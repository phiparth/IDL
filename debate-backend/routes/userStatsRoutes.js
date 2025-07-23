const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getUserStats } = require("../controllers/userstatsController");
router.get("/stats", verifyToken, getUserStats);
module.exports = router;
// This route allows users to get their debate statistics
// It requires the user to be authenticated (verifyToken middleware)
// The controller function getUserStats will handle the logic for fetching and returning the user's statistics
// The router is exported so it can be used in the main server file