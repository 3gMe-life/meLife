import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { adminController } from "./admin.controller";

const adminRouter = Router();

// Enforce authentication & strict Administrator RBAC for all admin endpoints
adminRouter.use(authenticate);
adminRouter.use(requireRole("SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"));

/**
 * Platform Overview & Aggregated Statistics
 */
adminRouter.get("/overview", adminController.getPlatformOverview);

/**
 * Counsellor Application Review & Approval Management Routes
 */
// Primary route conventions: /api/v1/admin/counsellor-applications
adminRouter.get(
  "/counsellor-applications",
  adminController.listCounsellorApplications
);

adminRouter.get(
  "/counsellor-applications/:id",
  adminController.getCounsellorApplicationById
);

adminRouter.post(
  "/counsellor-applications/:id/approve",
  adminController.approveCounsellorApplication
);

adminRouter.post(
  "/counsellor-applications/:id/reject",
  adminController.rejectCounsellorApplication
);

// Alias conventions for developer ergonomics: /api/v1/admin/counsellors/applications
adminRouter.get(
  "/counsellors/applications",
  adminController.listCounsellorApplications
);

adminRouter.get(
  "/counsellors/applications/:id",
  adminController.getCounsellorApplicationById
);

// Direct aliases for practitioner & application operations: /api/v1/admin/counsellors/:id
adminRouter.get(
  "/counsellors/:id",
  adminController.getCounsellorApplicationById
);

adminRouter.post(
  "/counsellors/:id/approve",
  adminController.approveCounsellorApplication
);

adminRouter.post(
  "/counsellors/:id/reject",
  adminController.rejectCounsellorApplication
);

/**
 * Counsellor Profile, Access, and Account Governance Routes
 */
adminRouter.get("/counsellors/:id/access", adminController.getCounsellorAccess);
adminRouter.put("/counsellors/:id/profile", adminController.updateCounsellorProfile);
adminRouter.post("/counsellors/:id/suspend", adminController.suspendCounsellor);
adminRouter.post("/counsellors/:id/reactivate", adminController.reactivateCounsellor);
adminRouter.delete("/counsellor-applications/:id", adminController.deleteCounsellorApplication);
adminRouter.delete("/counsellors/applications/:id", adminController.deleteCounsellorApplication);
adminRouter.delete("/counsellors/:id", adminController.deleteCounsellorApplication);

/**
 * User Accounts & Roles Administrative Management Routes
 */
adminRouter.get("/users", adminController.listUsers);
adminRouter.post("/users/bulk-delete", adminController.deleteUsersBulk);
adminRouter.delete("/users/bulk", adminController.deleteUsersBulk);
adminRouter.patch("/users/bulk-status", adminController.updateUsersStatusBulk);
adminRouter.get("/users/:id", adminController.getUserById);
adminRouter.patch("/users/:id", adminController.updateUserProfile);
adminRouter.patch("/users/:id/status", adminController.updateUserStatus);
adminRouter.patch("/users/:id/role", adminController.updateUserRole);
adminRouter.delete("/users/:id", adminController.deleteUser);

/**
 * System Roles & RBAC Governance Routes
 */
adminRouter.get("/roles", adminController.listRoles);
adminRouter.get("/roles/:id", adminController.getRoleById);
adminRouter.get("/roles/:id/permissions", adminController.getRolePermissionsMatrix);
adminRouter.put("/roles/:id/permissions", adminController.updateRolePermissions);
adminRouter.get("/roles/:id/dashboard-features", adminController.getRoleDashboardFeatures);
adminRouter.put("/roles/:id/dashboard-features", adminController.updateRoleDashboardFeatures);
adminRouter.get("/permissions", adminController.listPermissions);
adminRouter.get("/dashboard-features", adminController.listDashboardFeatures);

export { adminRouter };



