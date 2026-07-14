import { Request, Response, NextFunction } from "express";

import equipmentService from "../services/equipment.service";

import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../dto/equipment.dto";

import { AuthRequest } from "../middlewares/auth.middleware";

import {
  createdResponse,
  successResponse,
} from "../utils/response";

class EquipmentController {
  /**
   * POST /api/v1/equipment
   */
  async createEquipment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: CreateEquipmentDto = req.body;

      const equipment =
        await equipmentService.createEquipment(
          req.user!.userId,
          body
        );

      createdResponse(
        res,
        "Equipment created successfully.",
        equipment
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/equipment
   */
  async getAllEquipment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const equipment =
        await equipmentService.getAllEquipment();

      successResponse(
        res,
        "Equipment fetched successfully.",
        equipment
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/equipment/:id
   */
  async getEquipmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id ?? "";

      const equipment = await equipmentService.getEquipmentById(id);

      successResponse(
        res,
        "Equipment fetched successfully.",
        equipment
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/equipment/my-items
   */
  async getMyEquipment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const equipment =
        await equipmentService.getMyEquipment(
          req.user!.userId
        );

      successResponse(
        res,
        "Your equipment fetched successfully.",
        equipment
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/equipment/:id
   */
  async updateEquipment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: UpdateEquipmentDto = req.body;

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id ?? "";

      const equipment = await equipmentService.updateEquipment(
        id,
        req.user!.userId,
        body
      );

      successResponse(
        res,
        "Equipment updated successfully.",
        equipment
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/equipment/:id
   */
  async deleteEquipment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id ?? "";

      const result = await equipmentService.deleteEquipment(
        id,
        req.user!.userId
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
}

export default new EquipmentController();