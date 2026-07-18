import { Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import { AuthRequest } from "./auth.middleware";

/**
 * Any regular member — every authenticated user can both book and list
 * equipment, regardless of which role they registered with.
 */
export const MEMBER_ROLES = ["customer", "owner"];

export const authorize =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You don't have permission to access this resource."
        )
      );
    }

    next();
  };