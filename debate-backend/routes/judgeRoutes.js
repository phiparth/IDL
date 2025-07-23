const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { judgeSpeech } = require("../controllers/judgeController");

// Secure the route with verifyToken
router.post("/score", verifyToken, judgeSpeech);

module.exports = router;
