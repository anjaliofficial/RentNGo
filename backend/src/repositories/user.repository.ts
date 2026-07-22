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

  /**
   * Find Customers/Owners (Admin: Manage Users)
   */
  async findCustomers(search?: string): Promise<IUser[]> {
    const filter: Record<string, unknown> = {
      role: { $in: ["customer", "owner"] },
    };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ fullName: regex }, { email: regex }];
    }

    return User.find(filter as any).sort({ createdAt: -1 });
  }

  /**
   * Find Moderators (Admin: Manage Moderators)
   */
  async findModerators(): Promise<IUser[]> {
    return User.find({ role: "moderator" } as any).sort({
      createdAt: -1,
    });
  }

  /**
   * Suspend Or Reinstate A User
   */
  async setSuspended(
    id: string,
    isSuspended: boolean
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { isSuspended },
      { new: true }
    );
  }

  /**
   * Set Role (Promote/Demote)
   */
  async setRole(id: string, role: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
  }
}

export default new UserRepository();