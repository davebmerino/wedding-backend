const Invite = require("../models/invite.model.js");
const RSVP = require("../models/rsvp.model.js");

exports.getStats = async (req, res, next) => {
  try {
    const [
      totalInvites,
      respondedInvites,
      totalOpened,
      emailsSent,
      totalRsvps,
    ] = await Promise.all([
      Invite.countDocuments(),
      Invite.countDocuments({
        has_responded: true,
      }),
      Invite.countDocuments({
        opened_count: { $gt: 0 },
      }),
      Invite.countDocuments({
        email_sent: true,
      }),
      RSVP.countDocuments(),
    ]);

    res.json({
      total_invites: totalInvites,
      responded: respondedInvites,
      opened: totalOpened,
      emails_sent: emailsSent,
      total_rsvps: totalRsvps,
    });
  } catch (err) {
    next(err);
  }
};
