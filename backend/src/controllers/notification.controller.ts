import { Response, NextFunction } from "express";

import notificationService from "../services/notification.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import {
  successResponse,
  createdResponse,
} from "../utils/response";

class NotificationController {
  /**
   * GET /api/v1/notifications
   */
  async getMyNotifications(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notifications =
        await notificationService.getMyNotifications(
          req.user!.userId
        );

      successResponse(
        res,
        "Notifications fetched successfully.",
        notifications
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/notifications/unread
   */
  async getUnreadNotifications(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notifications =
        await notificationService.getUnreadNotifications(
          req.user!.userId
        );

      successResponse(
        res,
        "Unread notifications fetched successfully.",
        notifications
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/notifications/unread/count
   */
  async getUnreadCount(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await notificationService.getUnreadCount(
          req.user!.userId
        );

      successResponse(
        res,
        "Unread notification count fetched successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/notifications
   * (Admin / Internal Use)
   */
  async createNotification(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notification =
        await notificationService.createNotification(
          req.body
        );

      createdResponse(
        res,
        "Notification created successfully.",
        notification
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notification =
        await notificationService.markAsRead(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Notification marked as read.",
        notification
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await notificationService.markAllAsRead(
          req.user!.userId
        );

      successResponse(
        res,
        result.message
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await notificationService.deleteNotification(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        result.message
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();