import React, { useState } from "react";
import { BookOpen, Video, Users, Info, X, ArrowLeft, Shield, Trash2 } from "lucide-react";
import { extractId } from "../../services/socket";

const ChatHeader = ({
  conversation,
  onBackToList,
  currentUserId,
  currentUserRole,
  onDeleteConversation,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  if (!conversation) {
    return (
      <div className="h-14 border-b border-glass-border bg-glass-card flex items-center px-4">
        <p className="text-xs text-text-muted">Select a discussion to start messaging</p>
      </div>
    );
  }

  const isCourse = !!conversation.course;
  const title = isCourse
    ? conversation.course?.title
    : conversation.session?.title;

  const subtitle = isCourse
    ? "Course Discussion Workspace"
    : conversation.session?.topic
    ? `Topic: ${conversation.session.topic}`
    : "Mentorship Session Workspace";

  const thumbnail = isCourse ? conversation.course?.thumbnail : null;
  const participantCount = conversation.participants?.length || 0;

  const isSession = !!conversation.session;

  const courseCreatorId = extractId(conversation.course?.createdBy?._id || conversation.course?.createdBy);
  const sessionExpertUserId = extractId(conversation.session?.expert?.user?._id || conversation.session?.expert?.user || conversation.session?.expert);

  const isSessionParticipant = isSession && (
    sessionExpertUserId === extractId(currentUserId) ||
    (conversation.session?.learners || []).some((l) => extractId(l.user?._id || l.user) === extractId(currentUserId)) ||
    (conversation.participants || []).some((p) => extractId(p._id || p) === extractId(currentUserId))
  );

  const isCourseCreator = isCourse && courseCreatorId === extractId(currentUserId);
  const isAdmin = currentUserRole === "admin";
  const canDelete = isAdmin || isCourseCreator || isSessionParticipant;

  return (
    <>
      <div className="h-14 border-b border-glass-border bg-glass-card flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="lg:hidden p-1.5 rounded-lg bg-bg-darker border border-glass-border text-text-title shrink-0"
              aria-label="Back to discussions list"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {/* Thumbnail / Avatar */}
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-bg-darker border border-glass-border shrink-0 flex items-center justify-center">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title || "Icon"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  isCourse ? "bg-sky-500/10 text-sky-500" : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {isCourse ? <BookOpen size={16} /> : <Video size={16} />}
              </div>
            )}
          </div>

          {/* Title & Info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-text-title text-sm truncate leading-tight">
              {title || "Discussion"}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
              <span className="truncate">{subtitle}</span>
              <span>•</span>
              <div className="flex items-center gap-1 shrink-0 font-medium text-text-muted">
                <Users size={11} />
                <span>{participantCount} participants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {canDelete && (
            <button
              onClick={onDeleteConversation}
              className="p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:bg-rose-500/10 text-text-muted hover:text-rose-500"
              title="Delete Discussion Workspace"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors cursor-pointer border ${
              showInfo
                ? "bg-bg-darker border-glass-border text-text-title"
                : "hover:bg-bg-darker border-transparent text-text-muted hover:text-text-title"
            }`}
            title="Toggle Details"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Info Drawer Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-80 max-w-full bg-glass-card border-l border-glass-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-14 border-b border-glass-border flex items-center justify-between px-4">
              <h3 className="font-semibold text-text-title text-xs uppercase tracking-wider">
                Discussion Information
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1.5 rounded-lg hover:bg-bg-darker text-text-muted hover:text-text-title transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Type Badge */}
              <div className="p-3 bg-bg-darker border border-glass-border rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-title">
                  {isCourse ? (
                    <BookOpen size={16} className="text-sky-400" />
                  ) : (
                    <Video size={16} className="text-emerald-400" />
                  )}
                  <span>{isCourse ? "Course Discussion" : "Mentorship Discussion"}</span>
                </div>
                <p className="text-[11px] text-text-muted leading-normal">
                  {isCourse
                    ? "Enrolled students, creator, and platform admins share real-time updates and Q&A here."
                    : "Accepted session participants and expert interact in real time here."}
                </p>
              </div>

              {/* Course/Session Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Title
                </label>
                <p className="text-xs font-medium text-text-title bg-bg-darker p-2.5 rounded-lg border border-glass-border">
                  {title}
                </p>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Participants
                  </label>
                  <span className="text-[10px] font-semibold text-sky-500">
                    {participantCount} total
                  </span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {conversation.participants?.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center gap-2.5 p-2 bg-bg-darker border border-glass-border rounded-lg"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-panel border border-glass-border shrink-0 flex items-center justify-center text-[10px] font-bold text-text-title uppercase">
                        {participant.profilePicture ? (
                          <img
                            src={participant.profilePicture}
                            alt={participant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          participant.name?.[0] || "?"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-title truncate">
                          {participant.name}
                        </p>
                        <p className="text-[10px] text-text-muted capitalize">
                          {participant.role || "Member"}
                        </p>
                      </div>
                      {participant.role === "admin" && (
                        <Shield size={12} className="text-amber-400 shrink-0" title="Admin" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone: Delete Action */}
              {canDelete && (
                <div className="pt-2 border-t border-glass-border">
                  <button
                    onClick={() => {
                      setShowInfo(false);
                      onDeleteConversation();
                    }}
                    className="w-full py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>Delete Discussion Workspace</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
