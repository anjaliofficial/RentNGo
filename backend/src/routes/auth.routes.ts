import { Router } from "express";
import rateLimit from "express-rate-limit";

import authController from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// ---------------------------------------------------------------------
// BEFORE (vulnerable) - Finding 5: Weak Password Policy Enabling
// Unauthorized Account Access
// /login had no rate limiting at all, allowing unlimited login attempts
// per IP/account and making brute-force / credential-stuffing trivial:
//
//   router.post("/login", authController.login);
//
// ---------------------------------------------------------------------
// AFTER (fixed): loginLimiter caps each IP to 5 attempts per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again in 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Public Routes
 */

// Register
router.post("/register", authController.register);

// Login
router.post("/login", loginLimiter, authController.login);

// Refresh Token
router.post("/refresh", authController.refresh);

/**
 * Protected Routes
 */

// Current User
router.get(
  "/me",
  authenticate,
  authController.me
);

// Logout
router.post(
  "/logout",
  authenticate,
  authController.logout
);

/**
 * Coming Soon
 */

router.post("/verify-email", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Verify Email API not implemented yet.",
  });
});

router.post("/forgot-password", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Forgot Password API not implemented yet.",
  });
});

router.post("/reset-password", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Reset Password API not implemented yet.",
  });
});

export default router;