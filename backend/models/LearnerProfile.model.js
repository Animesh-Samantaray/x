import mongoose from "mongoose";

const learnerProfileSchema = new mongoose.Schema(
  {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true,
        index:true
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

    interests: {
      type: [String],
      default: [],
    },

    learningGoals: {
      type: [String],
      default: [],
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
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

const LearnerProfile =
  mongoose.models.LearnerProfile ||
  mongoose.model("LearnerProfile", learnerProfileSchema);

export default LearnerProfile;