import { Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import { AuthRequest } from "./auth.middleware";

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