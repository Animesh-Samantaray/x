import express from "express";

import {
  completeUnit,
  uncompleteUnit,
  getCourseProgress,
  getMyProgress,
} from "../controllers/progress.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// My  learning progress
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("learner"),
  getMyProgress
);

// Progress of one enrolled course
router.get(
  "/course/:courseId",
  authMiddleware,
  authorizeRoles("learner"),
  getCourseProgress
);

// Completr  unit
router.post(
  "/course/:courseId/unit/:unitId/complete",
  authMiddleware,
  authorizeRoles("learner"),
  completeUnit
);

// Mark unit incompletr
router.delete(
  "/course/:courseId/unit/:unitId/complete",
  authMiddleware,
  authorizeRoles("learner"),
  uncompleteUnit
);

export default router;