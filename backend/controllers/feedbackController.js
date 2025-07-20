
const Progress = require("../models/Progress");
const { SarvamAIClient } = require("sarvamai");
const LearningModule = require("../models/LearningModules");

// This controller handles AI-generated feedback for debate answers using Sarvam AI

// POST /api/feedback/generate
const generateFeedback = async (req, res) => {
  try {
    const { motion, answer, moduleId } = req.body;
const module = await LearningModule.findById(moduleId);
const userId = req.user.id;
// 1. Get user's completed modules
const completedProgress = await Progress.find({ userId, status: "completed" }).populate("moduleId");

// 2. Find highest unlocked
let highestCompleted = 0;
completedProgress.forEach(p => {
  if (p.moduleId?.order && p.moduleId.order > highestCompleted) {
    highestCompleted = p.moduleId.order;
  }
});

// 3. Block if module is locked
if (module.order > highestCompleted + 1) {
  return res.status(403).json({ message: "This module is currently locked for you." });
}

  

    const prompt = `
You're an expert debate coach. A student responded to this motion:

Motion: "${motion}"

Their answer:
"${answer}"

Give them structured feedback in 3 parts:
1. Argument Quality
2. Rebuttal Strength
3. Suggestions to improve.
    `;

// Initialize the SarvamAI client with your API key
const client = new SarvamAIClient({
apiSubscriptionKey: "sk_ouygrhpd_RsgETM4ZjHdrtOGZViImobRT",});

  const response = await client.chat.completions({
    messages: [
      {
        role: "user",
        content: prompt,},],});
// Log the assistant's reply
const feedback=response.choices[0].message.content;
    // Generate feedback using Sarvam AI

    // Optional: Save to Progress DB
    const progress = await Progress.findOne({ userId, moduleId });
    if (progress) {
      progress.feedback = feedback;
      await progress.save();
    }
const updateStreak = require("../utils/streak");
await updateStreak(req.user);
    // Update user's last active date and streak count
    res.status(200).json({ feedback });
  } catch (err) {
    console.error("AI Feedback error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to generate feedback" });
  }
};

module.exports = { generateFeedback };
