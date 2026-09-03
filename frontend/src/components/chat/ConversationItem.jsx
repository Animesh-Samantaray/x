import React from "react";
import { BookOpen, Video, Users } from "lucide-react";

const ConversationItem = ({ conversation, isActive, onClick, lastMessage }) => {
  const isCourse = !!conversation.course;

  const title = isCourse
    ? conversation.course?.title
    : conversation.session?.title;

  const subtitle = isCourse
    ? "Course Discussion"
    : conversation.session?.topic || "Mentorship Session";

  const thumbnail = isCourse ? conversation.course?.thumbnail : null;
  const participantCount = conversation.participants?.length || 0;
  const unreadCount = conversation.unreadCount || 0;

  const displayMessage = lastMessage || conversation.lastMessage;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const getLastMessageText = () => {
    if (displayMessage) {
      if (displayMessage.attachment) {
        return `📎 ${displayMessage.attachment.originalName || "Attachment"}`;
      }
      return displayMessage.message || "No message content";
    }
    return "No messages yet";
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${
        isActive
          ? "bg-slate-800/90 border-sky-500/30 text-white"
          : "hover:bg-slate-800/50 border-transparent text-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar/Thumbnail */}
        <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || "Thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                isCourse ? "bg-sky-600/20 text-sky-400" : "bg-emerald-600/20 text-emerald-400"
              }`}
            >
              {isCourse ? <BookOpen size={20} /> : <Video size={20} />}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h3 className="font-semibold text-sm text-slate-100 truncate">
              {title || "Untitled Discussion"}
            </h3>
            {displayMessage && (
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                {formatTime(displayMessage.createdAt || conversation.updatedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                isCourse
                  ? "bg-sky-950 text-sky-400 border border-sky-800/50"
                  : "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
              }`}
            >
              {isCourse ? "Course" : "Session"}
            </span>
            <span className="text-xs text-slate-400 truncate">{subtitle}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400 truncate flex-1 leading-snug">
              {getLastMessageText()}
            </p>

            <div className="flex items-center gap-1.5 shrink-0">
              {unreadCount > 0 && (
                <span className="bg-sky-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              <div className="flex items-center gap-0.5 text-[10px] text-slate-500 font-medium">
                <Users size={11} />
                <span>{participantCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
