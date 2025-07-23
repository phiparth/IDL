const axios = require("axios");
const FormData = require("form-data");

const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: req.file.mimetype || "audio/webm"
    });
form.append("language", "en"); // Specify language if needed
    const response = await axios.post(
      "https://api.sarvam.ai/speech-to-text",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "api-subscription-key": process.env.SARVAMAI_API_KEY,
          
        },
    params: {
     model: "saaras:english", // or whatever model forces English
      language: "en"         // try this if the API supports it
    }
      }
    );

    if (!response.data || !response.data.transcript) {
      console.warn("No transcript in response:", response.data);
      return res.status(502).json({ error: "No transcript received from Sarvam API" });
    }

    res.json({ transcript: response.data.transcript });

  } catch (error) {
    console.error("Transcription error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to transcribe audio",
      details: error?.response?.data || error.message,
    });
  }
};

module.exports = { transcribeAudio };

