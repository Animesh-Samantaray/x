import Conversation from "../models/Conversation.model.js";
import User from "../models/User.model.js";

export const addParticipantToConversation = async (conversationId, userId) => {
  if (!conversationId || !userId) return null;

  return await Conversation.findOneAndUpdate(
    { _id: conversationId },
    {
      $addToSet: {
        participants: userId,
      },
    },
    {
      returnDocument: "after",
    }
  );
};

export const removeParticipantFromConversation = async (conversationId, userId) => {
  if (!conversationId || !userId) return null;

  return await Conversation.findOneAndUpdate(
    { _id: conversationId },
    {
      $pull: {
        participants: userId,
      },
    },
    {
      returnDocument: "after",
    }
  );
};

export const createCourseConversation = async (courseId, createdById) => {
  if (!courseId) return null;

  const admins = await User.find({ role: "admin" }).select("_id");
  const adminIds = admins.map((a) => a._id);

  const initialParticipants = createdById
    ? [createdById, ...adminIds]
    : adminIds;

  return await Conversation.findOneAndUpdate(
    { course: courseId },
    {
      $addToSet: {
        participants: {
          $each: initialParticipants,
        },
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );
};

export const createSessionConversation = async (sessionId, expertUserId) => {
  if (!sessionId) return null;

  const admins = await User.find({ role: "admin" }).select("_id");
  const adminIds = admins.map((a) => a._id);

  const initialParticipants = expertUserId
    ? [expertUserId, ...adminIds]
    : adminIds;

  return await Conversation.findOneAndUpdate(
    { session: sessionId },
    {
      $addToSet: {
        participants: {
          $each: initialParticipants,
        },
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );
};

export default {
  addParticipantToConversation,
  removeParticipantFromConversation,
  createCourseConversation,
  createSessionConversation,
};
