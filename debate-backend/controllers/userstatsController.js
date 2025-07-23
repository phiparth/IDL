const LearningModule = require("../models/LearningModules");
const Progress = require("../models/Progress");
const User = require("../models/user");

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalModules = await LearningModule.countDocuments();
    const userProgress = await Progress.find({ userId });
    const user = await User.findById(userId);

    const completedModules = userProgress.filter(p => p.status === "completed").length;

    const quizScores = userProgress
      .filter(p => typeof p.score === "number")
      .map(p => p.score);
    const averageQuizScore = quizScores.length
      ? (quizScores.reduce((a, b) => a + b, 0) / quizScores.length).toFixed(2)
      : null;

    const judgeScores = userProgress
      .filter(p => p.judging && typeof p.judging.score === "number")
      .map(p => p.judging.score);
    const averageJudgeScore = judgeScores.length
      ? (judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length).toFixed(2)
      : null;

    const totalPoints = userProgress.reduce((sum, p) => sum + (p.points || 0), 0);
    const streak = user.streakCount || 0;

    // 🏅 BADGE LOGIC
    let badges = [];

    if (quizScores.length >= 3) badges.push("Active Learner");
    if (averageQuizScore >= 80) badges.push("Quiz Champ");
    if (averageJudgeScore >= 7) badges.push("Solid Speaker");
    if (totalPoints >= 100) badges.push("Power Learner");
    if (streak >= 5) badges.push("Streak Star");
    if (totalPoints >= 200 && averageJudgeScore >= 8) badges.push("Debate Warrior");
    if (averageQuizScore >= 85 && averageJudgeScore >= 8 && totalPoints >= 250) badges.push("Ultimate Debater");
   if (badges.length === 0) badges.push("New Debater"); 
    res.status(200).json({
      averageQuizScore: averageQuizScore ? Number(averageQuizScore) : null,
      averageJudgeScore: averageJudgeScore ? Number(averageJudgeScore) : null,
      totalPoints,
      streak,
      badges,
    });

  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

module.exports = { getUserStats };

