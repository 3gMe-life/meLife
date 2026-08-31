import { Router, Request, Response } from "express";
import { APP_CONFIG } from "../config/app.config";
import { checkDatabaseHealth } from "../config/database";

const router = Router();

router.get("/health", async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();

  const isHealthy = dbHealth.connected;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    data: {
      status: isHealthy ? "ok" : "degraded",
      service: APP_CONFIG.serviceName,
      version: APP_CONFIG.apiVersion,
      timestamp: new Date().toISOString(),
      database: {
        status: dbHealth.connected ? "connected" : "disconnected",
        latencyMs: `${dbHealth.latencyMs}ms`,
        ...(dbHealth.database ? { name: dbHealth.database } : {}),
        ...(dbHealth.error ? { error: dbHealth.error } : {}),
      },
    },
  });
});

export const healthRoutes = router;
