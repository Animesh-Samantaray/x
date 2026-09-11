import Badge from "../models/badge.model.js";
import UserAchievement from "../models/UserAchievement.model.js";
import { checkAndUnlockAchievements } from "../services/achievement.service.js";


export const getAllAchievements = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = { isActive: true };

    if (role) {
      filter.$or = [{ roles: role }, { roles: { $size: 0 } }];
    }

    const badges = await Badge.find(filter)
      .populate("category", "name")
      .select("-users")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error("Get All Achievements Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
      error: error.message,
    });
  }
};

export const getMyAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // 1. Sync & evaluate real database data for any newly qualified badges
    await checkAndUnlockAchievements(userId);

    // 2. Fetch active badges matching user role (or role-agnostic)
    const roleBadges = await Badge.find({
      isActive: true,
      $or: [{ roles: userRole }, { roles: { $size: 0 } }],
    })
      .populate("category", "name")
      .sort({ createdAt: 1 });

    const roleBadgeIds = roleBadges.map((b) => b._id.toString());

    // 3. Fetch user achievements for those role badges
    const userAchievements = await UserAchievement.find({
      user: userId,
      badge: { $in: roleBadgeIds },
    })
      .populate({
        path: "badge",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ unlockedAt: -1 });

    return res.status(200).json({
      success: true,
      data: userAchievements,
      allBadges: roleBadges,
    });
  } catch (error) {
    console.error("Get My Achievements Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your achievements",
      error: error.message,
    });
  }
};


export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;

    const badge = await Badge.findOne({ _id: id, isActive: true })
      .populate("category", "name")
      .select("-users");

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: badge,
    });
  } catch (error) {
    console.error("Get Achievement By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievement details",
      error: error.message,
    });
  }
};
