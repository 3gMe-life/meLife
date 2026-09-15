import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { careerRecommendationService, GetRecommendedPathwaysOptions } from "./career-recommendation.service";
import { careerRepository } from "./career.repository";
import { CareerTier } from "./career.types";

export class CareerController {
  /**
   * GET /api/v1/careers
   * Retrieves all available career pathways with optional search / domain / category filters.
   */
  async getAllCareers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const languageCode = (req.query.language as string) || (req.query.lang as string) || "en";
      const domainCode = req.query.domain as string || req.query.domainCode as string;
      const familyCode = req.query.family as string || req.query.familyCode as string;
      const clusterCode = req.query.cluster as string || req.query.clusterCode as string;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const isEmerging = req.query.isEmerging !== undefined ? req.query.isEmerging === "true" : undefined;

      const careers = await careerRepository.findAllCareers({
        languageCode,
        domainCode,
        familyCode,
        clusterCode,
        category,
        search,
        page,
        limit,
        isEmerging,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: careers,
        total: careers.length,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/careers/recommendations
   * Retrieves ranked career pathway recommendations personalized to the participant's
   * psychometric results across multiple assessments.
   */
  async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const languageCode = (req.query.language as string) || (req.query.lang as string) || "en";
      const tier = req.query.tier as CareerTier | "ALL" | undefined;
      const domainCode = (req.query.domain as string) || (req.query.domainCode as string);
      const familyCode = (req.query.family as string) || (req.query.familyCode as string);
      const clusterCode = (req.query.cluster as string) || (req.query.clusterCode as string);
      const search = req.query.search as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const viewAll = req.query.viewAll === "true" || req.query.all === "true";

      const options: GetRecommendedPathwaysOptions = {
        languageCode,
        tier,
        domainCode,
        familyCode,
        clusterCode,
        search,
        page,
        limit,
        viewAll,
      };

      const data = await careerRecommendationService.getRecommendedPathways(
        req.user.id,
        options
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/careers/:idOrSlug
   * Retrieves full career pathway details, educational roadmap, and student match notes.
   */
  async getCareerDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const idOrSlug = String(req.params.idOrSlug);
      const languageCode = (req.query.language as string) || (req.query.lang as string) || "en";

      const data = await careerRecommendationService.getCareerDetail(
        req.user.id,
        idOrSlug,
        languageCode
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const careerController = new CareerController();
