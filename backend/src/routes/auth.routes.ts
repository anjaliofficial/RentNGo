import { Router } from "express";

import authController from "../controllers/auth.controller";

const router = Router();

/**
 * Authentication Routes
 */

// Register
router.post("/register", authController.register);

// Login (Coming Next)
router.post("/login", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Login API not implemented yet.",
  });
});

// Logout (Coming Next)
router.post("/logout", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Logout API not implemented yet.",
  });
});

// Refresh Token (Coming Next)
router.post("/refresh", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Refresh Token API not implemented yet.",
  });
});

// Current User (Coming Next)
router.get("/me", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Current User API not implemented yet.",
  });
});

// Verify Email (Coming Next)
router.post("/verify-email", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Verify Email API not implemented yet.",
  });
});

// Forgot Password (Coming Next)
router.post("/forgot-password", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Forgot Password API not implemented yet.",
  });
});

// Reset Password (Coming Next)
router.post("/reset-password", (_req, res) => {
  res.status(501).json({
    success: false,
    message: "Reset Password API not implemented yet.",
  });
});

export default router;