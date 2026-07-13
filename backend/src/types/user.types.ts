import { Document } from "mongoose";
import { UserRole, VerificationStatus } from "../models/user.model";

export interface IUser extends Document {
  fullName: string;

  email: string;

  password: string;

  role: UserRole;

  avatar?: string;

  trustScore: number;

  emailVerified: boolean;

  mfaEnabled: boolean;

  verificationStatus: VerificationStatus;

  refreshToken?: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;

  fullName: string;

  email: string;

  role: UserRole;

  avatar: string;

  trustScore: number;

  emailVerified: boolean;

  mfaEnabled: boolean;

  verificationStatus: VerificationStatus;

  createdAt: Date;

  updatedAt: Date;
}