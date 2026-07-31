import { Request, Response, NextFunction } from "express";

import userService from "../services/user.service";

import {
  UpdateProfileDto,
  ChangePasswordDto,
  UpdateAvatarDto,
  VerifyGovernmentIdDto,
} from "../dto/user.dto";

import { AuthRequest } from "../middlewares/auth.middleware";

import { successResponse } from "../utils/response";

class UserController {
  /**
   * GET /api/v1/users/:id/public-profile
   */
  async getPublicProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id ?? "";

      const profile = await userService.getPublicProfile(id);

      successResponse(
        res,
        "Public profile fetched successfully.",
        profile
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/profile
   */
  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.getProfile(
        req.user!.userId
      );

      successResponse(
        res,
        "Profile fetched successfully.",
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/profile
   */
  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // ---------------------------------------------------------------
      // BEFORE (vulnerable) - Finding 2: Mass Assignment / Privilege Escalation
      // `req.body` was cast directly to UpdateProfileDto. That cast is a
      // compile-time-only type annotation with no runtime effect, so any
      // extra field a client sent (e.g. "role": "admin", "trustScore": 100)
      // passed straight through to the database update untouched:
      //
      //   const body: UpdateProfileDto = req.body;
      //
      // ---------------------------------------------------------------
      // AFTER (fixed): explicitly whitelist only the editable fields.
      // Anything else the client tries to smuggle in is silently dropped.
      const { fullName, phone, address, bio } = req.body;
      const body: UpdateProfileDto = { fullName, phone, address, bio };

      const user = await userService.updateProfile(
        req.user!.userId,
        body
      );

      successResponse(
        res,
        "Profile updated successfully.",
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/change-password
   */
  async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: ChangePasswordDto = req.body;

      const result = await userService.changePassword(
        req.user!.userId,
        body
      );

      successResponse(
        res,
        result.message,
        null
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/avatar
   */
  async updateAvatar(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: UpdateAvatarDto = req.body;

      const user = await userService.updateAvatar(
        req.user!.userId,
        body
      );

      successResponse(
        res,
        "Avatar updated successfully.",
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/verify-id
   */
  async verifyGovernmentId(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: VerifyGovernmentIdDto = req.body;

      const user =
        await userService.verifyGovernmentId(
          req.user!.userId,
          body
        );

      successResponse(
        res,
        "Government ID submitted successfully.",
        user
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();