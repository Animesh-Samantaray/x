import express from "express";
import {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReportStatus,
} from "../controllers/report.controller.js";
import { takeModerationAction } from "../controllers/moderation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();


router.post("/", authMiddleware, createReport);
router.get("/my", authMiddleware, getMyReports);


router.get("/", authMiddleware, authorizeRoles("admin"), getAllReports);
router.get("/:id", authMiddleware, authorizeRoles("admin"), getReportById);
router.put("/:id/status", authMiddleware, authorizeRoles("admin"), updateReportStatus);
router.put("/:id/action", authMiddleware, authorizeRoles("admin"), takeModerationAction);

export default router;
