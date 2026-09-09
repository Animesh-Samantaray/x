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
          ? "bg-sky-500/10 border-sky-500/30 text-text-title shadow-sm"
          : "hover:bg-glass-card border-transparent text-text-muted hover:text-text-title"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar/Thumbnail */}
        <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-bg-darker border border-glass-border flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || "Thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                isCourse ? "bg-sky-500/10 text-sky-500" : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              {isCourse ? <BookOpen size={20} /> : <Video size={20} />}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h3 className="font-semibold text-sm text-text-title truncate">
              {title || "Untitled Discussion"}
            </h3>
            {displayMessage && (
              <span className="text-[11px] text-text-muted shrink-0 font-medium">
                {formatTime(displayMessage.createdAt || conversation.updatedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                isCourse
                  ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              }`}
            >
              {isCourse ? "Course" : "Session"}
            </span>
            <span className="text-xs text-text-muted truncate">{subtitle}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-text-muted truncate flex-1 leading-snug">
              {getLastMessageText()}
            </p>

            <div className="flex items-center gap-1.5 shrink-0">
              {unreadCount > 0 && (
                <span className="bg-sky-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              <div className="flex items-center gap-0.5 text-[10px] text-text-muted font-medium">
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
