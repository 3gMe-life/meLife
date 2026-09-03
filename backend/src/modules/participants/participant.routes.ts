import { Router } from "express";
import { participantController } from "./participant.controller";
import { assessmentController } from "../assessments/assessment.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import {
  participantOnboardingSchema,
  updateParticipantProfileSchema,
} from "./participant.schema";

const participantRouter = Router();

// Protect all participant endpoints
participantRouter.use(authenticate);
participantRouter.use(requireRole("PARTICIPANT"));

/**
 * Profile Endpoints
 */
participantRouter.get("/profile", participantController.getProfile);

participantRouter.patch(
  "/profile",
  validateBody(updateParticipantProfileSchema),
  participantController.updateProfile
);

participantRouter.put(
  "/profile",
  validateBody(updateParticipantProfileSchema),
  participantController.updateProfile
);

/**
 * Onboarding Endpoints
 */
participantRouter.get("/onboarding", participantController.getOnboardingState);

participantRouter.post(
  "/onboarding",
  validateBody(participantOnboardingSchema),
  participantController.completeOnboarding
);

participantRouter.patch(
  "/onboarding",
  validateBody(participantOnboardingSchema),
  participantController.completeOnboarding
);

/**
 * Assessment Eligibility Endpoints
 */
participantRouter.get("/assessments", assessmentController.getParticipantAssessments);

export { participantRouter };
