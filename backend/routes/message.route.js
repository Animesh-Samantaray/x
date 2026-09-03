import express from "express";

import {
  sendMessage,
  getConversationMessages,
  markMessageAsRead,
  deleteMessage,
  reactToMessage,
} from "../controllers/message.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/:conversationId",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  upload.single("file"),
  sendMessage
);

router.get(
  "/:conversationId",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  getConversationMessages
);

router.patch(
  "/:messageId/read",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  markMessageAsRead
);

router.delete(
  "/:messageId",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  deleteMessage
);

router.patch(
  "/:messageId/reaction",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  reactToMessage
);

export default router;