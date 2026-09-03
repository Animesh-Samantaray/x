import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import SessionStatusBadge from "./SessionStatusBadge";
import LearnerRequestCard from "./LearnerRequestCard";
import { getSessionById, acceptLearner, rejectLearner, cancelSession, completeSession } from "../../services/sessionService";
import { X, ExternalLink, Users, Video, AlertCircle, Info, MessageSquare } from "lucide-react";

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

const SessionDetailsModal = ({
  sessionId,
  isOpen,
  onClose,
  currentUser,
  onSessionUpdated,
}) => {
  if (!isOpen || !sessionId) return null;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [loadingLearnerId, setLoadingLearnerId] = useState(null);
  const [lifecycleLoading, setLifecycleLoading] = useState(false);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSessionById(sessionId);
      if (res && res.success) {
        setSession(res.session);
      } else {
        setError("Session details not found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  const triggerToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const handleAcceptLearner = async (learnerId) => {
    try {
      setLoadingLearnerId(learnerId);
      const res = await acceptLearner(sessionId, learnerId);
      if (res && res.success) {
        triggerToast("Learner request accepted successfully!");
        fetchSessionDetails();
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to accept learner.");
    } finally {
      setLoadingLearnerId(null);
    }
  };

  const handleRejectLearner = async (learnerId) => {
    try {
      setLoadingLearnerId(learnerId);
      const res = await rejectLearner(sessionId, learnerId);
      if (res && res.success) {
        triggerToast("Learner request rejected.");
        fetchSessionDetails();
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to reject learner.");
    } finally {
      setLoadingLearnerId(null);
    }
  };

  const handleCompleteSession = async () => {
    try {
      setLifecycleLoading(true);
      const res = await completeSession(sessionId);
      if (res && res.success) {
        triggerToast("Session marked as completed!");
        fetchSessionDetails();
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to complete session.");
    } finally {
      setLifecycleLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!window.confirm("Are you sure you want to cancel this mentorship session? Affected learners will be notified.")) {
      return;
    }
    try {
      setLifecycleLoading(true);
      const res = await cancelSession(sessionId);
      if (res && res.success) {
        triggerToast("Session cancelled.");
        fetchSessionDetails();
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to cancel session.");
    } finally {
      setLifecycleLoading(false);
    }
  };

  const isLearner = currentUser?.role === "learner";
  const isExpert = currentUser?.role === "expert";

  const expertUserId = session?.expert?.user?._id || session?.expert?.user;
  const isOwnerExpert = currentUser?._id && (
    String(expertUserId) === String(currentUser._id) ||
    String(session?.expert?._id) === String(currentUser._id)
  );

  const myLearnerEntry = isLearner && session
    ? (session.learners || []).find((l) => {
        const lId = l.user?._id || l.user;
        return lId && String(lId) === String(currentUser?._id);
      })
    : null;

  const learnerStatus = myLearnerEntry?.status;
  const canJoin = (isOwnerExpert || learnerStatus === "accepted") && session?.meetingUrl;

  const formattedPrice = session?.price > 0 ? `₹${session.price.toLocaleString("en-IN")}` : "Free";
  const expertName = session?.expert?.user?.name || "Expert Mentor";
  const expertPicture = session?.expert?.user?.profilePicture;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <SpotlightCard
        className="w-full max-w-2xl bg-bg-panel border border-glass-border/80 p-6 rounded-2xl text-left shadow-2xl space-y-6 my-8"
        glowColor="rgba(6, 182, 212, 0.12)"
      >
        <div className="flex items-center justify-between border-b border-glass-border/40 pb-4">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-accent-purple" />
            <h2 className="text-sm font-extrabold text-text-title uppercase tracking-widest">
              Mentorship Session Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-rose-400 transition cursor-pointer p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {actionMessage && (
          <div className="p-3 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs rounded-xl flex items-center gap-2">
            <Info size={15} /> <span>{actionMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-text-muted space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-purple mx-auto"></div>
            <p>Fetching session data...</p>
          </div>
        ) : error || !session ? (
          <div className="py-12 text-center text-xs text-rose-400 space-y-3">
            <AlertCircle size={24} className="mx-auto text-rose-400" />
            <p>{error || "Failed to load session details."}</p>
            <Button onClick={fetchSessionDetails} variant="secondary" className="text-xs py-1.5 px-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6 text-xs">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2.5 py-0.5 rounded">
                  {session.topic}
                </span>
                <SessionStatusBadge status={session.status} type="session" />
              </div>
              <h1 className="text-base font-bold text-text-title leading-snug">
                {session.title}
              </h1>
            </div>

            <div className="p-3.5 bg-bg-darker/50 rounded-xl border border-glass-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-accent p-[1px]">
                  {expertPicture ? (
                    <img src={expertPicture} alt={expertName} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center font-extrabold text-white text-xs uppercase">
                      {expertName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-text-title">{expertName}</div>
                  <div className="text-[10px] text-text-muted">Mentorship Expert</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(isOwnerExpert || learnerStatus === "accepted") && (
                  <Link
                    to={`/chat?session=${session._id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 font-extrabold text-xs border border-sky-500/30 transition cursor-pointer"
                  >
                    <MessageSquare size={14} /> Open Chat
                  </Link>
                )}

                {canJoin && (
                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <ExternalLink size={14} /> Join Meeting Now
                  </a>
                )}
              </div>
            </div>

            {session.message && (
              <div className="space-y-1.5">
                <h3 className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Session Agenda / Message</h3>
                <p className="whitespace-pre-wrap bg-bg-dark/40 p-3 rounded-xl border border-glass-border/40 leading-relaxed text-text-main">
                  {session.message}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-bg-darker/40 rounded-xl border border-glass-border/30">
                <div className="text-[9px] font-bold text-text-muted uppercase">Date & Time</div>
                <div className="font-bold text-text-title mt-1 truncate">{formatLocalDateTime(session.scheduledAt)}</div>
              </div>
              <div className="p-3 bg-bg-darker/40 rounded-xl border border-glass-border/30">
                <div className="text-[9px] font-bold text-text-muted uppercase">Duration</div>
                <div className="font-bold text-text-title mt-1">{session.duration} Minutes</div>
              </div>
              <div className="p-3 bg-bg-darker/40 rounded-xl border border-glass-border/30">
                <div className="text-[9px] font-bold text-text-muted uppercase">Session Price</div>
                <div className="font-bold text-accent-emerald mt-1">{formattedPrice}</div>
              </div>
              <div className="p-3 bg-bg-darker/40 rounded-xl border border-glass-border/30">
                <div className="text-[9px] font-bold text-text-muted uppercase">Capacity</div>
                <div className="font-bold text-accent-cyan mt-1">
                  {session.learners?.length || 0} / {session.maxParticipants || 100} Registered
                </div>
              </div>
            </div>

            {isLearner && (
              <div className="p-4 bg-bg-darker/50 rounded-xl border border-glass-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-muted uppercase text-[10px]">Your Mentorship Request Status</span>
                  <SessionStatusBadge status={learnerStatus || "pending"} type="learner" />
                </div>
                {learnerStatus === "accepted" ? (
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    🎉 Your mentorship request has been accepted by the expert! Click "Join Meeting Now" above when the session begins.
                  </p>
                ) : learnerStatus === "rejected" ? (
                  <p className="text-[11px] text-rose-400">
                    Your request for this mentorship session was not accepted by the expert.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-400">
                    ⏳ Your request is currently pending approval by the expert. The meeting URL will unlock once accepted.
                  </p>
                )}
              </div>
            )}

            {isOwnerExpert && (
              <div className="space-y-3 pt-2 border-t border-glass-border/40">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-text-title uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users size={14} className="text-accent-purple" /> Learner Applications ({session.learners?.length || 0} / {session.maxParticipants || 100})
                  </h3>
                  <div className="flex items-center gap-2">
                    {session.status !== "completed" && session.status !== "cancelled" && (
                      <>
                        <Button
                          onClick={handleCompleteSession}
                          loading={lifecycleLoading}
                          className="text-[10px] py-1 px-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                        >
                          Mark Completed
                        </Button>
                        <Button
                          onClick={handleCancelSession}
                          loading={lifecycleLoading}
                          variant="danger"
                          className="text-[10px] py-1 px-3"
                        >
                          Cancel Session
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {!session.learners || session.learners.length === 0 ? (
                  <p className="text-xs text-text-muted py-6 italic text-center bg-bg-dark/30 rounded-xl border border-glass-border/30">
                    No learners have requested to join this session yet.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {session.learners.map((entry, idx) => (
                      <LearnerRequestCard
                        key={entry._id || idx}
                        learnerEntry={entry}
                        onAccept={handleAcceptLearner}
                        onReject={handleRejectLearner}
                        loadingLearnerId={loadingLearnerId}
                        isSessionActive={session.status === "open"}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-glass-border/40">
          <Button variant="secondary" onClick={onClose} className="text-xs py-2 px-5">
            Close
          </Button>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default SessionDetailsModal;
