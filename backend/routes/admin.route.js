// routes/admin.route.js

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminProfile,
  updateAdminProfile
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin self profile routes
router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminProfile
);

router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("admin"),
  updateAdminProfile
);

// Admin get all users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);

// Admin get single user
router.get(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getUserById
);

// Admin update user
router.put(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUser
);

// Admin delete user
router.delete(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
