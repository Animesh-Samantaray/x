import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const formattedTo = Array.isArray(to)
    ? to.filter(Boolean).join(", ")
    : to;

  if (!formattedTo) {
    throw new Error("No recipient email provided");
  }

  if (!user || !pass) {
    console.warn("Nodemailer warning: EMAIL_USER / EMAIL_PASS or SMTP credentials not set. Mail logged to console.");
    console.log(`[Mock Mail Send] To: ${formattedTo} | Subject: ${subject}`);
    return { messageId: "mock-id-no-credentials" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const from = process.env.EMAIL_FROM || `"Collaborative Knowledge Marketplace" <${user}>`;

  try {

    const info = await transporter.sendMail({
      from,
      to: formattedTo,
      subject,
      html,
    });
    return info;
  } catch (err) {
    console.error("Nodemailer sendMail error:", err);
    throw new Error(err.message || "Failed to send email via Nodemailer");
  }
};