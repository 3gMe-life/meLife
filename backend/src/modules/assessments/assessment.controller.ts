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
      const result = await assessmentRunnerService.startOrCreateAttempt(userId, code);

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

      const data = await assessmentRunnerService.getAttemptQuestions(userId, attemptId);

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
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required", "ATTEMPT_ID_REQUIRED");
      }

      const result = await assessmentRunnerService.submitAttempt(userId, attemptId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/results/:attemptId
   * Retrieves the computed result snapshot for an attempt.
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
      if (!attemptId) {
        throw AppError.badRequest("Attempt ID is required", "ATTEMPT_ID_REQUIRED");
      }

      const result = await assessmentRunnerService.getAttemptResult(userId, attemptId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const assessmentController = new AssessmentController();
