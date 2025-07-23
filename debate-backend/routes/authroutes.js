const express = require("express");
const { signup, login } = require("../controllers/authcontroller");
const router = express.Router();
// This is the router for authentication-related routes 
// It handles user registration and login
// POST /signup — Create a New User

// Signup route

router.post("/signup", signup);
router.post("/login",login);


// This route allows users to sign up by sending their details (name, email, password)
// The signup function will handle the logic of creating a new user
// It will check if the user already exists, hash the password, and save the user to the database
// If successful, it will return a success message
// If there's an error (like the user already exists), it will return an error message


module.exports = router;
// This exports the router so it can be used in the main server file
// The main server file will use this router to handle requests to the /signup endpoint
// This way, we keep our code organized and separate the authentication logic from other parts of the application
// This makes it easier to manage and maintain the code in the future
