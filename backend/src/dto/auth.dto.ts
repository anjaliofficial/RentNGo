/**
 * Register User DTO
 */
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  bio?: string;
}

/**
 * Login DTO
 */
export interface LoginDto {
  email: string;

  password: string;
}

/**
 * Refresh Token DTO
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Forgot Password DTO
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * Reset Password DTO
 */
export interface ResetPasswordDto {
  token: string;

  password: string;

  confirmPassword: string;
}

/**
 * Verify Email DTO
 */
export interface VerifyEmailDto {
  token: string;
}

/**
 * Change Password DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

/**
 * Enable MFA DTO
 */
export interface EnableMFADto {
  secret: string;
}

/**
 * Verify MFA DTO
 */
export interface VerifyMFADto {
  code: string;
}