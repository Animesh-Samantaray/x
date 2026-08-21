import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./configs/passport.js";

import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(passport.initialize());

app.use(
  cors({
    origin:[ process.env.CLIENT_URL,"http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

export default app;