import express from "express";

import {
  createUnit,
  getUnitsByCourse,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const router = express.Router();

// Get units of a course
router.get(
  "/course/:courseId",
  authMiddleware,
  getUnitsByCourse
);

// Get single unit
router.get(
  "/:id",
  authMiddleware,
  getUnitById
);


router.post(
  "/",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("attachments", 10),
  createUnit
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("attachments", 10),
  updateUnit
);

// Delete unit
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  deleteUnit
);

export default router;