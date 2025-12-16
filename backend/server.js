const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const serviceRoutes = require("./routes/services");
const paymentRoutes = require("./routes/payments");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);

// Add this route to test if server is running
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", details: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// REMOVE DEPRECATED OPTIONS and KEEP ONLY ONE mongoose.connect
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rentd")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;
