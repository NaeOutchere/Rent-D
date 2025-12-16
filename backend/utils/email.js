// /backend/utils/email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Check if email config exists - make it more strict
const hasEmailConfig =
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== "your-email@gmail.com" &&
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_PASSWORD !== "your-app-password";

let transporter;
if (hasEmailConfig) {
  console.log("Setting up real email transporter...");
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Email configuration error:", error.message);
      console.log("Falling back to mock email service.");
    } else {
      console.log("Email server is ready to send messages");
    }
  });
} else {
  console.log(
    "Email configuration not found or using placeholder values. Using mock email service."
  );
  transporter = {
    sendMail: async function (mailOptions) {
      console.log(`[MOCK EMAIL] Would send to: ${mailOptions.to}`);
      console.log(`[MOCK EMAIL] Subject: ${mailOptions.subject}`);
      console.log(
        `[MOCK EMAIL] Body preview: ${mailOptions.text?.substring(0, 100)}...`
      );
      return { messageId: "mock-id", accepted: [mailOptions.to] };
    },
  };
}

// Function to send receipt emails
async function sendReceiptEmail({ to, subject, payment, type = "payer" }) {
  try {
    // Format currency symbol
    const currencySymbol = payment.currency === "usd" ? "$" : "J$";
    const formattedAmount = `${currencySymbol}${payment.amount.toFixed(2)}`;

    let greeting = "";
    let body = "";
    let footer = "";

    switch (type) {
      case "payer":
        greeting = `Dear ${payment.payerName || "Valued Customer"},`;
        body = `
          <p>Thank you for your payment of <strong>${formattedAmount}</strong>.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Payment ID: ${payment._id}</li>
            <li>Amount: ${formattedAmount}</li>
            <li>Date: ${new Date(
              payment.paidAt || Date.now()
            ).toLocaleDateString()}</li>
            <li>Property: ${payment.property?.title || "N/A"}</li>
            <li>Tenant: ${payment.tenant?.name || "N/A"}</li>
          </ul>
        `;
        footer = `
          <p>This receipt serves as confirmation of your payment.</p>
          <p>If you have any questions, please contact our support team.</p>
        `;
        break;

      case "landlord":
        greeting = `Dear ${payment.landlord?.name || "Landlord"},`;
        body = `
          <p>A rent payment of <strong>${formattedAmount}</strong> has been received.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Payment ID: ${payment._id}</li>
            <li>Amount: ${formattedAmount}</li>
            <li>Date: ${new Date(
              payment.paidAt || Date.now()
            ).toLocaleDateString()}</li>
            <li>Property: ${payment.property?.title || "N/A"}</li>
            <li>Tenant: ${payment.tenant?.name || "Guest Payment"}</li>
            <li>Payer: ${payment.payerName || payment.payerEmail}</li>
          </ul>
        `;
        footer = `
          <p>This payment has been recorded in your account.</p>
        `;
        break;

      case "tenant":
        greeting = `Dear ${payment.tenant?.name || "Tenant"},`;
        body = `
          <p>A payment of <strong>${formattedAmount}</strong> has been made to your account.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Payment ID: ${payment._id}</li>
            <li>Amount: ${formattedAmount}</li>
            <li>Date: ${new Date(
              payment.paidAt || Date.now()
            ).toLocaleDateString()}</li>
            <li>Property: ${payment.property?.title || "N/A"}</li>
            <li>Payer: ${payment.payerName || payment.payerEmail}</li>
          </ul>
        `;
        footer = `
          <p>This payment has been applied to your balance.</p>
          <p>Thank you for using our service.</p>
        `;
        break;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background-color: white; padding: 30px; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
            .logo { color: #ff6b35; font-weight: bold; font-size: 24px; }
            .amount { font-size: 28px; color: #28a745; font-weight: bold; }
            .details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Rent'D</div>
              <h2>Payment Receipt</h2>
            </div>
            <div class="content">
              <p>${greeting}</p>
              ${body}
              <div class="footer">
                ${footer}
                <p>© ${new Date().getFullYear()} Rent'D. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Rent'D" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@rentd.com"
      }>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: `Payment Receipt - Amount: ${formattedAmount}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${to}`);

    return info;
  } catch (error) {
    console.error("Error sending receipt email:", error.message);
    return null;
  }
}

module.exports = {
  sendReceiptEmail,
  transporter,
};
