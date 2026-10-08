// ─────────────────────────────────────────────
//  FoodBridge – Express Server
//  Entry point: server/index.js
// ─────────────────────────────────────────────

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const postsRouter = require("./routes/posts");
const statsRouter = require("./routes/stats");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root health check
app.get("/", (req, res) => {
  res.json({ message: "FoodBridge server is running! 🍽️" });
});

// API Routes
app.use("/api/posts", postsRouter);
app.use("/api/stats", statsRouter);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ FoodBridge server running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/posts?status=`);
  console.log(`   POST http://localhost:${PORT}/api/posts`);
  console.log(`   POST http://localhost:${PORT}/api/posts/:id/claims`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
});
