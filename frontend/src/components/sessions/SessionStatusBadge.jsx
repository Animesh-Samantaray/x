import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, PlayCircle } from "lucide-react";

const SessionStatusBadge = ({ status, type = "session", className = "" }) => {
  if (!status) return null;

  const normalizedStatus = String(status).toLowerCase();

  if (type === "learner") {
    switch (normalizedStatus) {
      case "accepted":
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md ${className}`}
          >
            <CheckCircle2 size={11} /> Confirmed
          </span>
        );
      case "rejected":
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-md ${className}`}
          >
            <XCircle size={11} /> Request Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md ${className}`}
          >
            <Clock size={11} /> Pending Approval
          </span>
        );
    }
  }

  switch (normalizedStatus) {
    case "accepted":
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md ${className}`}
        >
          <CheckCircle2 size={11} /> Accepted
        </span>
      );
    case "completed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2.5 py-0.5 rounded-md ${className}`}
        >
          <CheckCircle2 size={11} /> Completed
        </span>
      );
    case "cancelled":
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-md ${className}`}
        >
          <AlertCircle size={11} /> Cancelled
        </span>
      );
    case "open":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2.5 py-0.5 rounded-md ${className}`}
        >
          <PlayCircle size={11} /> Open
        </span>
      );
  }
};

export default SessionStatusBadge;
