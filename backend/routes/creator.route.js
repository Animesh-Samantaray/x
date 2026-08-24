// routes/creator.route.js

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import {
  getCreatorProfile,
  getAllCreators,
  getCreatorById,
  updateCreatorProfile,
  deleteCreatorProfile
} from "../controllers/creator.controller.js";

const router = express.Router();

// Get logged-in user's creator profile
router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("creator","admin"),
  getCreatorProfile
);

// Update creator profile
router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("creator","admin"),
  updateCreatorProfile
);

// Delete creator profile
router.delete(
  "/profile",
  authMiddleware,
  authorizeRoles("creator","admin"),
  deleteCreatorProfile
);

// Get all creators (admin only)
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllCreators
);

// Get particular creator by ID
router.get(
  "/:id",
  authMiddleware,
  getCreatorById
);

export default router;
