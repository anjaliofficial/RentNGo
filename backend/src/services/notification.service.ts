import { Types } from "mongoose";

import notificationRepository from "../repositories/notification.repository";
import { getIO } from "../socket/socket";

import {
  CreateNotificationDto,
} from "../dto/notification.dto";

import ApiError from "../error/ApiError";

class NotificationService {
  /**
   * Create Notification
   */
  async createNotification(
    body: CreateNotificationDto
  ) {
    return notificationRepository.create({
      receiver: new Types.ObjectId(body.receiver),

      sender: body.sender
        ? new Types.ObjectId(body.sender)
        : undefined,

      title: body.title,

      message: body.message,

      type: body.type as never,
    });
  }

  /**
   * Create and emit notification
   */
  async createAndEmitNotification(
    body: CreateNotificationDto
  ) {
    const notification =
      await this.createNotification(body);

    try {
      getIO()
        .to(body.receiver)
        .emit("notification", notification);
    } catch {
      // Socket.IO is optional for background notification delivery.
    }

    return notification;
  }

  /**
   * Get Current User Notifications
   */
  async getMyNotifications(
    userId: string
  ) {
    return notificationRepository.findByReceiver(
      userId
    );
  }

  /**
   * Get Unread Notifications
   */
  async getUnreadNotifications(
    userId: string
  ) {
    return notificationRepository.findUnread(
      userId
    );
  }

  /**
   * Count Unread Notifications
   */
  async getUnreadCount(
    userId: string
  ) {
    const count =
      await notificationRepository.countUnread(
        userId
      );

    return {
      unread: count,
    };
  }

  /**
   * Mark One Notification As Read
   */
  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await notificationRepository.findById(
        notificationId
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    if (
      notification.receiver.toString() !==
      userId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to access this notification."
      );
    }

    return notificationRepository.markAsRead(
      notificationId
    );
  }

  /**
   * Mark All Notifications As Read
   */
  async markAllAsRead(
    userId: string
  ) {
    await notificationRepository.markAllAsRead(
      userId
    );

    return {
      message:
        "All notifications marked as read.",
    };
  }

  /**
   * Delete Notification
   */
  async deleteNotification(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await notificationRepository.findById(
        notificationId
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    if (
      notification.receiver.toString() !==
      userId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to delete this notification."
      );
    }

    await notificationRepository.delete(
      notificationId
    );

    return {
      message:
        "Notification deleted successfully.",
    };
  }
}

export default new NotificationService();