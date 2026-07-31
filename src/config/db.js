const mongoose = require("mongoose");
const { MONGO_URL, DB_NAME } = require("./env.js");

async function connectDB() {
  try {
    const connectionString = DB_NAME ? `${MONGO_URL}/${DB_NAME}` : MONGO_URL;

    await mongoose.connect(connectionString);

    console.log("Database:", mongoose.connection.name);

    console.log("✓ Connected to MongoDB");
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
