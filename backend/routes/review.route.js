import express from "express";

import {
  createReview,
  getCourseReviews,
  getMyCourseReview,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();


router.get(
  "/my",
  protect,
  authorizeRoles("learner"),
  getMyReviews
);


// get all reviewas og  course
router.get(
  "/course/:courseId",
  getCourseReviews
);

// get yhe users review for a cosrs
router.get(
  "/course/:courseId/my",
  protect,
  authorizeRoles("learner"),
  getMyCourseReview
);

// create review
router.post(
  "/course/:courseId",
  protect,
  authorizeRoles("learner"),
  createReview
);

// updt the  review
router.put(
  "/:id",
  protect,
  authorizeRoles("learner","admin"),
  updateReview
);

// dlt the  review
router.delete(
  "/:id",
  protect,
  authorizeRoles("learner","admin"),
  deleteReview
);

export default router;