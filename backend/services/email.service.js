import { sendMail } from "../utils/sendMail.js";
import Payment from "../models/Payment.model.js";

const getEmailTemplate = ({ title, fromText, toText, amount, reason, itemLabel, itemTitle, paymentId, razorpayPaymentId, paidAt, message }) => {
  const formattedDate = paidAt ? new Date(paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : new Date().toLocaleString("en-IN");
  
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
        <h1 style="color: #a855f7; margin: 0; font-size: 24px;">Collaborative Knowledge Marketplace</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Payment Notification</p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="color: #38bdf8; font-size: 20px; margin-top: 0;">${title}</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">${message}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">From</td>
            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">${fromText}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">To</td>
            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">${toText}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">Amount</td>
            <td style="padding: 12px 16px; color: #34d399; font-size: 16px; font-weight: 700; border-bottom: 1px solid #334155;">₹${amount} INR</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">Reason</td>
            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; border-bottom: 1px solid #334155;">${reason}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">${itemLabel}</td>
            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">${itemTitle}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">Payment ID</td>
            <td style="padding: 12px 16px; color: #cbd5e1; font-size: 12px; font-family: monospace; border-bottom: 1px solid #334155;">${paymentId}</td>
          </tr>
          ${
            razorpayPaymentId
              ? `<tr>
                  <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;">Razorpay Payment ID</td>
                  <td style="padding: 12px 16px; color: #38bdf8; font-size: 12px; font-family: monospace; border-bottom: 1px solid #334155;">${razorpayPaymentId}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Date</td>
            <td style="padding: 12px 16px; color: #cbd5e1; font-size: 13px;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #334155; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">This is an automated notification from Collaborative Knowledge Marketplace.</p>
      </div>
    </div>
  `;
};

export const sendPaymentEmails = async (payment, learnerUser, recipientUser, itemDoc) => {
  if (!payment) return;

  const learnerName = learnerUser?.name || "Learner";
  const learnerEmail = learnerUser?.email || "";
  const recipientName = recipientUser?.name || "Creator/Expert";
  const recipientEmail = recipientUser?.email || "";

  const isCourse = payment.type === "Course";
  const itemTitle = itemDoc?.title || (isCourse ? "Course Enrollment" : "Mentorship Session");

  // Send Learner Email
  if (!payment.learnerEmailSent && learnerEmail) {
    try {
      const html = getEmailTemplate({
        title: "Payment Successful",
        fromText: learnerName,
        toText: recipientName,
        amount: payment.amount,
        reason: payment.reason || (isCourse ? "Course Enrollment" : "Mentorship Session Booking"),
        itemLabel: isCourse ? "Course" : "Session",
        itemTitle,
        paymentId: payment._id.toString(),
        razorpayPaymentId: payment.razorpayPaymentId,
        paidAt: payment.paidAt,
        message: isCourse
          ? "Your payment was successfully completed and you are now enrolled in this course."
          : "Your payment was successfully completed and your mentorship session request has been sent to the expert.",
      });

      await sendMail(learnerEmail, "Payment Successful", html);
      payment.learnerEmailSent = true;
    } catch (err) {
      console.error("Failed to send payment email to learner:", err.message);
    }
  }

  // Send Recipient (Creator/Expert) Email
  if (!payment.recipientEmailSent && recipientEmail) {
    try {
      const html = getEmailTemplate({
        title: "Payment Received",
        fromText: `${learnerName} (${learnerEmail})`,
        toText: `${recipientName} (${recipientEmail})`,
        amount: payment.amount,
        reason: payment.reason || (isCourse ? "Course Enrollment" : "Mentorship Session Booking"),
        itemLabel: isCourse ? "Course" : "Session",
        itemTitle,
        paymentId: payment._id.toString(),
        razorpayPaymentId: payment.razorpayPaymentId,
        paidAt: payment.paidAt,
        message: isCourse
          ? "A learner has successfully paid for your course."
          : "A learner has successfully paid for your mentorship session and the request is now pending your approval.",
      });

      await sendMail(recipientEmail, "Payment Received", html);
      payment.recipientEmailSent = true;
    } catch (err) {
      console.error("Failed to send payment email to recipient:", err.message);
    }
  }

  try {
    await payment.save();
  } catch (saveErr) {
    console.error("Failed to save email status on payment:", saveErr.message);
  }
};

export default {
  sendPaymentEmails,
};
