// routes/learner.route.js

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import {
  getLearnerProfile,
  getAllLearners,
  getLearnerById,
  updateLearnerProfile,
  deleteLearnerProfile
} from "../controllers/learner.controller.js";

const router = express.Router();


router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("learner","admin"),
  getLearnerProfile
);

router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("learner","admin"),
  updateLearnerProfile
);

// Delete learner profile
router.delete(
  "/profile",
  authMiddleware,
  authorizeRoles("learner","admin"),
  deleteLearnerProfile
);

 
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllLearners
);

// Get particular learner by ID
router.get(
  "/:id",
  authMiddleware,
  getLearnerById
);

export default router;