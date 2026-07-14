import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookingRoutes from "./routes/booking.routes";
const app = express();

app.use(cors());

app.use(helmet());


app.use(morgan("dev"));
app.use("/api/v1/bookings", bookingRoutes);
app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
import { errorHandler } from "./middlewares/error.middleware";
app.use("/api/v1/users", userRoutes);
// Health Check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "RentNGo API is running 🚀",
  });
});

app.get("/favicon.ico", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/app/favicon.ico"));
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);
export default app;