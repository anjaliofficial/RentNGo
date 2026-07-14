import User from "../models/user.model";
import { IUser } from "../types/user.types";

class AuthRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("+password +refreshToken");
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select("+refreshToken");
  }

  /**
   * Create user
   */
  async createUser(user: Partial<IUser>): Promise<IUser> {
    return User.create(user);
  }

  /**
   * Save Refresh Token
   */
  async saveRefreshToken(
    id: string,
    refreshToken: string
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      refreshToken,
    });
  }

  /**
   * Remove Refresh Token
   */
  async removeRefreshToken(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      refreshToken: "",
    });
  }

  /**
   * Verify Refresh Token
   */
  async findByRefreshToken(
    refreshToken: string
  ): Promise<IUser | null> {
    return User.findOne({ refreshToken }).select("+refreshToken");
  }
}

export default new AuthRepository();