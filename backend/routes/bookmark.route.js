import express from "express";
import {
  createBookmark,
  deleteBookmark,
  getMyBookmarks,
  getCourseBookmarks,
} from "../controllers/bookmark.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBookmark);
router.get("/", protect, getMyBookmarks);
router.get("/course/:courseId", protect, getCourseBookmarks);
router.delete("/:id", protect, deleteBookmark);

export default router;
