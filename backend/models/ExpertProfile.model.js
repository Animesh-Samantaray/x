import mongoose from "mongoose";

const expertProfileSchema = new mongoose.Schema(
  {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
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

    expertise: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    qualifications: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
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

      website: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const ExpertProfile =
  mongoose.models.ExpertProfile ||
  mongoose.model("ExpertProfile", expertProfileSchema);

export default ExpertProfile;