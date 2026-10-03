import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { studentRouter } from "../modules/students/student.routes";
import { participantRouter } from "../modules/participants/participant.routes";
import { assessmentRouter } from "../modules/assessments/assessment.routes";
import { assessmentController } from "../modules/assessments/assessment.controller";
import { scoringRouter } from "../modules/scoring/scoring.routes";
import { reportRouter } from "../modules/reports/report.routes";
import { careerRouter } from "../modules/careers/career.routes";
import { careerReportRouter } from "../modules/careers/reports/career-report.routes";
import { counsellorsRouter, counsellingRouter, notificationRouter } from "../modules/counselling/counselling.routes";
import { parentRouter } from "../modules/parent/parent.routes";
import { institutionRouter } from "../modules/institution/institution.routes";
import { companyRouter } from "../modules/company/company.routes";
import { authenticate } from "../middleware/authenticate.middleware";
import { requireRole } from "../middleware/authorization.middleware";

const apiRouter = Router();

// Mount system health routes
apiRouter.use(healthRoutes);

// Mount administrative management module routes (/api/v1/admin)
apiRouter.use("/admin", adminRouter);

// Mount company tenant management module routes (/api/v1/company)
apiRouter.use("/company", companyRouter);

// Mount authentication module routes (/api/v1/auth)
apiRouter.use("/auth", authRouter);

// Mount participant module routes (/api/v1/participant & /api/v1/participants)
apiRouter.use("/participant", participantRouter);
apiRouter.use("/participants", participantRouter);

// Mount assessment module routes (/api/v1/assessments)
apiRouter.use("/assessments", assessmentRouter);

// Mount scoring & result routes
apiRouter.use(scoringRouter);

// Mount reports module routes (/api/v1/reports)
apiRouter.use("/reports", reportRouter);

// Mount career pathways module routes (/api/v1/careers)
apiRouter.use("/careers", careerRouter);

// Mount career exploration reports module routes (/api/v1/career-reports)
apiRouter.use("/career-reports", careerReportRouter);

// Mount counsellor directory & connect routes (/api/v1/counsellors & /api/v1/counselling & /api/v1/counsellor & /api/v1/student/counsellors)
apiRouter.use("/counsellors", counsellorsRouter);
apiRouter.use("/student/counsellors", counsellorsRouter);
apiRouter.use("/counselling", counsellingRouter);
apiRouter.use("/counsellor", counsellingRouter);

// Mount parent connect routes (/api/v1/parent)
apiRouter.use("/parent", parentRouter);

// Mount institution portal routes (/api/v1/institution & /api/v1/institutions)
apiRouter.use("/institution", institutionRouter);
apiRouter.use("/institutions", institutionRouter);

// Mount user notifications routes (/api/v1/notifications)
apiRouter.use("/notifications", notificationRouter);

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
resultRouter.get("/compare/latest", assessmentController.compareLatestResults);
resultRouter.get("/compare", assessmentController.compareResults);
resultRouter.get("/history", assessmentController.getAssessmentHistory);
resultRouter.get("/latest", assessmentController.getAttemptResult);
resultRouter.get("/:attemptId", assessmentController.getAttemptResult);
apiRouter.use("/results", resultRouter);

// Mount student module routes (/api/v1/students) for backward compatibility
apiRouter.use("/students", studentRouter);

export { apiRouter };
