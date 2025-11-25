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
        },
        { new: true }
      ).populate("landlord property");

      if (!payment) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      // Send receipts
      await sendReceipts(payment);

      res.json({
        success: true,
        payment: payment,
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
    });

    await payment.save();

    if (paymentIntent.status === "succeeded") {
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

    // Update receipt sent status
    await Payment.findByIdAndUpdate(payment._id, {
      "receiptsSent.payer": true,
      "receiptsSent.landlord": true,
    });

    console.log("Receipts sent successfully for payment:", payment._id);
  } catch (error) {
    console.error("Error sending receipts:", error);
  }
}

module.exports = router;
