import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";

export const checkConversationAccess = async (conversationId, userId, role) => {
  if (!conversationId) {
    return { conversation: null, allowed: false };
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return {
      conversation: null,
      allowed: false,
    };
  }

  if (role === "admin") {
    return {
      conversation,
      allowed: true,
    };
  }

  const allowed = conversation.participants?.some(
    (participant) => participant.toString() === userId.toString()
  );

  return {
    conversation,
    allowed,
  };
};

export const populateMessage = async (messageId) => {
  if (!messageId) return null;
  return await Message.findById(messageId)
    .populate("sender", "name email profilePicture role")
    .populate("reactions.user", "name profilePicture");
};

export default {
  checkConversationAccess,
  populateMessage,
};
