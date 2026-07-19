import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwt";
import User from "../models/user.model";
import ApiError from "../error/ApiError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ApiError(401, "Access token expired");
      }
      if (err instanceof JsonWebTokenError) {
        throw new ApiError(401, "Invalid access token");
      }
      throw err;
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = {
      userId: String(user._id),
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};