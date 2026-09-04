import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
  getPaymentById,
  getMyPayments,
} from "../controllers/payment.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/create-order",
  authMiddleware,
  authorizeRoles("learner"),
  createPaymentOrder
);

router.post(
  "/verify",
  authMiddleware,
  authorizeRoles("learner"),
  verifyPayment
);

router.get(
  "/my-payments",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  getMyPayments
);

router.get(
  "/:paymentId",
  authMiddleware,
  authorizeRoles("learner", "creator", "expert", "admin"),
  getPaymentById
);

export default router;