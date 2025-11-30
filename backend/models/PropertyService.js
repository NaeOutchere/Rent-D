const mongoose = require("mongoose");

const propertyServiceSchema = new mongoose.Schema(
  {
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
    serviceProviders: [
      {
        serviceProvider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceProvider",
        },
        category: String,
        isPreferred: {
          type: Boolean,
          default: false,
        },
      },
    ],
    emergencyContact: {
      name: String,
      phone: String,
    },
    serviceInstructions: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PropertyService", propertyServiceSchema);
