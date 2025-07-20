const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["reading", "quiz", "caseStudy"], default: "reading" },
  content: {
  type: mongoose.Schema.Types.Mixed,
  required: function () {
    return this.type !== "quiz";
  },
},
  order: {
    type: Number,
    required: true,
    unique: true, // ensures order is unique across modules
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  quiz: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ]
});

module.exports = mongoose.model("LearningModule", moduleSchema);
// This code defines a Mongoose schema for learning modules in a debate application.
// Each module has a title, type (like reading or quiz), content (which can be flexible), an order number, and a lock status.
// The schema is then exported as a Mongoose model named "LearningModule".
