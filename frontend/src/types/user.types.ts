export interface PublicProfile {
  _id: string;
  fullName: string;
  avatar: string;
  trustScore: number;
  verificationStatus: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  completedRentals: number;
}

export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
