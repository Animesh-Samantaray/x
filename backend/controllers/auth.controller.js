import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import generateToken from "../helper/generateToken.js";
import { comparePassword, hashPassword } from "../helper/hashPassword.js";
import resetPasswordTemplate from "../utils/resetPasswordOtpTemplete.js";
import { sendMail } from "../utils/sendMail.js";


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, adminAccessToken } = req.body;

    if (!email || !password || !role || (role !== "admin" && !name)) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!["learner", "creator", "expert", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    if (role === "admin") {
      if (!adminAccessToken) {
        return res.status(400).json({
          success: false,
          message: "Admin Access Token is required to register as Admin",
        });
      }
      if (adminAccessToken !== process.env.ADMIN_ACCESS_TOKEN) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin access token",
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: role === "admin" ? (name || "System Admin") : name,
      email,
      password: hashedPassword,
      role,
      authProvider: "local",
      isVerified: role === "admin" ? true : false,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.redirect(
      `${process.env.CLIENT_URL}/`
    );

  } catch (error) {
    console.error("Google Callback Error:", error);

    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=google_auth_failed`
    );
  }
};


export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};





export const sendPasswordOTP = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.passwordResetOTP = otp;

    user.passwordResetOTPExpire = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      resetPasswordTemplate(otp)
    );

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });

  } catch (error) {
    console.error("Send Reset OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




export const updatePassword = async (req, res) => {
  try {
    let { email, inputOtp, newPassword } = req.body;

    if (!email || !inputOtp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required.",
      });
    }

    email = email.trim().toLowerCase();

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({ email })
      .select("+passwordResetOTP +passwordResetOTPExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      !user.passwordResetOTP ||
      !user.passwordResetOTPExpire
    ) {
      return res.status(400).json({
        success: false,
        message: "Please request a password reset OTP first.",
      });
    }

    if (
      Date.now() > user.passwordResetOTPExpire.getTime()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.passwordResetOTP !== inputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.error("Update Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const verifyResetPasswordOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email })
      .select("+passwordResetOTP +passwordResetOTPExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      !user.passwordResetOTP ||
      !user.passwordResetOTPExpire
    ) {
      return res.status(400).json({
        success: false,
        message: "Please request a password reset OTP first.",
      });
    }

    if (
      Date.now() > user.passwordResetOTPExpire.getTime()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.passwordResetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};