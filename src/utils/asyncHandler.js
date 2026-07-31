const asyncHandler = require("../utils/asyncHandler");
const Invite = require("../models/Invite");

exports.listInvites = asyncHandler(async (req, res) => {
  const invites = await Invite.find().select("-_id");
  res.json(invites);
});
