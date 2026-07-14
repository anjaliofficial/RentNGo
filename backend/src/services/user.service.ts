import userRepository from "../repositories/user.repository";

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
}

export default new UserService();