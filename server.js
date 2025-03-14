const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const redis = require("redis");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Middleware for parsing JSON

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes); // Use user routes

app.use("/api/tasks", taskRoutes); // Use task routes

app.use(errorHandler);

const redisClient = redis.createClient();

redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("error", (err) =>
  console.log("❌ Redis connection error:", err)
);

(async () => {
  try {
    await redisClient.connect(); // THIS IS ESSENTIAL
    console.log("🚀 Redis client connected");
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = redisClient;
