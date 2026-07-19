import { Response, NextFunction } from "express";

import chatService from "../services/chat.service";

import { SendMessageDto, StartConversationDto } from "../dto/chat.dto";

import { AuthRequest } from "../middlewares/auth.middleware";

import { createdResponse, successResponse } from "../utils/response";

class ChatController {
  /**
   * POST /api/v1/conversations
   */
  async startConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: StartConversationDto = req.body;

      const conversation = await chatService.startConversation(req.user!.userId, body);

      createdResponse(res, "Conversation ready.", conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations
   */
  async getMyConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversations = await chatService.getMyConversations(req.user!.userId);

      successResponse(res, "Conversations fetched successfully.", conversations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/:id
   */
  async getConversationById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversation = await chatService.getConversationById(
        req.params.id as string,
        req.user!.userId
      );

      successResponse(res, "Conversation fetched successfully.", conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/:id/messages
   */
  async getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await chatService.getMessages(req.params.id as string, req.user!.userId);

      successResponse(res, "Messages fetched successfully.", messages);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/conversations/:id/messages
   */
  async sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: SendMessageDto = req.body;

      const message = await chatService.sendMessage(
        req.params.id as string,
        req.user!.userId,
        body
      );

      createdResponse(res, "Message sent successfully.", message);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
