const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Rent-D Backend is WORKING with LIVE Database!",
    database:
      mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
    timestamp: new Date().toISOString(),
  });
});

// Import routes
const authRoutes = require("./routes/auth");
const authDetailedRoutes = require("./routes/auth-detailed"); // ← ADD THIS LINE
const propertyRoutes = require("./routes/properties");


// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", authDetailedRoutes); // ← ADD THIS LINE
app.use("/api/properties", propertyRoutes);


// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🎉 MongoDB Atlas connected successfully!");
    console.log("📊 Database: rentd");
    console.log("🌐 Cloud: MongoDB Atlas");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`📍 Live API: http://localhost:${PORT}`);
});
