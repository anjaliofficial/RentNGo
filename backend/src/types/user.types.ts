import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  role: string;

  avatar: string;

  phone: string;

  address: string;

  bio: string;

  trustScore: number;

  emailVerified: boolean;

  mfaEnabled: boolean;

  verificationStatus: string;

  governmentIdUrl: string;

  isSuspended: boolean;

  refreshToken: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;

  fullName: string;

  email: string;

  role: string;

  avatar: string;

  phone: string;

  address: string;

  bio: string;

  trustScore: number;

  emailVerified: boolean;

  mfaEnabled: boolean;

  verificationStatus: string;

  governmentIdUrl: string;

  createdAt: Date;

  updatedAt: Date;
}