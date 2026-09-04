import { Request, Response, NextFunction } from "express";
import { scoringService } from "./scoring.service";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";

export class ScoringController {
  /**
   * POST /api/v1/attempts/:attemptId/score
   * Scores and finalizes the assessment attempt.
   */
  async scoreAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required.", "MISSING_ATTEMPT_ID");
      }

      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      const response = await scoringService.scoreAndFinalizeAttempt(
        userId,
        attemptId,
        languageCode
      );

      res.status(HttpStatus.OK).json({
        success: true,
        status: "completed",
        message: "Assessment scored and finalized successfully.",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/results/:resultId
   * Retrieves student-safe psychometric result by result ID.
   */
  async getResultById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const paramResultId = req.params.resultId;
      const resultId = Array.isArray(paramResultId) ? paramResultId[0] : paramResultId;
      if (!resultId) {
        throw AppError.badRequest("Result ID is required.", "MISSING_RESULT_ID");
      }

      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      const result = await scoringService.getResultById(userId, resultId, languageCode);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/assessments/results/:attemptId
   * Retrieves student-safe psychometric result by attempt ID.
   */
  async getResultByAttemptId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required.", "MISSING_ATTEMPT_ID");
      }

      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      const result = await scoringService.getResultByAttemptId(
        userId,
        attemptId,
        languageCode
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/assessments/results/latest
   * Retrieves participant's latest completed assessment result.
   */
  async getLatestResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      const result = await scoringService.getLatestResultForUser(userId, languageCode);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const scoringController = new ScoringController();
