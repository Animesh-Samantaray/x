import express from "express";
import Notification from "../models/Notification.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get logged in user's notifications
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name email profilePicture role")
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
});

// Mark all notifications as read
router.put("/read-all", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
      error: error.message,
    });
  }
});

export default router;
