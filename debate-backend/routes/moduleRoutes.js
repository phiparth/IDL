const express = require("express");
const router = express.Router();
const { getModules } = require("../controllers/modulecontroller");
const verifyToken = require("../middlewares/authMiddleware");
// GET /api/modules
router.get("/", verifyToken,getModules);

module.exports = router;
