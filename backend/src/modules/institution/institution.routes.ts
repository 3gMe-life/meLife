import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole, requireDashboardFeature } from "../../middleware/authorization.middleware";
import { institutionController } from "./institution.controller";

const institutionRouter = Router();

// All institution routes require authentication and appropriate roles
institutionRouter.use(authenticate);
institutionRouter.use(
  requireRole("INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN")
);

// Institution overview & metrics
institutionRouter.get(
  "/overview",
  requireDashboardFeature("dashboard.overview"),
  institutionController.getOverview
);

// Institution profile
institutionRouter.get(
  "/profile",
  requireDashboardFeature("dashboard.overview"),
  institutionController.getProfile
);
institutionRouter.put(
  "/profile",
  requireDashboardFeature("dashboard.overview"),
  institutionController.updateProfile
);

// Classes & Cohorts
institutionRouter.get(
  "/classes",
  institutionController.getClasses
);
institutionRouter.post(
  "/classes",
  institutionController.createClass
);

// Students
institutionRouter.get(
  "/students",
  institutionController.getStudents
);

// Assessments
institutionRouter.get(
  "/assessments",
  institutionController.getAssessments
);
institutionRouter.post(
  "/assessments/assign",
  institutionController.assignAssessment
);

export { institutionRouter };
