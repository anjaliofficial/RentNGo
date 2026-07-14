import { Request, Response, NextFunction } from "express";

import authService from "../services/auth.service";

import { LoginDto, RegisterDto } from "../dto/auth.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

import {
  createdResponse,
  successResponse,
} from "../utils/response";

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: RegisterDto = req.body;

      const result = await authService.register(body);

      createdResponse(
        res,
        "User registered successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }
  /**
 * POST /api/v1/auth/login
 */
async login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: LoginDto = req.body;

    const result = await authService.login(body);

    successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    next(error);
  }
}
/**
 * GET /api/v1/auth/me
 */
async me(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.getCurrentUser(
      req.user!.userId
    );

    successResponse(
      res,
      "Current user fetched successfully.",
      result
    );
  } catch (error) {
    next(error);
  }
}


/**
 * POST /api/v1/auth/refresh
 */
async refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(
      refreshToken
    );

    successResponse(
      res,
      "Token refreshed successfully.",
      result
    );
  } catch (error) {
    next(error);
  }
}



/**
 * POST /api/v1/auth/logout
 */
async logout(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // authService.logout may not be defined on the AuthService type in some implementations;
    // use a type assertion to any to call it if available at runtime.
    if ((authService as any).logout) {
      await (authService as any).logout(req.user!.userId);
    }

successResponse(
  res,
  "Logged out successfully.",
  null
);
  } catch (error) {
    next(error);
  }
}


}

export default new AuthController();