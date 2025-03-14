// redisClient.js
const redis = require("redis");

// Create Redis client with the newer Redis v4+ syntax
const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379", // Modern format for connection URL
});

redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("error", (err) =>
  console.log("❌ Redis connection error:", err)
);

// Initialize Redis connection
const connectRedis = async () => {
  try {
    await redisClient.connect(); // Connect to Redis server
    console.log("🚀 Redis client connected");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
};

module.exports = { redisClient, connectRedis };
