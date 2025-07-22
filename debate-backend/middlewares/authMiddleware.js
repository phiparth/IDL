const jwt=require("jsonwebtoken");
// We are creating a function called verifyToken.
// This function will run before your main route (like /profile or /dashboard).
// It checks if the person trying to access the route is allowed or not.
const verifyToken=(req,res,next)=>{
  const authHeader=req.headers.authorization;
    // We look for a special header called "Authorization" in the request.  
    // This looks inside the request headers to find the token sent by the user.
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"Unauthorized access"});
        // If the header is missing or doesn’t start with "Bearer", we send a 401 status (Unauthorized) with an error message.
    }
    const token=authHeader.split(" ")[1];
    // We split the header to get the actual token part (the part after "Bearer").
//      Now, we cut the token out of the string.

// From "Bearer abc123", this will give us just "abc123" (the actual token).
try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    // We use jwt.verify to check if the token is valid using our secret key.
    //  This checks if the token is real and not tampered with.
    req.user = decoded;
    // If the token is valid, we attach the decoded user information to the request object.
    // This way, we can access user info in the next steps.
    // decoded will now contain info like the user’s ID, name, etc.
    next();
    // We call next() to move on to the next step in the route handling.
    // Token is valid!
// So we go to the next step — the actual route (like /getUser or something else).
}
catch(err){
    res.status(403).json({message:"Forbidden access"});
}
}

module.exports = verifyToken;