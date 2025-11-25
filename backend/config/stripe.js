const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripeConfig = {
  currencies: ["usd", "jmd"],
  defaultCurrency: "jmd",
  exchangeRates: {
    // You can update this dynamically from an API
    USD_TO_JMD: 155, // Example rate
    JMD_TO_USD: 0.00645
  },
  supportedPaymentMethods: ["card", "us_bank_account"], // Add more as needed
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// Webhook handler for Stripe events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeConfig.webhookSecret
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

async function handleSuccessfulPayment(paymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment && payment.status !== "completed") {
      payment.status = "completed";
      payment.paidAt = new Date();
      payment.stripeChargeId = paymentIntent.latest_charge;
      await payment.save();

      await sendReceipts(payment);
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: "failed" }
    );
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

module.exports = {
  stripe,
  stripeConfig,
  handleStripeWebhook,
};
