import { getIO } from "../configs/socket.js";
import Notification from "../models/Notification.model.js";

export const createAndSendNotification = async ({
  recipient,
  sender,
  type = "message",
  title,
  message,
  conversationId,
  targetMessageId = null,
  reaction = null,
  metadata = {},
}) => {
  if (!recipient) {
    console.warn("[Notification] No recipient provided");
    return null;
  }

  const recipientStr = recipient.toString();
  const senderId = sender ? (sender._id || sender) : null;
  const senderStr = senderId ? senderId.toString() : null;

  if (senderStr && recipientStr === senderStr) {
    console.log(`[Notification] Skipping self-notification for user: ${senderStr}`);
    return null;
  }

  let dbNotification = null;
  try {
    dbNotification = await Notification.create({
      recipient: recipientStr,
      sender: senderId,
      type,
      title: title || "New Notification",
      message: message || "",
      conversation: conversationId || null,
      targetMessage: targetMessageId || null,
      reaction: reaction || null,
      metadata,
    });

    if (dbNotification) {
      dbNotification = await Notification.findById(dbNotification._id).populate(
        "sender",
        "name email profilePicture role"
      );
    }
  } catch (dbErr) {
    console.error("[Notification] Error saving notification to DB:", dbErr);
  }

  const notificationPayload = dbNotification
    ? dbNotification.toObject()
    : {
        recipient: recipientStr,
        sender,
        type,
        title: title || "New Notification",
        message: message || "",
        conversation: conversationId,
        targetMessage: targetMessageId,
        reaction,
        isRead: false,
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

