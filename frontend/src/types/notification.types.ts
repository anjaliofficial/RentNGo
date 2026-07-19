export type NotificationType = "booking" | "review" | "payment" | "system";

export interface NotificationSender {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface AppNotification {
  _id: string;
  receiver: string;
  sender?: NotificationSender;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
