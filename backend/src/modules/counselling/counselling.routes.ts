import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { counsellingController } from "./counselling.controller";

// Public & student-accessible counsellor directory routes
const counsellorsRouter = Router();
counsellorsRouter.get("/", (req, res, next) => {
  // If authorization header or cookie is present, run authenticate middleware soft/gracefully
  if (req.headers.authorization || req.cookies?.refreshToken) {
    return authenticate(req, res, () => counsellingController.getAllCounsellors(req, res, next));
  }
  return counsellingController.getAllCounsellors(req, res, next);
});
counsellorsRouter.get("/:id", counsellingController.getCounsellorById);

// Counselling session & portal management routes
const counsellingRouter = Router();
counsellingRouter.use(authenticate);

// Student booking & sessions
counsellingRouter.post("/request", counsellingController.requestSession);
counsellingRouter.get("/sessions", counsellingController.getStudentSessions);
counsellingRouter.post("/consent", counsellingController.updateConsent);

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
