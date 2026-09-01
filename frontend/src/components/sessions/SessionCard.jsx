import React from "react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import SessionStatusBadge from "./SessionStatusBadge";
import LearnerRequestCard from "./LearnerRequestCard";
import { Calendar, Clock, DollarSign, User, ExternalLink, Users, PlayCircle, Edit3 } from "lucide-react";

const formatLocalDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    const dateFormatted = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateFormatted} at ${timeFormatted}`;
  } catch (e) {
    return isoString;
  }
};

const SessionCard = ({
  session,
  currentUser,
  onBook,
  onViewDetails,
  onEditSession,
  onCancel,
  onComplete,
  onAcceptLearner,
  onRejectLearner,
  loadingLearnerId,
  bookingLoadingId,
  actionLoadingId,
}) => {
  if (!session) return null;

  const isExpert = currentUser?.role === "expert";


  const expertUserId = session.expert?.user?._id || session.expert?.user || session.expert;
  const isOwnerExpert = isExpert && (
    !session.expert?.user ||
    String(expertUserId) === String(currentUser?._id) ||
    String(session.expert?._id) === String(currentUser?._id)
  );

  const currentUserIdStr = currentUser?._id || currentUser?.id || "";

  const myLearnerEntry = (session.learners || []).find((l) => {
    if (!l || !l.user) return false;
    const learnerId = typeof l.user === "object" ? l.user._id || l.user.id : l.user;
    return (
      learnerId &&
      currentUserIdStr &&
      String(learnerId).trim() === String(currentUserIdStr).trim()
    );
  });

  const isLearner =
    currentUser?.role === "learner" ||
    (!isOwnerExpert && Boolean(myLearnerEntry));

  const learnerStatus = myLearnerEntry?.status;
  const isAcceptedLearner = learnerStatus === "accepted";
  const isPendingLearner = learnerStatus === "pending";
  const isRejectedLearner = learnerStatus === "rejected";


  const canJoin =
    (isOwnerExpert || isAcceptedLearner) &&
    session.meetingUrl &&
    session.status !== "completed" &&
    session.status !== "cancelled";


  const formattedPrice = session.price > 0 ? `₹${session.price.toLocaleString("en-IN")}` : "Free";
  const expertName = session.expert?.user?.name || "Expert Mentor";
  const expertPicture = session.expert?.user?.profilePicture;

  const learnersCount = session.learners?.length || 0;
  const maxCapacity = session.maxParticipants || 100;
  const isFull = learnersCount >= maxCapacity;

  const pendingRequests = (session.learners || []).filter((l) => l.status === "pending");

  return (
    <SpotlightCard
      className="h-full flex flex-col justify-between p-5 text-left border border-glass-border/70 rounded-2xl"
      glowColor={isAcceptedLearner ? "rgba(16, 185, 129, 0.12)" : "rgba(168, 85, 247, 0.12)"}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2 border-b border-glass-border/30 pb-3">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2.5 py-0.5 rounded">
              {session.topic}
            </span>
            <h3 className="text-sm font-bold text-text-title leading-snug line-clamp-1">
              {session.title}
            </h3>
          </div>
          <SessionStatusBadge status={session.status} type="session" />
        </div>

        <div className="flex items-center gap-3 p-2.5 bg-bg-darker/40 rounded-xl border border-glass-border/40">
          <div className="h-9 w-9 rounded-xl bg-gradient-accent p-[1px] shrink-0">
            {expertPicture ? (
              <img src={expertPicture} alt={expertName} className="h-full w-full rounded-xl object-cover" />
            ) : (
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center font-extrabold text-white text-xs uppercase">
                {expertName[0]}
              </div>
            )}
          </div>
          <div className="truncate text-left space-y-0.5">
            <div className="text-xs font-bold text-text-title truncate">{expertName}</div>
            <div className="text-[9px] text-text-muted font-semibold flex items-center gap-1">
              <User size={10} className="text-accent-cyan" /> Mentorship Expert
            </div>
          </div>
        </div>

        {session.message && (
          <p className="text-xs text-text-main leading-relaxed line-clamp-2 bg-bg-dark/30 p-2.5 rounded-lg border border-glass-border/30">
            "{session.message}"
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-muted font-semibold pt-1">
          <div className="flex items-center gap-1.5 bg-glass-border/20 p-2 rounded-lg border border-glass-border/30">
            <Calendar size={12} className="text-accent-purple shrink-0" />
            <span className="truncate">{formatLocalDateTime(session.scheduledAt)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-glass-border/20 p-2 rounded-lg border border-glass-border/30">
            <Clock size={12} className="text-accent-cyan shrink-0" />
            <span>{session.duration} min</span>
          </div>

          <div className="flex items-center gap-1.5 bg-glass-border/20 p-2 rounded-lg border border-glass-border/30">
            <DollarSign size={12} className="text-accent-emerald shrink-0" />
            <span className="font-extrabold text-text-title">{formattedPrice}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-glass-border/20 p-2 rounded-lg border border-glass-border/30">
            <Users size={12} className="text-accent-orange shrink-0" />
            <span className="truncate">{learnersCount} / {maxCapacity} Seats</span>
          </div>
        </div>

        {isExpert && session.learners && session.learners.length > 0 && (
          <div className="pt-2 border-t border-glass-border/30 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-text-title uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Users size={12} className="text-accent-purple" /> Learner Requests
              </span>
              {pendingRequests.length > 0 && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.2 rounded-full text-[9px]">
                  {pendingRequests.length} Pending
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {session.learners.map((learnerEntry, idx) => (
                <LearnerRequestCard
                  key={learnerEntry._id || idx}
                  learnerEntry={learnerEntry}
                  onAccept={(learnerId) => onAcceptLearner && onAcceptLearner(session._id, learnerId)}
                  onReject={(learnerId) => onRejectLearner && onRejectLearner(session._id, learnerId)}
                  loadingLearnerId={loadingLearnerId}
                  isSessionActive={session.status === "open"}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-glass-border/40 space-y-2">
        {isLearner && (
          <div className="flex items-center justify-between gap-2">
            {!myLearnerEntry ? (
              <Button
                onClick={() => onBook(session._id)}
                loading={bookingLoadingId === session._id}
                disabled={session.status !== "open" || isFull}
                className="w-full text-xs py-2 px-4 bg-gradient-to-r from-accent-purple to-accent-indigo shadow-lg flex items-center justify-center gap-1.5"
              >
                <PlayCircle size={14} /> {isFull ? "Session Full" : `Book Session (${formattedPrice})`}
              </Button>
            ) : isPendingLearner ? (
              <div className="w-full flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <SessionStatusBadge status="pending" type="learner" />
                <button
                  onClick={() => onViewDetails(session._id)}
                  className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  View Details &rarr;
                </button>
              </div>
            ) : isAcceptedLearner ? (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <SessionStatusBadge status="accepted" type="learner" />
                  {canJoin && (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <ExternalLink size={13} /> Join Session
                    </a>
                  )}
                </div>
              </div>
            ) : isRejectedLearner ? (
              <div className="w-full flex items-center justify-between p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <SessionStatusBadge status="rejected" type="learner" />
                <span className="text-[10px] text-text-muted">Contact Expert</span>
              </div>
            ) : null}
          </div>
        )}

        {isExpert && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => onViewDetails(session._id)}
                variant="secondary"
                className="text-xs py-1.5 px-3 flex items-center gap-1 text-accent-purple border-accent-purple/30 hover:bg-accent-purple/10"
              >
                Details & Manage
              </Button>

              {onEditSession && session.status === "open" && (
                <button
                  onClick={() => onEditSession(session)}
                  className="p-1.5 rounded-lg border border-glass-border/40 hover:bg-glass-border/30 text-text-muted hover:text-accent-purple transition cursor-pointer"
                  title="Edit Session Details & Meeting Link"
                >
                  <Edit3 size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {session.status !== "completed" && session.status !== "cancelled" && (
                <>
                  {onComplete && (
                    <button
                      onClick={() => onComplete(session._id)}
                      disabled={actionLoadingId === session._id}
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}
                  {onCancel && (
                    <button
                      onClick={() => onCancel(session._id)}
                      disabled={actionLoadingId === session._id}
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};

export default SessionCard;
