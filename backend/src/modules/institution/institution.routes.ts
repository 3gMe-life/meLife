import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole, requireDashboardFeature } from "../../middleware/authorization.middleware";
import { institutionController } from "./institution.controller";

const institutionRouter = Router();

// =========================================================================
// PUBLIC STUDENT INVITATION & WEBHOOK ROUTES (No admin auth required)
// =========================================================================
institutionRouter.get(
  "/invitations/validate",
  institutionController.validateInvitationToken
);
institutionRouter.get(
  "/invitations/verify/:token",
  institutionController.validateInvitationToken
);
institutionRouter.post(
  "/invitations/accept",
  institutionController.acceptInvitation
);
institutionRouter.post(
  "/webhooks/resend",
  institutionController.handleResendWebhook
);

// =========================================================================
// PROTECTED INSTITUTION PORTAL ROUTES (Requires authenticated admin)
// =========================================================================
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

// Students Directory
institutionRouter.get(
  "/students",
  institutionController.getStudents
);

// Student Invitations & Campaigns Management
institutionRouter.get(
  "/invitations",
  institutionController.getInvitations
);
institutionRouter.post(
  "/invitations",
  institutionController.inviteStudent
);
institutionRouter.post(
  "/invitations/bulk",
  institutionController.bulkImportStudents
);
institutionRouter.post(
  "/invitations/:id/resend",
  institutionController.resendInvitation
);
institutionRouter.post(
  "/invitations/:id/revoke",
  institutionController.revokeInvitation
);

// Invitation Campaigns
institutionRouter.get(
  "/campaigns",
  institutionController.getCampaigns
);
institutionRouter.get(
  "/campaigns/:id",
  institutionController.getCampaignDetails
);
institutionRouter.post(
  "/campaigns/:id/retry-failed",
  institutionController.retryFailedCampaign
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
