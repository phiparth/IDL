const mongoose=require("mongoose");
// Schema is like a blueprint for a user
const progressSchema = new mongoose.Schema({
  userId:String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningModule", required: true },
  status: { type: String, enum: ["not-started", "in-progress", "completed"], default: "in-progress" },
  score: Number,
  feedback: String,
  judging: {
    score: Number,
    comment: String,
    role: String,
  },
  points: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });


module.exports = mongoose.model("Progress", progressSchema);