const mongoose = require("mongoose");

const kanbanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ["tech_tasks", "development", "maintenance", "customer_support"],
    required: true,
  },

  columns: [
    {
      title: { type: String, required: true },
      position: { type: Number, required: true },
      tasks: [
        {
          title: { type: String, required: true },
          description: String,
          priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
          },
          assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
          dueDate: Date,
          labels: [String],
          attachments: [String],
          comments: [
            {
              user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              comment: String,
              createdAt: { type: Date, default: Date.now },
            },
          ],
          position: { type: Number, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],

  // Access control
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPublic: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Kanban", kanbanBoard);
