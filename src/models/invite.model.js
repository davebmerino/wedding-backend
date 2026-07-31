const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: null,
      trim: true,
    },

    contact: {
      type: String,
      default: null,
      trim: true,
    },

    number_of_guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    notes: {
      type: String,
      default: "",
    },

    has_responded: {
      type: Boolean,
      default: false,
    },

    opened_count: {
      type: Number,
      default: 0,
    },

    last_opened: {
      type: Date,
      default: null,
    },

    email_sent: {
      type: Boolean,
      default: false,
    },

    email_sent_at: {
      type: Date,
      default: null,
    },

    manually_marked: {
      type: Boolean,
      default: false,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("Invite", inviteSchema);
