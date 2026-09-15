import express from "express";

import passport from "../configs/passport.js";
import {
  register,
  login,
  getMe,
  logout,
  googleCallback,
  sendPasswordOTP,
  updatePassword,
  verifyResetPasswordOTP,
  verify2FA,
  resend2FA,
  update2FA
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, getMe);

router.post(
  "/send-reset-password-otp",
  sendPasswordOTP
);

router.post(
  "/verify-reset-password-otp",
  verifyResetPasswordOTP
);

router.post(
  "/change-password",
  updatePassword
);

router.post(
  "/verify-2fa",
  verify2FA
);

router.post(
  "/resend-2fa",
  resend2FA
);


router.put(
  "/2fa",
  authMiddleware,
  update2FA
);




router.get(
  "/google",
  (req, res, next) => {
    const clientUrl = (process.env.CLIENT_URL || "https://animesh-ckm.vercel.app").replace(/\/$/, "");
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent("Google OAuth is not configured on the server")}`);
    }

    const role = req.query.role;
    const allowedRoles = ["learner", "creator", "expert"];
    const safeRole = allowedRoles.includes(role) ? role : "learner";
    const state = Buffer.from(JSON.stringify({ role: safeRole })).toString("base64");

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: state,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  (req, res, next) => {
    const clientUrl = (process.env.CLIENT_URL || "https://animesh-ckm.vercel.app").replace(/\/$/, "");
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Passport Google Strategy Error:", err);
        return res.redirect(
          `${clientUrl}/login?error=${encodeURIComponent("Google authentication failed. Please try again.")}`
        );
      }
      if (!user) {
        console.error("Passport Google Strategy Failed (No user returned):", info);
        return res.redirect(
          `${clientUrl}/login?error=${encodeURIComponent("Google authentication failed. Please try again.")}`
        );
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);



export default router;