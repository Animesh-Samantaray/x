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

const app = express();
app.use(passport.initialize());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/learner", learnerRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/category", categoryRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/courses", courseRoutes);

export default app;