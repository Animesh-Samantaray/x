import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";
import Course from "../models/Course.model.js";
import MentorshipSession from "../models/MentorshipSession.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";
import {
  createCourseConversation as createCourseConvService,
  createSessionConversation as createSessionConvService,
  addParticipantToConversation,
} from "../services/conversation.service.js";

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profilePicture role")
      .populate("course", "title thumbnail createdBy")
      .populate("session", "title topic scheduledAt status expert")
      .lean();

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversation: conv._id })
          .populate("sender", "name profilePicture")
          .sort({ createdAt: -1 });

        return {
          ...conv,
          lastMessage: lastMsg || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      conversations: conversationsWithLastMessage,
    });
  } catch (error) {
    console.error("Get my conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations.",
      error: error.message,
    });
  }
};

export const getCourseConversation = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    let conversation = await Conversation.findOne({
      course: courseId,
    })
      .populate("participants", "name email profilePicture role")
      .populate("course", "title thumbnail createdBy");

    if (!conversation) {
      conversation = await createCourseConvService(courseId, course.createdBy);
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email profilePicture role")
        .populate("course", "title thumbnail createdBy");
    }

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    if (req.user.role === "creator") {
      if (course.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not the creator of this course.",
        });
      }

      return res.status(200).json({
        success: true,
        conversation,
      });
    }


    const isEnrolled = (course.enrolledStudents || []).some(
      (sId) => sId.toString() === userId.toString()
    );

    const isParticipant = conversation.participants.some(
      (participant) => (participant._id || participant).toString() === userId.toString()
    );

    if (!isParticipant && isEnrolled) {
      await addParticipantToConversation(conversation._id, userId);
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email profilePicture role")
        .populate("course", "title thumbnail createdBy");
    } else if (!isParticipant && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this course discussion.",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get course conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course conversation.",
      error: error.message,
    });
  }
};

export const getSessionConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id || req.user._id;

    const session = await MentorshipSession.findById(sessionId).populate(
      "expert"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found.",
      });
    }

    let conversation = await Conversation.findOne({
      session: sessionId,
    })
      .populate("participants", "name email profilePicture role")
      .populate("session", "title topic scheduledAt status expert");

    if (!conversation) {
      const expertUserId = session.expert?.user || session.expert;
      conversation = await createSessionConvService(sessionId, expertUserId);
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email profilePicture role")
        .populate("session", "title topic scheduledAt status expert");
    }

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    const expertUserId = session.expert?.user?._id || session.expert?.user || session.expert;
    const isSessionExpert = expertUserId && expertUserId.toString() === userId.toString();

    if (req.user.role === "expert" || isSessionExpert) {
      const expertProfile = await ExpertProfile.findOne({
        user: userId,
      });

      if (
        !expertProfile &&
        !isSessionExpert
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not the expert of this session.",
        });
      }

      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    // Check if user is an accepted learner in this mentorship session
    const isAcceptedLearner = (session.learners || []).some((l) => {
      const lId = l.user?._id || l.user;
      return lId && lId.toString() === userId.toString() && l.status === "accepted";
    });

    const isParticipant = conversation.participants.some(
      (participant) => (participant._id || participant).toString() === userId.toString()
    );

    if (!isParticipant && isAcceptedLearner) {
      await addParticipantToConversation(conversation._id, userId);
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email profilePicture role")
        .populate("session", "title topic scheduledAt status");
    } else if (!isParticipant && !isAcceptedLearner) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this session discussion.",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get session conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch session conversation.",
      error: error.message,
    });
  }
};

export const createCourseConversation = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create this course conversation.",
      });
    }

    const conversation = await createCourseConvService(courseId, course.createdBy);

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email profilePicture role")
      .populate("course", "title thumbnail createdBy");

    return res.status(200).json({
      success: true,
      message: "Course conversation retrieved/initialized successfully.",
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Create course conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course conversation.",
      error: error.message,
    });
  }
};

export const createSessionConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id || req.user._id;

    const session = await MentorshipSession.findById(sessionId).populate(
      "expert"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found.",
      });
    }

    if (req.user.role !== "admin") {
      if (!session.expert) {
        return res.status(400).json({
          success: false,
          message: "Session expert not found.",
        });
      }

      const expertProfile = await ExpertProfile.findOne({
        _id: session.expert._id,
        user: userId,
      });

      if (!expertProfile) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to create this session conversation.",
        });
      }
    }

    const expertUserId = session.expert?.user || session.expert;
    const conversation = await createSessionConvService(sessionId, expertUserId);

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email profilePicture role")
      .populate("session", "title topic scheduledAt status expert");

    return res.status(200).json({
      success: true,
      message: "Session conversation retrieved/initialized successfully.",
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Create session conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create session conversation.",
      error: error.message,
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id || req.user._id;

    const conversation = await Conversation.findById(conversationId)
      .populate("course")
      .populate("session");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    let isAuthorized = false;

    if (req.user.role === "admin") {
      isAuthorized = true;
    } else if (conversation.course) {
      const creatorId = conversation.course.createdBy?._id || conversation.course.createdBy;
      if (creatorId && creatorId.toString() === userId.toString()) {
        isAuthorized = true;
      }
    } else if (conversation.session) {
      const expertUserId = conversation.session.expert?.user?._id || conversation.session.expert?.user || conversation.session.expert;
      if (expertUserId && expertUserId.toString() === userId.toString()) {
        isAuthorized = true;
      }

      if (!isAuthorized && conversation.session.learners) {
        const isSessionLearner = conversation.session.learners.some((l) => {
          const lId = l.user?._id || l.user;
          return lId && lId.toString() === userId.toString();
        });
        if (isSessionLearner) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized && conversation.participants) {
      const isPart = conversation.participants.some(
        (p) => (p._id || p).toString() === userId.toString()
      );
      if (isPart) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Only admins or session/course participants are authorized to delete this conversation.",
      });
    }


    await Message.deleteMany({ conversation: conversationId });

    // Delete conversation document
    await Conversation.findByIdAndDelete(conversationId);

    // Emit realtime event
    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`conversation:${conversationId}`).emit("conversation_deleted", {
          conversationId,
        });
      }
    } catch (socketErr) {
      console.warn("Realtime emit conversation_deleted warning:", socketErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation.",
      error: error.message,
    });
  }
};