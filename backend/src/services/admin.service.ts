import userRepository from "../repositories/user.repository";

import ApiError from "../error/ApiError";

class AdminService {
  /**
   * List Customers/Owners
   */
  async listCustomers(search?: string) {
    return userRepository.findCustomers(search);
  }

  /**
   * Suspend A User
   */
  async suspendUser(actingAdminId: string, userId: string) {
    const target = await userRepository.findById(userId);

    if (!target) {
      throw new ApiError(404, "User not found.");
    }

    if (target.role === "admin") {
      throw new ApiError(400, "You cannot suspend an admin account.");
    }

    if (userId === actingAdminId) {
      throw new ApiError(400, "You cannot suspend your own account.");
    }

    if (target.isSuspended) {
      throw new ApiError(400, "This user is already suspended.");
    }

    return userRepository.setSuspended(userId, true);
  }

  /**
   * Reinstate A Suspended User
   */
  async reinstateUser(userId: string) {
    const target = await userRepository.findById(userId);

    if (!target) {
      throw new ApiError(404, "User not found.");
    }

    if (!target.isSuspended) {
      throw new ApiError(400, "This user is not suspended.");
    }

    return userRepository.setSuspended(userId, false);
  }

  /**
   * List Moderators
   */
  async listModerators() {
    return userRepository.findModerators();
  }

  /**
   * Promote A User To Moderator
   */
  async promoteToModerator(userId: string) {
    const target = await userRepository.findById(userId);

    if (!target) {
      throw new ApiError(404, "User not found.");
    }

    if (target.role === "moderator" || target.role === "admin") {
      throw new ApiError(400, "This user is already a moderator or admin.");
    }

    return userRepository.setRole(userId, "moderator");
  }

  /**
   * Demote A Moderator Back To Customer
   */
  async demoteModerator(userId: string) {
    const target = await userRepository.findById(userId);

    if (!target) {
      throw new ApiError(404, "User not found.");
    }

    if (target.role !== "moderator") {
      throw new ApiError(400, "This user is not a moderator.");
    }

    return userRepository.setRole(userId, "customer");
  }
}

export default new AdminService();
