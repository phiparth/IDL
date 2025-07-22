const LearningModule = require("../models/LearningModules");
const Progress = require("../models/Progress");
// GET /api/user/stats
const User = require("../models/user");
const getUserStats=async(req,res)=>{
try{
    const userId=req.user.id;
     // Get total number of modules
    const totalModules = await LearningModule.countDocuments();
        // Get user's progress
    const userProgress = await Progress.find({ userId });
     const completedModules = userProgress.filter(p => p.status === "completed").length;
    //  	•	Filters out all the Progress documents where the status is "completed".
	// •	Gets the count of completed modules.
     const quizScores = userProgress
      .filter(p => typeof p.score === "number")
      .map(p => p.score);
      const averageQuizScore = quizScores.length
      ? (quizScores.reduce((a, b) => a + b, 0) / quizScores.length).toFixed(2)
      : null;
	// •	Filters out progress items that have a valid quiz score (number).
	// •	Maps those to just the score numbers.
	// •	If scores exist:
	// •	Uses reduce to sum all scores.
	// •	Divides by total number to get the average.
	// •	toFixed(2) rounds to two decimal places.
	// •	If no scores → returns null.
     // we can add logic here to assign badges later

    const judgeScores = userProgress
      .filter(p => p.judging && typeof p.judging.score === "number")
      .map(p => p.judging.score);

     const averageJudgeScore = judgeScores.length
      ? (judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length).toFixed(2)
      : null;
    let badges = [];

if (completedModules >= 5) badges.push("Curious Beginner");
if (averageQuizScore >= 80) badges.push("Quiz Champ");
if (averageJudgeScore >= 7) badges.push("Solid Speaker");

const totalPoints = userProgress.reduce((sum, p) => sum + (p.points || 0), 0);


const user = await User.findById(userId);




if (totalPoints >= 100) badges.push("Power Learner");
    res.status(200).json({
  totalModules,
  completedModules,
  averageQuizScore: averageQuizScore ? Number(averageQuizScore) : null,
  averageJudgeScore: averageJudgeScore ? Number(averageJudgeScore) : null,
  totalPoints,
  badges, streak: user.streakCount || 0,
});

  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

module.exports = { getUserStats };
