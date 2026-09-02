import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../common/errors/app-error";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = result.error as ZodError;
      const formattedErrors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        AppError.badRequest(
          formattedErrors[0]?.message || "Invalid request payload",
          "VALIDATION_ERROR",
          formattedErrors
        )
      );
    }

    req.body = result.data;
    next();
  };
};
