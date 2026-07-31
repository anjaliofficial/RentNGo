import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Malformed input that reached the database layer (bad ObjectId, failed
  // schema validation, invalid regex, etc.) is a client mistake, not a
  // server failure — respond 400 instead of leaking a raw 500.
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "MongoServerError"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data.",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};