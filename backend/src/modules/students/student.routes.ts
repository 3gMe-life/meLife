import { Router } from "express";
import { studentController } from "./student.controller";

const studentRouter = Router();

/**
 * POST /api/v1/students/onboarding
 */
studentRouter.post(
  "/onboarding",
  studentController.onboarding
);

export { studentRouter };
