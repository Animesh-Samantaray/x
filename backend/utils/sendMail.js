import { Resend } from "resend";

export const sendMail = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Resend email error: RESEND_API_KEY is not defined in environment variables");
    throw new Error("Email service is not properly configured");
  }

  const resend = new Resend(apiKey);

  const formattedTo = Array.isArray(to)
    ? to.filter(Boolean)
    : [to].filter(Boolean);

  if (!formattedTo.length) {
    throw new Error("No recipient email provided");
  }

  const from = process.env.EMAIL_FROM || "Collaborative Knowledge Marketplace <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: formattedTo,
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message || "Failed to send email");
  }

  return data;
};