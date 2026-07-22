import { Response, NextFunction } from "express";

import userService from "../services/user.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import { ModerateVerificationDto } from "../dto/user.dto";

import { successResponse } from "../utils/response";

class VerificationController {
  /**
   * GET /api/v1/verifications/pending
   */
  async getPending(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getPendingVerifications();

      successResponse(
        res,
        "Pending verifications fetched successfully.",
        users
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/verifications/:id/approve
   */
  async approve(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: ModerateVerificationDto = req.body;

      const user = await userService.moderateVerification(
        req.params.id as string,
        req.user!.userId,
        "approved",
        body.note
      );

      successResponse(res, "Verification approved.", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/verifications/:id/reject
   */
  async reject(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: ModerateVerificationDto = req.body;

      const user = await userService.moderateVerification(
        req.params.id as string,
        req.user!.userId,
        "rejected",
        body.note
      );

      successResponse(res, "Verification rejected.", user);
    } catch (error) {
      next(error);
    }
  }
}

export default new VerificationController();
