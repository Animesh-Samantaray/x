import React from "react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import Sticker from "../ui/Sticker";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Video,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from "lucide-react";

const PaymentCheckoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  type,
  loading,
  paymentStatus = "idle", // 'idle' | 'processing' | 'success' | 'failed'
  errorMessage = null,
}) => {
  if (!isOpen || !item) return null;

  const isCourse = type === "Course";
  const title = item.title || "Untitled";
  const price = item.price || 0;

  let recipientName = "Instructor / Expert";
  if (isCourse) {
    recipientName = item.createdBy?.name || item.createdBy || "Course Creator";
  } else {
    recipientName = item.expert?.user?.name || item.expertName || "Expert Mentor";
  }

  const scheduledDate = item.scheduledAt
    ? new Date(item.scheduledAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  const duration = item.durationMinutes ? `${item.durationMinutes} minutes` : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* PAYMENT SUCCESS STATE */}
        {paymentStatus === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <SpotlightCard
              className="w-full bg-[#181824] border border-emerald-500/30 p-8 rounded-3xl text-center shadow-2xl space-y-6 relative overflow-hidden"
              glowColor="rgba(16, 185, 129, 0.2)"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <Sticker type="verified" text="Payment Verified" className="mx-auto" />
                <h2 className="text-xl font-extrabold text-white">Payment Successful!</h2>
                <p className="text-xs text-text-muted">
                  You are now enrolled in <strong className="text-white">{title}</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#0F0F17] border border-white/10 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-text-muted font-semibold">Amount Paid</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{price.toLocaleString("en-IN")}</span>
              </div>

              <Button
                onClick={onClose}
                className="w-full py-3 px-6 text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                Start Learning Now &rarr;
              </Button>
            </SpotlightCard>
          </motion.div>
        ) : paymentStatus === "processing" ? (
          /* PAYMENT PROCESSING STATE */
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <SpotlightCard
              className="w-full bg-[#181824] border border-accent-purple/30 p-8 rounded-3xl text-center shadow-2xl space-y-6"
              glowColor="rgba(119, 87, 245, 0.2)"
            >
              <div className="w-16 h-16 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(119,87,245,0.3)]">
                <RotateCw size={32} className="animate-spin text-cyan-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-white">Confirming Payment...</h2>
                <p className="text-xs text-text-muted leading-relaxed">
                  Please wait while our backend verifies your Razorpay transaction and initializes your enrollment.
                </p>
              </div>

              <div className="h-1.5 w-full bg-bg-dark rounded-full overflow-hidden border border-glass-border">
                <div className="h-full bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-emerald rounded-full animate-shimmer" />
              </div>
            </SpotlightCard>
          </motion.div>
        ) : (
          /* REGULAR CONFIRMATION MODAL */
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <SpotlightCard
              className="w-full bg-[#181824] border border-white/10 p-6 sm:p-7 rounded-3xl text-left shadow-2xl space-y-6 relative overflow-hidden"
              glowColor="rgba(119, 87, 245, 0.15)"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isCourse
                        ? "bg-[#7757F5]/15 text-[#00F2FF] border-[#7757F5]/30"
                        : "bg-[#00F2FF]/15 text-[#00F2FF] border-[#00F2FF]/30"
                    }`}
                  >
                    {isCourse ? <BookOpen size={20} /> : <Video size={20} />}
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white tracking-tight">
                      {isCourse ? "Confirm Enrollment" : "Confirm Mentorship Booking"}
                    </h2>
                    <span className="text-[10px] text-[#9696A8] font-semibold">
                      Review payment breakdown
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  disabled={loading}
                  className="text-[#9696A8] hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Item Card Details */}
              <div className="p-4 bg-[#0F0F17] border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                      isCourse
                        ? "bg-[#7757F5]/15 text-[#00F2FF] border-[#7757F5]/30"
                        : "bg-[#00F2FF]/15 text-[#00F2FF] border-[#00F2FF]/30"
                    }`}
                  >
                    {isCourse ? "Course Masterclass" : "Mentorship Call"}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {title}
                </h3>

                <div className="space-y-1.5 text-xs text-[#9696A8] pt-1">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-[#7757F5] shrink-0" />
                    <span>
                      {isCourse ? "Creator" : "Expert"}:{" "}
                      <strong className="text-white font-bold">{recipientName}</strong>
                    </span>
                  </div>

                  {scheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#00F2FF] shrink-0" />
                      <span>
                        Scheduled: <strong className="text-white font-bold">{scheduledDate}</strong>
                      </span>
                    </div>
                  )}

                  {duration && (
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-emerald-400 shrink-0" />
                      <span>
                        Duration: <strong className="text-white font-bold">{duration}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Large Fintech Readable Amount Card */}
              <div className="p-4.5 bg-gradient-to-r from-[#7757F5]/15 via-[#0F0F17] to-[#00F2FF]/15 border border-[#7757F5]/30 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-extrabold text-[#9696A8] uppercase tracking-wider block">
                    Total Amount Payable
                  </span>
                  <span className="text-[11px] text-[#9696A8]">Includes platform fee & tax</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400 tracking-tight">
                    ₹{price.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[9px] text-[#9696A8] font-bold uppercase">INR</span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={onConfirm}
                  loading={loading}
                  disabled={loading}
                  className="w-full py-3.5 px-6 text-xs font-extrabold shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#7757F5] to-[#5C36F5] hover:from-[#8868F7] hover:to-[#6C48F7] text-white cursor-pointer"
                >
                  <span>{loading ? "Initializing..." : "Continue to Payment"}</span>
                  {!loading && <ArrowRight size={16} />}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9696A8]">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Secure 256-bit encrypted payment via Razorpay</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentCheckoutModal;
