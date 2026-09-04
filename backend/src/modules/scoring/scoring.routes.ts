import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { scoringController } from "./scoring.controller";

export const scoringRouter = Router();

// All scoring & result endpoints require valid PARTICIPANT authentication
scoringRouter.use(authenticate);
scoringRouter.use(requireRole("PARTICIPANT"));

// Score attempt endpoint: POST /api/v1/attempts/:attemptId/score
scoringRouter.post(
  "/attempts/:attemptId/score",
  (req, res, next) => scoringController.scoreAttempt(req, res, next)
);

// Result retrieval endpoints
scoringRouter.get(
  "/results/latest",
  (req, res, next) => scoringController.getLatestResult(req, res, next)
);

scoringRouter.get(
  "/results/:resultId",
  (req, res, next) => scoringController.getResultById(req, res, next)
);

scoringRouter.get(
  "/assessments/results/latest",
  (req, res, next) => scoringController.getLatestResult(req, res, next)
);

scoringRouter.get(
  "/assessments/results/:attemptId",
  (req, res, next) => scoringController.getResultByAttemptId(req, res, next)
);
