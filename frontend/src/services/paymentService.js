import api from "./api";
import { loadRazorpayScript } from "../utils/razorpay";
import toast from "react-hot-toast";

export const createPaymentOrder = async (data) => {
  const response = await api.post("/payments/create-order", data);
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post("/payments/verify", data);
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get("/payments/my-payments");
  return response.data;
};

export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const getMyEarnings = async () => {
  const response = await api.get("/earnings/my-earnings");
  return response.data;
};

export const startPayment = async ({
  type,
  courseId,
  sessionId,
  user,
  onStateChange,
  onSuccess,
  onError,
  onCancel,
}) => {
  try {
    if (onStateChange) onStateChange("Processing...");

    
    const payload = { type };
    if (type === "Course") payload.courseId = courseId;
    if (type === "Session") payload.sessionId = sessionId;

    const orderRes = await createPaymentOrder(payload);

    if (!orderRes || !orderRes.success || !orderRes.data) {
      throw new Error(orderRes?.message || "Failed to create payment order");
    }

    const { orderId, amount, currency, key } = orderRes.data;

    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      const scriptError = new Error("Failed to load Razorpay SDK. Please check your internet connection.");
      toast.error(scriptError.message);
      if (onError) onError(scriptError);
      return;
    }

    if (onStateChange) onStateChange("Processing Payment...");

    const razorpayKey = key || import.meta.env.VITE_RAZORPAY_KEY_ID;

   
    const options = {
      key: razorpayKey,
      amount,
      currency: currency || "INR",
      name: "Collaborative Knowledge Marketplace",
      description: type === "Course" ? "Course Enrollment Payment" : "Mentorship Session Booking",
      order_id: orderId,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#9333ea",
      },
      handler: async function (response) {
        try {
          if (onStateChange) onStateChange("Verifying Payment...");

          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes && verifyRes.success) {
            const successMsg =
              type === "Course"
                ? "Payment successful. You are now enrolled in this course."
                : "Payment successful. Your request has been sent to the expert.";
            toast.success(successMsg);
            if (onSuccess) onSuccess(verifyRes.data);
          } else {
            const failMsg = "Payment verification failed. Please try again.";
            toast.error(failMsg);
            if (onError) onError(new Error(failMsg));
          }
        } catch (vErr) {
          console.error("Payment verification error:", vErr);
          const failMsg = vErr.response?.data?.message || "Payment verification failed. Please try again.";
          toast.error(failMsg);
          if (onError) onError(vErr);
        }
      },
      modal: {
        ondismiss: function () {
          toast("Payment cancelled.", { icon: "ℹ️" });
          if (onCancel) onCancel();
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", function (response) {
      console.error("Razorpay Payment Failed:", response.error);
      const errorMsg = response.error?.description || "Payment failed. Please try again.";
      toast.error(errorMsg);
      if (onError) onError(new Error(errorMsg));
    });

    razorpayInstance.open();
  } catch (err) {
    console.error("Payment initiation error:", err);
    const errorMsg = err.response?.data?.message || err.message || "Failed to start payment order.";
    toast.error(errorMsg);
    if (onError) onError(err);
  }
};

export default {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentById,
  getMyEarnings,
  startPayment,
};
