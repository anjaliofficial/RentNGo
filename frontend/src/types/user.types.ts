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
