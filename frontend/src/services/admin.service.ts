import { apiClient } from "../lib/api-client";

class AdminService {
  listUsers(search?: string) {
    return apiClient.get("/admin/users", { params: { search } });
  }

  suspendUser(id: string) {
    return apiClient.patch(`/admin/users/${id}/suspend`);
  }

  reinstateUser(id: string) {
    return apiClient.patch(`/admin/users/${id}/reinstate`);
  }

  listModerators() {
    return apiClient.get("/admin/moderators");
  }

  promoteModerator(id: string) {
    return apiClient.patch(`/admin/moderators/${id}/promote`);
  }

  demoteModerator(id: string) {
    return apiClient.patch(`/admin/moderators/${id}/demote`);
  }
}

export default new AdminService();
