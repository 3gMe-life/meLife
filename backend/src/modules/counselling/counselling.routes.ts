import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole, requireDashboardFeature } from "../../middleware/authorization.middleware";
import { counsellingController } from "./counselling.controller";

// Helper for optional auth + feature guard on public/student catalogue routes
const optionalAuthAndFeature = (featureKey: string) => {
  return async (req: any, res: any, next: any) => {
    if (req.headers.authorization || req.cookies?.refreshToken) {
      return authenticate(req, res, (authErr) => {
        if (authErr) return next(authErr);
        return requireDashboardFeature(featureKey)(req, res, next);
      });
    }
    next();
  };
};

// Public & student-accessible counsellor directory routes
const counsellorsRouter = Router();
counsellorsRouter.get("/", optionalAuthAndFeature("dashboard.counsellors"), counsellingController.getAllCounsellors);
counsellorsRouter.get("/:id/availability", optionalAuthAndFeature("dashboard.counsellors"), counsellingController.getDateAvailability);
counsellorsRouter.get("/:id", optionalAuthAndFeature("dashboard.counsellors"), counsellingController.getCounsellorById);

// Counselling session & portal management routes
const counsellingRouter = Router();
counsellingRouter.use(authenticate);

// Student booking & sessions (enforce dashboard.counsellors feature check)
counsellingRouter.post("/request", requireDashboardFeature("dashboard.counsellors"), counsellingController.requestSession);
counsellingRouter.get("/sessions", requireDashboardFeature("dashboard.counsellors"), counsellingController.getStudentSessions);
counsellingRouter.post("/consent", requireDashboardFeature("dashboard.counsellors"), counsellingController.updateConsent);

// Counsellor portal endpoints (Strictly authorized for approved career counsellors and admins)
counsellingRouter.get(
  "/counsellor/overview",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorOverview
);
counsellingRouter.get(
  "/dashboard/overview",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorOverview
);
counsellingRouter.get(
  "/overview",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorOverview
);
counsellingRouter.get(
  "/counsellor/sessions",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorSessions
);
counsellingRouter.get(
  "/counsellor/sessions/:id",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getSessionDetail
);
counsellingRouter.get(
  "/sessions/:id",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getSessionDetail
);
counsellingRouter.patch(
  "/sessions/:id/status",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.updateSessionStatus
);
counsellingRouter.get(
  "/counsellor/students",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getAssignedStudents
);
counsellingRouter.get(
  "/counsellor/students/:studentId/summary",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getStudentSummary
);
counsellingRouter.put(
  "/counsellor/profile",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.updateCounsellorProfile
);
counsellingRouter.get(
  "/counsellor/availability",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorAvailability
);
counsellingRouter.put(
  "/counsellor/availability",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.updateCounsellorAvailability
);
counsellingRouter.get(
  "/counsellor/reviews",
  requireRole("CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"),
  counsellingController.getCounsellorReviews
);

// Counselling notes
counsellingRouter.post("/sessions/:id/notes", counsellingController.saveSessionNotes);
counsellingRouter.get("/sessions/:id/notes", counsellingController.getSessionNotes);

// Notifications routes
const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get("/", counsellingController.getNotifications);
notificationRouter.patch("/:id/read", counsellingController.markNotificationAsRead);

export { counsellorsRouter, counsellingRouter, notificationRouter };
