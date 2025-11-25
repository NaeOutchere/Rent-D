const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // Message Content
  content: { type: String, required: true },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "system"],
    default: "text",
  },

  // Participants
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Conversation Context
  conversationType: {
    type: String,
    enum: ["tenant_landlord", "tenant_tech", "landlord_tech", "general"],
    required: true,
  },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },

  // Message Status
  read: { type: Boolean, default: false },
  readAt: Date,

  // Attachments
  attachments: [
    {
      filename: String,
      url: String,
      fileType: String,
      size: Number,
    },
  ],

  // System Messages
  isSystemMessage: { type: Boolean, default: false },
  systemMessageType: String,

  createdAt: { type: Date, default: Date.now },
});

// Indexes for efficient querying
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ conversationType: 1 });

module.exports = mongoose.model("Message", messageSchema);
