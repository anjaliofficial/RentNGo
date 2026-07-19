import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import equipmentRoutes from "./routes/equipment.routes";
import bookingRoutes from "./routes/booking.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import chatRoutes from "./routes/chat.routes";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();

/**
 * -------------------------
 * Global Middlewares
 * -------------------------
 */

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/**
 * -------------------------
 * Health Check
 * -------------------------
 */

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "RentNGo API is running 🚀",
  });
});

/**
 * Optional Favicon
 */
app.get("/favicon.ico", (_req, res) => {
  res.sendFile(
    path.resolve(
      __dirname,
      "../../frontend/app/favicon.ico"
    )
  );
});

/**
 * -------------------------
 * API Routes
 * -------------------------
 */

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/equipment", equipmentRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.use(
  "/api/v1/notifications",
  notificationRoutes
);

app.use(
  "/api/v1/wishlist",
  wishlistRoutes
);

app.use(
  "/api/v1/conversations",
  chatRoutes
);

import uploadRoutes from "./routes/upload.routes";
/**
 * -------------------------
 * Global Error Handler
 * -------------------------
 */
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);
app.use(
  "/api/v1/upload",
  uploadRoutes
);

app.use(errorHandler);

export default app;