import { Request, Response, NextFunction } from "express";

import feedbackService from "../services/feedback.service";

import { CreateFeedbackDto } from "../dto/feedback.dto";

import { AuthRequest } from "../middlewares/auth.middleware";

import { createdResponse, successResponse } from "../utils/response";

class FeedbackController {
  /**
   * POST /api/v1/equipment/:id/feedback
   */
  async addFeedback(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: CreateFeedbackDto = req.body;

      const feedback = await feedbackService.addFeedback(
        req.user!.userId,
        req.params.id as string,
        body
      );

      createdResponse(res, "Feedback submitted successfully.", feedback);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/equipment/:id/feedback
   */
  async getFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedback = await feedbackService.getFeedbackForEquipment(req.params.id as string);

      successResponse(res, "Feedback fetched successfully.", feedback);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/equipment/:id/feedback/:feedbackId
   */
  async deleteFeedback(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await feedbackService.deleteFeedback(
        req.params.feedbackId as string,
        req.user!.userId
      );

      successResponse(res, result.message);
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedbackController();
