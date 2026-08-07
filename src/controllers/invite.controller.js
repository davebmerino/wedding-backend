const { v4: uuidv4 } = require("uuid");
const Invite = require("../models/invite.model.js");
const { sendInviteEmail } = require("../services/email.service.js");

const { redis } = require("../config/redis");

// exports.getInvite = async (req, res, next) => {
//   try {
//     const invite = await Invite.findOne({
//       id: req.params.id,
//     });

//     if (!invite) {
//       return res.status(404).json({
//         detail: "Invite not found",
//       });
//     }

//     invite.opened_count += 1;
//     invite.last_opened = new Date();
//     await invite.save();

//     const response = invite.toObject();
//     delete response._id;

//     res.json(response);
//   } catch (err) {
//     next(err);
//   }
// };

exports.getInvite = async (req, res, next) => {
  try {
    const cacheKey = `invite:${req.params.id}`;

    // 1. Check cache
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 2. Get from MongoDB
    const invite = await Invite.findOne({
      id: req.params.id,
    }).select("-_id");

    if (!invite) {
      return res.status(404).json({ detail: "Invite not found" });
    }

    // 3. Cache for 5 minutes
    await redis.setEx(cacheKey, 300, JSON.stringify(invite));

    res.json(invite);
  } catch (err) {
    next(err);
  }
};

exports.listInvites = async (req, res, next) => {
  try {
    const invites = await Invite.find().select("-_id").sort({ created_at: -1 });

    res.json(invites);
  } catch (err) {
    next(err);
  }
};

exports.createInvite = async (req, res, next) => {
  try {
    const { name, email, contact, number_of_guests, notes } = req.body;

    if (!name) {
      return res.status(400).json({ detail: "Name is required" });
    }

    // Check duplicate name
    const existingName = await Invite.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingName) {
      return res
        .status(400)
        .json({ detail: "An invite with this name already exists" });
    }

    // Check duplicate email (only if email is provided)
    if (email) {
      const existingEmail = await Invite.findOne({
        email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
      });

      if (existingEmail) {
        return res
          .status(400)
          .json({ detail: "A guest with this email already exists." });
      }
    }

    const invite = await Invite.create({
      id: uuidv4(),
      name,
      email: email || null,
      contact: contact || null,
      number_of_guests: number_of_guests || 1,
      notes: notes || "",
    });

    res.status(201).json(invite);
  } catch (err) {
    next(err);
  }
};

exports.bulkCreateInvites = async (req, res, next) => {
  try {
    const requests = req.body;

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ detail: "Expected array of invites" });
    }

    const invites = requests
      .filter((r) => r.name)
      .map((r) => ({
        id: uuidv4(),
        name: r.name,
        email: r.email || null,
        contact: r.contact || null,
        number_of_guests: r.number_of_guests || 1,
        notes: r.notes || "",
      }));

    if (invites.length === 0) {
      return res.status(400).json({ detail: "No valid invites to create" });
    }

    const created = await Invite.insertMany(invites);

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.deleteInvite = async (req, res, next) => {
  try {
    const result = await Invite.deleteOne({
      id: req.params.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: "Invite not found" });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.toggleMarkSent = async (req, res, next) => {
  try {
    const invite = await Invite.findOne({
      id: req.params.id,
    });

    if (!invite) {
      return res.status(404).json({ detail: "Invite not found" });
    }

    invite.email_sent = !invite.email_sent;
    invite.manually_marked = invite.email_sent;

    invite.email_sent_at = invite.email_sent ? new Date() : null;

    await invite.save();

    res.json({
      success: true,
      email_sent: invite.email_sent,
    });
  } catch (err) {
    next(err);
  }
};

exports.sendSingleInviteEmail = async (req, res, next) => {
  try {
    const invite = await Invite.findOne({
      id: req.params.id,
    });

    if (!invite) {
      return res.status(404).json({ detail: "Invite not found" });
    }

    if (!invite.email) {
      return res.status(400).json({
        detail: "Guest has no email address",
      });
    }

    const frontendUrl =
      req.body.frontend_url || "https://your-wedding-site.com";

    await sendInviteEmail(invite, frontendUrl);

    invite.email_sent = true;
    invite.email_sent_at = new Date();
    invite.manually_marked = false;

    await invite.save();

    res.json({
      success: true,
      message: `Invitation sent to ${invite.email}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.sendAllInvites = async (req, res, next) => {
  try {
    const frontendUrl =
      req.body.frontend_url || "https://your-wedding-site.com";

    const onlyUnsent = req.body.only_unsent !== false;

    const filter = {
      email: { $ne: null },
    };

    if (onlyUnsent) {
      filter.email_sent = { $ne: true };
    }

    const invites = await Invite.find(filter);

    const results = {
      sent: 0,
      failed: 0,
      errors: [],
    };

    for (const invite of invites) {
      try {
        await sendInviteEmail(invite, frontendUrl);

        invite.email_sent = true;
        invite.email_sent_at = new Date();
        await invite.save();

        results.sent++;

        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        results.failed++;
        results.errors.push(`${invite.name}: ${err.message}`);
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
};
