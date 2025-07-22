const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { submitQuiz } = require("../controllers/quizController");

router.post("/submit", verifyToken, submitQuiz);

module.exports = router;

