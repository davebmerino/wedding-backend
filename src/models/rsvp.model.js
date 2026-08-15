const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    contact: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["coming", "not_coming", "undecided"],
      default: "coming",
    },
  },
  { _id: false },
);

const rsvpSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    invite_id: {
      type: String,
      default: null,
    },

    primary_guest: {
      type: guestSchema,
      required: true,
    },

    additional_guests: {
      type: [guestSchema],
      default: [],
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("RSVP", rsvpSchema);
