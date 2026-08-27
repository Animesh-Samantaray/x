import express from "express";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  getMyCourses,
  getMyEnrolledCourses,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledStudents,
} from "../controllers/course.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getAllCourses);


router.get(
  "/my-courses",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  getMyCourses
);


router.get(
  "/my-enrolled",
  protect,
  authorizeRoles("learner"),
  getMyEnrolledCourses
);


router.get("/:id", getCourseById);


router.post(
  "/",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  createCourse
);


router.put(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  updateCourse
);


router.delete(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  deleteCourse
);


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


router.get(
  "/:id/students",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  getEnrolledStudents
);

export default router;