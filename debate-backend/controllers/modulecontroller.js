const Progress = require("../models/Progress");
const LearningModule = require("../models/LearningModules");

const getModules = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all progress for this user
    const userProgress = await Progress.find({ userId, status: "completed" }).populate("moduleId");

    // Find highest order of completed module
    let highestCompletedOrder = 0;
    userProgress.forEach(p => {
      if (p.moduleId?.order && p.moduleId.order > highestCompletedOrder) {
        highestCompletedOrder = p.moduleId.order;
      }
    });

    // Get all modules and attach locked status
    const allModules = await LearningModule.find().sort({ order: 1 });

    const modulesWithLock = allModules.map(module => {
      return {
        ...module.toObject(),
        isLocked: module.order > highestCompletedOrder + 1 // locked if ahead of next
      };
    });

    res.json(modulesWithLock);

  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};

module.exports = {
  getModules,
};

