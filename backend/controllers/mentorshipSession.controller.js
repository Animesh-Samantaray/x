import MentorshipSession from "../models/MentorshipSession.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";
import User from "../models/User.model.js";
import Conversation from "../models/Conversation.model.js";
import {
  createSessionConversation as createSessionConvService,
  addParticipantToConversation,
} from "../services/conversation.service.js";

export const createSession = async (req, res) => {
  try {
    const {
      title,
      topic,
      message,
      scheduledAt,
      duration,
      maxParticipants,
      price,
      meetingUrl,
    } = req.body;

    if (
      !title ||
      !topic ||
      !scheduledAt ||
      !duration ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, topic, scheduled time, duration and price are required",
      });
    }

    const expert = await ExpertProfile.findOne({
      user: req.user._id,
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found",
      });
    }

    if (!expert.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Your expert profile is currently unavailable",
      });
    }

    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be in the future",
      });
    }

    const session = await MentorshipSession.create({
      expert: expert._id,
      title,
      topic,
      message: message || "",
      scheduledAt,
      duration,
      maxParticipants: maxParticipants ? Number(maxParticipants) : 100,
      price,
      meetingUrl: meetingUrl || "",
      learners: [],
      status: "open",
    });

    // Automatically create session conversation
    try {
      const expertProfile = await ExpertProfile.findById(session.expert).select("user");
      if (expertProfile && expertProfile.user) {
        await createSessionConvService(session._id, expertProfile.user);
      }
    } catch (convErr) {
      console.error("Auto conversation creation error on session create:", convErr);
    }

    return res.status(201).json({
      success: true,
      message: "Mentorship session created successfully",
      session,
    });
  } catch (error) {
    console.error("Create session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create mentorship session",
      error: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({
      status: "open",
    })
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      })
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get all sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentorship sessions",
      error: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const isExpert =
      session.expert?.user?._id?.toString() === req.user._id.toString();

    let isAcceptedLearner = false;

    for (const learner of session.learners || []) {
      if (
        learner.user?._id?.toString() === req.user._id.toString() &&
        learner.status === "accepted"
      ) {
        isAcceptedLearner = true;
        break;
      }
    }

    const responseSession = session.toObject();

    if (!isExpert && !isAcceptedLearner) {
      delete responseSession.meetingUrl;
    }

    return res.status(200).json({
      success: true,
      session: responseSession,
    });
  } catch (error) {
    console.error("Get session by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentorship session",
      error: error.message,
    });
  }
};

export const getMySessions = async (req, res) => {
  try {
    if (req.user.role === "expert") {
      const expert = await ExpertProfile.findOne({
        user: req.user._id,
      });

      if (!expert) {
        return res.status(404).json({
          success: false,
          message: "Expert profile not found",
        });
      }

      const sessions = await MentorshipSession.find({
        expert: expert._id,
      })
        .populate({
          path: "expert",
          populate: {
            path: "user",
            select: "name email profilePicture",
          },
        })
        .populate({
          path: "learners.user",
          select: "name email profilePicture",
        })
        .sort({ scheduledAt: 1 });

      return res.status(200).json({
        success: true,
        count: sessions.length,
        sessions,
      });
    }

    if (req.user.role === "learner") {
      const sessions = await MentorshipSession.find({
        "learners.user": req.user._id,
      })
        .populate({
          path: "expert",
          populate: {
            path: "user",
            select: "name email profilePicture",
          },
        })
        .populate({
          path: "learners.user",
          select: "name email profilePicture",
        })
        .sort({ scheduledAt: 1 });

      const filteredSessions = sessions.map((session) => {
        const sessionObject = session.toObject();

        let isAccepted = false;

        for (const learner of session.learners || []) {
          const learnerId = learner.user?._id || learner.user;
          if (
            learnerId.toString() === req.user._id.toString() &&
            learner.status === "accepted"
          ) {
            isAccepted = true;
            break;
          }
        }

        if (!isAccepted) {
          delete sessionObject.meetingUrl;
        }

        return sessionObject;
      });

      return res.status(200).json({
        success: true,
        count: filteredSessions.length,
        sessions: filteredSessions,
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not authorized to view mentorship sessions",
    });
  } catch (error) {
    console.error("Get my sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your mentorship sessions",
      error: error.message,
    });
  }
};

