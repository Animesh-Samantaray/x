import express from "express";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  getMyCourses,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledStudents,
} from "../controllers/course.controller.js";

import protect  from "../middlewares/auth.middleware.js";
import  authorizeRoles  from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllCourses);

// not dor learners
router.get(
  "/my-courses",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  getMyCourses
);

// all get it 
router.get("/:id", getCourseById);

// Create Course
router.post(
  "/",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  createCourse
);

// Update Course
router.put(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  updateCourse
);

// Delete Course
router.delete(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  deleteCourse
);

// Enroll
router.post(
  "/:id/enroll",
  protect,
  authorizeRoles("learner"),
  enrollInCourse
);

router.delete(
  "/:id/enroll",
  protect,
  authorizeRoles("learner"),
  unenrollFromCourse
);

// View enrolled students
router.get(
  "/:id/students",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  getEnrolledStudents
);

export default router;