import express from "express";

import {
  getMyEarnings,
  getEarningsByUserId,
} from "../controllers/earnings.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();


router.get(
  "/my-earnings",
  authMiddleware,
  authorizeRoles("creator", "expert"),
  getMyEarnings
);


router.get(
  "/user/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  getEarningsByUserId
);

export default router;