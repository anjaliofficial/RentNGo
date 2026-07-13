export interface JwtPayload {
  userId: string;
}

export interface LoginResponse {
  accessToken: string;

  refreshToken: string;
}