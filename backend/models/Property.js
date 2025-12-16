const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    parish: String, // Added for Jamaican context
    country: { type: String, default: "Jamaica" },
  },

  rentAmount: { type: Number, required: true },
  currency: {
    // Added for Fast Pay feature
    type: String,
    enum: ["usd", "jmd"],
    default: "jmd",
  },
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
    enum: ["Available", "Rented", "Under Maintenance", "Occupied"], // Added "Occupied"
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

  // ===== FAST PAY FEATURE FIELDS =====
  propertyType: {
    type: String,
    enum: ["apartment", "house", "condo", "townhouse", "commercial"],
    default: "apartment",
  },

  yearBuilt: Number,

  securityDeposit: Number,

  utilitiesDetails: [
    {
      type: String,
      included: Boolean,
      monthlyCost: Number,
    },
  ],

  availableFrom: Date,
  leaseTerm: {
    type: String,
    enum: ["6", "12", "24", "month_to_month"],
    default: "12",
  },

  // Media
  floorPlans: [String],
  virtualTour: String,

  // Features & Amenities
  parkingSpaces: Number,
  hasPetPolicy: Boolean,
  petPolicy: String,
  smokingAllowed: Boolean,

  // Payment Information for Fast Pay
  paymentInstructions: String,
  acceptedPaymentMethods: [String],

  // Rent payment tracking
  nextRentDueDate: Date,
  rentPaymentHistory: [
    {
      date: Date,
      amount: Number,
      paymentMethod: String,
      status: {
        type: String,
        enum: ["paid", "pending", "overdue"],
        default: "pending",
      },
    },
  ],

  // Fast Pay settings
  allowGuestPayments: {
    type: Boolean,
    default: true,
  },
  guestPaymentInstructions: String,
  // ===================================

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Added updatedAt
});

// Virtual for full address
propertySchema.virtual("fullAddress").get(function () {
  const addr = this.address;
  if (!addr) return "";

  const parts = [];
  if (addr.street) parts.push(addr.street);
  if (addr.city) parts.push(addr.city);
  if (addr.state) parts.push(addr.state);
  if (addr.zipCode) parts.push(addr.zipCode);
  if (addr.country) parts.push(addr.country);

  return parts.join(", ");
});

// Virtual for formatted rent amount
propertySchema.virtual("formattedRent").get(function () {
  const currencySymbol = this.currency === "usd" ? "$" : "J$";
  return `${currencySymbol}${this.rentAmount.toFixed(2)}`;
});

// Method to check if property is available for rent
propertySchema.methods.isRentable = function () {
  return this.isAvailable && this.status === "Available";
};

// Method to add a tenant
propertySchema.methods.addTenant = async function (tenantId) {
  if (!this.tenants.includes(tenantId)) {
    this.tenants.push(tenantId);

    // Update status if first tenant
    if (this.tenants.length === 1) {
      this.status = "Occupied";
      this.isAvailable = false;
    }

    await this.save();
    return true;
  }
  return false;
};

// Method to remove a tenant
propertySchema.methods.removeTenant = async function (tenantId) {
  const index = this.tenants.indexOf(tenantId);
  if (index > -1) {
    this.tenants.splice(index, 1);

    // Update status if no tenants left
    if (this.tenants.length === 0) {
      this.status = "Available";
      this.isAvailable = true;
    }

    await this.save();
    return true;
  }
  return false;
};

// Method to record rent payment
propertySchema.methods.recordPayment = async function (paymentData) {
  this.rentPaymentHistory.push({
    date: new Date(),
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod || "stripe",
    status: "paid",
  });

  // Update next rent due date (assuming monthly rent)
  if (this.nextRentDueDate) {
    this.nextRentDueDate = new Date(this.nextRentDueDate);
    this.nextRentDueDate.setMonth(this.nextRentDueDate.getMonth() + 1);
  }

  await this.save();
};

// Pre-save hook to update timestamp
propertySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
propertySchema.index({ landlord: 1 });
propertySchema.index({ isAvailable: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ "address.city": 1 });
propertySchema.index({ "address.state": 1 });
propertySchema.index({ rentAmount: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ tenants: 1 });

// Text search index
propertySchema.index({
  title: "text",
  description: "text",
  "address.street": "text",
  "address.city": "text",
  "address.state": "text",
});

module.exports = mongoose.model("Property", propertySchema);
