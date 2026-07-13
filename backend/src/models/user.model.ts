import { Schema, model } from "mongoose";
import { IUser } from "../types/user.types";

export enum UserRole {
  CUSTOMER = "customer",
  OWNER = "owner",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },

    avatar: {
      type: String,
      default: "",
    },

    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    mfaEnabled: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);