const { v4: uuidv4 } = require("uuid");
const RSVP = require("../models/rsvp.model.js");
const Invite = require("../models/invite.model.js");
const { validateEmail } = require("../utils/validators.js");
const { sendRSVPNotification } = require("../services/email.service.js");

exports.submitRSVP = async (req, res, next) => {
  try {
    const { invite_id, primary_guest, additional_guests = [] } = req.body;

    if (
      !primary_guest ||
      !primary_guest.name ||
      !primary_guest.email ||
      !primary_guest.contact
    ) {
      return res.status(400).json({
        detail: "Primary guest information is required",
      });
    }

    if (!validateEmail(primary_guest.email)) {
      return res.status(400).json({
        detail: "Invalid primary guest email",
      });
    }

    for (const guest of additional_guests) {
      if (!guest.name || !guest.email || !guest.contact) {
        return res.status(400).json({
          detail: "All guest fields are required",
        });
      }

      if (!validateEmail(guest.email)) {
        return res.status(400).json({
          detail: `Invalid email for guest: ${guest.name}`,
        });
      }
    }

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
