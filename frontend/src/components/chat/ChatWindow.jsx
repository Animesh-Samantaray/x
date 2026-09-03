import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, WifiOff } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import chatService from "../../services/chatService";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getSocket,
  joinConversation,
  leaveConversation,
  extractId,
} from "../../services/socket";

const ChatWindow = ({ conversation, currentUserId, onBackToList }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(true);

  const conversationId = conversation?._id;
  const currentConvIdStr = extractId(conversationId);

  const loadMessages = useCallback(async () => {
    if (!currentConvIdStr) return;

    try {
      console.log(`[ChatWindow] Loading messages for conversation: ${currentConvIdStr}`);
      setLoading((prevLoading) => (messages.length === 0 ? true : prevLoading));

      const response = await chatService.getConversationMessages(
        currentConvIdStr
      );
      if (response.success && response.messages) {
        console.log(`[ChatWindow] Loaded ${response.messages.length} messages`);
        setMessages((prev) => {
          const map = new Map();
          response.messages.forEach((m) => map.set(extractId(m._id), m));
          prev.forEach((m) => map.set(extractId(m._id), m));
          return Array.from(map.values()).sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, [currentConvIdStr]);

  useEffect(() => {
    if (!currentConvIdStr) {
      setMessages([]);
      return;
    }

    console.log(`[ChatWindow] Setting up conversation: ${currentConvIdStr}`);
    
    setMessages([]);
    loadMessages();
    joinConversation(currentConvIdStr);

    const socket = getSocket();
    if (!socket) {
      console.warn("[ChatWindow] Socket not available");
      return;
    }

    setSocketConnected(socket.connected);

    const handleConnect = () => {
      console.log("[ChatWindow] Socket reconnected, rejoining conversation");
      setSocketConnected(true);
      joinConversation(currentConvIdStr);
    };

    const handleDisconnect = () => {
      console.log("[ChatWindow] Socket disconnected");
      setSocketConnected(false);
    };

    const handleNewMessage = (incomingMessage) => {
      const msgConvId = extractId(incomingMessage.conversation);
      const incomingId = extractId(incomingMessage._id);
      console.log(`[ChatWindow] Received new_message: ${incomingId} for conv: ${msgConvId}, current: ${currentConvIdStr}`);

      if (msgConvId && msgConvId === currentConvIdStr) {
        setMessages((prev) => {
          if (prev.some((m) => extractId(m._id) === incomingId)) {
            console.log(`[ChatWindow] Message ${incomingId} already exists, skipping`);
            return prev;
          }
          console.log(`[ChatWindow] Adding new message ${incomingId} to state`);
          return [...prev, incomingMessage];
        });
      }
    };

    const handleMessageRead = (payload) => {
      const target = payload.updatedMessage || payload;
      const targetId = extractId(target?._id || payload.messageId);
      console.log(`[ChatWindow] Received message_read for: ${targetId}`);

      if (targetId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (extractId(m._id) === targetId) {
              if (target._id) return target;
              const readBy = m.readBy || [];
              const readUserId = extractId(payload.userId);
              const already = readBy.some(
                (id) => extractId(id) === readUserId
              );
              if (!already && readUserId) {
                return { ...m, readBy: [...readBy, readUserId] };
              }
            }
            return m;
          })
        );
      }
    };

    const handleMessageDeleted = (payload) => {
      const targetId = extractId(payload.messageId || payload._id || payload);
      console.log(`[ChatWindow] Received message_deleted for: ${targetId}`);
      if (targetId) {
        setMessages((prev) =>
          prev.filter((m) => extractId(m._id) !== targetId)
        );
      }
    };

    const handleMessageReaction = (updatedMessage) => {
      const targetId = extractId(updatedMessage?._id);
      console.log(`[ChatWindow] Received message_reaction for: ${targetId}`);
      if (targetId) {
        setMessages((prev) =>
          prev.map((m) =>
            extractId(m._id) === targetId ? updatedMessage : m
          )
        );
      }
    };

    const handleConversationDeleted = (payload) => {
      const targetId = extractId(payload.conversationId || payload._id || payload);
      if (targetId === currentConvIdStr) {
        setMessages([]);
        toast.error("This discussion workspace was deleted.");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_message", handleNewMessage);
    socket.on("message_read", handleMessageRead);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_reaction", handleMessageReaction);
    socket.on("conversation_deleted", handleConversationDeleted);

    console.log("[ChatWindow] Socket listeners registered");

    return () => {
      console.log(`[ChatWindow] Cleaning up conversation: ${currentConvIdStr}`);
      leaveConversation(currentConvIdStr);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new_message", handleNewMessage);
      socket.off("message_read", handleMessageRead);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_reaction", handleMessageReaction);
      socket.off("conversation_deleted", handleConversationDeleted);
    };
  }, [currentConvIdStr]);

  const handleSendMessage = async (messageText, file) => {
    if (!currentConvIdStr || sending) return;

    try {
      setSending(true);
      const response = await chatService.sendMessage(
        currentConvIdStr,
        messageText,
        file
      );

      const returnedMessage = response.data || response.message;

      if (response.success && returnedMessage && returnedMessage._id) {
        const returnedId = extractId(returnedMessage._id);
        setMessages((prev) => {
          if (prev.some((m) => extractId(m._id) === returnedId)) {
            return prev;
          }
          return [...prev, returnedMessage];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const targetId = extractId(messageId);
    try {
      await chatService.deleteMessage(targetId);
      setMessages((prev) => prev.filter((msg) => extractId(msg._id) !== targetId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleReactToMessage = async (messageId, emoji) => {
    const targetId = extractId(messageId);
    try {
      const response = await chatService.reactToMessage(targetId, emoji);
      if (response.success && response.data) {
        setMessages((prev) =>
          prev.map((msg) => (extractId(msg._id) === targetId ? response.data : msg))
        );
      }
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  const handleDeleteConversation = async () => {
    if (!currentConvIdStr || sending) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this discussion workspace? All messages will be permanently removed for all participants."
      )
    ) {
      return;
    }
    try {
      const response = await chatService.deleteConversation(currentConvIdStr);
      if (response.success) {
        toast.success("Discussion workspace deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error(error.response?.data?.message || "Failed to delete conversation.");
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-3 shadow-md">
          <MessageSquare size={28} />
        </div>
        <h3 className="text-sm font-bold text-slate-200 mb-1">
          Select a discussion workspace
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Select a course or mentorship discussion from the left column to interact with participants in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full overflow-hidden relative">
      {!socketConnected && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 px-3 py-1 text-center text-amber-200 text-xs flex items-center justify-center gap-1.5 shrink-0">
          <WifiOff size={14} className="animate-pulse" />
          <span>Reconnecting to realtime server...</span>
        </div>
      )}

      <ChatHeader
        conversation={conversation}
        onBackToList={onBackToList}
        currentUserId={currentUserId}
        currentUserRole={user?.role}
        onDeleteConversation={handleDeleteConversation}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        loading={loading}
        onDelete={handleDeleteMessage}
        onReact={handleReactToMessage}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sending || loading}
      />
    </div>
  );
};

export default ChatWindow;
