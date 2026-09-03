import mongoose from "mongoose";

const creatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    expertise: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
      },

      github: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CreatorProfile =
  mongoose.models.CreatorProfile ||
  mongoose.model("CreatorProfile", creatorProfileSchema);

export default CreatorProfile;