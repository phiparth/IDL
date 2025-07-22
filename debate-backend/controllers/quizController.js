const Progress = require("../models/Progress");
const LearningModule = require("../models/LearningModules");
const updateStreak = require("../utils/streak");

const submitQuiz = async (req, res) => {
  try {
    const { moduleId, answers } = req.body;
    const userId = req.user.id;

    const module = await LearningModule.findById(moduleId);
    if (!module || module.type !== "quiz") {
      return res.status(400).json({ message: "Invalid module or not a quiz" });
    }

    // // Unlock check
    // const userProgress = await Progress.find({ userId, status: "completed" }).populate("moduleId");
    // const maxOrder = Math.max(...userProgress.map(p => p.moduleId?.order || 0));
    // if (module.order > maxOrder + 1) {
    //   return res.status(403).json({ message: "This module is locked" });
    // }


// Score calculation
const rawQuestions = module.quiz ?? module.content?.questions ?? [];
const total = rawQuestions.length;
console.log("rawQuestions:", rawQuestions);
let correct = 0;
rawQuestions.forEach((q, i) => {
  if (answers[i] && answers[i].trim().toLowerCase() === q.answer.trim().toLowerCase()) {
    correct++;
  }
});

let score = 0;

if (total > 0) {
  score = Math.round((correct / total) * 100);
}
if (!Number.isFinite(score)) score = 0;

let pointsToAdd = Math.floor(score / 10);
if (!Number.isFinite(pointsToAdd)) pointsToAdd = 0;

// Save to Progress
let progress = await Progress.findOne({ userId, moduleId });
if (!progress) progress = new Progress({ userId, moduleId });

progress.status = "completed";
progress.score = score;
progress.points = (progress.points || 0) + pointsToAdd;
await progress.save();
    res.json({ score, correct, total });

  } catch (error) {
    console.error("Quiz submit error:", error);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};

module.exports = { submitQuiz };
