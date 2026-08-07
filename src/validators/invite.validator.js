const Joi = require("joi");

exports.createInviteSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().allow(null, ""),
  contact: Joi.string().allow(null, ""),
  number_of_guests: Joi.number().integer().min(1).max(10).default(1),
  notes: Joi.string().allow(""),
});
