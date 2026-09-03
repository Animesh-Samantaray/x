import React, { useState, useEffect, useCallback ,useRef} from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { initSocket, getSocket, extractId } from "../services/socket";
import chatService from "../services/chatService";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendDesktopNotification,
} from "../services/notification";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";

const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    // Ignore audio autoplay policies
  }
};

const Chat = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConversationListMobile, setShowConversationListMobile] =
    useState(true);
  const [notifPermission, setNotifPermission] = useState(
    getNotificationPermission()
  );

  const currentUserId = extractId(user?.id || user?._id);
  const targetConvUrlParam = searchParams.get("conversation");
  const targetSessionUrlParam = searchParams.get("session");
  const targetCourseUrlParam = searchParams.get("course");

  const handleRequestNotifPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      requestNotificationPermission().then((perm) =>
        setNotifPermission(perm)
      );
    }
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await chatService.getMyConversations();
      if (response.success && response.conversations) {
        const sorted = [...response.conversations].sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );
        setConversations(sorted);

        // Explicit target parameters handling
        if (targetSessionUrlParam) {
          const match = sorted.find(
            (c) => extractId(c.session?._id || c.session) === targetSessionUrlParam
          );
          if (match) {
            setSelectedConversation(match);
            setShowConversationListMobile(false);
          } else {
            try {
              const sessionRes = await chatService.getSessionConversation(targetSessionUrlParam);
              if (sessionRes?.success && sessionRes?.conversation) {
                setSelectedConversation(sessionRes.conversation);
                setShowConversationListMobile(false);
              }
            } catch (err) {
              console.error("Error resolving session conversation:", err);
            }
          }
        } else if (targetCourseUrlParam) {
          const match = sorted.find(
            (c) => extractId(c.course?._id || c.course) === targetCourseUrlParam
          );
          if (match) {
            setSelectedConversation(match);
            setShowConversationListMobile(false);
          } else {
            try {
              const courseRes = await chatService.getCourseConversation(targetCourseUrlParam);
              if (courseRes?.success && courseRes?.conversation) {
                setSelectedConversation(courseRes.conversation);
                setShowConversationListMobile(false);
              }
            } catch (err) {
              console.error("Error resolving course conversation:", err);
            }
          }
        } else if (targetConvUrlParam) {
          const match = sorted.find(
            (c) => extractId(c._id) === targetConvUrlParam
          );
          if (match) {
            setSelectedConversation(match);
            setShowConversationListMobile(false);
          } else {
            try {
              const sessionRes = await chatService.getSessionConversation(targetConvUrlParam);
              if (sessionRes?.success && sessionRes?.conversation) {
                setSelectedConversation(sessionRes.conversation);
                setShowConversationListMobile(false);
              }
            } catch (fallbackErr) {}
          }
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [targetConvUrlParam, targetSessionUrlParam, targetCourseUrlParam]);

  const selectedConversationRef = useRef(selectedConversation);
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initSocket(token);
    }

    loadConversations();

    const socket = getSocket();
    if (socket) {
      console.log("[Chat] Setting up global socket listeners");

      const handleGlobalNewMessage = (message) => {
        const senderId = extractId(message.sender?._id || message.sender);
        const isFromOther = senderId && senderId !== currentUserId;
        const targetConvId = extractId(message.conversation);

        console.log(`[Chat] Global new_message received: ${targetConvId}, from: ${senderId}`);

        setConversations((prevConvs) => {
          const matchingConv = prevConvs.find(
            (conv) => extractId(conv._id) === targetConvId
          );

          const activeConvIdStr = extractId(selectedConversationRef.current?._id);
          const isActiveWindowAndConv =
            activeConvIdStr === targetConvId &&
            document.visibilityState === "visible";

          if (isFromOther) {
            playNotificationChime();

            const senderName = message.sender?.name || "New Message";
            const bodyText = message.attachment
              ? `📎 ${message.attachment.originalName || "Attachment"}`
              : message.message || "Sent a message";
            const convTitle =
              matchingConv?.course?.title ||
              matchingConv?.session?.title ||
              "Discussion Forum";

            // Show system notification if not actively viewing the conversation
            if (!isActiveWindowAndConv) {
              sendDesktopNotification({
                title: `${senderName} • ${convTitle}`,
                body: bodyText,
                icon: message.sender?.profilePicture || "/favicon.ico",
                tag: targetConvId,
                onClick: () => {
                  if (matchingConv) {
                    setSelectedConversation(matchingConv);
                    setSearchParams({ conversation: extractId(matchingConv._id) });
                    setShowConversationListMobile(false);
                  }
                },
              });
            }
          }

          if (!matchingConv) {
            loadConversations();
            return prevConvs;
          }

          const updated = prevConvs.map((conv) => {
            if (extractId(conv._id) === targetConvId) {
              const isCurrentActive = activeConvIdStr === targetConvId;
              return {
                ...conv,
                updatedAt: message.createdAt || new Date().toISOString(),
                lastMessage: message,
                unreadCount: isCurrentActive
                  ? 0
                  : (conv.unreadCount || 0) + 1,
              };
            }
            return conv;
          });

          return updated.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
        });
      };

      const handleConversationDeleted = (payload) => {
        const deletedId = extractId(payload.conversationId || payload._id || payload);
        console.log(`[Chat] Global conversation_deleted received: ${deletedId}`);
        setConversations((prev) => prev.filter((c) => extractId(c._id) !== deletedId));
        if (extractId(selectedConversationRef.current?._id) === deletedId) {
          setSelectedConversation(null);
          setSearchParams({});
          setShowConversationListMobile(true);
        }
      };

      socket.on("new_message", handleGlobalNewMessage);
      socket.on("conversation_deleted", handleConversationDeleted);

      return () => {
        console.log("[Chat] Cleaning up global socket listeners");
        socket.off("new_message", handleGlobalNewMessage);
        socket.off("conversation_deleted", handleConversationDeleted);
      };
    }
  }, [currentUserId, loadConversations, setSearchParams]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversation: extractId(conversation._id) });
    setShowConversationListMobile(false);
    setConversations((prev) =>
      prev.map((c) =>
        extractId(c._id) === extractId(conversation._id)
          ? { ...c, unreadCount: 0 }
          : c
      )
    );
  };

  const handleBackToList = () => {
    setShowConversationListMobile(true);
  };

  return (
    <div className="h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Middle Column: Conversation List */}
      <div
        className={`w-full lg:w-80 xl:w-96 border-r border-slate-800 flex flex-col shrink-0 h-full bg-slate-900/90 ${
          showConversationListMobile ? "flex" : "hidden lg:flex"
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?._id}
          onSelectConversation={handleSelectConversation}
          loading={loading}
          notifPermission={notifPermission}
          onRequestNotifPermission={handleRequestNotifPermission}
        />
      </div>

      {/* Right Column: Active Conversation */}
      <div
        className={`flex-1 flex flex-col h-full min-w-0 bg-slate-950 ${
          !showConversationListMobile ? "flex" : "hidden lg:flex"
        }`}
      >
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onBackToList={handleBackToList}
        />
      </div>
    </div>
  );
};

export default Chat;
