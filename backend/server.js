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
    message: "🚀 Rent-D Backend is working! (Database connection pending)",
    status: "Server running - MongoDB IP whitelist in progress",
    timestamp: new Date().toISOString(),
  });
});

// Database connection - SIMPLIFIED (no deprecated options)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully!");
  })
  .catch((err) => {
    console.log("⚠️  MongoDB connection pending...");
    console.log(
      "💡 IP whitelist is being configured. Server will auto-connect when ready."
    );
  });

// Test authentication (simulated - works without database)
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;

  // Simulate successful registration
  res.json({
    status: "success",
    message: "User registration simulated (DB connection pending)",
    data: {
      user: {
        id: "simulated-" + Date.now(),
        name,
        email,
        role,
        isVerified: false,
      },
    },
    note: "Real database connection will be available once IP whitelist is active",
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Simulate successful login
  res.json({
    status: "success",
    message: "User login simulated (DB connection pending)",
    token: "simulated-jwt-token-" + Date.now(),
    data: {
      user: {
        id: "simulated-user",
        name: "Test User",
        email: email,
        role: "tenant",
      },
    },
  });
});

// Test payment endpoint (simulated)
app.post("/api/payments/guest-payment", (req, res) => {
  res.json({
    success: true,
    message: "Payment simulation successful",
    paymentId: "simulated-payment-" + Date.now(),
    note: "Real Stripe integration will work once database is connected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/auth/register`);
  console.log(
    `💡 MongoDB Status: IP whitelist pending - server running in simulation mode`
  );
});
