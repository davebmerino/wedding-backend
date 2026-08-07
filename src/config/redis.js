const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

async function connectRedis() {
  try {
    await redis.connect();
    console.log("✓ Redis connected");
  } catch (err) {
    console.error("✗ Redis connection failed:", err.message);
  }
}

module.exports = {
  redis,
  connectRedis,
};
