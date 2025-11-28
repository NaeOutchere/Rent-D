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
  email: { type: String, required: true, unique: true },
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
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

/* userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}; */

userSchema.methods.isTechTeam = function () {
  return this.role === "tech_support" || this.role === "tech_admin";
};

module.exports = mongoose.model("User", userSchema);
