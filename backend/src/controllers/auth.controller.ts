import { Request, Response, NextFunction } from "express";

import authService from "../services/auth.service";

import { LoginDto, RegisterDto } from "../dto/auth.dto";


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

}

export default new AuthController();