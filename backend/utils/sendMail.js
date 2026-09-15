import "dotenv/config";
import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  const formattedTo = Array.isArray(to)
    ? to.filter(Boolean).join(", ")
    : to?.trim();

  if (!formattedTo) {
    throw new Error("No recipient email provided");
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const emailFrom = process.env.EMAIL_FROM?.trim();

  if (!smtpUser) {
    throw new Error("SMTP_USER is not configured");
  }

  if (!smtpPass) {
    throw new Error("SMTP_PASS is not configured");
  }

  if (!emailFrom) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    return await transporter.sendMail({
      from: emailFrom,
      to: formattedTo,
      subject,
      html,
    });
  } catch (error) {
    console.error("Gmail SMTP sendMail error:", error.message);
    throw new Error("Failed to send email via Gmail SMTP");
  }
};