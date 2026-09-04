import Payment from "../models/Payment.model.js";

import {
  createPaymentOrderService,
  verifyPaymentService,
} from "../services/payment.service.js";


export const createPaymentOrder = async (req, res) => {
  try {
    const { type, courseId, sessionId } = req.body;
    const learnerId = req.user._id;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Payment type is required",
      });
    }

    if (!["Course", "Session"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    if (type === "Course" && !courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    if (type === "Session" && !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const result = await createPaymentOrderService({
      learnerId,
      type,
      courseId,
      sessionId,
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const learnerId = req.user._id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details are required",
      });
    }

    const payment = await verifyPaymentService({
      learnerId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;
    const role = req.user.role;

    const payment = await Payment.findById(paymentId)
      .populate("learner", "name email profilePicture")
      .populate("recipient", "name email profilePicture")
      .populate("course", "title thumbnail price")
      .populate("session", "title topic scheduledAt price");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Admin can access any payment
    if (role !== "admin") {
      const isLearner =
        payment.learner._id.toString() === userId.toString();

      const isRecipient =
        payment.recipient._id.toString() === userId.toString();

      if (!isLearner && !isRecipient) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this payment",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Get Payment By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get payment",
    });
  }
};

// Get logged-in user's payments
export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};

    if (role === "learner") {
      query.learner = userId;
    } else if (role === "creator" || role === "expert") {
      query.recipient = userId;
    }

    const payments = await Payment.find(query)
      .populate("learner", "name email profilePicture")
      .populate("recipient", "name email profilePicture")
      .populate("course", "title thumbnail price")
      .populate("session", "title topic scheduledAt price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get My Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get payments",
    });
  }
};