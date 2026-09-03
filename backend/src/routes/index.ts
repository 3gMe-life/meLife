import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { studentRouter } from "../modules/students/student.routes";
import { participantRouter } from "../modules/participants/participant.routes";
import { assessmentRouter } from "../modules/assessments/assessment.routes";
import { assessmentController } from "../modules/assessments/assessment.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { requireRole } from "../middleware/authorization.middleware";

const apiRouter = Router();

// Mount system health routes
apiRouter.use(healthRoutes);

// Mount authentication module routes (/api/v1/auth)
apiRouter.use("/auth", authRouter);

// Mount participant module routes (/api/v1/participant & /api/v1/participants)
apiRouter.use("/participant", participantRouter);
apiRouter.use("/participants", participantRouter);

// Mount assessment module routes (/api/v1/assessments)
apiRouter.use("/assessments", assessmentRouter);

// Mount attempt routes (/api/v1/attempts)
const attemptRouter = Router();
attemptRouter.use(authenticate);
attemptRouter.use(requireRole("PARTICIPANT"));
attemptRouter.get("/:attemptId/questions", assessmentController.getAttemptQuestions);
attemptRouter.post("/:attemptId/responses", assessmentController.saveResponse);
attemptRouter.post("/:attemptId/submit", assessmentController.submitAttempt);
apiRouter.use("/attempts", attemptRouter);

// Mount result routes (/api/v1/results)
const resultRouter = Router();
resultRouter.use(authenticate);
resultRouter.use(requireRole("PARTICIPANT"));
resultRouter.get("/:attemptId", assessmentController.getAttemptResult);
apiRouter.use("/results", resultRouter);

// Mount student module routes (/api/v1/students) for backward compatibility
apiRouter.use("/students", studentRouter);

export { apiRouter };
