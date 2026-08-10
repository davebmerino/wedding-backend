const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

async function connectRedis() {
  if (!process.env.REDIS_URL) {
    console.log("Redis disabled (no REDIS_URL)");
    return;
  }

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
