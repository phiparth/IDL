const mongoose= require("mongoose");
// Schema is like a blueprint for a user
const userSchema = new mongoose.Schema({
name:{
    type: String,
     // name is required
},
email:{
    type: String,
    required: true, // email is required
    unique: true, // email must be unique
},
username:{
    type: String,
    required: true, // username is required
    unique: true, // username must be unique
},
password:{
    type: String,
    required: true, // password is required
},
lastActiveDate: {
  type: Date,
  default: null,
},
streakCount: {
  type: Number,
  default: 0,
},
age:Number,
organization:String,
},
{timestamps: true, // automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
// This exports the User model so it can be used in other parts of the application
// The model is created using the userSchema we defined above
// This way, we can create, read, update, and delete users in our database easily
