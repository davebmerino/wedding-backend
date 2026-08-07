const express = require("express");
const router = express.Router();

const { loginLimiter } = require("../middleware/rateLimit.middleware.js");
const authController = require("../controllers/auth.controller.js");

router.post("/login", loginLimiter, authController.login);

module.exports = router;
