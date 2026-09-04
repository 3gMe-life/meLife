import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { careerRecommendationService } from "./career-recommendation.service";
import { careerRepository } from "./career.repository";

export class CareerController {
  /**
   * GET /api/v1/careers
   * Retrieves all available career pathways with optional search / category filters.
   */
  async getAllCareers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const languageCode = (req.query.language as string) || (req.query.lang as string) || "en";
      const category = req.query.category as string;
      const search = req.query.search as string;

      let careers = await careerRepository.findAllCareers(languageCode);

      if (category && category !== "ALL") {
        careers = careers.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
      }

      if (search) {
        const query = search.toLowerCase().trim();
        careers = careers.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.required_skills.some((s) => s.toLowerCase().includes(query))
        );
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: careers,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/careers/recommendations
   * Retrieves ranked career pathway recommendations personalized to the participant's
   * psychometric results.
   */
  async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const languageCode = (req.query.language as string) || (req.query.lang as string) || "en";

      const data = await careerRecommendationService.getRecommendedPathways(
        req.user.id,
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
