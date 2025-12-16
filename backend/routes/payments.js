const express = require("express");
const router = express.Router();
const { stripe, stripeConfig } = require("../config/stripe");
const Payment = require("../models/Payment");
const Property = require("../models/Property");
const User = require("../models/User");
const { auth, optionalAuth } = require("../middleware/auth");
const { sendReceiptEmail } = require("../utils/email");

// Guest Payment (Fast Pay - No login required)
router.post("/guest-payment", async (req, res) => {
  try {
    const {
      amount,
      currency,
      payerEmail,
      payerName,
      propertyId,
      tenantEmail,
      description,
    } = req.body;

    // Validate required fields
    if (!amount || !currency || !payerEmail || !propertyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate property exists and get landlord
    const property = await Property.findById(propertyId).populate("landlord");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      receipt_email: payerEmail,
      metadata: {
        propertyId: propertyId.toString(),
        payerEmail: payerEmail,
        payerName: payerName || "",
        tenantEmail: tenantEmail || "",
        type: "guest_payment",
        landlordId: property.landlord._id.toString(),
      },
      description: description || `Rent payment for ${property.title}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    const payment = new Payment({
      amount: amount,
      currency: currency.toLowerCase(),
      originalAmount: amount,
      payerEmail: payerEmail,
      payerName: payerName,
      isGuestPayment: true,
      landlord: property.landlord._id,
      property: propertyId,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
      guestPaymentToken: require("crypto").randomBytes(16).toString("hex"),
      guestPaymentExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await payment.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      amount: amount,
      currency: currency,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("Guest payment error:", error);
    res.status(500).json({
      error: "Payment processing failed",
      details: error.message,
    });
  }
});

// Search for tenant/property (Fast Pay feature)
router.post("/search-tenant", async (req, res) => {
  try {
    const { searchType, searchTerm } = req.body;

    if (!searchType || !searchTerm) {
      return res
        .status(400)
        .json({ error: "Search type and term are required" });
    }

    let query = { role: "tenant", isActive: true };

    // Build search query based on type
    switch (searchType) {
      case "email":
        query.email = { $regex: searchTerm, $options: "i" };
        break;
      case "tenantId":
        query.tenantId = { $regex: searchTerm, $options: "i" };
        break;
      case "name":
        query.name = { $regex: searchTerm, $options: "i" };
        break;
      default:
        return res.status(400).json({ error: "Invalid search type" });
    }

    // Find tenants with their properties
    const tenants = await User.find(query)
      .populate({
        path: "currentProperty",
        select: "title address rentAmount landlord",
        populate: {
          path: "landlord",
          select: "name email",
        },
      })
      .select("name email tenantId currentProperty balanceDue isActive")
      .limit(10); // Limit results to prevent abuse

    // Format results
    const results = tenants.map((tenant) => ({
      _id: tenant._id,
      name: tenant.name,
      email: tenant.email,
      tenantId: tenant.tenantId,
      propertyId: tenant.currentProperty?._id,
      propertyTitle: tenant.currentProperty?.title,
      propertyAddress: tenant.currentProperty?.address,
      landlordName: tenant.currentProperty?.landlord?.name,
      balanceDue: tenant.balanceDue || tenant.currentProperty?.rentAmount || 0,
      isActive: tenant.isActive,
    }));

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Tenant search error:", error);
    res.status(500).json({ error: "Search failed", details: error.message });
  }
});

// Get tenant details by ID (for Fast Pay confirmation)
router.get("/tenant-details/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Try to find by tenantId field first, then by _id
    let tenant = await User.findOne({
      tenantId: tenantId,
      role: "tenant",
      isActive: true,
    });

    if (!tenant) {
      // Try to find by MongoDB _id
      if (tenantId.match(/^[0-9a-fA-F]{24}$/)) {
        tenant = await User.findOne({
          _id: tenantId,
          role: "tenant",
          isActive: true,
        });
      }
    }

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found or inactive" });
    }

    // Populate property and landlord info
    const tenantWithDetails = await User.findById(tenant._id)
      .populate({
        path: "currentProperty",
        select: "title address rentAmount landlord",
        populate: {
          path: "landlord",
          select: "name email phone",
        },
      })
      .select("name email tenantId phone balanceDue currentProperty");

    res.json({
      success: true,
      data: {
        _id: tenantWithDetails._id,
        name: tenantWithDetails.name,
        email: tenantWithDetails.email,
        phone: tenantWithDetails.phone,
        tenantId: tenantWithDetails.tenantId,
        propertyId: tenantWithDetails.currentProperty?._id,
        propertyTitle: tenantWithDetails.currentProperty?.title,
        propertyAddress: tenantWithDetails.currentProperty?.address,
        landlordName: tenantWithDetails.currentProperty?.landlord?.name,
        landlordEmail: tenantWithDetails.currentProperty?.landlord?.email,
        balanceDue:
          tenantWithDetails.balanceDue ||
          tenantWithDetails.currentProperty?.rentAmount ||
          0,
      },
    });
  } catch (error) {
    console.error("Get tenant details error:", error);
    res
      .status(500)
      .json({ error: "Failed to get tenant details", details: error.message });
  }
});

// Confirm and complete guest payment
router.post("/confirm-guest-payment", async (req, res) => {
  try {
    const { paymentIntentId, paymentId } = req.body;

    if (!paymentIntentId || !paymentId) {
      return res
        .status(400)
        .json({ error: "Payment intent ID and payment ID are required" });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update payment record
      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: "completed",
          paidAt: new Date(),
          stripeCustomerId: paymentIntent.customer,
          stripeChargeId: paymentIntent.latest_charge,
          paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
          paymentMethodType: paymentIntent.payment_method_types?.[0] || "card",
        },
        { new: true }
      )
        .populate("landlord")
        .populate("property", "title address rentAmount")
        .populate("tenant", "name email tenantId");

      if (!payment) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      // Update tenant's balance (if tenant exists)
      if (payment.tenant) {
        const tenant = await User.findById(payment.tenant._id);
        if (tenant) {
          // Reduce the tenant's balance by payment amount
          tenant.balanceDue = Math.max(
            0,
            (tenant.balanceDue || 0) - payment.amount
          );
          await tenant.save();
        }
      }

      // Send receipts
      await sendReceipts(payment);

      res.json({
        success: true,
        payment: {
          _id: payment._id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          paidAt: payment.paidAt,
          payerEmail: payment.payerEmail,
          payerName: payment.payerName,
          property: payment.property,
          tenant: payment.tenant,
          landlord: payment.landlord,
          isGuestPayment: payment.isGuestPayment,
        },
        message: "Payment completed successfully",
      });
    } else {
      // Update payment status based on Stripe status
      await Payment.findByIdAndUpdate(paymentId, {
        status: paymentIntent.status === "processing" ? "processing" : "failed",
      });

      res.status(400).json({
        error: "Payment not successful",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      error: "Payment confirmation failed",
      details: error.message,
    });
  }
});

// Resend receipt endpoint
router.post("/resend-receipt", async (req, res) => {
  try {
    const { paymentId, email, recipientType = "payer" } = req.body;

    if (!paymentId || !email) {
      return res
        .status(400)
        .json({ error: "Payment ID and email are required" });
    }

    const payment = await Payment.findById(paymentId)
      .populate("landlord", "name email")
      .populate("property", "title")
      .populate("tenant", "name email");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Validate recipient type
    const validRecipientTypes = ["payer", "tenant", "landlord"];
    if (!validRecipientTypes.includes(recipientType)) {
      return res.status(400).json({ error: "Invalid recipient type" });
    }

    // Resend receipt based on recipient type
    let subject = "";
    switch (recipientType) {
      case "payer":
        subject = `Payment Receipt (Resent) - ${payment._id}`;
        break;
      case "tenant":
        subject = `Payment Notification (Resent) - ${payment._id}`;
        break;
      case "landlord":
        subject = `Rent Payment Received (Resent) - ${payment._id}`;
        break;
    }

    await sendReceiptEmail({
      to: email,
      subject: subject,
      payment: payment,
      type: recipientType,
    });

    // Update receipt sent status
    const updateField = `receiptsSent.${recipientType}`;
    await Payment.findByIdAndUpdate(paymentId, {
      [updateField]: true,
    });

    res.json({
      success: true,
      message: `Receipt has been resent to ${email}`,
      recipientType: recipientType,
    });
  } catch (error) {
    console.error("Resend receipt error:", error);
    res
      .status(500)
      .json({ error: "Failed to resend receipt", details: error.message });
  }
});

// Get payment details for receipt resending (public access)
router.get("/guest-payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate("landlord", "name email")
      .populate("property", "title address")
      .populate("tenant", "name email tenantId");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Basic payment info (no sensitive data)
    res.json({
      success: true,
      data: {
        _id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paidAt: payment.paidAt,
        payerEmail: payment.payerEmail,
        payerName: payment.payerName,
        property: payment.property,
        tenant: payment.tenant,
        landlord: payment.landlord,
        isGuestPayment: payment.isGuestPayment,
        receiptsSent: payment.receiptsSent,
      },
    });
  } catch (error) {
    console.error("Get guest payment error:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve payment", details: error.message });
  }
});

// Get payment status
router.get("/status/:paymentIntentId", async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Check in Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check in database
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    })
      .populate("property", "title")
      .populate("tenant", "name");

    res.json({
      success: true,
      stripeStatus: paymentIntent.status,
      payment: payment
        ? {
            _id: payment._id,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            payerEmail: payment.payerEmail,
            property: payment.property,
            tenant: payment.tenant,
          }
        : null,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res
      .status(500)
      .json({ error: "Failed to get payment status", details: error.message });
  }
});

// Regular tenant payment (logged in users)
router.post("/tenant-payment", auth, async (req, res) => {
  try {
    const { amount, currency, propertyId, paymentMethodId } = req.body;
    const tenantId = req.user.id;

    // Validate input
    if (!amount || !currency || !propertyId || !paymentMethodId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const property = await Property.findById(propertyId).populate("landlord");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if tenant is associated with this property
    if (!property.tenants.includes(tenantId)) {
      return res
        .status(403)
        .json({ error: "You are not a tenant of this property" });
    }

    // Get or create Stripe customer for user
    let stripeCustomerId = req.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString(),
        },
      });
      stripeCustomerId = customer.id;

      // Save Stripe customer ID to user
      await User.findByIdAndUpdate(tenantId, { stripeCustomerId });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      off_session: false,
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      metadata: {
        propertyId: propertyId,
        tenantId: tenantId,
        type: "tenant_payment",
      },
    });

    // Create payment record
    const payment = new Payment({
      amount: amount,
      currency: currency.toLowerCase(),
      originalAmount: amount,
      payerEmail: req.user.email,
      payerName: req.user.name,
      landlord: property.landlord._id,
      tenant: tenantId,
      property: propertyId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId,
      status: paymentIntent.status === "succeeded" ? "completed" : "processing",
      paidAt: paymentIntent.status === "succeeded" ? new Date() : null,
      paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
      paymentMethodType: paymentIntent.payment_method_types?.[0] || "card",
    });

    await payment.save();

    // Update tenant's balance
    if (paymentIntent.status === "succeeded") {
      const tenant = await User.findById(tenantId);
      if (tenant) {
        tenant.balanceDue = Math.max(0, (tenant.balanceDue || 0) - amount);
        await tenant.save();
      }
      await sendReceipts(payment);
    }

    res.json({
      success: true,
      payment: payment,
      clientSecret:
        paymentIntent.status === "requires_action"
          ? paymentIntent.client_secret
          : null,
      requiresAction: paymentIntent.status === "requires_action",
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Tenant payment error:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return res.status(400).json({ error: "Card was declined" });
    }

    res.status(500).json({
      error: "Payment processing failed",
      details: error.message,
    });
  }
});

// Get payment history for user
router.get("/history", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let filter = {};

    // Different filters based on user role
    if (req.user.role === "tenant") {
      filter.tenant = req.user.id;
    } else if (req.user.role === "landlord") {
      filter.landlord = req.user.id;
    }
    // Admin can see all payments

    const payments = await Payment.find(filter)
      .populate("property", "title address")
      .populate("landlord", "name email")
      .populate("tenant", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Payment history error:", error);
    res.status(500).json({ error: "Failed to retrieve payment history" });
  }
});

// Get specific payment details
router.get("/:paymentId", auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("property", "title address")
      .populate("landlord", "name email phone")
      .populate("tenant", "name email phone");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Check if user has permission to view this payment
    if (
      req.user.role === "tenant" &&
      payment.tenant.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (
      req.user.role === "landlord" &&
      payment.landlord._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ error: "Failed to retrieve payment" });
  }
});

// Currency conversion endpoint
router.get("/convert-currency", async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.query;

    if (!amount || !fromCurrency || !toCurrency) {
      return res
        .status(400)
        .json({ error: "Amount, fromCurrency, and toCurrency are required" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const convertedAmount = convertCurrency(
      numericAmount,
      fromCurrency,
      toCurrency
    );
    const exchangeRate = getExchangeRate(fromCurrency, toCurrency);

    res.json({
      success: true,
      originalAmount: numericAmount,
      originalCurrency: fromCurrency,
      convertedAmount: convertedAmount,
      convertedCurrency: toCurrency,
      exchangeRate: exchangeRate,
      lastUpdated: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: "Currency conversion failed" });
  }
});

// Helper functions
function convertCurrency(amount, fromCurrency, toCurrency) {
  const rates = {
    usd_jmd: 155, // USD to JMD
    jmd_usd: 0.00645, // JMD to USD
  };

  const rateKey = `${fromCurrency.toLowerCase()}_${toCurrency.toLowerCase()}`;
  return parseFloat((amount * (rates[rateKey] || 1)).toFixed(2));
}

function getExchangeRate(fromCurrency, toCurrency) {
  const rates = {
    usd_jmd: 155,
    jmd_usd: 0.00645,
  };

  return (
    rates[`${fromCurrency.toLowerCase()}_${toCurrency.toLowerCase()}`] || 1
  );
}

async function sendReceipts(payment) {
  try {
    // Send receipt to payer
    await sendReceiptEmail({
      to: payment.payerEmail,
      subject: `Payment Receipt - ${payment._id}`,
      payment: payment,
      type: "payer",
    });

    // Send receipt to landlord
    const landlord = await User.findById(payment.landlord);
    if (landlord && landlord.email) {
      await sendReceiptEmail({
        to: landlord.email,
        subject: `Rent Payment Received - ${payment._id}`,
        payment: payment,
        type: "landlord",
      });
    }

    // Send receipt to tenant (if exists and not the payer)
    if (payment.tenant && payment.tenant.email !== payment.payerEmail) {
      const tenant = await User.findById(payment.tenant);
      if (tenant && tenant.email) {
        await sendReceiptEmail({
          to: tenant.email,
          subject: `Payment Received on Your Account - ${payment._id}`,
          payment: payment,
          type: "tenant",
        });
      }
    }

    // Update receipt sent status
    const updateData = {
      "receiptsSent.payer": true,
      "receiptsSent.landlord": true,
    };

    if (payment.tenant) {
      updateData["receiptsSent.tenant"] = true;
    }

    await Payment.findByIdAndUpdate(payment._id, updateData);

    console.log("Receipts sent successfully for payment:", payment._id);
  } catch (error) {
    console.error("Error sending receipts:", error);
    // Don't throw error here, as the payment is already successful
  }
}

module.exports = router;
