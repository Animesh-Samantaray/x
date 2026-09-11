import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        enum: ["learner", "creator", "expert"],
      },
    ],
    requirementType: {
      type: String,
      required: true,
      enum: [
        "course_completed",
        "courses_completed",
        "category_courses_completed",
        "earnings",
        "resources_created",
        "courses_created",
        "sessions_completed",
        "rating",
      ],
    },
    requirementValue: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);

export default Badge;