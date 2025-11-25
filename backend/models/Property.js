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
  amenities: [String],
  images: [String],
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isAvailable: { type: Boolean, default: true },
  documents: [
    {
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
