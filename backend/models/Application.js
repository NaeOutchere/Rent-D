const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    email: String,
    phone: String,
    message: String,

    status: {
      type: String,
      enum: ["Submitted", "Reviewed", "Accepted", "Rejected"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
