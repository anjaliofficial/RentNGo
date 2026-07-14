import { Router } from "express";

import authController from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Public Routes
 */

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

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