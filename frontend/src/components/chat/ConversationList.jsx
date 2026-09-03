import React, { useState, useEffect } from "react";
import { Search, MessageSquare, Bell, BellOff, BellRing } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { extractId } from "../../services/socket";

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  loading,
  notifPermission,
  onRequestNotifPermission,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);

  const selectedConvIdStr = extractId(selectedConversationId);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = conversations.filter((conv) => {
        const title = conv.course?.title || conv.session?.title || "";
        const topic = conv.session?.topic || "";
        return (
          title.toLowerCase().includes(q) || topic.toLowerCase().includes(q)
        );
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-slate-900/90">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-9 bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="flex-1 p-3 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/90">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Discussions
          </h2>
          <div className="flex items-center gap-2">
            {/* Desktop System Notification Toggle */}
            <button
              onClick={onRequestNotifPermission}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                notifPermission === "granted"
                  ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                  : notifPermission === "denied"
                  ? "bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-sky-950/60 border-sky-800/60 text-sky-400 hover:bg-sky-900/80 cursor-pointer animate-pulse"
              }`}
              title={
                notifPermission === "granted"
                  ? "Browser desktop notifications active"
                  : notifPermission === "denied"
                  ? "Desktop notifications blocked in Chrome settings"
                  : "Click to enable browser system notifications"
              }
            >
              {notifPermission === "granted" ? (
                <BellRing size={13} />
              ) : notifPermission === "denied" ? (
                <BellOff size={13} />
              ) : (
                <Bell size={13} />
              )}
            </button>

            <span className="text-xs text-slate-400 font-medium">
              {conversations.length} {conversations.length === 1 ? "chat" : "chats"}
            </span>
          </div>
        </div>

        {/* System Notification Enable Callout Banner if Default */}
        {notifPermission === "default" && (
          <div
            onClick={onRequestNotifPermission}
            className="p-2 bg-sky-950/80 border border-sky-800/80 rounded-lg flex items-center justify-between cursor-pointer hover:bg-sky-900/80 transition"
          >
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-sky-400 shrink-0" />
              <span className="text-[11px] text-sky-200 font-medium leading-tight">
                Enable desktop notifications for new messages
              </span>
            </div>
            <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded font-bold">
              Allow
            </span>
          </div>
        )}

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all duration-150"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare size={36} className="text-slate-600 mb-2" />
            <p className="text-xs font-semibold text-slate-300">
              {searchQuery ? "No discussions found" : "No active discussions"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
              {searchQuery
                ? "Try searching for a different keyword"
                : "Course and mentorship session chats will automatically appear here"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const convIdStr = extractId(conversation._id);
            return (
              <ConversationItem
                key={convIdStr}
                conversation={conversation}
                isActive={selectedConvIdStr === convIdStr}
                onClick={() => onSelectConversation(conversation)}
                lastMessage={conversation.lastMessage}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
