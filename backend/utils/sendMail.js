import "dotenv/config";
import { Resend } from "resend";

export const sendMail = async (to, subject, html) => {
  const formattedTo = Array.isArray(to)
    ? to.filter(Boolean).join(", ")
    : to;

  if (!formattedTo) {
    throw new Error("No recipient email provided");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const emailFrom = process.env.EMAIL_FROM?.trim();

  if (!emailFrom) {
    throw new Error("EMAIL_FROM is not configured");
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: formattedTo,
      subject,
      html,
    });

    if (error) {
      console.error("Resend sendMail error:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Resend sendMail error:", err);
    throw new Error(err.message || "Failed to send email via Resend");
  }
};