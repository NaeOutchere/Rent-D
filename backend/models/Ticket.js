const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["maintenance", "payment", "account", "technical", "general"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "waiting_customer", "resolved", "closed"],
    default: "open",
  },

  // Relationships
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },

  // Communication
  messages: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      attachments: [String],
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Scheduling
  scheduledDate: Date,
  estimatedDuration: Number, // in minutes
  actualDuration: Number,

  // Resolution
  resolutionNotes: String,
  closedAt: Date,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ticketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
