import { IUserResponse } from "./user.types";

export interface JwtPayload {
  userId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserRequest {
  userId: string;
}

export interface VerifyTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}