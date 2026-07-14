import { Response } from "express";

/**
 * Success Response
 */
export const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  errors: unknown = null
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Created Response (201)
 */
export const createdResponse = (
  res: Response,
  message: string,
  data: unknown = null
): Response => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

/**
 * No Content Response (204)
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};