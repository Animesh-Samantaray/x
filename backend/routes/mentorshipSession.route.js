import express from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  getMySessions,
  updateSession,
  requestSession,
  acceptLearner,
  rejectLearner,
  cancelSession,
  completeSession,
} from "../controllers/mentorshipSession.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getAllSessions
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("expert"),
  createSession
);

router.get(
  "/my-sessions",
  authMiddleware,
  getMySessions
);

router.get(
  "/:id",
  authMiddleware,
  getSessionById
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("expert"),
  updateSession
);

router.post(
  "/:id/request",
  authMiddleware,
  authorizeRoles("learner"),
  requestSession
);

router.put(
  "/:id/learners/:learnerId/accept",
  authMiddleware,
  authorizeRoles("expert"),
  acceptLearner
);

router.put(
  "/:id/learners/:learnerId/reject",
  authMiddleware,
  authorizeRoles("expert"),
  rejectLearner
);

router.put(
  "/:id/cancel",
  authMiddleware,
  authorizeRoles("expert"),
  cancelSession
);

router.put(
  "/:id/complete",
  authMiddleware,
  authorizeRoles("expert"),
  completeSession
);

export default router;