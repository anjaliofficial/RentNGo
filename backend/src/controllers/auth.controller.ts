import { Request, Response, NextFunction } from "express";

import authService from "../services/auth.service";

import { RegisterDto } from "../dto/auth.dto";

import { createdResponse } from "../utils/response";

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
}

export default new AuthController();