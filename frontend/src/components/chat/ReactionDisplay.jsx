import React from "react";
import { extractId } from "../../services/socket";

const ReactionDisplay = ({ reactions = [], currentUserId, messageId, onReact, isOwn }) => {
  if (!reactions || reactions.length === 0) return null;

  const currentUserIdStr = extractId(currentUserId);

  // Group reactions by emoji
  const reactionMap = {};
  reactions.forEach((r) => {
    const emoji = r.emoji;
    if (!emoji) return;

    if (!reactionMap[emoji]) {
      reactionMap[emoji] = {
        emoji,
        count: 0,
        users: [],
        hasReacted: false,
      };
    }

    reactionMap[emoji].count += 1;

    const uId = extractId(r.user?._id || r.user);
    const uName = r.user?.name || "User";
    if (uName && !reactionMap[emoji].users.includes(uName)) {
      reactionMap[emoji].users.push(uName);
    }

    if (uId && currentUserIdStr && uId === currentUserIdStr) {
      reactionMap[emoji].hasReacted = true;
    }
  });

  const groupedReactions = Object.values(reactionMap);

  if (groupedReactions.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 mt-1 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {groupedReactions.map((item) => {
        const titleText = item.users.length > 0 ? item.users.join(", ") : "Reactions";

        return (
          <button
            key={item.emoji}
            type="button"
            onClick={() => onReact(messageId, item.emoji)}
            title={titleText}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none ${
              item.hasReacted
                ? "bg-sky-500/20 border-sky-500/50 text-sky-500 shadow-xs ring-1 ring-sky-500/30 hover:bg-sky-500/30 hover:scale-105"
                : "bg-glass-card border-glass-border text-text-title hover:bg-bg-darker hover:scale-105"
            }`}
          >
            <span className="text-sm leading-none">{item.emoji}</span>
            {item.count > 1 && (
              <span className="text-[10px] font-bold tracking-tight text-text-title leading-none">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionDisplay;
