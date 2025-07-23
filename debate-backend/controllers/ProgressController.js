const Progress = require("../models/Progress");
const mongoose = require("mongoose");

// POST /api/progress/update
const updateProgress = async (req, res) => {
  try {
    const { moduleId, status, score, feedback } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ message: "Invalid moduleId format" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const validModuleId = new mongoose.Types.ObjectId(moduleId);
   
        let progress = await Progress.findOne({ userId, moduleId: validModuleId });

    if (progress) {
      // update existing progress
if (typeof score === "number") {
  progress.score = score;

  
  progress.points = Math.floor(score / 10); // 70 → 7 pts
  
}
  console.log("Calculated points for update:", progress.points);
      progress.status = status || progress.status;
      
      progress.feedback = feedback || progress.feedback;
      
      await progress.save();
    } else {
      // create new progress entry
      const points = typeof score === "number" ? Math.floor(score / 10) : 0;
      console.log("Creating new progress with score:", score);
      console.log("Calculated points for creation:", points);
      progress = new Progress({
        userId,
        moduleId: validModuleId,
        status,
        score,
        feedback,
        points,
      });

      await progress.save();
    }

    res.status(200).json({ message: "Progress updated", progress });
  } catch (error) {
    console.error("Progress error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// get user progress
const getUserProgress = async (req, res) => {
    try{
        const userId=req.user.id;
        const progress = await Progress.find({ userId }).populate('moduleId');
        // This will fetch all progress entries for the user and populate the moduleId with the actual
        // module details instead of just the ID.
        res.status(200).json(progress);

    }catch (error){
        console.error("Error fetching user progress:", error.message);
        res.status(500).json({ message: "Server error" });
        // If something goes wrong, we log the error and send a 500 status with an error message.
    }
}

module.exports = { updateProgress , getUserProgress };
