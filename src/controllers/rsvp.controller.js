const { v4: uuidv4 } = require("uuid");
const RSVP = require("../models/rsvp.model.js");
const Invite = require("../models/invite.model.js");
const { validateEmail } = require("../utils/validators.js");
const { sendRSVPNotification } = require("../services/email.service.js");

exports.submitRSVP = async (req, res, next) => {
  try {
    const { invite_id, primary_guest, additional_guests = [] } = req.body;

    // Require invite ID
    if (!invite_id) {
      return res.status(400).json({ detail: "Invalid invitation." });
    }

    if (!primary_guest || !primary_guest.name) {
      return res.status(400).json({
        detail: "Primary guest name is required",
      });
    }

    // Email is optional, but if provided it must be valid
    if (primary_guest.email && !validateEmail(primary_guest.email)) {
      return res.status(400).json({
        detail: "Invalid primary guest email",
      });
    }

    for (const guest of additional_guests) {
      if (!guest.name) {
        return res.status(400).json({
          detail: "Guest name is required",
        });
      }

      if (guest.email && !validateEmail(guest.email)) {
        return res.status(400).json({
          detail: `Invalid email for guest: ${guest.name}`,
        });
      }
    }
    // Find the invitation
    const invite = await Invite.findOne({ id: invite_id });

    if (!invite) {
      return res.status(404).json({ detail: "Invitation not found." });
    }

    // Prevent multiple RSVPs for the same invitation
    if (invite.has_responded) {
      return res
        .status(400)
        .json({ detail: "This invitation has already submitted an RSVP." });
    }

    // Primary guest email must match the invitation email
    if (
      invite.name.trim().toLowerCase() !==
      primary_guest.name.trim().toLowerCase()
    ) {
      return res
        .status(400)
        .json({ detail: "This invitation is assigned to a different guest." });
    }

    // Check guest limit
    const allowedAdditionalGuests = Math.max(invite.number_of_guests - 1, 0);
    if (additional_guests.length > allowedAdditionalGuests) {
      return res.status(400).json({
        detail: `This invitation allows only ${allowedAdditionalGuests} additional guest(s).`,
      });
    }

    // Collect all emails
    const emails = [
      primary_guest.email,
      ...additional_guests.map((g) => g.email),
    ]
      .filter(Boolean)
      .map((e) => e.trim().toLowerCase());

    if (new Set(emails).size !== emails.length) {
      return res
        .status(400)
        .json({ detail: "Duplicate email addresses are not allowed." });
    }

    // Every email must exist in the invitation list
    // for (const email of emails) {
    //   const invited = await Invite.findOne({
    //     email: { $regex: new RegExp(`^${email}$`, "i") },
    //   });
    //   if (!invited) {
    //     return res
    //       .status(400)
    //       .json({ detail: `${email} is not on the invitation list.` });
    //   }
    // }

    // Create RSVP
    const rsvp = await RSVP.create({
      id: uuidv4(),
      invite_id: invite_id || null,
      primary_guest,
      additional_guests,
    });

    if (invite_id) {
      await Invite.updateOne({ id: invite_id }, { has_responded: true });
    }

    try {
      await sendRSVPNotification(rsvp);
    } catch (emailErr) {
      console.error("Failed to send RSVP notification:", emailErr.message);
    }

    res.status(201).json(rsvp);
  } catch (err) {
    next(err);
  }
};

exports.listRSVPs = async (req, res, next) => {
  try {
    const submissions = await RSVP.find()
      .select("-_id")
      .sort({ timestamp: -1 });

    res.json(submissions);
  } catch (err) {
    next(err);
  }
};
