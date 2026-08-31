import { Router } from "express";
import { healthRoutes } from "./health.routes";

const apiRouter = Router();

// Mount module routes
apiRouter.use(healthRoutes);

// Future module routes will be registered here:
// apiRouter.use("/auth", authRoutes);
// apiRouter.use("/users", userRoutes);
// apiRouter.use("/students", studentRoutes);
// apiRouter.use("/institutions", institutionRoutes);
// apiRouter.use("/assessments", assessmentRoutes);
// apiRouter.use("/attempts", attemptRoutes);
// apiRouter.use("/results", resultRoutes);
// apiRouter.use("/reports", reportRoutes);

export { apiRouter };
