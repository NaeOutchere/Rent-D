const express = require("express");
const router = express.Router();

const Property = require("../models/Property");
const Viewing = require("../models/Viewing");
const Application = require("../models/Application");

const { auth, optionalAuth, requireRole } = require("../middleware/auth");

/* ================================
   GET ALL AVAILABLE PROPERTIES
================================ */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .populate("landlord", "firstname lastname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   GET PROPERTY BY ID
================================ */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("landlord", "firstname lastname email")
      .populate("tenants", "firstname lastname email");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   CREATE PROPERTY (LANDLORD + ADMIN)
================================ */
router.post("/", auth, requireRole(["landlord", "admin"]), async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      landlord: req.user._id,
    });

    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   UPDATE PROPERTY
================================ */
router.put(
  "/:id",
  auth,
  requireRole(["landlord", "admin"]),
  async (req, res) => {
    try {
      const property = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json({ success: true, property });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/* ================================
   DELETE PROPERTY
================================ */
router.delete(
  "/:id",
  auth,
  requireRole(["landlord", "admin"]),
  async (req, res) => {
    try {
      await Property.findByIdAndDelete(req.params.id);

      res.json({ success: true, message: "Property deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ============================================================
   SCHEDULE VIEWING (TENANT + ADMIN)
============================================================ */
router.post(
  "/:id/schedule",
  auth,
  requireRole(["tenant", "admin"]),
  async (req, res) => {
    try {
      const { date, name, email, phone, message } = req.body;

      const property = await Property.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      const viewing = await Viewing.create({
        property: property._id,
        user: req.user._id,
        date,
        name,
        email,
        phone,
        message,
      });

      res.status(201).json({ success: true, viewing });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/* ============================================================
   APPLY TO RENT (TENANT)
============================================================ */
router.post("/:id/apply", auth, requireRole(["tenant"]), async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const application = await Application.create({
      property: property._id,
      user: req.user._id,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
