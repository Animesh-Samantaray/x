import express from "express";
import {
  getAllAchievements,
  getMyAchievements,
  getAchievementById,
} from "../controllers/achievement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/", getAllAchievements);


router.get("/my", authMiddleware, getMyAchievements);


router.get("/:id", getAchievementById);

export default router;
