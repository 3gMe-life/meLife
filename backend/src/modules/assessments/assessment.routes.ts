import { Router } from "express";
import { assessmentController } from "./assessment.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";

const assessmentRouter = Router();

// Protect all assessment endpoints
assessmentRouter.use(authenticate);
assessmentRouter.use(requireRole("PARTICIPANT"));

/**
 * Catalog & Eligibility Endpoints
 */
assessmentRouter.get("/", assessmentController.getParticipantAssessments);
assessmentRouter.get("/available", assessmentController.getParticipantAssessments);

/**
 * Retake, History Ledger & Longitudinal Comparison Endpoints
 */
assessmentRouter.get("/compare/latest", assessmentController.compareLatestResults);
assessmentRouter.get("/compare", assessmentController.compareResults);
assessmentRouter.post("/:assessmentCode/retake", assessmentController.startRetake);
assessmentRouter.get("/:assessmentCode/history", assessmentController.getAssessmentHistory);

/**
 * Assessment Runner Lifecycle Endpoints
 */
assessmentRouter.post("/:code/start", assessmentController.startAssessment);
assessmentRouter.get("/attempts/:attemptId/questions", assessmentController.getAttemptQuestions);
assessmentRouter.post("/attempts/:attemptId/responses", assessmentController.saveResponse);
assessmentRouter.post("/attempts/:attemptId/submit", assessmentController.submitAttempt);
assessmentRouter.get("/results", assessmentController.getAllUserResults);
assessmentRouter.get("/results/latest", assessmentController.getAttemptResult);
assessmentRouter.get("/results/:attemptId", assessmentController.getAttemptResult);

export { assessmentRouter };
