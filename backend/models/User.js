const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  parish: String,
  country: { type: String, default: "Jamaica" },
});

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String,
  email: String,
});

const referenceSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String,
  email: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, // This automatically creates an index
    index: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["tenant", "landlord", "tech_support", "tech_admin", "admin"],
    required: true,
  },
  phone: String,
  dateOfBirth: Date,
  avatar: String,
  isVerified: { type: Boolean, default: false },

  // ===== FAST PAY FEATURE FIELDS =====
  tenantId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined for non-tenants
    index: true, // This is fine - creates index for tenantId
  },
  balanceDue: {
    type: Number,
    default: 0,
  },
  currentProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // ===================================

  // Common fields for both landlords and tenants
  trn: String,
  idType: {
    type: String,
    enum: ["driver_license", "passport", "national_id", "voter_id"],
  },
  idNumber: String,
  idFile: String, // Store file path or URL
  bankName: String,
  accountNumber: String,
  accountType: {
    type: String,
    enum: ["checking", "savings"],
  },
  routingNumber: String,
  emergencyContact: emergencyContactSchema,

  // Landlord specific fields
  companyName: String,
  companyRegistration: String,
  propertyManagementExperience: {
    type: String,
    enum: ["none", "less_1", "1_3", "3_5", "5_plus"],
  },
  properties: [
    {
      address: addressSchema,
      propertyType: String,
      numberOfUnits: Number,
      hasExistingLease: Boolean,
      leaseAgreementPreference: {
        type: String,
        enum: ["generate", "upload", "both"],
      },
      existingLeaseFile: String,
    },
  ],
  paymentPreferences: {
    rentCollectionDate: { type: Number, default: 1 },
    lateFeePolicy: {
      type: String,
      enum: ["standard", "flexible", "strict", "none"],
      default: "standard",
    },
  },

  // Tenant specific fields
  employmentStatus: String,
  occupation: String,
  monthlyIncome: Number,
  employerName: String,
  employerPhone: String,
  workAddress: String,
  rentalHistory: String,
  previousLandlordName: String,
  previousLandlordPhone: String,
  reasonForLeaving: String,
  references: [referenceSchema],
  rentalPreferences: {
    preferredLocation: {
      parish: String,
      areas: [String],
      maxBudget: Number,
      minBedrooms: Number,
      propertyType: String,
    },
    moveInDate: Date,
    leaseDuration: {
      type: String,
      enum: ["6", "12", "24", "month_to_month"],
    },
    hasPets: Boolean,
    petDetails: String,
    numberOfOccupants: Number,
    smoking: Boolean,
    vehicles: Number,
    specialRequirements: String,
  },
  proofOfIncomeFile: String,
  creditCheckConsent: Boolean,

  // Tech team specific fields
  techSkills: [String],
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean },
  },
  currentTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],

  // Stripe integration
  stripeCustomerId: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add pre-save hook to generate tenantId for new tenants
userSchema.pre("save", async function (next) {
  // Generate tenantId for new tenants
  if (this.isNew && this.role === "tenant" && !this.tenantId) {
    // Generate tenantId in format: TEN-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);
    this.tenantId = `TEN-${year}${month}${day}-${random}`;
  }

  if (!this.isModified("password")) return next();

  // Only hash password if it's not already hashed
  const isAlreadyHashed =
    this.password.startsWith("$2a$") || this.password.startsWith("$2b$");
  if (!isAlreadyHashed) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  this.updatedAt = Date.now();
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  // If password is not hashed (plain text), compare directly
  if (this.password.length < 20) {
    // Simple check for plain text
    return candidatePassword === this.password;
  }

  // If password is hashed, use bcrypt
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isTechTeam = function () {
  return this.role === "tech_support" || this.role === "tech_admin";
};

// Virtual property for displaying formatted balance
userSchema.virtual("formattedBalanceDue").get(function () {
  return this.balanceDue ? this.balanceDue.toFixed(2) : "0.00";
});

// Method to update balance
userSchema.methods.updateBalance = function (amount, operation = "add") {
  if (operation === "add") {
    this.balanceDue += amount;
  } else if (operation === "subtract") {
    this.balanceDue = Math.max(0, this.balanceDue - amount);
  } else if (operation === "set") {
    this.balanceDue = amount;
  }
  return this.save();
};

// REMOVE OR COMMENT OUT THESE DUPLICATE INDEXES:
// userSchema.index({ tenantId: 1 }); // DUPLICATE - already created by unique: true
// userSchema.index({ email: 1 });    // DUPLICATE - already created by unique: true

// Keep these additional indexes:
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ name: "text", email: "text", tenantId: "text" });

module.exports = mongoose.model("User", userSchema);
