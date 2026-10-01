import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";
import { UserRole } from "../modules/users/user.types";
import { userRepository } from "../modules/users/user.repository";

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

/**
 * Authorization middleware enforcing enabled dashboard features for the authenticated user's role.
 */
export const requireDashboardFeature = (featureKey: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(
          AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED")
        );
      }

      // Super Admin and root admin.all permission bypass
      if (req.user.role === "SUPER_ADMIN" || req.user.permissions?.includes("admin.all")) {
        return next();
      }

      const features = await userRepository.getUserDashboardFeatures(req.user.id);

      if (!features.includes(featureKey)) {
        return next(
          AppError.forbidden(
            `Access denied. The '${featureKey}' feature is disabled for your account role.`,
            "FEATURE_DISABLED"
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Authorization middleware enforcing that the authenticated parent/guardian
 * has an active, verified relationship with the target student ID.
 *
 * Checks req.params[studentIdParam], req.body[studentIdParam], or req.query[studentIdParam].
 */
export const requireParentOfStudent = (studentIdParam = "studentId") => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(
          AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED")
        );
      }

      // Super Admin and root admin.all permission bypass
      if (req.user.role === "SUPER_ADMIN" || req.user.permissions?.includes("admin.all")) {
        return next();
      }

      const targetStudentId =
        req.params[studentIdParam] ||
        req.body?.[studentIdParam] ||
        (req.query?.[studentIdParam] as string);

      if (!targetStudentId) {
        return next(
          AppError.badRequest(
            `Missing required student identifier '${studentIdParam}'`,
            "BAD_REQUEST"
          )
        );
      }

      // If the authenticated user is the student themselves accessing their own resource
      if (req.user.id === targetStudentId && req.user.role === "PARTICIPANT") {
        return next();
      }

      // Verify active parent-student link in database
      const isLinked = await userRepository.isParentOfStudent(req.user.id, targetStudentId);

      if (!isLinked) {
        return next(
          AppError.forbidden(
            "Access denied. You do not have an active verified parent link with this student.",
            "AUTH_FORBIDDEN"
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
