import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { scoringController } from "./scoring.controller";

export const scoringRouter = Router();

// Score attempt endpoint: POST /api/v1/attempts/:attemptId/score
scoringRouter.post(
  "/attempts/:attemptId/score",
  authenticate,
  requireRole("PARTICIPANT"),
  (req, res, next) => scoringController.scoreAttempt(req, res, next)
);

// Result retrieval endpoints
scoringRouter.get(
  "/results/latest",
  authenticate,
  requireRole("PARTICIPANT"),
  (req, res, next) => scoringController.getLatestResult(req, res, next)
);

scoringRouter.get(
  "/results/:resultId",
  authenticate,
  requireRole("PARTICIPANT"),
  (req, res, next) => scoringController.getResultById(req, res, next)
);

scoringRouter.get(
  "/assessments/results/latest",
  authenticate,
  requireRole("PARTICIPANT"),
  (req, res, next) => scoringController.getLatestResult(req, res, next)
);

scoringRouter.get(
  "/assessments/results/:attemptId",
  authenticate,
  requireRole("PARTICIPANT"),
  (req, res, next) => scoringController.getResultByAttemptId(req, res, next)
);
