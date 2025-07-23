const Progress = require("../models/Progress");

// Predefined answer keys for different quizzes
const quizAnswerKeys = {
  "roles-trivia": ["C", "C", "C", "D", "C", "C", "B", "B"],
   "further-reading": ["C", "B", "C", "C", "B", "C", "B", "C","B","B"],
    "explain-roles": ["C","D","C","B","B"],
};

const submitQuiz = async (req, res) => {
  try {
//     if (progress.status === "completed") {
//   return res.status(403).json({ message: "Quiz already submitted." });
// }

    const { quizId, answers } = req.body; // use quizId instead of moduleId
    const userId = req.user.id;

    if (!quizAnswerKeys[quizId]) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const correctAnswers = quizAnswerKeys[quizId];
    const total = correctAnswers.length;
    let correct = 0;

    correctAnswers.forEach((ans, i) => {
      if (answers[i] && answers[i].trim().toLowerCase() === ans.toLowerCase()) {
        correct++;
      }
    });

    const score = Math.round((correct / total) * 100);
    const pointsToAdd = Math.floor(score / 10);

    // Store progress per quiz
    let progress = await Progress.findOne({ userId, quizId });
    if (!progress) progress = new Progress({ userId, quizId });

    progress.status = "completed";
    progress.score = score;
    progress.points = (progress.points || 0) + pointsToAdd;
    await progress.save();

    res.json({ score, correct, total });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { submitQuiz };
