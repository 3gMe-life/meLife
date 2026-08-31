import { HttpStatus, HttpStatusCode } from "../constants/http-status";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(params: {
    message: string;
    statusCode?: HttpStatusCode;
    code?: string;
    details?: unknown;
    isOperational?: boolean;
  }) {
    super(params.message);
    this.name = this.constructor.name;
    this.statusCode = params.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = params.code ?? "INTERNAL_SERVER_ERROR";
    this.details = params.details;
    this.isOperational = params.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST", details?: unknown) {
    return new AppError({
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      code,
      details,
    });
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new AppError({
      message,
      statusCode: HttpStatus.UNAUTHORIZED,
      code,
    });
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new AppError({
      message,
      statusCode: HttpStatus.FORBIDDEN,
      code,
    });
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new AppError({
      message,
      statusCode: HttpStatus.NOT_FOUND,
      code,
    });
  }

  static conflict(message: string, code = "CONFLICT") {
    return new AppError({
      message,
      statusCode: HttpStatus.CONFLICT,
      code,
    });
  }

  static unprocessable(message: string, code = "UNPROCESSABLE_ENTITY", details?: unknown) {
    return new AppError({
      message,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code,
      details,
    });
  }

  static internal(message = "Internal server error", code = "INTERNAL_SERVER_ERROR") {
    return new AppError({
      message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code,
      isOperational: false,
    });
  }
}
