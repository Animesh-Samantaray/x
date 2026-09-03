import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["learner", "creator", "expert", "admin"],
      default: "learner",
    },

    profilePicture: {
      type: String,
      default: "https://img.magnific.com/premium-vector/avatar-profile-icon_188544-4755.jpg?semt=ais_hybrid&w=740&q=80",
    },

    passwordResetOTP: {
      type: String,
      default: "",
      select: false,
    },

    passwordResetOTPExpire: {
      type: Date,
      select: false,
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

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;