export const requestSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    if (session.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This session is no longer open for requests",
      });
    }

    const maxCapacity = session.maxParticipants || 100;
    if (session.learners.length >= maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "This mentorship session has reached maximum capacity",
      });
    }

    const alreadyRequested = session.learners.some(
      (l) => l.user.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join this session",
      });
    }

    session.learners.push({
      user: req.user._id,
      status: "pending",
      requestedAt: new Date(),
    });

    await session.save();

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Session request sent successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Request session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to request mentorship session",
      error: error.message,
    });
  }
};

export const acceptLearner = async (req, res) => {
  try {
    const { id, learnerId } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const expert = await ExpertProfile.findById(session.expert);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found",
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept learners for this session",
      });
    }

    if (session.status === "cancelled" || session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This session can no longer accept learners",
      });
    }

    let learnerFound = false;

    for (const learner of session.learners || []) {
      if (learner.user.toString() === learnerId) {
        learnerFound = true;

        if (learner.status === "accepted") {
          return res.status(400).json({
            success: false,
            message: "Learner is already accepted",
          });
        }

        learner.status = "accepted";
        learner.acceptedAt = new Date();
        break;
      }
    }

    if (!learnerFound) {
      return res.status(404).json({
        success: false,
        message: "Learner request not found",
      });
    }

    await session.save();

    // Add accepted learner User ID to session Conversation
    try {
      let conv = await Conversation.findOne({ session: id });
      if (conv) {
        await addParticipantToConversation(conv._id, learnerId);
      } else {
        conv = await createSessionConvService(id, expert.user);
        await addParticipantToConversation(conv._id, learnerId);
      }
    } catch (convErr) {
      console.error("Add learner to session conversation error:", convErr);
    }

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Learner accepted successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Accept learner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept learner",
      error: error.message,
    });
  }
};

export const rejectLearner = async (req, res) => {
  try {
    const { id, learnerId } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const expert = await ExpertProfile.findById(session.expert);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found",
      });
    }

    if (expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject learners for this session",
      });
    }

    let learnerFound = false;

    for (const learner of session.learners || []) {
      if (learner.user.toString() === learnerId) {
        learnerFound = true;

        if (learner.status === "accepted") {
          return res.status(400).json({
            success: false,
            message: "An accepted learner cannot be rejected",
          });
        }

        learner.status = "rejected";
        break;
      }
    }

    if (!learnerFound) {
      return res.status(404).json({
        success: false,
        message: "Learner request not found",
      });
    }

    await session.save();

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Learner request rejected successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Reject learner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject learner",
      error: error.message,
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const expert = await ExpertProfile.findById(session.expert);

    if (!expert || expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this session",
      });
    }

    const {
      title,
      topic,
      message,
      scheduledAt,
      duration,
      maxParticipants,
      price,
      meetingUrl,
    } = req.body;

    if (title !== undefined) session.title = title.trim();
    if (topic !== undefined) session.topic = topic.trim();
    if (message !== undefined) session.message = message.trim();
    if (meetingUrl !== undefined) session.meetingUrl = meetingUrl.trim();

    if (scheduledAt !== undefined) {
      if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time must be in the future",
        });
      }
      session.scheduledAt = scheduledAt;
    }

    if (duration !== undefined) {
      if (Number(duration) < 15) {
        return res.status(400).json({
          success: false,
          message: "Duration must be at least 15 minutes",
        });
      }
      session.duration = Number(duration);
    }

    if (maxParticipants !== undefined) {
      if (Number(maxParticipants) < 1) {
        return res.status(400).json({
          success: false,
          message: "Max participants must be at least 1",
        });
      }
      session.maxParticipants = Number(maxParticipants);
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative",
        });
      }
      session.price = Number(price);
    }

    await session.save();

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update mentorship session",
      error: error.message,
    });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const expert = await ExpertProfile.findById(session.expert);

    if (!expert || expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this session",
      });
    }

    if (session.status === "completed" || session.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This session cannot be cancelled",
      });
    }

    session.status = "cancelled";

    await session.save();

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Mentorship session cancelled successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Cancel session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel mentorship session",
      error: error.message,
    });
  }
};

export const completeSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await MentorshipSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Mentorship session not found",
      });
    }

    const expert = await ExpertProfile.findById(session.expert);

    if (!expert || expert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this session",
      });
    }

    if (session.status === "cancelled" || session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This session is already cancelled or completed",
      });
    }

    session.status = "completed";
    session.completedAt = new Date();

    await session.save();

    const updatedSession = await MentorshipSession.findById(id)
      .populate({
        path: "expert",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "learners.user",
        select: "name email profilePicture",
      });

    return res.status(200).json({
      success: true,
      message: "Mentorship session completed successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Complete session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete mentorship session",
      error: error.message,
    });
  }
};