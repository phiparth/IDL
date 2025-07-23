const express = require("express");
const multer = require("multer");
const { transcribeAudio } = require("../controllers/audioController");

const router = express.Router();

// Set up multer to handle audio uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/transcribe", upload.single("audio"), transcribeAudio);

module.exports = router;
// This route allows users to upload audio files for transcription
// It uses multer to handle file uploads

