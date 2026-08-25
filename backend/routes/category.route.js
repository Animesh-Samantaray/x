import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import authorizeRoles from '../middlewares/role.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get("/", authMiddleware, getCategories);

router.get("/:id", authMiddleware, getCategoryById);


router.post(
  "/",
  authMiddleware,
  authorizeRoles("creator", "admin"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "admin"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "admin"),
  deleteCategory
);

export default router;