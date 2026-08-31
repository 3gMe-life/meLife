import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";
import { HttpStatus } from "../common/constants/http-status";
import { env } from "../config/env";
import { logger } from "../common/utils/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.id || "unknown";

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(
        { err, requestId, path: req.originalUrl, method: req.method },
        `Operational Error: ${err.message}`
      );
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
        requestId,
      },
    });
    return;
  }

  // Handle unhandled non-AppError exceptions
  logger.error(
    { err, requestId, path: req.originalUrl, method: req.method },
    `Unhandled Exception: ${err.message}`
  );

  const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  const isProduction = env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction ? "An unexpected error occurred" : err.message,
      requestId,
      ...(!isProduction && err.stack ? { stack: err.stack } : {}),
    },
  });
};
