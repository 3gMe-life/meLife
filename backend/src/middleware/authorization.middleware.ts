import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";
import { UserRole } from "../modules/users/user.types";

/**
 * Authorization middleware enforcing required granular permissions.
 */
export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED")
      );
    }

    const userPermissions = req.user.permissions || [];

    // Super admins with "admin.all" bypass granular checks
    if (userPermissions.includes("admin.all") || req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      return next(
        AppError.forbidden(
          "Access denied. You do not have permission to perform this action.",
          "AUTH_FORBIDDEN"
        )
      );
    }

    next();
  };
};

/**
 * Authorization middleware enforcing explicit role constraints.
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED")
      );
    }

    if (req.user.role === "SUPER_ADMIN" || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(
      AppError.forbidden(
        "Access denied. Your role is not authorized for this resource.",
        "AUTH_FORBIDDEN"
      )
    );
  };
};
