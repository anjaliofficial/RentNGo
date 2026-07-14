export interface CreateNotificationDto {
  receiver: string;

  sender?: string;

  title: string;

  message: string;

  type:
    | "booking"
    | "review"
    | "payment"
    | "system";
}

export interface MarkNotificationReadDto {
  notificationId: string;
}