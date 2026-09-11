import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ user: 1, badge: 1 }, { unique: true });

const UserAchievement =
  mongoose.models.UserAchievement ||
  mongoose.model("UserAchievement", userAchievementSchema);

export default UserAchievement;
