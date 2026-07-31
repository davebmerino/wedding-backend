const express = require("express");
const router = express.Router();

const rsvpController = require("../controllers/rsvp.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Public
router.post("/rsvp", rsvpController.submitRSVP);

// Admin
router.get("/admin/rsvp", verifyToken, rsvpController.listRSVPs);

module.exports = router;
