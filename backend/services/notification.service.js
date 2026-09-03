import { getIO } from "../configs/socket.js";

export const createAndSendNotification = async ({
  recipient,
  sender,
  type = "message",
  title,
  message,
  conversationId,
  metadata = {},
}) => {
  if (!recipient) {
    console.warn("[Notification] No recipient provided");
    return null;
  }

  const recipientStr = recipient.toString();
  const senderStr = sender ? (sender._id || sender).toString() : null;

  // Do not send notification to sender self
  if (senderStr && recipientStr === senderStr) {
    console.log(`[Notification] Skipping self-notification for user: ${senderStr}`);
    return null;
  }

  const notificationPayload = {
    recipient: recipientStr,
    sender,
    type,
    title: title || "New Notification",
    message: message || "",
    conversationId,
    metadata,
    createdAt: new Date().toISOString(),
  };

  console.log(`[Notification] Sending to user:${recipientStr}, type: ${type}, title: ${title}`);

  try {
    const io = getIO();
    if (io) {
      io.to(`user:${recipientStr}`).emit("new_notification", notificationPayload);
      console.log(`[Notification] Emitted new_notification to user:${recipientStr}`);
    } else {
      console.warn("[Notification] IO instance not available");
    }
  } catch (error) {
    console.error("[Notification] Realtime notification emit error:", error);
  }

  return notificationPayload;
};

export default {
  createAndSendNotification,
};
