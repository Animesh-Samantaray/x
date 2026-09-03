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
                ? "bg-sky-950/90 border-sky-500/70 text-sky-200 shadow-xs ring-1 ring-sky-500/40 hover:bg-sky-900/90 hover:scale-105"
                : "bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/90 hover:border-slate-700 hover:scale-105"
            }`}
          >
            <span className="text-sm leading-none">{item.emoji}</span>
            {item.count > 1 && (
              <span className="text-[10px] font-bold tracking-tight text-slate-300 leading-none">
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
