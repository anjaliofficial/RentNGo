import { Response, NextFunction } from "express";

import disputeService from "../services/dispute.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import { CreateDisputeDto, ResolveDisputeDto } from "../dto/dispute.dto";

import { createdResponse, successResponse } from "../utils/response";

class DisputeController {
  /**
   * POST /api/v1/disputes
   */
  async createDispute(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: CreateDisputeDto = req.body;

      const dispute = await disputeService.fileDispute(
        req.user!.userId,
        body
      );

      createdResponse(res, "Dispute filed successfully.", dispute);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/disputes/open
   */
  async getOpenDisputes(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const disputes = await disputeService.getOpenDisputes();

      successResponse(res, "Open disputes fetched successfully.", disputes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/disputes/:id
   */
  async getDisputeById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dispute = await disputeService.getDisputeById(
        req.params.id as string,
        req.user!.userId,
        req.user!.role
      );

      successResponse(res, "Dispute fetched successfully.", dispute);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/disputes/:id/resolve
   */
  async resolveDispute(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: ResolveDisputeDto = req.body;

      const dispute = await disputeService.resolveDispute(
        req.params.id as string,
        req.user!.userId,
        body
      );

      successResponse(res, "Dispute resolved successfully.", dispute);
    } catch (error) {
      next(error);
    }
  }
}

export default new DisputeController();
