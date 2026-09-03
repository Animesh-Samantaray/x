import "dotenv/config";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.model.js";
import LearnerProfile from "../models/LearnerProfile.model.js";
import CreatorProfile from "../models/CreatorProfile.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(
            new Error("Google account does not have an email"),
            null
          );
        }


        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        //  Check existing email
        user = await User.findOne({ email });

        if (user) {
          // Link Google account to existing account
          user.googleId = googleId;
          user.authProvider = "google";
          user.isVerified = true;

          if (avatar && !user.profilePicture) {
            user.profilePicture = avatar;
          }

          await user.save();

          return done(null, user);
        }

        //  New Google user
        let role = undefined;
        if (req.query.state) {
          try {
            const decodedState = Buffer.from(req.query.state, "base64").toString("utf-8");
            const parsedState = JSON.parse(decodedState);
            role = parsedState.role;
          } catch (e) {
            console.error("Failed to parse Google OAuth state:", e);
          }
        }

        if (!role) {
          role = "learner";
        }

        if (role === "admin") {
          return done(
            new Error("Admin registration is not allowed"),
            null
          );
        }

        if (!["learner", "creator", "expert"].includes(role)) {
          return done(
            new Error("Invalid registration role"),
            null
          );
        }

        // Create new user
        user = await User.create({
          name,
          email,
          googleId,
          profilePicture: avatar || "",
          role,
          authProvider: "google",
          isVerified: true,
        });
        if (role === "learner") {
          await LearnerProfile.create({
            user: user._id,
          });
        }

        if (role === "creator") {
          await CreatorProfile.create({
            user: user._id,
          });
        }

        if (role === "expert") {
          await ExpertProfile.create({
            user: user._id,
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return done(null, false);
    }

    done(null, user);

  } catch (error) {
    done(error, null);
  }
});

export default passport;