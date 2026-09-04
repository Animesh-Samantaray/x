import MentorshipSession from "../models/MentorshipSession.model.js";

export const requestSessionService = async (sessionId, userId) => {
  const session = await MentorshipSession.findById(sessionId);

  if (!session) {
    const error = new Error("Mentorship session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.status !== "open") {
    const error = new Error("This session is no longer open for requests");
    error.statusCode = 400;
    throw error;
  }

  const maxCapacity = session.maxParticipants || 100;
  if (session.learners.length >= maxCapacity) {
    const error = new Error("This mentorship session has reached maximum capacity");
    error.statusCode = 400;
    throw error;
  }

  const alreadyRequested = session.learners.some(
    (l) => l.user.toString() === userId.toString()
  );

  if (alreadyRequested) {
    const error = new Error("You have already requested to join this session");
    error.statusCode = 400;
    throw error;
  }

  session.learners.push({
    user: userId,
    status: "pending",
    requestedAt: new Date(),
  });

  await session.save();

  const updatedSession = await MentorshipSession.findById(sessionId)
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

  return updatedSession;
};

export default {
  requestSessionService,
};
