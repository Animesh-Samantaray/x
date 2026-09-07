import React from "react";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import { CheckCircle, XCircle, Loader2, PlayCircle, Video, CreditCard, ShieldAlert } from "lucide-react";

const PaymentStatusModal = ({ isOpen, onClose, state, paymentData, item, type, errorMessage }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isCourse = type === "Course";
  const title = item?.title || paymentData?.course?.title || paymentData?.session?.title || "Transaction";
  const amount = paymentData?.amount || item?.price || 0;

  const handleStartLearning = () => {
    onClose();
    if (item?._id || paymentData?.course?._id || paymentData?.course) {
      const cId = item?._id || paymentData?.course?._id || paymentData?.course;
      navigate(`/courses/${cId}/learn`);
    } else {
      navigate("/my-courses");
    }
  };

  const handleViewSessions = () => {
    onClose();
    navigate("/sessions");
  };

  const handleViewPayments = () => {
    onClose();
    navigate("/my-payments");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <SpotlightCard
        className="w-full max-w-md bg-bg-panel border border-glass-border/90 p-7 rounded-3xl text-center shadow-2xl space-y-6 relative overflow-hidden"
        glowColor={state === "success" ? "rgba(52, 211, 153, 0.15)" : state === "failed" ? "rgba(244, 63, 94, 0.15)" : "rgba(168, 85, 247, 0.15)"}
      >
        {/* PROCESSING STATE */}
        {state === "processing" && (
          <div className="py-6 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple animate-pulse">
                <Loader2 size={40} className="animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-text-title">Payment Processing</h3>
              <p className="text-xs text-text-muted max-w-xs mx-auto">
                Please wait while we verify your Razorpay payment and activate your order...
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 font-semibold max-w-xs mx-auto">
              ⚠️ Please do not close or refresh this page.
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {state === "success" && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle size={44} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ✓ Payment Verified & Confirmed
              </span>
              <h3 className="text-xl font-extrabold text-text-title mt-2">Payment Successful</h3>
              <p className="text-xs text-text-muted">{title}</p>
            </div>

            {/* Amount Receipt Box */}
            <div className="p-4 bg-bg-darker border border-glass-border rounded-2xl space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Paid Amount</span>
              <div className="text-2xl font-extrabold text-accent-emerald">
                ₹{amount.toLocaleString("en-IN")} INR
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                {isCourse
                  ? "You are now fully enrolled in this course."
                  : "Your request has been sent to the expert. Status: Pending Expert Approval."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              {isCourse ? (
                <Button
                  onClick={handleStartLearning}
                  className="w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo cursor-pointer"
                >
                  <PlayCircle size={15} /> Start Learning
                </Button>
              ) : (
                <Button
                  onClick={handleViewSessions}
                  className="w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo cursor-pointer"
                >
                  <Video size={15} /> View Sessions
                </Button>
              )}

              <Button
                onClick={handleViewPayments}
                variant="secondary"
                className="w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-glass-border hover:bg-glass-border cursor-pointer"
              >
                <CreditCard size={15} /> View Payment
              </Button>
            </div>
          </div>
        )}

        {/* FAILED / CANCELLED STATE */}
        {state === "failed" && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <XCircle size={44} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                Payment Failed / Cancelled
              </span>
              <h3 className="text-xl font-extrabold text-text-title mt-2">Transaction Could Not Complete</h3>
            </div>

            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-xs text-rose-300 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-bold">
                <ShieldAlert size={14} />
                <span>{errorMessage || "Payment signature verification failed or was cancelled."}</span>
              </div>
              <p className="text-[10px] text-text-muted pt-1">No money was deducted or enrollment updated for this transaction.</p>
            </div>

            <div className="pt-2">
              <Button onClick={onClose} variant="secondary" className="w-full py-2.5 px-4 text-xs font-bold cursor-pointer">
                Close & Retry
              </Button>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};

export default PaymentStatusModal;
