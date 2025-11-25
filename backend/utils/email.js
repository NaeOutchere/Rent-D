const nodemailer = require("nodemailer");

// Create transporter (using Gmail for development)
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send receipt email
const sendReceiptEmail = async ({ to, subject, payment, type }) => {
  try {
    let html = "";

    if (type === "payer") {
      html = `
        <h2>Payment Receipt</h2>
        <p>Thank you for your payment!</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Payment ID:</strong> ${payment._id}</p>
          <p><strong>Amount:</strong> ${payment.currency.toUpperCase()} ${
        payment.amount
      }</p>
          <p><strong>Date:</strong> ${payment.paidAt.toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${payment.status}</p>
        </div>
        <p>If you have any questions, please contact our support team.</p>
      `;
    } else if (type === "landlord") {
      html = `
        <h2>Rent Payment Received</h2>
        <p>You have received a rent payment!</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Payment ID:</strong> ${payment._id}</p>
          <p><strong>Amount:</strong> ${payment.currency.toUpperCase()} ${
        payment.amount
      }</p>
          <p><strong>From:</strong> ${
            payment.payerName || payment.payerEmail
          }</p>
          <p><strong>Date:</strong> ${payment.paidAt.toLocaleDateString()}</p>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"Rent-D" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = { sendReceiptEmail };
