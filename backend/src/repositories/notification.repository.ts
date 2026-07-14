import Notification from "../models/notification.model";
import { INotification } from "../types/notification.types";

class NotificationRepository {
  /**
   * Create Notification
   */
  async create(
    data: Partial<INotification>
  ): Promise<INotification> {
    return Notification.create(data);
  }

  /**
   * Get User Notifications
   */
  async findByReceiver(
    receiverId: string
  ): Promise<INotification[]> {
    return Notification.find({
      receiver: receiverId,
    })
      .populate("sender", "fullName avatar")
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Get Unread Notifications
   */
  async findUnread(
    receiverId: string
  ): Promise<INotification[]> {
    return Notification.find({
      receiver: receiverId,
      isRead: false,
    })
      .populate("sender", "fullName avatar")
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Find Notification By ID
   */
  async findById(
    id: string
  ): Promise<INotification | null> {
    return Notification.findById(id);
  }

  /**
   * Mark One Notification As Read
   */
  async markAsRead(
    id: string
  ): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Mark All Notifications As Read
   */
  async markAllAsRead(
    receiverId: string
  ): Promise<void> {
    await Notification.updateMany(
      {
        receiver: receiverId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );
  }

  /**
   * Delete Notification
   */
  async delete(
    id: string
  ): Promise<INotification | null> {
    return Notification.findByIdAndDelete(id);
  }

  /**
   * Count Unread Notifications
   */
  async countUnread(
    receiverId: string
  ): Promise<number> {
    return Notification.countDocuments({
      receiver: receiverId,
      isRead: false,
    });
  }
}

export default new NotificationRepository();