const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Input validation
const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["tenant", "landlord", "tech_support", "tech_admin", "admin", "ceo"])
    .withMessage("Valid role is required"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
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

// Regular Login - For Tenants & Landlords only
router.post("/login", validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log("=== REGULAR LOGIN ATTEMPT ===");
    console.log("Email:", email);

    // Find user and include password for verification
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ User found - Role:", user.role);

    // Check if user is allowed to use regular login (Tenants & Landlords only)
    const allowedRoles = ["tenant", "landlord"];
    if (!allowedRoles.includes(user.role)) {
      console.log("❌ Role not allowed for regular login:", user.role);
      return res.status(403).json({
        error:
          "Staff members must use the Staff Portal for login. Please use the Staff Login button.",
      });
    }

    // Check password
    const isPasswordValid = await user.correctPassword(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Password invalid for user:", user.email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Password valid - Regular login successful");

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
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
});

// Staff Login - For staff roles only
router.post("/staff-login", validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log("=== STAFF LOGIN ATTEMPT ===");
    console.log("Email:", email);

    // Find user and include password for verification
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ User found - Role:", user.role);

    // Check if user is allowed to use staff login (Staff roles only)
    const staffRoles = [
      "admin",
      "tech_support",
      "tech_admin",
      "ceo",
      "support",
    ];
    if (!staffRoles.includes(user.role)) {
      console.log("❌ Role not allowed for staff login:", user.role);
      return res.status(403).json({
        error:
          "This account is not authorized for staff access. Please use the regular login.",
      });
    }

    // Check password
    const isPasswordValid = await user.correctPassword(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Password invalid for staff user:", user.email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Password valid - Staff login successful");

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
    console.error("❌ Staff login error:", error);
    res.status(500).json({ error: "Staff login failed: " + error.message });
  }
});

module.exports = router;
