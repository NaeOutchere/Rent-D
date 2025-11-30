const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: String,
    services: [
      {
        type: String,
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
    ],
    hourlyRate: Number,
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalJobs: {
      type: Number,
      default: 0,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
