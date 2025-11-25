require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log("✅ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: "System Administrator",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log("🔑 Password: " + process.env.ADMIN_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};


createAdminUser();
