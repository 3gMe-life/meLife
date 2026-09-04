import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
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

// Counsellor portal endpoints
counsellingRouter.get("/counsellor/overview", counsellingController.getCounsellorOverview);
counsellingRouter.get("/counsellor/sessions", counsellingController.getCounsellorSessions);
counsellingRouter.patch("/sessions/:id/status", counsellingController.updateSessionStatus);
counsellingRouter.get("/counsellor/students", counsellingController.getAssignedStudents);
counsellingRouter.get("/counsellor/students/:studentId/summary", counsellingController.getStudentSummary);

// Counselling notes
counsellingRouter.post("/sessions/:id/notes", counsellingController.saveSessionNotes);
counsellingRouter.get("/sessions/:id/notes", counsellingController.getSessionNotes);

// Notifications routes
const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get("/", counsellingController.getNotifications);
notificationRouter.patch("/:id/read", counsellingController.markNotificationAsRead);

export { counsellorsRouter, counsellingRouter, notificationRouter };
