import React from "react";
import SessionStatusBadge from "./SessionStatusBadge";
import { Check, X, Calendar } from "lucide-react";

const LearnerRequestCard = ({
  learnerEntry,
  onAccept,
  onReject,
  loadingLearnerId,
  isSessionActive = true,
}) => {
  if (!learnerEntry) return null;

  const user = learnerEntry.user || {};
  const name = user.name || "Learner";
  const email = user.email;
  const picture = user.profilePicture;
  const status = learnerEntry.status || "pending";
  const requestedAt = learnerEntry.requestedAt;

  const isPending = status === "pending";
  const isProcessing = loadingLearnerId === user._id;

  return (
    <div className="p-3.5 bg-bg-darker/60 border border-glass-border/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-accent p-[1px] shrink-0">
          {picture ? (
            <img src={picture} alt={name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-accent-blue to-accent-indigo flex items-center justify-center font-extrabold text-white text-xs uppercase">
              {name[0]}
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <div className="text-xs font-bold text-text-title">{name}</div>
          {email && <div className="text-[10px] text-text-muted">{email}</div>}
          {requestedAt && (
            <div className="text-[9px] text-text-muted flex items-center gap-1">
              <Calendar size={10} /> Requested {new Date(requestedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end">
        <SessionStatusBadge status={status} type="learner" />

        {isPending && isSessionActive && (
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => onAccept(user._id)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-[10px] font-extrabold uppercase transition cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Check size={12} /> {isProcessing ? "Accepting..." : "Accept"}
            </button>
            <button
              onClick={() => onReject(user._id)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-[10px] font-extrabold uppercase transition cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <X size={12} /> {isProcessing ? "Rejecting..." : "Reject"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerRequestCard;
