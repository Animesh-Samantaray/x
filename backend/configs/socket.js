import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { checkConversationAccess } from "../utils/message.utils.js";

let io = null;

export const initSocket = (server) => {
  if (io) return io;

  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (token && typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    if (!token && socket.handshake.headers?.cookie) {
      const cookieHeader = socket.handshake.headers.cookie;
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    if (!token) {
      console.warn("[Socket] Authentication failed: No token provided");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      console.log(`[Socket] Authentication successful for user: ${decoded.id || decoded._id}`);
      next();
    } catch (err) {
      console.warn("[Socket] JWT verification failed:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user?.id || socket.user?._id;

    console.log(`[Socket] New connection: socket.id=${socket.id}, userId=${userId}`);

    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket] User ${userId} joined personal room: user:${userId}`);
    }

    socket.on("join_conversation", async (conversationId) => {
      if (!conversationId) {
        console.warn(`[Socket] join_conversation called with invalid conversationId`);
        return;
      }

      try {
        const { allowed } = await checkConversationAccess(
          conversationId,
          userId,
          socket.user?.role
        );

        if (allowed) {
          socket.join(`conversation:${conversationId}`);
          console.log(`[Socket] User ${userId} joined conversation room: conversation:${conversationId}`);
        } else {
          console.warn(`[Socket] User ${userId} unauthorized to join conversation:${conversationId}`);
        }
      } catch (err) {
        console.error(`[Socket] Error verifying conversation access for ${conversationId}:`, err);
      }
    });

    socket.on("leave_conversation", (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
        console.log(`[Socket] User ${userId} left conversation room: conversation:${conversationId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected: ${userId} (${socket.id})`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return io;
};

export default {
  initSocket,
  getIO,
};
