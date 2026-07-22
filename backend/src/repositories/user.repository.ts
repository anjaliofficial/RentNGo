import User from "../models/user.model";
import { IUser } from "../types/user.types";

class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  /**
   * Update profile
   */
  async updateProfile(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update password
   */
  async updatePassword(
    id: string,
    password: string
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        password,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update avatar
   */
  async updateAvatar(
    id: string,
    avatar: string
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        avatar,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Save Government ID
   */
  async updateGovernmentId(
    id: string,
    governmentIdUrl: string
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        governmentIdUrl,
        verificationStatus: "pending",
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update Verification Status
   */
  async updateVerificationStatus(
    id: string,
    status: string
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        verificationStatus: status,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Find Pending Verifications (submitted, awaiting moderator decision)
   */
  async findPendingVerifications(): Promise<IUser[]> {
    return User.find({
      verificationStatus: "pending",
      governmentIdUrl: { $ne: "" },
    }).sort({ updatedAt: -1 });
  }
}

export default new UserRepository();