// /signup — Create a New User (Securely)
// // This endpoint will handle user registration, including password hashing and validation.

// Accept user input (name, email, password)

// Hash the password using bcrypt

// Save user to the database
const User= require("../models/user");
const bcrypt = require("bcrypt");
const signup=async (req,res)=>{
    console.log("✅ /api/auth/signup route triggered");
    try{
//  get user info from request body
const {name,email,password,username,age}=req.body;
//  check if user already exists
if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
const existingUser=await User.findOne({username});
if(existingUser){
    return res.status(400).json({message:"User already exists"});
    }
//  hash the password
const salt=await bcrypt.genSalt(10);
// We create a random “salt” — like a special code to make the password harder to crack.
const hashedPassword=await bcrypt.hash(password,salt);
// Now we mix the password with that salt and scramble it.
// Even if someone hacks the database, they can’t see your real password!
// create a new user 
const newUser=new User({
    name,
    email,
    password:hashedPassword,
    username,age// save the hashed password
})
// We create a new user object using the User model.
// But we save the hashed password, not the original one.
await newUser.save();
// Save the user to the database
res.status(201).json({message:"User created successfully"});
// We send a success message back to the user.
    }catch(error){
        console.error("Error during signup:", error);
        res.status(500).json({message:"Internal server error"});
        // If something goes wrong, we log the error and send a 500 status.
    // If anything goes wrong (maybe MongoDB isn’t working), we catch the error, log it, and send back
}}

// login logic
const jwt=require("jsonwebtoken");
const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        // We look for the user in the database using their email.
        if(!user){
            return res.status(400).json({message:"User not found"});
            // If we can’t find the user, we send a 400 status with an error message.
        }
        // compare the password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
            // If the password doesn’t match, we send a 400 status with an error message.
        }
        // create JWT token
        const payload={
            id:user._id,
        };
        // preparing some data (userId) to store inside the JWT token
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"});
        // We create a JWT token using the userId and a secret key from our environment variables
        // The token will expire in 1 hour.
        res.status(200).json({token,message:"Login successful"});
        // We send back the token and a success message.
    }catch(error){
         res.status(403).json({ message: "Invalid or expired token" });
        // If something goes wrong, we log the error and send a 500 status.
// 	If a user logs in, but forgets to logout — they might stay logged in forever.
// 	•	But with a time limit, even if they forget, the token automatically expires after 2 hours.
// This forces them to log in again — which keeps everything fresh and secure.
    }
}

module.exports={signup,login};
// We export the signup and login functions so they can be used in our routes.
