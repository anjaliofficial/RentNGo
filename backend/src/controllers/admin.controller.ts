import { Response, NextFunction } from "express";

import adminService from "../services/admin.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import { successResponse } from "../utils/response";

class AdminController {
  /**
   * GET /api/v1/admin/users
   */
  async getCustomers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const search = req.query.search as string | undefined;

      const users = await adminService.listCustomers(search);

      successResponse(res, "Users fetched successfully.", users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id/suspend
   */
  async suspendUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await adminService.suspendUser(
        req.user!.userId,
        req.params.id as string
      );

      successResponse(res, "User suspended.", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id/reinstate
   */
  async reinstateUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await adminService.reinstateUser(
        req.params.id as string
      );

      successResponse(res, "User reinstated.", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/moderators
   */
  async getModerators(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const moderators = await adminService.listModerators();

      successResponse(res, "Moderators fetched successfully.", moderators);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/moderators/:id/promote
   */
  async promoteModerator(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await adminService.promoteToModerator(
        req.params.id as string
      );

      successResponse(res, "User promoted to moderator.", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/moderators/:id/demote
   */
  async demoteModerator(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await adminService.demoteModerator(
        req.params.id as string
      );

      successResponse(res, "Moderator demoted.", user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
