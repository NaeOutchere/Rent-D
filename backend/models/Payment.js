const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // Payment Details
  amount: { type: Number, required: true },
  currency: { type: String, enum: ["usd", "jmd"], required: true },
  originalAmount: Number,
  convertedAmount: Number,
  exchangeRate: Number,

  // Payer Information
  payerEmail: { type: String, required: true },
  payerName: String,
  isGuestPayment: { type: Boolean, default: false },

  // Recipient Information
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },

  // Stripe Data
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  stripeChargeId: String,
  paymentMethod: String,
  paymentMethodType: String,

  // Status Tracking
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "completed",
      "failed",
      "refunded",
      "disputed",
    ],
    default: "pending",
  },

  // Receipt Information
  receiptsSent: {
    payer: { type: Boolean, default: false },
    tenant: { type: Boolean, default: false },
    landlord: { type: Boolean, default: false },
  },

  // Guest Payment Specific
  guestPaymentToken: String, // For guest payment tracking
  guestPaymentExpires: Date,

  // Timestamps
  paidAt: Date,
  refundedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

// Index for better query performance
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ payerEmail: 1 });
paymentSchema.index({ landlord: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
