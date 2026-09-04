import { Request, Response, NextFunction } from "express";
import { assessmentEligibilityService } from "./assessment-eligibility.service";
import { assessmentRunnerService } from "./assessment-runner.service";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";

export class AssessmentController {
  /**
   * GET /api/v1/participant/assessments or /api/v1/assessments/available
   * Retrieves all eligible assessments for the authenticated participant.
   */
  async getParticipantAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const data = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/assessments/:code/start
   * Starts or resumes an attempt for the specified assessment code.
   */
  async startAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const paramCode = req.params.code;
      const code = Array.isArray(paramCode) ? paramCode[0] : paramCode || "SKILL_FINDER";
      const versionCode = (req.body?.versionCode || req.query?.versionCode || req.query?.version || undefined) as string | undefined;
      const result = await assessmentRunnerService.startOrCreateAttempt(userId, code, versionCode);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/attempts/:attemptId/questions
   * Retrieves sanitized questions with existing responses for the runner.
   */
  async getAttemptQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required", "ATTEMPT_ID_REQUIRED");
      }

      const rawLang = req.query.language || req.headers["accept-language"] || "en";
      const language = Array.isArray(rawLang) ? String(rawLang[0]) : String(rawLang);

      const data = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, language);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/attempts/:attemptId/responses
   * Saves a participant's response to a question.
   */
  async saveResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required", "ATTEMPT_ID_REQUIRED");
      }

      const { questionId, selectedOptionId, responseValue } = req.body;

      if (!questionId) {
        throw AppError.badRequest("Question ID is required", "QUESTION_ID_REQUIRED");
      }

      const result = await assessmentRunnerService.saveResponse(userId, attemptId, {
        questionId,
        selectedOptionId,
        responseValue: String(responseValue ?? ""),
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/attempts/:attemptId/submit
   * Finalizes the assessment attempt and computes the result.
   */
  async submitAttempt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;
      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      const result = await assessmentRunnerService.submitAttempt(
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
   * GET /api/v1/assessments/results/:attemptId
   * Retrieves the computed result snapshot for an attempt or the latest completed attempt.
   */
  async getAttemptResult(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const paramAttemptId = req.params.attemptId;
      const attemptId = Array.isArray(paramAttemptId) ? paramAttemptId[0] : paramAttemptId;

      const languageCode =
        (req.query.language as string) ||
        (req.headers["accept-language"] as string) ||
        "en";

      if (!attemptId || attemptId === "latest") {
        const latestResult = await assessmentRunnerService.getLatestUserResult(
          userId,
          languageCode
        );
        res.status(HttpStatus.OK).json({
          success: true,
          data: latestResult,
        });
        return;
      }

      const result = await assessmentRunnerService.getAttemptResult(
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
   * GET /api/v1/assessments/results
   * Retrieves all completed assessment results for the participant.
   */
  async getAllUserResults(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const results = await assessmentRunnerService.getAllUserResults(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const assessmentController = new AssessmentController();
