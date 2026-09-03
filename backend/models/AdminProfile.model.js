import mongoose from "mongoose";

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    department: {
      type: String,
      default: "Administration",
      trim: true,
    },

    permissions: {
      type: [String],
      default: [
        "manage_users",
        "manage_content",
        "manage_reports",
        "view_analytics",
      ],
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AdminProfile =
  mongoose.models.AdminProfile ||
  mongoose.model("AdminProfile", adminProfileSchema);

export default AdminProfile;