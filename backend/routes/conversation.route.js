import express from "express";

import {
  createCourseConversation,
  createSessionConversation,
  getCourseConversation,
  getSessionConversation,
  getMyConversations,
  deleteConversation,
} from "../controllers/conversation.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  getMyConversations
);

router.post(
  "/course/:courseId",
  authMiddleware,
  authorizeRoles("creator", "admin"),
  createCourseConversation
);

router.get(
  "/course/:courseId",
  authMiddleware,
  authorizeRoles("learner", "creator", "admin"),
  getCourseConversation
);

router.post(
  "/session/:sessionId",
  authMiddleware,
  authorizeRoles("expert", "admin"),
  createSessionConversation
);

router.get(
  "/session/:sessionId",
  authMiddleware,
  authorizeRoles("learner", "expert", "admin"),
  getSessionConversation
);

router.delete(
  "/:conversationId",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  deleteConversation
);

export default router;