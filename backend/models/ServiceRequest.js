const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Plumbing",
        "Electrical",
        "HVAC",
        "Carpentry",
        "Pest Control",
        "Cleaning",
        "Appliance Repair",
        "General Maintenance",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Medium",
    },
    preferredProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    assignedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    status: {
      type: String,
      enum: ["Submitted", "Assigned", "In Progress", "Completed", "Cancelled"],
      default: "Submitted",
    },
    scheduledDate: Date,
    completedDate: Date,
    costEstimate: Number,
    actualCost: Number,
    tenantNotes: String,
    providerNotes: String,
    images: [String],
    landlordApproval: {
      type: Boolean,
      default: false,
    },
    landlordNotes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
