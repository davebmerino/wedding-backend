const express = require("express");
const router = express.Router();

const statsController = require("../controllers/stats.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

router.get("/stats", verifyToken, statsController.getStats);

module.exports = router;
