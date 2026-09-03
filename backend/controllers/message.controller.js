import Message from "../models/Message.model.js";
import {
  checkConversationAccess,
  populateMessage,
} from "../utils/message.utils.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import {
  emitNewMessage,
  emitMessageRead,
  emitMessageDeleted,
  emitMessageReaction,
} from "../services/message.service.js";
import { createAndSendNotification } from "../services/notification.service.js";

// Send message
export const sendMessage = async (req, res) => {
  let uploadedAttachment = null;

  try {
    const { conversationId } = req.params;
    const { message } = req.body;
    const userId = req.user.id || req.user._id;

    const { conversation, allowed } = await checkConversationAccess(
      conversationId,
      userId,
      req.user.role
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    if (!message?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message or file is required.",
      });
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);

      uploadedAttachment = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        resourceType: uploadResult.resource_type,
      };
    }

    let newMessage;
    try {
      newMessage = await Message.create({
        conversation: conversationId,
        sender: userId,
        message: message?.trim() || "",
        attachment: uploadedAttachment,
        readBy: [userId],
      });
    } catch (dbError) {
      // Rollback uploaded Cloudinary file if DB insertion fails
      if (uploadedAttachment?.publicId) {
        await deleteFromCloudinary(
          uploadedAttachment.publicId,
          uploadedAttachment.resourceType
        );
      }
      throw dbError;
    }

    const populatedMessage = await populateMessage(newMessage._id);

    // Emit realtime message
    emitNewMessage(conversationId, populatedMessage);

    // Send personal notifications to other conversation participants
    if (conversation.participants && Array.isArray(conversation.participants)) {
      const title = populatedMessage.sender?.name || "New Message";
      const body = uploadedAttachment
        ? `📎 ${uploadedAttachment.originalName || "Attachment"}`
        : populatedMessage.message;

      conversation.participants.forEach((participantId) => {
        createAndSendNotification({
          recipient: participantId,
          sender: populatedMessage.sender,
          type: "message",
          title,
          message: body,
          conversationId,
        });
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error: error.message,
    });
  }
};

// Get conversation messages
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id || req.user._id;

    const { conversation, allowed } = await checkConversationAccess(
      conversationId,
      userId,
      req.user.role
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email profilePicture role")
      .populate("reactions.user", "name profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get conversation messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation messages.",
      error: error.message,
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id || req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const { conversation, allowed } = await checkConversationAccess(
      message.conversation,
      userId,
      req.user.role
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          readBy: userId,
        },
      },
      { returnDocument: "after" }
    );

    const updatedMessage = await populateMessage(messageId);

    // Emit read receipt event
    emitMessageRead(message.conversation, {
      messageId,
      userId,
      conversationId: message.conversation,
      updatedMessage,
    });

    return res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Mark message as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark message as read.",
      error: error.message,
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id || req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const { conversation, allowed } = await checkConversationAccess(
      message.conversation,
      userId,
      req.user.role
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    // Only sender or admin can delete
    if (
      message.sender.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message.",
      });
    }

    // Delete attachment from Cloudinary if present
    if (message.attachment?.publicId) {
      await deleteFromCloudinary(
        message.attachment.publicId,
        message.attachment.resourceType || "image"
      );
    }

    await Message.findByIdAndDelete(messageId);

    // Emit message deleted event
    emitMessageDeleted(message.conversation, messageId);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
      error: error.message,
    });
  }
};

// Add / remove / replace reaction
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id || req.user._id;

    if (!emoji?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Emoji is required.",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const { conversation, allowed } = await checkConversationAccess(
      message.conversation,
      userId,
      req.user.role
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId.toString()
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji.trim()) {
        // Same emoji -> remove reaction
        message.reactions = message.reactions.filter(
          (reaction) => reaction.user.toString() !== userId.toString()
        );
      } else {
        // Different emoji -> replace reaction
        existingReaction.emoji = emoji.trim();
      }
    } else {
      // New reaction
      message.reactions.push({
        user: userId,
        emoji: emoji.trim(),
      });
    }

    await message.save();

    const updatedMessage = await populateMessage(messageId);

    // Emit reaction update event
    emitMessageReaction(message.conversation, updatedMessage);

    return res.status(200).json({
      success: true,
      message: "Reaction updated successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("React to message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reaction.",
      error: error.message,
    });
  }
};