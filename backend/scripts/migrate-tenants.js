// /backend/scripts/migrate-tenants.js
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function migrateTenants() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/rentd"
    );

    console.log("Connected to MongoDB");

    // Find all existing tenants without tenantId
    const tenants = await User.find({
      role: "tenant",
      $or: [{ tenantId: { $exists: false } }, { tenantId: null }],
    });

    console.log(`Found ${tenants.length} tenants to migrate`);

    let updatedCount = 0;

    for (const tenant of tenants) {
      // Generate tenantId if not exists
      if (!tenant.tenantId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = Math.floor(1000 + Math.random() * 9000);
        tenant.tenantId = `TEN-${year}${month}${day}-${random}`;
      }

      // Ensure isActive field exists
      if (tenant.isActive === undefined) {
        tenant.isActive = true;
      }

      // Ensure balanceDue field exists
      if (tenant.balanceDue === undefined) {
        tenant.balanceDue = 0;
      }

      await tenant.save();
      updatedCount++;

      console.log(`Updated tenant: ${tenant.name} (${tenant.tenantId})`);
    }

    console.log(`Migration completed. Updated ${updatedCount} tenants.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateTenants();
