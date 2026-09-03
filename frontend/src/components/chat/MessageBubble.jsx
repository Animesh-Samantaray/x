import React, { useState } from "react";
import { Check, CheckCheck, MoreVertical, Trash2, Smile } from "lucide-react";
import { extractId } from "../../services/socket";

const MessageBubble = ({
  message,
  isOwn,
  onDelete,
  onReact,
  currentUserId,
  showSenderInfo = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getReadStatus = () => {
    if (!isOwn) return null;

    const currentIdStr = extractId(currentUserId);
    const readBy = message.readBy || [];
    const readByOthers = readBy.filter((id) => {
      const uId = extractId(id);
      return uId && uId !== currentIdStr;
    });

    if (readByOthers.length > 0) {
      return (
        <CheckCheck
          size={14}
          className="text-sky-400 font-bold"
          title="Read by recipient"
        />
      );
    }
    return (
      <Check
        size={14}
        className="text-slate-400"
        title="Sent"
      />
    );
  };

  const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥"];

  const handleReaction = (emoji) => {
    onReact(message._id, emoji);
    setShowReactionPicker(false);
  };

  const handleDelete = () => {
    onDelete(message._id);
    setShowMenu(false);
  };

  const senderIdStr = extractId(message.sender?._id || message.sender);
  const currentUserIdStr = extractId(currentUserId);
  const canDelete = isOwn || (senderIdStr && senderIdStr === currentUserIdStr);

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } mb-2 group relative`}
    >
      <div
        className={`flex max-w-[85%] sm:max-w-[72%] ${
          isOwn ? "flex-row-reverse" : "flex-row"
        } items-end gap-2`}
      >
        {/* Sender Avatar for other users */}
        {!isOwn && (
          <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase">
            {message.sender?.profilePicture ? (
              <img
                src={message.sender.profilePicture}
                alt={message.sender.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              message.sender?.name?.[0] || "?"
            )}
          </div>
        )}

        {/* Message Bubble Container */}
        <div className={`relative ${isOwn ? "items-end" : "items-start"} flex flex-col min-w-0`}>
          {/* Sender Name for other users */}
          {!isOwn && showSenderInfo && message.sender?.name && (
            <span className="text-[10px] font-bold text-sky-400 mb-0.5 ml-1">
              {message.sender.name}
            </span>
          )}

          <div
            className={`relative px-3.5 py-2 rounded-2xl text-xs border shadow-xs ${
              isOwn
                ? "bg-slate-800 border-slate-700 text-slate-100 rounded-br-none"
                : "bg-slate-900 border-slate-800 text-slate-200 rounded-bl-none"
            }`}
          >
            {/* Message Text */}
            {message.message && (
              <p className="whitespace-pre-wrap break-words leading-relaxed text-xs">
                {message.message}
              </p>
            )}

            {/* Attachment Rendering */}
            {message.attachment && (
              <div className="mt-1.5">
                {message.attachment.resourceType === "image" ||
                message.attachment.resourceType === "photo" ||
                message.attachment.mimeType?.startsWith("image/") ? (
                  <a
                    href={message.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.originalName || "Attachment"}
                      className="max-w-full rounded-lg max-h-64 object-cover border border-slate-800 hover:opacity-95 transition"
                    />
                  </a>
                ) : message.attachment.resourceType === "video" ||
                  message.attachment.mimeType?.startsWith("video/") ? (
                  <video
                    src={message.attachment.url}
                    controls
                    className="max-w-full rounded-lg max-h-64 border border-slate-800"
                  />
                ) : (
                  <a
                    href={message.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-slate-950/80 rounded-lg hover:bg-slate-950 transition border border-slate-800"
                  >
                    <span className="text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {message.attachment.originalName || "Document"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {message.attachment.size
                          ? `${(message.attachment.size / 1024 / 1024).toFixed(2)} MB`
                          : "Attachment"}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Timestamp and Read Status */}
            <div
              className={`flex items-center gap-1 mt-1 text-[10px] ${
                isOwn ? "justify-end text-slate-400" : "justify-end text-slate-500"
              }`}
            >
              <span>{formatTime(message.createdAt)}</span>
              {getReadStatus()}
            </div>

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div
                className={`absolute -bottom-2.5 ${
                  isOwn ? "left-2" : "right-2"
                } flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded-full px-1.5 py-0.5 shadow-md text-[10px]`}
              >
                {message.reactions.map((r, idx) => (
                  <span key={idx} title={r.user?.name}>
                    {r.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div
            className={`absolute ${
              isOwn ? "-left-14" : "-right-14"
            } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5`}
          >
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="React"
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Options"
            >
              <MoreVertical size={14} />
            </button>
          </div>

          {/* Reaction Picker Popup */}
          {showReactionPicker && (
            <div
              className={`absolute ${
                isOwn ? "right-0" : "left-0"
              } -top-9 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1 flex gap-1 z-20`}
            >
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-sm hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Option Menu */}
          {showMenu && (
            <div
              className={`absolute ${
                isOwn ? "right-0" : "left-0"
              } -top-9 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1 z-20`}
            >
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition w-full font-medium"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
