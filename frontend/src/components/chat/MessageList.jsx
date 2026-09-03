import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, ArrowDown } from "lucide-react";
import MessageBubble from "./MessageBubble";
import chatService from "../../services/chatService";

const MessageList = ({
  messages,
  currentUserId,
  onDelete,
  onReact,
  loading,
}) => {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const isNearBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 150;
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    setShowScrollDown(false);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (isNearBottom()) {
      setShowScrollDown(false);
    } else {
      setShowScrollDown(true);
    }
  };

  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom(false);
    } else {
      setShowScrollDown(true);
    }

    // Mark unread messages as read
    if (messages && messages.length > 0 && currentUserId) {
      messages.forEach((msg) => {
        const isOwn = (msg.sender?._id || msg.sender) === currentUserId;
        if (!isOwn) {
          const readBy = msg.readBy || [];
          const hasRead = readBy.some(
            (id) => (typeof id === "object" ? id._id : id) === currentUserId
          );
          if (!hasRead && msg._id) {
            chatService.markMessageAsRead(msg._id).catch(() => {});
          }
        }
      });
    }
  }, [messages, currentUserId]);

  const groupMessagesByDate = (messagesList) => {
    const groups = {};
    messagesList.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-end p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-12 w-1/2 bg-slate-900 rounded-xl animate-pulse ${
              i % 2 === 0 ? "self-end" : "self-start"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <MessageSquare size={36} className="text-slate-600 mb-2" />
        <p className="text-xs font-semibold text-slate-300">
          No messages in this discussion
        </p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
          Send a message below to start the conversation with participants.
        </p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
          <div key={dateKey} className="space-y-3">
            {/* Date divider */}
            <div className="flex items-center justify-center my-2">
              <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {formatDate(dateKey)}
              </span>
            </div>

            <div className="space-y-1">
              {dateMessages.map((message, idx) => {
                const prevMessage = idx > 0 ? dateMessages[idx - 1] : null;
                const senderId = message.sender?._id || message.sender;
                const prevSenderId =
                  prevMessage?.sender?._id || prevMessage?.sender;
                const showSenderInfo = senderId !== prevSenderId;

                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={senderId === currentUserId}
                    currentUserId={currentUserId}
                    showSenderInfo={showSenderInfo}
                    onDelete={onDelete}
                    onReact={onReact}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom pill */}
      {showScrollDown && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-4 right-4 bg-sky-600 hover:bg-sky-500 text-white rounded-full p-2 shadow-lg flex items-center gap-1.5 text-xs px-3 font-medium transition animate-bounce cursor-pointer z-10"
        >
          <span>New messages</span>
          <ArrowDown size={14} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
