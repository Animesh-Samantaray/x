import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SessionStatusBadge from "./SessionStatusBadge";
import LearnerRequestCard from "./LearnerRequestCard";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  ExternalLink,
  Users,
  PlayCircle,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const formatLocalDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    const dateFormatted = date.toLocaleDateString("en-US", {
      month: "short",
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
  bookingStateLabel,
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
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between"
    >
      {/* Reference UI/UX Container: rounded-[28px], light white or dark space violet background */}
      <div className="h-full p-4 sm:p-5 rounded-[28px] bg-white dark:bg-[#14121f] border-2 border-gray-200 dark:border-[#2b243d] hover:border-purple-500/50 shadow-md dark:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left group">
        
        <div>
          {/* Top Banner Graphics (Liquid gradient background with expert avatar) */}
          <div className="h-36 sm:h-40 w-full rounded-[20px] overflow-hidden relative mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-between p-4">
            
            {/* SVG Liquid Wave Effect */}
            <svg className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" viewBox="0 0 400 200" fill="none">
              <path d="M 0 80 Q 150 140 300 60 T 400 120 L 400 200 L 0 200 Z" fill="url(#sessWaveGrad)" />
              <defs>
                <linearGradient id="sessWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Expert Avatar & Name */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md p-0.5 border border-white/20 shadow-xl shrink-0">
                {expertPicture ? (
                  <img src={expertPicture} alt={expertName} className="h-full w-full rounded-[14px] object-cover" />
                ) : (
                  <div className="h-full w-full rounded-[14px] bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-white text-base uppercase">
                    {expertName[0]}
                  </div>
                )}
              </div>
              <div className="truncate">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  {session.topic || "1:1 Mentorship"}
                </span>
                <h4 className="text-xs font-black text-white truncate mt-1">{expertName}</h4>
              </div>
            </div>

            {/* Status Badge top-right */}
            <div className="relative z-10">
              <SessionStatusBadge status={session.status} type="session" />
            </div>

          </div>

          {/* Card Body */}
          <div className="space-y-3">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition duration-200">
              {session.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">
              Mentorship Schedule:
            </p>

            {/* Feature Bullet Points (3 circular icon rows matching reference UI/UX) */}
            <div className="space-y-2.5 pt-1">
              {/* Date & Time Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-[#272138] border border-purple-100 dark:border-[#3b3254] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Calendar size={13} />
                </div>
                <span className="truncate">{formatLocalDateTime(session.scheduledAt)}</span>
              </div>

              {/* Duration Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-[#272138] border border-cyan-100 dark:border-[#3b3254] text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Clock size={13} />
                </div>
                <span className="truncate">Duration: <strong className="text-gray-900 dark:text-white font-bold">{session.duration} mins</strong></span>
              </div>

              {/* Capacity Seats Row */}
              <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-[#272138] border border-emerald-100 dark:border-[#3b3254] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Users size={13} />
                </div>
                <span className="truncate">Seats Available: <strong className="text-gray-900 dark:text-white font-bold">{learnersCount} / {maxCapacity}</strong></span>
              </div>
            </div>

            {/* Expert Requests Management Section */}
            {isExpert && session.learners && session.learners.length > 0 && (
              <div className="pt-2 border-t border-[#2a233f] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-purple-400" /> Learner Requests
                  </span>
                  {pendingRequests.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[9px]">
                      {pendingRequests.length} Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
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
        </div>

        {/* Bottom Action Pill Bar (Signature pill container matching reference UI/UX) */}
        <div className="mt-5 p-1.5 rounded-full bg-[#1c182b] border border-[#332a4a] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 pl-3 text-xs font-black truncate">
            {isAcceptedLearner ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Booked
              </span>
            ) : (
              <span className="text-emerald-400 text-sm tracking-tight">
                {formattedPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!myLearnerEntry && isLearner ? (
              <button
                onClick={() => onBook(session._id)}
                disabled={session.status !== "open" || isFull || bookingLoadingId === session._id}
                className="px-5 py-2 rounded-full bg-white hover:bg-gray-100 text-gray-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <PlayCircle size={13} /> {isFull ? "Full" : bookingLoadingId === session._id ? (bookingStateLabel || "Processing...") : "Book"}
              </button>
            ) : isAcceptedLearner ? (
              <div className="flex items-center gap-1">
                <Link
                  to={`/chat?session=${session._id}`}
                  className="px-3 py-1.5 rounded-full bg-[#272138] hover:bg-[#342b4a] text-cyan-300 font-bold text-xs border border-[#3b3254] transition cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare size={13} /> Chat
                </Link>
                {canJoin && (
                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-white text-gray-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <ExternalLink size={13} /> Join
                  </a>
                )}
              </div>
            ) : (
              <button
                onClick={() => onViewDetails(session._id)}
                className="px-5 py-2 rounded-full bg-white hover:bg-gray-100 text-gray-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                Inspect <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SessionCard;
