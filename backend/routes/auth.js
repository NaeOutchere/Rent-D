const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { expressValidator, validationResult } = require("express-validator");

const router = express.Router();

// Input validation
const validateRegistration = [
  expressValidator.body("name").notEmpty().withMessage("Name is required"),
  expressValidator
    .body("email")
    .isEmail()
    .withMessage("Valid email is required"),
  expressValidator
    .body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  expressValidator
    .body("role")
    .isIn(["tenant", "landlord", "tech_support", "tech_admin", "admin"])
    .withMessage("Valid role is required"),
];

const validateLogin = [
  expressValidator
    .body("email")
    .isEmail()
    .withMessage("Valid email is required"),
  expressValidator
    .body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Register new user
router.post("/register", validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      isVerified: newUser.isVerified,
    };

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user and include password for verification
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // User response without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      avatar: user.avatar,
    };

    res.json({
      status: "success",
      token,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    // This requires auth middleware - we'll create that next
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
});

module.exports = router;
