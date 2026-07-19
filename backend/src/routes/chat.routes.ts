import { Router } from "express";

import chatController from "../controllers/chat.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * All Conversation Routes
 * Require Authentication
 */

// Start (or resume) a conversation
router.post("/", authenticate, chatController.startConversation);

// List my conversations
router.get("/", authenticate, chatController.getMyConversations);

// Get a single conversation
router.get("/:id", authenticate, chatController.getConversationById);

// Get messages in a conversation
router.get("/:id/messages", authenticate, chatController.getMessages);

// Send a message
router.post("/:id/messages", authenticate, chatController.sendMessage);

export default router;
