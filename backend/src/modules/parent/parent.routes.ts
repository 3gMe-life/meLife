import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole, requireParentOfStudent } from "../../middleware/authorization.middleware";
import { parentController } from "./parent.controller";

const parentRouter = Router();

// =========================================================================
// 1. PUBLIC INVITATION VERIFICATION
// =========================================================================
/**
 * POST /api/v1/parent/invitations/verify
 * Public endpoint to safely verify an invitation code and preview student name & grade.
 */
parentRouter.post(
  "/invitations/verify",
  parentController.verifyInvitation
);

// =========================================================================
// 2. STUDENT INVITATION GENERATION & GUARDIAN MANAGEMENT
// =========================================================================
/**
 * POST /api/v1/parent/invitations/create
 * Student generates a secure MLP-XXXX-XXXX invitation code.
 */
parentRouter.post(
  "/invitations/create",
  authenticate,
  requireRole("PARTICIPANT"),
  parentController.createInvitation
);

/**
 * GET /api/v1/parent/invitations/active
 * Student retrieves their currently active unexpired invitation.
 */
parentRouter.get(
  "/invitations/active",
  authenticate,
  requireRole("PARTICIPANT"),
  parentController.getActiveInvitation
);

/**
 * POST /api/v1/parent/invitations/revoke
 * Student revokes an active invitation.
 */
parentRouter.post(
  "/invitations/revoke",
  authenticate,
  requireRole("PARTICIPANT"),
  parentController.revokeInvitation
);

/**
 * GET /api/v1/parent/linked-parents
 * Student views currently verified and connected parents/guardians.
 */
parentRouter.get(
  "/linked-parents",
  authenticate,
  requireRole("PARTICIPANT"),
  parentController.getLinkedParents
);

// =========================================================================
// 3. PARENT REDEMPTION & CONNECTED CHILDREN
// =========================================================================
/**
 * POST /api/v1/parent/invitations/redeem
 * Parent redeems invitation code and links student.
 */
parentRouter.post(
  "/invitations/redeem",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  parentController.redeemInvitation
);

/**
 * GET /api/v1/parent/children
 * Returns list of verified children connected to the logged-in parent.
 */
parentRouter.get(
  "/children",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  parentController.getConnectedChildren
);

/**
 * GET /api/v1/parent/children/:studentId/overview
 * Returns comprehensive child overview, assessment summaries, reports, and counselling stats.
 */
parentRouter.get(
  "/children/:studentId/overview",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  requireParentOfStudent("studentId"),
  parentController.getChildOverview
);

/**
 * GET /api/v1/parent/children/:studentId
 * Alias for student overview.
 */
parentRouter.get(
  "/children/:studentId",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  requireParentOfStudent("studentId"),
  parentController.getChildOverview
);

// =========================================================================
// 4. PARENT ASSESSMENT REPORTS
// =========================================================================
/**
 * GET /api/v1/parent/reports
 * Returns all assessment reports for all connected children (or filtered by ?studentId=...).
 */
parentRouter.get(
  "/reports",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  parentController.getReports
);

/**
 * GET /api/v1/parent/reports/:reportId
 * Returns full assessment report detail for a verified child.
 */
parentRouter.get(
  "/reports/:reportId",
  authenticate,
  requireRole("PARENT_GUARDIAN"),
  parentController.getReportDetail
);

// =========================================================================
// 5. SHARED LINK REVOCATION
// =========================================================================
/**
 * POST /api/v1/parent/links/:linkId/revoke
 * Revokes a parent-student link.
 */
parentRouter.post(
  "/links/:linkId/revoke",
  authenticate,
  parentController.revokeLink
);

export { parentRouter };

