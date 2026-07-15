import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createdResponse,
  successResponse,
} from "../utils/response";

class UploadController {
  /**
   * POST /api/v1/upload
   * Upload Single Image
   */
  async uploadSingle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        successResponse(
          res,
          "No image uploaded."
        );
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      createdResponse(
        res,
        "Image uploaded successfully.",
        {
          imageUrl,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/upload/multiple
   * Upload Multiple Images
   */
  async uploadMultiple(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.files) {
        successResponse(
          res,
          "No images uploaded."
        );
        return;
      }

      const files =
        req.files as Express.Multer.File[];

      const images = files.map(
        (file) =>
          `/uploads/${file.filename}`
      );

      createdResponse(
        res,
        "Images uploaded successfully.",
        {
          images,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();