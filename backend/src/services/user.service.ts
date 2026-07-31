import userRepository from "../repositories/user.repository";
import bookingRepository from "../repositories/booking.repository";
import notificationService from "./notification.service";

import {
  UpdateProfileDto,
  ChangePasswordDto,
  UpdateAvatarDto,
  VerifyGovernmentIdDto,
} from "../dto/user.dto";

import ApiError from "../error/ApiError";

import {
  comparePassword,
  hashPassword,
} from "../utils/password";

import User from "../models/user.model";

class UserService {
  /**
   * Get Current User
   */
  async getProfile(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /**
   * Get Public Profile (safe fields only, no auth required)
   */
  async getPublicProfile(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const completedRentals =
      await bookingRepository.countCompletedForOwner(id);

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      avatar: user.avatar || "",
      trustScore: user.trustScore,
      verificationStatus: user.verificationStatus,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
      completedRentals,
    };
  }

  /**
   * Update Profile
   */
  async updateProfile(
    id: string,
    body: UpdateProfileDto
  ) {
    const user = await userRepository.updateProfile(id, body);

    if (!user) { 
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /**
   * Change Password
   */
  async changePassword(
    id: string,
    body: ChangePasswordDto
  ) {
    const user = await User.findById(id).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isMatch = await comparePassword(
      body.currentPassword,
      user.password
    );

    if (!isMatch) {
      throw new ApiError(
        400,
        "Current password is incorrect."
      );
    }

    if (body.newPassword !== body.confirmPassword) {
      throw new ApiError(
        400,
        "Passwords do not match."
      );
    }

    const hashedPassword = await hashPassword(
      body.newPassword
    );

    await userRepository.updatePassword(
      id,
      hashedPassword
    );

    return {
      message: "Password changed successfully.",
    };
  }

  /**
   * Update Avatar
   */
  async updateAvatar(
    id: string,
    body: UpdateAvatarDto
  ) {
    const user = await userRepository.updateAvatar(
      id,
      body.avatar
    );

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /**
   * Submit Government ID
   */
  async verifyGovernmentId(
    id: string,
    body: VerifyGovernmentIdDto
  ) {
    const user =
      await userRepository.updateGovernmentId(
        id,
        body.governmentIdUrl
      );

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /**
   * Get Pending Verifications (moderator queue)
   */
  async getPendingVerifications() {
    return userRepository.findPendingVerifications();
  }

  /**
   * Approve Or Reject A Submitted Verification
   */
  async moderateVerification(
    userId: string,
    moderatorId: string,
    outcome: "approved" | "rejected",
    note?: string
  ) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.verificationStatus !== "pending") {
      throw new ApiError(
        400,
        "This verification has already been decided."
      );
    }

    const updated = await userRepository.updateVerificationStatus(
      userId,
      outcome
    );

    await notificationService.createAndEmitNotification({
      receiver: userId,
      sender: moderatorId,
      title:
        outcome === "approved"
          ? "ID verification approved"
          : "ID verification rejected",
      message:
        note ||
        (outcome === "approved"
          ? "Your government ID has been verified."
          : "Your government ID submission was rejected."),
      type:
        outcome === "approved"
          ? "verification_approved"
          : "verification_rejected",
    });

    return updated;
  }
}

export default new UserService();