import { RegisterDto, LoginDto } from "../dto/auth.dto";
import ApiError from "../error/ApiError";
import authRepository from "../repositories/auth.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/password";
import { AuthResponse } from "../types/auth.types";
import { IUserResponse } from "../types/user.types";
import User from "../models/user.model";

class AuthService {
  /**
   * Get Current User
   */
  async getCurrentUser(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      trustScore: user.trustScore,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      verificationStatus: user.verificationStatus,
      governmentIdUrl: user.governmentIdUrl || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    };
  }

  /**
   * Refresh Token
   */
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await authRepository.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    await authRepository.saveRefreshToken(user._id.toString(), newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Register User
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const { fullName, email, password, phone, address, bio } = data;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await authRepository.createUser({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
      bio,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await authRepository.saveRefreshToken(user._id.toString(), refreshToken);

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
      governmentIdUrl: user.governmentIdUrl || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    };

    return { user: userResponse, accessToken, refreshToken };
  }

  /**
   * Login User
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatched = await comparePassword(password, user.password);
    if (!passwordMatched) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.isSuspended) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    const userId = String(user._id);
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await authRepository.saveRefreshToken(userId, refreshToken);

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
      governmentIdUrl: user.governmentIdUrl || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    };

    return { user: userResponse, accessToken, refreshToken };
  }
}

export default new AuthService();
