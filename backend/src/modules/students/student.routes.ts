import { Router } from "express";
import { studentController } from "./student.controller";
import { authenticate } from "../../middleware/authenticate.middleware";

const studentRouter = Router();

// Mount authentication middleware to populate security context (req.user) from Bearer JWT / cookie
studentRouter.use(authenticate);

/**
 * POST /api/v1/students/onboarding
 */
studentRouter.post(
  "/onboarding",
  studentController.onboarding
);

export { studentRouter };
