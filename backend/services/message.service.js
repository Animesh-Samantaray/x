import { getIO } from "../configs/socket.js";

export const emitNewMessage = (conversationId, message) => {
  try {
    const io = getIO();
    if (io && conversationId && message) {
      console.log(`[Socket] Emitting new_message to conversation:${conversationId}, message ID: ${message._id}`);
      io.to(`conversation:${conversationId}`).emit("new_message", message);
    } else {
      console.warn(`[Socket] emitNewMessage failed - io: ${!!io}, conversationId: ${!!conversationId}, message: ${!!message}`);
    }
  } catch (error) {
    console.error("Realtime emitNewMessage error:", error);
  }
};

export const emitMessageRead = (conversationId, payload) => {
  try {
    const io = getIO();
    if (io && conversationId && payload) {
      io.to(`conversation:${conversationId}`).emit("message_read", payload);
    }
  } catch (error) {
    console.warn("Realtime emitMessageRead warning:", error.message);
  }
};

export const emitMessageDeleted = (conversationId, messageId) => {
  try {
    const io = getIO();
    if (io && conversationId && messageId) {
      io.to(`conversation:${conversationId}`).emit("message_deleted", {
        messageId,
        conversationId,
      });
    }
  } catch (error) {
    console.warn("Realtime emitMessageDeleted warning:", error.message);
  }
};

export const emitMessageReaction = (conversationId, message) => {
  try {
    const io = getIO();
    if (io && conversationId && message) {
      io.to(`conversation:${conversationId}`).emit("message_reaction", message);
    }
  } catch (error) {
    console.warn("Realtime emitMessageReaction warning:", error.message);
  }
};

export default {
  emitNewMessage,
  emitMessageRead,
  emitMessageDeleted,
  emitMessageReaction,
};
