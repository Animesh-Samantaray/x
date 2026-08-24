// routes/expert.route.js

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import {
  getExpertProfile,
  getAllExperts,
  getExpertById,
  updateExpertProfile,
  deleteExpertProfile
} from "../controllers/expert.controller.js";

const router = express.Router();

// Get logged-in user's expert profile
router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("expert","admin"),
  getExpertProfile
);

// Update expert profile
router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("expert","admin"),
  updateExpertProfile
);

// Delete expert profile
router.delete(
  "/profile",
  authMiddleware,
  authorizeRoles("expert","admin"),
  deleteExpertProfile
);

// Get all experts (admin only)
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllExperts
);

// Get particular expert by ID
router.get(
  "/:id",
  authMiddleware,
  getExpertById
);

export default router;
