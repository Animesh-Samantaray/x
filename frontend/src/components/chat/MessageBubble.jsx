import React, { useState, useEffect, useRef } from "react";
import { Check, CheckCheck, MoreVertical, Trash2, Smile } from "lucide-react";
import { extractId } from "../../services/socket";
import { isStickerMessage } from "../../data/stickers";
import ReactionDisplay from "./ReactionDisplay";

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
  const pickerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showReactionPicker && !showMenu) return;

    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowReactionPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowReactionPicker(false);
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showReactionPicker, showMenu]);

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

  const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "🙏"];

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

  const isSticker = !message.attachment && isStickerMessage(message.message);

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
        {/* Sender Avatar for other users */}
        {!isOwn && (
          <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden bg-bg-darker border border-glass-border flex items-center justify-center text-[10px] font-bold text-text-title uppercase shadow-sm">
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

        {/* Message Container */}
        <div className={`relative ${isOwn ? "items-end" : "items-start"} flex flex-col min-w-0`}>
          {/* Sender Name for other users */}
          {!isOwn && showSenderInfo && message.sender?.name && (
            <span className="text-[10px] font-bold text-sky-500 mb-0.5 ml-1 select-none">
              {message.sender.name}
            </span>
          )}

          {/* STICKER RENDER PATH */}
          {isSticker ? (
            <div className="flex flex-col items-end group/sticker relative py-1">
              <div className="text-5xl sm:text-6xl select-none leading-none transition-transform duration-200 hover:scale-115 active:scale-95 drop-shadow-md py-1 px-1">
                {message.message}
              </div>

              {/* Timestamp & Read Status for Sticker */}
              <div
                className={`flex items-center gap-1 mt-0.5 px-1.5 py-0.5 bg-bg-darker/60 backdrop-blur-xs rounded-full border border-glass-border text-[10px] text-text-muted`}
              >
                <span>{formatTime(message.createdAt)}</span>
                {getReadStatus()}
              </div>
            </div>
          ) : (
            /* STANDARD TEXT/ATTACHMENT BUBBLE RENDER PATH */
            <div
              className={`relative px-3.5 py-2 rounded-2xl text-xs border shadow-xs ${
                isOwn
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-transparent rounded-br-none"
                  : "bg-glass-card border-glass-border text-text-title rounded-bl-none"
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
                        className="max-w-full rounded-lg max-h-64 object-cover border border-glass-border hover:opacity-95 transition"
                      />
                    </a>
                  ) : message.attachment.resourceType === "video" ||
                    message.attachment.mimeType?.startsWith("video/") ? (
                    <video
                      src={message.attachment.url}
                      controls
                      className="max-w-full rounded-lg max-h-64 border border-glass-border"
                    />
                  ) : (
                    <a
                      href={message.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-bg-darker rounded-lg hover:bg-bg-panel transition border border-glass-border"
                    >
                      <span className="text-lg">📄</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-title truncate">
                          {message.attachment.originalName || "Document"}
                        </p>
                        <p className="text-[10px] text-text-muted">
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
                  isOwn ? "justify-end text-sky-100" : "justify-end text-text-muted"
                }`}
              >
                <span>{formatTime(message.createdAt)}</span>
                {getReadStatus()}
              </div>
            </div>
          )}

          {/* Compact WhatsApp Style Reaction Display */}
          <ReactionDisplay
            reactions={message.reactions}
            currentUserId={currentUserId}
            messageId={message._id}
            onReact={onReact}
            isOwn={isOwn}
          />

          {/* Action Trigger Buttons */}
          <div
            className={`absolute ${
              isOwn ? "-left-14" : "-right-14"
            } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-10`}
          >
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="p-1 rounded-lg hover:bg-glass-card text-text-muted hover:text-text-title transition cursor-pointer"
              title="React"
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-glass-card text-text-muted hover:text-text-title transition cursor-pointer"
              title="Options"
            >
              <MoreVertical size={14} />
            </button>
          </div>

          {/* Reaction Picker Popup */}
          {showReactionPicker && (
            <div
              ref={pickerRef}
              className={`absolute ${
                isOwn ? "right-0" : "left-0"
              } -top-10 bg-glass-card backdrop-blur-md border border-glass-border rounded-full shadow-xl px-2 py-1 flex items-center gap-1 z-30 animate-in fade-in zoom-in-95`}
            >
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-base hover:scale-130 transition-transform duration-150 p-1 select-none cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Option Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className={`absolute ${
                isOwn ? "right-0" : "left-0"
              } -top-9 bg-glass-card border border-glass-border rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95`}
            >
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition w-full font-medium cursor-pointer"
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
