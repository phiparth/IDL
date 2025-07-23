const Progress = require("../models/Progress");
const { SarvamAIClient } = require("sarvamai");
const updateStreak = require("../utils/streak");
require("dotenv").config();
const User = require("../models/user");
const judgeSpeech = async (req, res) => {
  try {
    const { motion, role, speech } = req.body;
    const userId = req.user.id;

    // 🎯 Prompt for Sarvam AI
    const prompt = `
You are a WUDC-style debate adjudicator. You just heard a speech from a debater in the role of **${role}**.

Motion: "${motion}"

Here is their speech:
"""
${speech}
"""

Evaluate their speech on these 3 things:
1. Content (arguments + relevance)
2. Structure (clarity, flow, strategy)
3. Delivery (style, tone, persuasiveness)

Then give:
- A score from 1 to 10 (with justification)
- A 2-line comment on improvement
-u can also give a full feedback if you want to
-if the answer is irrelevant or off-topic, give a score of 0 and say "irrelevant speech"
-u have to do strictly WUDC style judging, no other format

Output format:
**Score:** X/10  
**Comment:** <Your Comment>
`;

    // 🔑 Sarvam AI
    const client = new SarvamAIClient({
      apiSubscriptionKey: process.env.SARVAMAI_API_KEY,
    });

    const completion = await client.chat.completions({
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices[0].message.content;

    // 🧠 Parse score and comment
    const match = response.match(/\*\*Score:\*\*\s*(\d+)\/10[\s\S]*?\*\*Comment:\*\*\s*(.*)/i);
    const score = match ? parseInt(match[1]) : null;
    const comment = match ? match[2].trim() : "No comment";

    // 🗂️ Update Progress for user
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = new Progress({ userId, status: "in-progress" });
    }

    progress.judging = { score, comment, role };
    progress.points = (progress.points || 0) + Math.floor(score);

    const fullUser = await User.findById(userId);
await updateStreak(fullUser);
    await progress.save();

    // 🎉 Return response
    res.status(200).json({
      score,
      comment,
      fullFeedback: response,
    });

  } catch (err) {
    console.error("Judge error:", err);
    res.status(500).json({ message: "Judging failed" });
  }
};

module.exports = { judgeSpeech };
