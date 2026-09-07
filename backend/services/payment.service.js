import crypto from "crypto";
import razorpay from "../configs/razorpay.js";

import Payment from "../models/Payment.model.js";
import Earnings from "../models/Earnings.model.js";
import Course from "../models/Course.model.js";
import MentorshipSession from "../models/MentorshipSession.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";
import User from "../models/User.model.js";

import { enrollInCourseService } from "./course.service.js";
import { requestSessionService } from "./mentorshipSession.service.js";
import { sendPaymentEmails } from "./email.service.js";

export const createPaymentOrderService = async ({
  learnerId,
  type,
  courseId,
  sessionId,
}) => {
  let amount;
  let recipient;
  let reason;
  let course = null;
  let session = null;

  if (type === "Course") {
    course = await Course.findById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    if (!course.price || course.price <= 0) {
      throw new Error("This course is free");
    }

    recipient = course.createdBy;

    if (!recipient) {
      throw new Error("Course creator not found");
    }

    amount = course.price;
    reason = "Course Enrollment";
  }

  if (type === "Session") {
    session = await MentorshipSession.findById(sessionId);

    if (!session) {
      throw new Error("Mentorship session not found");
    }

    if (!session.price || session.price <= 0) {
      throw new Error("This mentorship session is free");
    }

    const expertProfile = await ExpertProfile.findById(session.expert);

    if (!expertProfile) {
      throw new Error("Expert profile not found");
    }

    recipient = expertProfile.user;

    if (!recipient) {
      throw new Error("Expert user not found");
    }

    amount = session.price;
    reason = "Mentorship Session Booking";
  }

  const receipt = `${type.toLowerCase()}_${Date.now()}`;

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  });

  const payment = await Payment.create({
    learner: learnerId,
    course: course ? course._id : undefined,
    session: session ? session._id : undefined,
    recipient,
    amount,
    currency: "INR",
    type,
    reason,
    status: "Pending",
    razorpayOrderId: razorpayOrder.id,
  });

  return {
    paymentId: payment._id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  };
};

export const verifyPaymentService = async ({
  learnerId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (payment.learner.toString() !== learnerId.toString()) {
    throw new Error("You are not authorized to verify this payment");
  }

  // Idempotency check: If payment is already Paid, return without repeating operations
  if (payment.status === "Paid") {
    return payment;
  }

  // Signature verification
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    payment.status = "Failed";
    await payment.save();

    throw new Error("Invalid Razorpay payment signature");
  }

  // Mark Payment as Paid
  payment.status = "Paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.paidAt = new Date();

  await payment.save();

  // 1. Credit recipient earnings
  await Earnings.findOneAndUpdate(
    { user: payment.recipient },
    { $inc: { earnings: payment.amount } },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );

  // 2. Perform Course enrollment or Session booking
  let itemDoc = null;

  if (payment.type === "Course" && payment.course) {
    try {
      await enrollInCourseService(payment.course, payment.learner);
      itemDoc = await Course.findById(payment.course);
    } catch (enrollErr) {
      console.error("Course enrollment error post payment verification:", enrollErr.message);
    }
  } else if (payment.type === "Session" && payment.session) {
    try {
      await requestSessionService(payment.session, payment.learner);
      itemDoc = await MentorshipSession.findById(payment.session);
    } catch (sessionErr) {
      console.error("Session request error post payment verification:", sessionErr.message);
    }
  }

  // 3. Dispatch Email Notifications safely
  try {
    const learnerUser = await User.findById(payment.learner);
    const recipientUser = await User.findById(payment.recipient);
    await sendPaymentEmails(payment, learnerUser, recipientUser, itemDoc);
  } catch (emailErr) {
    console.error("Email notification error post payment verification:", emailErr.message);
  }

  return payment;
};

export default {
  createPaymentOrderService,
  verifyPaymentService,
};