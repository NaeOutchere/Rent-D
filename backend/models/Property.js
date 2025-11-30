const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },

  rentAmount: { type: Number, required: true },
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,

  amenities: { type: [String], default: [] },
  utilities: { type: [String], default: [] },
  furnished: { type: Boolean, default: false },

  images: { type: [String], default: [] },

  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  isAvailable: { type: Boolean, default: true },

  status: {
    type: String,
    enum: ["Available", "Rented", "Under Maintenance"],
    default: "Available",
  },

  documents: [
    {
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  // Add maintenance service fields
  maintenanceContact: {
    name: String,
    phone: String,
    email: String,
  },
  serviceInstructions: String,
  emergencyProcedures: String,
  preferredServiceProviders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

// Virtual for full address
propertySchema.virtual("fullAddress").get(function () {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
});

module.exports = mongoose.model("Property", propertySchema);
