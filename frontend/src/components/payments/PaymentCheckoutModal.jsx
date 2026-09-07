import React from "react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import { BookOpen, Video, ShieldCheck, User, Calendar, Clock, X, ArrowRight } from "lucide-react";

const PaymentCheckoutModal = ({ isOpen, onClose, onConfirm, item, type, loading }) => {
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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <SpotlightCard
        className="w-full max-w-md bg-bg-panel border border-glass-border/90 p-6 sm:p-7 rounded-3xl text-left shadow-2xl space-y-6 relative overflow-hidden"
        glowColor="rgba(168, 85, 247, 0.15)"
      >
        <div className="flex items-center justify-between border-b border-glass-border/40 pb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${
              isCourse ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20" : "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
            }`}>
              {isCourse ? <BookOpen size={18} /> : <Video size={18} />}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text-title tracking-tight">
                {isCourse ? "Confirm Enrollment" : "Confirm Mentorship Booking"}
              </h2>
              <span className="text-[10px] text-text-muted font-semibold">Review your payment details</span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-text-muted hover:text-text-title p-1.5 rounded-xl hover:bg-glass-border transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

     
        <div className="p-4 bg-bg-darker/80 border border-glass-border/60 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
              isCourse ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20" : "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
            }`}>
              {isCourse ? "Course Enrollment" : "Mentorship Session Booking"}
            </span>
          </div>

          <h3 className="text-base font-bold text-text-title leading-snug">{title}</h3>

          <div className="space-y-1.5 text-xs text-text-muted pt-1">
            <div className="flex items-center gap-2">
              <User size={13} className="text-accent-purple shrink-0" />
              <span>{isCourse ? "Creator" : "Expert"}: <strong className="text-text-title">{recipientName}</strong></span>
            </div>

            {scheduledDate && (
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-accent-cyan shrink-0" />
                <span>Scheduled: <strong className="text-text-title">{scheduledDate}</strong></span>
              </div>
            )}

            {duration && (
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-accent-emerald shrink-0" />
                <span>Duration: <strong className="text-text-title">{duration}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Large Readable Amount (PhonePe-inspired fintech style) */}
        <div className="p-4 bg-gradient-to-r from-accent-purple/10 via-bg-darker to-accent-indigo/10 border border-accent-purple/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Amount Payable</span>
            <span className="text-xs text-text-muted">Includes all applicable platform fees</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-accent-emerald tracking-tight">
              ₹{price.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-text-muted font-bold">INR</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="w-full py-3 px-6 text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo hover:from-purple-600 hover:to-indigo-600 cursor-pointer"
          >
            <span>{loading ? "Initializing..." : "Continue to Payment"}</span>
            {!loading && <ArrowRight size={16} />}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default PaymentCheckoutModal;
