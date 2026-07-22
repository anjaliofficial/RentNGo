import { NotificationType } from "../types/notification.types";

export interface CreateNotificationDto {
  receiver: string;

  sender?: string;

  title: string;

  message: string;

  type: `${NotificationType}`;
}

export interface MarkNotificationReadDto {
  notificationId: string;
}