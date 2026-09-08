import React, { useState, useEffect } from "react";
import { Flag, X, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import { createReport } from "../../services/reportApi";
import toast from "react-hot-toast";

const REASON_OPTIONS = [
  { value: "spam", label: "Spam or unsolicited promotion" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate_content", label: "Inappropriate or explicit content" },
  { value: "copyright", label: "Copyright or intellectual property violation" },
  { value: "misinformation", label: "Misinformation or deceptive content" },
  { value: "fraud", label: "Scam or fraudulent activity" },
  { value: "abuse", label: "System or platform abuse" },
  { value: "other", label: "Other issue" },
];

const ReportDialog = ({ isOpen, onClose, targetType, targetId, targetTitle }) => {
  const [reason, setReason] = useState("inappropriate_content");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("inappropriate_content");
      setDescription("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason for reporting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createReport({
        targetType,
        targetId,
        reason,
        description: description.trim(),
      });

      toast.success("Thank you. Your report has been submitted for admin review.");
      onClose();
    } catch (err) {
      console.error("Report Submission Error:", err);
      const msg = err.response?.data?.message || "Failed to submit report. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getTargetTypeLabel = (type) => {
    switch (type) {
      case "course": return "Course";
      case "resource": return "Technical Resource";
      case "user": return "User Profile";
      case "unit": return "Course Unit";
      case "review": return "Review";
      case "comment": return "Comment";
      default: return "Content";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg relative z-10 text-left">
        <SpotlightCard
          className="p-6 sm:p-7 bg-bg-dark border border-glass-border rounded-2xl shadow-2xl relative"
          glowColor="rgba(244, 63, 94, 0.12)"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border/40 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Flag size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-text-title">
                  Report {getTargetTypeLabel(targetType)}
                </h3>
                <p className="text-xs text-text-muted truncate max-w-xs font-medium mt-0.5">
                  {targetTitle ? `"${targetTitle}"` : "Flag this content for moderation"}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="text-text-muted hover:text-text-title p-1.5 rounded-lg hover:bg-glass-border/40 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl">
              <AlertCircle size={14} className="shrink-0 text-rose-400" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Report Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Reason Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Reason for Reporting <span className="text-rose-400">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
                className="w-full form-input text-xs rounded-xl p-3 bg-bg-darker border-glass-border text-text-title cursor-pointer"
              >
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Additional Details (Optional)
                </label>
                <span className="text-[10px] text-text-muted font-mono">
                  {description.length}/1000
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                disabled={loading}
                placeholder="Provide specific details or timestamps to help moderators evaluate this report..."
                rows={4}
                className="w-full form-input text-xs rounded-xl p-3 bg-bg-darker border-glass-border resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-glass-border/40">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="text-xs py-2.5 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="text-xs py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <ShieldAlert size={14} />
                Submit Report
              </Button>
            </div>

          </form>

        </SpotlightCard>
      </div>
    </div>
  );
};

export default ReportDialog;
