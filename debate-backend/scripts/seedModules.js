require("dotenv").config();
const mongoose = require("mongoose");
const Module = require("../models/LearningModules");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB ✅");

  const modules = [
    {
      title: "Basics of Debate Format",
      type: "reading",
      order: 1,
      content: "This module explains the structure of Asian Parliamentary format with examples...",
      isLocked: false,
    },
    {
      title: "Intuitive Motion: Ban Zoos",
      type: "motion",
      order: 2,
      content: {
        motion: "This house would ban zoos",
        instructions: "Type your arguments. Then get feedback.",
      },
      isLocked: false,
    },
    {
      title: "Quiz: Debate Roles",
      type: "quiz",
      order: 3,
      content: {
        questions: [
          {
            question: "What does the Leader of Opposition do?",
            options: ["Give reply speech", "Refute PM", "Support Gov case"],
            correctAnswer: "Refute PM"
          }
        ]
      },
      isLocked: true
    }
  ];

  await Module.deleteMany(); // clear old modules if rerun
  await Module.insertMany(modules);
  console.log("🎉 Sample modules inserted!");
  process.exit(0);
}).catch((err) => {
  console.error("DB error ❌", err.message);
  process.exit(1);
});
// This script connects to MongoDB and seeds it with sample learning modules for a debate application.
// It creates modules with different types (reading, motion, quiz) and inserts them into the database.
// If the connection fails, it logs the error and exits the process.