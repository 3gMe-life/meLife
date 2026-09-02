import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { studentRouter } from "../modules/students/student.routes";

const apiRouter = Router();

// Mount system health routes
apiRouter.use(healthRoutes);

// Mount authentication module routes (/api/v1/auth)
apiRouter.use("/auth", authRouter);

// Mount student module routes (/api/v1/students)
apiRouter.use("/students", studentRouter);

// Future module routes will be registered here:
// apiRouter.use("/users", userRoutes);
// apiRouter.use("/institutions", institutionRoutes);
// apiRouter.use("/assessments", assessmentRoutes);
// apiRouter.use("/attempts", attemptRoutes);
// apiRouter.use("/results", resultRoutes);
// apiRouter.use("/reports", reportRoutes);

export { apiRouter };
