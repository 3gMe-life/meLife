import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { APP_CONFIG } from "./config/app.config";
import { httpLogger } from "./common/utils/logger";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export const createApp = (): Express => {
  const app = express();

  // 1. Disable technology leak headers
  app.disable("x-powered-by");

  // 2. Trust proxy in production if behind reverse proxy
  if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // 3. Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // REST API does not render HTML
      crossOriginEmbedderPolicy: false,
    })
  );

  // 4. CORS configuration
  const allowedOrigins = [env.FRONTEND_URL];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || env.NODE_ENV === "development") {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Request-Id",
        "Accept",
      ],
    })
  );

  // 5. Rate limiting
  const limiter = rateLimit({
    windowMs: APP_CONFIG.rateLimit.windowMs,
    max: APP_CONFIG.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "development" || env.NODE_ENV === "test",
    message: {
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests from this IP, please try again later",
      },
    },
  });
  app.use(limiter);

  // 6. Request ID generation/preservation
  app.use(requestIdMiddleware);

  // 7. Structured HTTP request logging
  app.use(httpLogger);

  // 8. Body parsing & Cookie parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // 9. Versioned API routes
  app.use(APP_CONFIG.apiPrefix, apiRouter);

  // 10. 404 Route Not Found handler
  app.use(notFoundMiddleware);

  // 11. Centralized global error handler
  app.use(errorMiddleware);

  return app;
};
