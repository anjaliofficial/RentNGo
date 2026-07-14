import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

/**
 * Environment Variables
 */
const ACCESS_TOKEN_SECRET: Secret =
  process.env.JWT_SECRET || "access_secret";

const REFRESH_TOKEN_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET || "refresh_secret";

const ACCESS_TOKEN_EXPIRES =
  process.env.JWT_EXPIRES_IN || "15m";

const REFRESH_TOKEN_EXPIRES =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * Generate Access Token
 */
export const generateAccessToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    } as SignOptions
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    } as SignOptions
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    ACCESS_TOKEN_SECRET
  ) as JwtPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as JwtPayload;
};