import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { companyController } from "./company.controller";

const companyRouter = Router();

// Enforce authentication & strict Company Administrator RBAC for all company endpoints
companyRouter.use(authenticate);
companyRouter.use(requireRole("COMPANY_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN"));

/**
 * Company Dashboard & Overview
 */
companyRouter.get("/overview", companyController.getOverview);

/**
 * Company Users Management
 */
companyRouter.get("/users", companyController.listUsers);
companyRouter.post("/users/invite", companyController.inviteUser);
companyRouter.post("/users/bulk-invite", companyController.bulkInviteUsers);
companyRouter.patch("/users/:userId/status", companyController.updateUserStatus);

/**
 * Company Students Directory
 */
companyRouter.get("/students", companyController.listStudents);

/**
 * Affiliated Institutions Directory
 */
companyRouter.get("/institutions", companyController.listInstitutions);

/**
 * Counsellors Network
 */
companyRouter.get("/counsellors", companyController.listCounsellors);

/**
 * Assessments & Allocations
 */
companyRouter.get("/assessments", companyController.listAssessments);
companyRouter.post("/assessments/allocate", companyController.allocateAssessment);

/**
 * Sessions Management
 */
companyRouter.get("/sessions", companyController.listSessions);

/**
 * Company Reports & Analytics
 */
companyRouter.get("/reports", companyController.getReports);

/**
 * Bulk Invitations Management
 */
companyRouter.get("/invitations", companyController.listInvitations);

/**
 * Company Profile & Settings
 */
companyRouter.get("/settings", companyController.getSettings);
companyRouter.patch("/settings", companyController.updateSettings);

export { companyRouter };
