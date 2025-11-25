const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

// Get all tickets (tech team only)
router.get("/tickets", auth, async (req, res) => {
  try {
    if (!req.user.isTechTeam()) {
      return res.status(403).json({ error: "Access denied. Tech team only." });
    }

    const { status, priority, category, assignedTo } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email phone")
      .populate("assignedTo", "name email")
      .populate("property", "title address")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign ticket to tech team member
router.put("/tickets/:id/assign", auth, async (req, res) => {
  try {
    if (!req.user.isTechTeam()) {
      return res.status(403).json({ error: "Access denied. Tech team only." });
    }

    const { assignedTo } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        status: "in_progress",
      },
      { new: true }
    ).populate("assignedTo", "name email");

    // Emit real-time update
    req.app
      .get("io")
      .to(`tech_team_${assignedTo}`)
      .emit("ticket_assigned", ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket status
router.put("/tickets/:id/status", auth, async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const updateData = { status };

    if (status === "resolved" || status === "closed") {
      updateData.resolutionNotes = resolutionNotes;
      updateData.closedAt = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    // Notify all tech team members
    req.app.get("io").emit("ticket_updated", ticket);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to ticket
router.post("/tickets/:id/messages", auth, async (req, res) => {
  try {
    const { message, attachments } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          messages: {
            user: req.user.id,
            message,
            attachments: attachments || [],
          },
        },
      },
      { new: true }
    ).populate("messages.user", "name role");

    // Real-time message update
    req.app
      .get("io")
      .to(`ticket_${req.params.id}`)
      .emit("new_ticket_message", {
        ticketId: req.params.id,
        message: ticket.messages[ticket.messages.length - 1],
      });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tech team availability
router.get("/availability", auth, async (req, res) => {
  try {
    if (!req.user.isTechTeam()) {
      return res.status(403).json({ error: "Access denied. Tech team only." });
    }

    const techTeam = await User.find({
      role: { $in: ["tech_support", "tech_admin"] },
    }).select("name role availability currentTickets");

    res.json(techTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule maintenance
router.post("/schedule", auth, async (req, res) => {
  try {
    const { ticketId, scheduledDate, assignedTo, estimatedDuration } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        scheduledDate,
        assignedTo,
        estimatedDuration,
        status: "in_progress",
      },
      { new: true }
    ).populate("assignedTo", "name email");

    // Add to tech team member's current tickets
    await User.findByIdAndUpdate(assignedTo, {
      $push: { currentTickets: ticketId },
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
