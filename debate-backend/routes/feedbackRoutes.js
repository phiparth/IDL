const express = require("express");
const router= express.Router();
const { generateFeedback } = require("../controllers/feedbackController.js");
const verifyToken = require("../middlewares/authMiddleware");
router.post("/generate", generateFeedback);
// This route allows users to submit feedback on a module
// It requires the user to be authenticated (verifyToken middleware)
module.exports = router;
// This exports the router so it can be used in the main server file



