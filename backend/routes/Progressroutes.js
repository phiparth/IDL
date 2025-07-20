const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

const { updateProgress ,getUserProgress} = require("../controllers/ProgressController");

router.post("/update", verifyToken, updateProgress);
router.get("/get", verifyToken, getUserProgress);





module.exports = router;
