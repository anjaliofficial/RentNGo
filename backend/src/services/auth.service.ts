import { RegisterDto } from "../dto/auth.dto";
import ApiError from "../error/ApiError";
import authRepository from "../repositories/auth.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { hashPassword } from "../utils/password";
import { AuthResponse } from "../types/auth.types";
import { IUserResponse } from "../types/user.types";

import { LoginDto } from "../dto/auth.dto";
import { comparePassword } from "../utils/password";

class AuthService {
  getCurrentUser(userId: string) {
    throw new Error("Method not implemented.");
  }
  refreshToken(refreshToken: any) {
    throw new Error("Method not implemented.");
  }
  /**
   * Register User
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const { fullName, email, password } = data;

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await authRepository.createUser({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token
    await authRepository.saveRefreshToken(
      user._id.toString(),
      refreshToken
    );

    // User response (hide sensitive data)
    const userResponse: IUserResponse = {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      trustScore: user.trustScore,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

/**
 * Login User
 */
async login(data: LoginDto) {
  const { email, password } = data;

  // Find user
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const passwordMatched = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatched) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userId = String(user._id);

  // Generate Tokens
  const accessToken = generateAccessToken(userId);

  const refreshToken = generateRefreshToken(userId);

  // Save Refresh Token
  await authRepository.saveRefreshToken(
    userId,
    refreshToken
  );

  const userResponse: IUserResponse = {
    _id: userId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar || "",
    trustScore: user.trustScore,
    emailVerified: user.emailVerified,
    mfaEnabled: user.mfaEnabled,
    verificationStatus: user.verificationStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
}
}
export default new AuthService();