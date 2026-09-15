import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./configs/passport.js";

import authRoutes from "./routes/auth.route.js";
import learnerRoutes from "./routes/learner.route.js";
import creatorRoutes from "./routes/creator.route.js";
import expertRoutes from "./routes/expert.route.js";
import adminRoutes from "./routes/admin.route.js";
import categoryRoutes from "./routes/category.route.js";
import resourceRoutes from "./routes/resource.route.js";
import courseRoutes from "./routes/course.route.js";
import unitRoutes from "./routes/unit.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";
import progressRoutes from "./routes/progress.route.js";
import reviewRoutes from "./routes/review.route.js";
import sessionRoutes from "./routes/mentorshipSession.route.js";
import convRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
import paymentRoutes from "./routes/payment.routes.js";
import earningRoutes from "./routes/earnings.route.js";
import notificationRoutes from "./routes/notification.route.js";
import reportRoutes from "./routes/report.route.js";
import aiRoutes from "./routes/ai.route.js";
import achievementRoutes from "./routes/achievement.routes.js";

const app = express();
app.set("trust proxy", 1);
app.use(passport.initialize());

const rawOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "https://animesh-ckm.vercel.app",
].filter(Boolean);

const allowedOrigins = rawOrigins.map((url) => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/learner", learnerRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/category", categoryRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/conversation", convRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/pay", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/achievements", achievementRoutes);


export default app;