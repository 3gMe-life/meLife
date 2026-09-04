import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { careerController } from "./career.controller";

export const careerRouter = Router();

// Protect career recommendation routes
careerRouter.use(authenticate);

/**
 * Career Exploration & Recommendations Endpoints
 */
careerRouter.get(
  "/recommendations",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  careerController.getRecommendations
);

careerRouter.get(
  "/matches",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  careerController.getRecommendations
);

careerRouter.get(
  "/:idOrSlug",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  careerController.getCareerDetail
);

careerRouter.get(
  "/",
  requireRole("PARTICIPANT", "SUPER_ADMIN", "PLATFORM_ADMIN", "CAREER_COUNSELLOR", "PARENT_GUARDIAN"),
  careerController.getAllCareers
);
