const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cron = require("node-cron");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const creditRoutes = require("./routes/credits");
const activityRoutes = require("./routes/activity");
const adminRoutes = require("./routes/admin");

// Import middleware
const { authenticateJWT } = require("./middleware/auth");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/creator-dashboard",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Creator Dashboard API" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/posts", authenticateJWT, postRoutes);
app.use("/api/credits", authenticateJWT, creditRoutes);
app.use("/api/activity", authenticateJWT, activityRoutes);
app.use("/api/admin", authenticateJWT, adminRoutes);

// Schedule daily tasks
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily tasks...");
  // Reset daily login flags for all users
  try {
    await mongoose.model("User").updateMany({}, { dailyLoginCredited: false });
    console.log("Reset daily login credits flags");
  } catch (error) {
    console.error("Error in daily task:", error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
