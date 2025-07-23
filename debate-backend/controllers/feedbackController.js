const { SarvamAIClient } = require("sarvamai");
require("dotenv").config();

const generateFeedback = async (req, res) => {
  console.log("🔥 /quiz-analysis endpoint hit");

  try {
    console.log("✅ Body received:", req.body);
    const { governmentAnswer, oppositionAnswer } = req.body;

    // Validate input
    if (
      !governmentAnswer ||
      !oppositionAnswer ||
      governmentAnswer.trim() === "" ||
      oppositionAnswer.trim() === ""
    ) {
      return res.status(400).json({
        message: "Missing motion or speeches. Please provide all fields.",
      });
    }

    const client = new SarvamAIClient({
      apiSubscriptionKey: process.env.SARVAMAI_API_KEY,
    });

    const motion = "This house believes that money can buy happiness";

    const govPrompt = `
You're an expert debate coach. A student responded to this motion:
Motion: "${motion}"
Government Side Answer: "${governmentAnswer}"

Give feedback in 3 parts:
1. Argument Quality
2. Rebuttal Strength
3. Suggestions to improve.
`;

    const oppPrompt = `
You're an expert debate coach. A student responded to this motion:
Motion: "${motion}"
Opposition Side Answer: "${oppositionAnswer}"

Give feedback in 3 parts:
1. Argument Quality
2. Rebuttal Strength
3. Suggestions to improve.
`;

    console.log("📤 Sending request to SarvamAI...");
    console.log("🔑 SARVAMAI_API_KEY:", process.env.SARVAMAI_API_KEY);

    const [govResponse, oppResponse] = await Promise.all([
      client.chat.completions({
        model: "sarvam-llama-2-chat",
        messages: [{ role: "user", content: govPrompt }],
      }),
      client.chat.completions({
        model: "sarvam-llama-2-chat",
        messages: [{ role: "user", content: oppPrompt }],
      }),
    ]);

    const govFeedback = govResponse.choices[0].message.content;
    const oppFeedback = oppResponse.choices[0].message.content;

    console.log("✅ Response received for Gov:", govFeedback);
    console.log("✅ Response received for Opp:", oppFeedback);

    // Return feedback with keys expected by frontend
    res.status(200).json({
      governmentAnswer: govFeedback,
      oppositionAnswer: oppFeedback,
    });
  } catch (err) {
    console.error("❌ AI Feedback error:", err);
    console.error("❌ SarvamAI error response:", err.response?.data || err.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { generateFeedback };

