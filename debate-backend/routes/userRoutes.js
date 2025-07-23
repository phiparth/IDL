const express=require("express");
const router=express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const User = require("../models/user");
// Private route to get current user's profile
router.get("/profile",verifyToken,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.status(200).json(user);

    }
    catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports=router;