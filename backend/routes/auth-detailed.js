const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Input validation for detailed registration
const validateDetailedRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["tenant", "landlord"])
    .withMessage("Valid role is required"),
];

// Register landlord with detailed information
router.post(
  "/register/landlord",
  validateDetailedRegistration,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        phone,
        trn,
        companyName,
        companyRegistration,
        propertyManagementExperience,
        properties,
        paymentPreferences,
        idType,
        idNumber,
        bankName,
        accountNumber,
        accountType,
        routingNumber,
        emergencyContact,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this email" });
      }

      // Create new landlord user
      const newUser = new User({
        name,
        email,
        password,
        role: "landlord",
        phone,
        trn,
        companyName,
        companyRegistration,
        propertyManagementExperience,
        properties: properties || [],
        paymentPreferences: paymentPreferences || {
          rentCollectionDate: 1,
          lateFeePolicy: "standard",
        },
        idType,
        idNumber,
        bankName,
        accountNumber,
        accountType,
        routingNumber,
        emergencyContact,
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        status: "success",
        message: "Landlord registered successfully",
        token,
        data: {
          user: userResponse,
        },
      });
    } catch (error) {
      console.error("Landlord registration error:", error);
      res.status(500).json({ error: "Landlord registration failed" });
    }
  }
);

// Register tenant with detailed information
router.post(
  "/register/tenant",
  validateDetailedRegistration,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        phone,
        dateOfBirth,
        trn,
        employmentStatus,
        occupation,
        monthlyIncome,
        employerName,
        employerPhone,
        workAddress,
        rentalHistory,
        previousLandlordName,
        previousLandlordPhone,
        reasonForLeaving,
        references,
        rentalPreferences,
        idType,
        idNumber,
        bankName,
        accountNumber,
        accountType,
        routingNumber,
        emergencyContact,
        creditCheckConsent,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this email" });
      }

      // Validate age for tenant (must be at least 18)
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          return res
            .status(400)
            .json({
              error:
                "You must be at least 18 years old to register as a tenant",
            });
        }
      }

      // Create new tenant user
      const newUser = new User({
        name,
        email,
        password,
        role: "tenant",
        phone,
        dateOfBirth,
        trn,
        employmentStatus,
        occupation,
        monthlyIncome,
        employerName,
        employerPhone,
        workAddress,
        rentalHistory,
        previousLandlordName,
        previousLandlordPhone,
        reasonForLeaving,
        references: references || [],
        rentalPreferences: rentalPreferences || {},
        idType,
        idNumber,
        bankName,
        accountNumber,
        accountType,
        routingNumber,
        emergencyContact,
        creditCheckConsent: creditCheckConsent || false,
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        status: "success",
        message: "Tenant registered successfully",
        token,
        data: {
          user: userResponse,
        },
      });
    } catch (error) {
      console.error("Tenant registration error:", error);
      res.status(500).json({ error: "Tenant registration failed" });
    }
  }
);

module.exports = router;
