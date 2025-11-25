const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  avatar: String,
  isVerified: { type: Boolean, default: false },

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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user is tech team
userSchema.methods.isTechTeam = function () {
  return this.role === "tech_support" || this.role === "tech_admin";
};

module.exports = mongoose.model("User", userSchema);
