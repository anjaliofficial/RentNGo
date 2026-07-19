import { apiClient } from "../lib/api-client";

class NotificationService {
  list() {
    return apiClient.get("/notifications");
  }

  unread() {
    return apiClient.get("/notifications/unread");
  }

  unreadCount() {
    return apiClient.get("/notifications/unread/count");
  }

  markAsRead(id: string) {
    return apiClient.patch(`/notifications/${id}/read`);
  }

  markAllAsRead() {
    return apiClient.patch("/notifications/read-all");
  }

  remove(id: string) {
    return apiClient.delete(`/notifications/${id}`);
  }
}

export default new NotificationService();
