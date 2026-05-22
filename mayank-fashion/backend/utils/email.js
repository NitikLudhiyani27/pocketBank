const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log('[Email skipped — SMTP not configured]', { to, subject });
    return { skipped: true };
  }
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'Mayank Fashion <noreply@mayankfashion.com>',
    to, subject, html, text,
  });
}

const orderConfirmationTemplate = (order) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2 style="color:#db2777">Thank you for your order!</h2>
    <p>Hi ${order.address?.fullName || 'Customer'}, your order <b>#${order._id}</b> has been placed.</p>
    <p>Total: <b>₹${order.total}</b></p>
    <p>We'll notify you when it ships. — Mayank Fashion</p>
  </div>`;

module.exports = { sendMail, orderConfirmationTemplate };
