import { Request, Response, NextFunction } from "express";

import reviewService from "../services/review.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import { CreateReviewDto } from "../dto/review.dto";

import {
  createdResponse,
  successResponse,
} from "../utils/response";

class ReviewController {
  /**
   * POST /api/v1/reviews
   */
  async createReview(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: CreateReviewDto = req.body;

      const review =
        await reviewService.createReview(
          req.user!.userId,
          body
        );

      createdResponse(
        res,
        "Review created successfully.",
        review
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reviews
   */
  async getAllReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviews =
        await reviewService.getAllReviews();

      successResponse(
        res,
        "Reviews fetched successfully.",
        reviews
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reviews/:id
   */
  async getReviewById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const review =
        await reviewService.getReviewById(
          req.params.id as string
        );

      successResponse(
        res,
        "Review fetched successfully.",
        review
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reviews/user/:userId
   */
  async getUserReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviews =
        await reviewService.getUserReviews(
          req.params.userId as string
        );

      successResponse(
        res,
        "User reviews fetched successfully.",
        reviews
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/reviews/:id
   */
  async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await reviewService.deleteReview(
        req.params.id as string
      );

      successResponse(
        res,
        "Review deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();