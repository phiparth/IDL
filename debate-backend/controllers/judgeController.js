const Progress = require("../models/Progress");
const { SarvamAIClient } = require("sarvamai");

const LearningModule = require("../models/LearningModules");

const judgeSpeech=async (req,res)=>{
    try{
        const { motion, role, speech, moduleId } = req.body;

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

Output format:
Score: X/10
Comment: <Your Comment>
`;
const client = new SarvamAIClient({
apiSubscriptionKey: "sk_ouygrhpd_RsgETM4ZjHdrtOGZViImobRT",});

  const completion = await client.chat.completions({
    messages: [
      {
        role: "user",
        content: prompt,},],});
// Log the assistant's reply
// parse score and comment from response
const response = completion.choices[0].message.content;
const match = response.match(/\*\*Score:\*\*\s*(\d+)\/10[\s\S]*?\*\*Comment:\*\*\s*(.*)/i);
const score = match ? parseInt(match[1]) : null;
const comment = match ? match[2].trim() : "No comment";

    // Store in DB
    let progress = await Progress.findOne({ userId, moduleId });
    if (!progress) {
      progress = new Progress({ userId, moduleId, status: "in-progress" });
    }
      progress.judging = { score, comment, role };
      // Assign points for judged speech
if (!progress.points) progress.points = 0;
progress.points += Math.floor(score); // 7/10 judge score = 7 pts

const updateStreak = require("../utils/streak");
await updateStreak(req.user);

    await progress.save();
    res.status(200).json({
      score,
      comment,
      fullFeedback: response,
    });
  } catch (err) {
    console.error("Judge error:", err.message);
    res.status(500).json({ message: "Judging failed" });
  }
};

module.exports = { judgeSpeech };

    

// This controller handles judging speeches in a debate.
// It uses Sarvam AI to evaluate the speech based on content, structure, and delivery.
// It extracts a score and comment from the AI response, saves it to the user's progress,
// and returns the score, comment, and full feedback.