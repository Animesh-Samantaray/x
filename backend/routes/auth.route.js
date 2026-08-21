import express from "express";

import passport from "../configs/passport.js";
import {
  register,
  login,
  getMe,
  logout,
  googleCallback
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, getMe);




router.get(
  "/google",
  (req, res, next) => {
    const role = req.query.role;
    const state = role ? Buffer.from(JSON.stringify({ role })).toString("base64") : undefined;
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: state,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`
        );
      }
      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(info?.message || "Google authentication failed")}`
        );
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);



export default router;