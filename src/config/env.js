require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8001,

  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,

  CORS_ORIGINS: process.env.CORS_ORIGINS || "*",

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SENDER_EMAIL: process.env.SENDER_EMAIL || "onboarding@resend.dev",
  RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL || "wedding@example.com",

  ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  JWT_SECRET: process.env.JWT_SECRET,
};
