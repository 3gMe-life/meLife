import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { reportController } from "./report.controller";

const reportRouter = Router();

// All report endpoints require authentication
reportRouter.use(authenticate);

/**
 * Report Generation & Retrieval Routes
 */
reportRouter.post(
  "/generate/:resultId",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  reportController.generateReport
);

reportRouter.get(
  "/participant/latest",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  reportController.getLatestReport
);

reportRouter.get(
  "/result/:resultId",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  reportController.getReportByResultId
);

reportRouter.get(
  "/:reportId/download",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  reportController.downloadReportPdf
);

reportRouter.get(
  "/:reportId",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  reportController.getReportById
);

export { reportRouter };
