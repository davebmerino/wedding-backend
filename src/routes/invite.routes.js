const express = require("express");
const router = express.Router();

const inviteController = require("../controllers/invite.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Public
router.get("/invites/:id", inviteController.getInvite);

// Admin
router.get("/admin/invites", verifyToken, inviteController.listInvites);

router.post("/admin/invites", verifyToken, inviteController.createInvite);

router.post(
  "/admin/invites/bulk",
  verifyToken,
  inviteController.bulkCreateInvites,
);

router.delete("/admin/invites/:id", verifyToken, inviteController.deleteInvite);

router.patch(
  "/admin/invites/:id/mark-sent",
  verifyToken,
  inviteController.toggleMarkSent,
);

router.post(
  "/admin/invites/:id/send-email",
  verifyToken,
  inviteController.sendSingleInviteEmail,
);

router.post(
  "/admin/invites/send-all",
  verifyToken,
  inviteController.sendAllInvites,
);

module.exports = router;
