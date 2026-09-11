import Badge from "../models/badge.model.js";
import UserAchievement from "../models/UserAchievement.model.js";
import User from "../models/User.model.js";
import Progress from "../models/Progress.model.js";
import Course from "../models/Course.model.js";
import Resource from "../models/resource.model.js";
import MentorshipSession from "../models/MentorshipSession.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";
import Earnings from "../models/Earnings.model.js";
import Review from "../models/Review.model.js";

/**
 * Central achievement engine.
 * Calculates user statistics against DB data and unlocks eligible active badges.
 */
export const checkAndUnlockAchievements = async (userId) => {
  try {
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) return;

    const userRole = user.role;

    // Load active badges applicable to user's role
    // Badges where roles array contains userRole OR roles is empty/all
    const activeBadges = await Badge.find({
      isActive: true,
      $or: [{ roles: userRole }, { roles: { $size: 0 } }],
    });

    // Filter out badges already unlocked by the user using Badge.users array
    const pendingBadges = activeBadges.filter(
      (badge) => !badge.users.some((uId) => uId.toString() === userId.toString())
    );

    if (pendingBadges.length === 0) {
      return;
    }

    // Lazy load user stats as needed
    const stats = {};

    const getStat = async (key) => {
      if (stats[key] !== undefined) return stats[key];

      switch (key) {
        case "courses_completed": {
          // Count progress records for this user where completedAt is set or percentage === 100
          const count = await Progress.countDocuments({
            user: userId,
            $or: [{ completedAt: { $ne: null } }, { percentage: 100 }],
          });
          stats[key] = count;
          break;
        }

        case "courses_created": {
          const count = await Course.countDocuments({
            createdBy: userId,
          });
          stats[key] = count;
          break;
        }

        case "resources_created": {
          const count = await Resource.countDocuments({
            createdBy: userId,
          });
          stats[key] = count;
          break;
        }

        case "earnings": {
          const earningDoc = await Earnings.findOne({ user: userId });
          stats[key] = earningDoc ? earningDoc.earnings : 0;
          break;
        }

        case "sessions_completed": {
          // If learner, check learner attendance; if expert, check expert sessions.
          if (userRole === "expert") {
            const expertProfile = await ExpertProfile.findOne({ user: userId });
            if (!expertProfile) {
              stats[key] = 0;
            } else {
              const count = await MentorshipSession.countDocuments({
                expert: expertProfile._id,
                status: "completed",
              });
              stats[key] = count;
            }
          } else {
            // Learner completed sessions
            const count = await MentorshipSession.countDocuments({
              "learners.user": userId,
              "learners.status": "accepted",
              status: "completed",
            });
            stats[key] = count;
          }
          break;
        }

        case "rating": {
          // Calculate average rating from Reviews on courses created by user or expert rating
          if (userRole === "creator" || userRole === "expert") {
            const userCourses = await Course.find({ createdBy: userId }).select("_id");
            const courseIds = userCourses.map((c) => c._id);
            if (courseIds.length === 0) {
              stats[key] = 0;
            } else {
              const avgResult = await Review.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: null, avgRating: { $avg: "$rating" } } },
              ]);
              stats[key] = avgResult.length > 0 ? avgResult[0].avgRating : 0;
            }
          } else {
            stats[key] = 0;
          }
          break;
        }

        default:
          stats[key] = 0;
      }

      return stats[key];
    };

    // Helper for category-specific completed courses count
    const getCategoryCoursesCompleted = async (categoryId) => {
      if (!categoryId) return 0;
      const catKey = `category_courses_completed_${categoryId}`;
      if (stats[catKey] !== undefined) return stats[catKey];

      // Find completed progress records for user
      const completedProgress = await Progress.find({
        user: userId,
        $or: [{ completedAt: { $ne: null } }, { percentage: 100 }],
      }).select("course");

      const courseIds = completedProgress.map((p) => p.course);
      if (courseIds.length === 0) {
        stats[catKey] = 0;
        return 0;
      }

      // Count how many of these courses belong to the category
      const count = await Course.countDocuments({
        _id: { $in: courseIds },
        category: categoryId,
      });

      stats[catKey] = count;
      return count;
    };

    // Evaluate each pending badge
    for (const badge of pendingBadges) {
      let isSatisfied = false;
      const reqType = badge.requirementType;
      const reqVal = badge.requirementValue;

      if (reqType === "course_completed" || reqType === "courses_completed") {
        const completedCount = await getStat("courses_completed");
        if (completedCount >= reqVal) {
          isSatisfied = true;
        }
      } else if (reqType === "category_courses_completed") {
        if (badge.category) {
          const categoryCompletedCount = await getCategoryCoursesCompleted(badge.category);
          if (categoryCompletedCount >= reqVal) {
            isSatisfied = true;
          }
        }
      } else if (reqType === "courses_created") {
        const createdCount = await getStat("courses_created");
        if (createdCount >= reqVal) {
          isSatisfied = true;
        }
      } else if (reqType === "resources_created") {
        const resourceCount = await getStat("resources_created");
        if (resourceCount >= reqVal) {
          isSatisfied = true;
        }
      } else if (reqType === "earnings") {
        const earningsVal = await getStat("earnings");
        if (earningsVal >= reqVal) {
          isSatisfied = true;
        }
      } else if (reqType === "sessions_completed") {
        const sessionsCount = await getStat("sessions_completed");
        if (sessionsCount >= reqVal) {
          isSatisfied = true;
        }
      } else if (reqType === "rating") {
        const ratingVal = await getStat("rating");
        if (ratingVal >= reqVal) {
          isSatisfied = true;
        }
      }

      if (isSatisfied) {
        // Unlock badge safely avoiding duplicates
        try {
          // 1. Create UserAchievement record (fails silently on duplicate due to unique index)
          await UserAchievement.create({
            user: userId,
            badge: badge._id,
            unlockedAt: new Date(),
          });

          // 2. Add user ID to Badge.users using $addToSet
          await Badge.findByIdAndUpdate(badge._id, {
            $addToSet: { users: userId },
          });
        } catch (err) {
          // If duplicate key error E11000, user already has badge
          if (err.code !== 11000) {
            console.error(`Error unlocking badge ${badge._id} for user ${userId}:`, err);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Achievement processing error for user ${userId}:`, error.message);
  }
};

export default {
  checkAndUnlockAchievements,
};
