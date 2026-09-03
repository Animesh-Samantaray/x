import { io } from "socket.io-client";

let socket = null;
let currentJoinedConversationId = null;

export const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val._id) return val._id.toString();
    if (typeof val.id === "string") return val.id;
    if (typeof val.toString === "function") return val.toString();
  }
  return String(val);
};

export const initSocket = (providedToken) => {
  const authToken = providedToken || localStorage.getItem("token");

  if (socket) {
    if (authToken && socket.auth?.token !== authToken) {
      console.log("[Socket] Updating socket auth token and reconnecting");
      socket.auth = { token: authToken };
      socket.disconnect().connect();
    } else if (!socket.connected) {
      console.log("[Socket] Reconnecting existing socket instance");
      socket.connect();
    }
    return socket;
  }

  const rawUrl =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  const SOCKET_URL = rawUrl.replace(/\/api\/?$/, "");

  console.log(`[Socket] Initializing singleton Socket.IO connection to: ${SOCKET_URL}`);

  socket = io(SOCKET_URL, {
    auth: {
      token: authToken || "",
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[Socket] Socket connected successfully:", socket.id);
    if (currentJoinedConversationId) {
      socket.emit("join_conversation", currentJoinedConversationId);
      console.log(`[Socket] Re-joined conversation room on connect: conversation:${currentJoinedConversationId}`);
    }
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("[Socket] Disconnecting socket service");
    socket.disconnect();
    socket = null;
    currentJoinedConversationId = null;
  }
};

export const joinConversation = (conversationId) => {
  if (!conversationId) {
    console.warn("[Socket] joinConversation called with empty conversationId");
    return;
  }

  const convIdStr = extractId(conversationId);
  currentJoinedConversationId = convIdStr;

  const s = getSocket();
  if (s && s.connected) {
    s.emit("join_conversation", convIdStr);
    console.log(`[Socket] Emitted join_conversation: conversation:${convIdStr}`);
  } else if (s) {
    console.log(`[Socket] Socket connecting... Queued join_conversation for: conversation:${convIdStr}`);
    // Socket connect event handler in initSocket automatically emits join_conversation for currentJoinedConversationId
  }
};

export const leaveConversation = (conversationId) => {
  if (!conversationId) return;
  const convIdStr = extractId(conversationId);
  if (currentJoinedConversationId === convIdStr) {
    currentJoinedConversationId = null;
  }

  if (socket && socket.connected) {
    socket.emit("leave_conversation", convIdStr);
    console.log(`[Socket] Left conversation room: conversation:${convIdStr}`);
  }
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  extractId,
};
