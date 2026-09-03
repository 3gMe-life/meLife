import { Request, Response, NextFunction } from "express";
import { participantService } from "./participant.service";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";

export class ParticipantController {
  /**
   * GET /api/v1/participant/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const profile = await participantService.getProfile(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/participant/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const profile = await participantService.updateProfile(userId, req.body);

      res.status(HttpStatus.OK).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/participant/onboarding
   */
  async getOnboardingState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const state = await participantService.getOnboardingState(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: state,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/participant/onboarding
   */
  async completeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const result = await participantService.completeOnboarding(userId, req.body);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const participantController = new ParticipantController();
