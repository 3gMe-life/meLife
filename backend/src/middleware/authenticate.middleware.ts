import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";
import { authTokenService } from "../modules/auth/auth.token.service";
import { userRepository } from "../modules/users/user.repository";
import { sessionRepository } from "../modules/sessions/session.repository";
import { env } from "../config/env";

/**
 * Authentication middleware that verifies the Bearer JWT access token
 * or validates the active HttpOnly session cookie, and attaches the security context to req.user.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Bearer Token Verification
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const payload = authTokenService.verifyAccessToken(token);
          const user = await userRepository.findById(payload.sub);
          if (user && user.status !== "SUSPENDED" && user.status !== "DISABLED") {
            req.user = {
              id: payload.sub,
              email: user.email,
              role: payload.role,
              permissions: payload.permissions,
              sessionId: payload.sessionId,
            };
            return next();
          }
        } catch {
          // Fall through to cookie verification if access token expired or invalid
        }
      }
    }

    // 2. Fallback: HttpOnly Refresh Token / Session Cookie Verification
    const rawRefreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (rawRefreshToken) {
      const tokenHash = authTokenService.hashRefreshToken(rawRefreshToken);
      const session = await sessionRepository.findActiveSessionByTokenHash(tokenHash);

      if (session) {
        const user = await userRepository.findById(session.user_id);
        if (user && user.status !== "SUSPENDED" && user.status !== "DISABLED") {
          const { roles, permissions } = await userRepository.getUserRolesAndPermissions(user.id);
          req.user = {
            id: user.id,
            email: user.email,
            role: roles[0] || "PARTICIPANT",
            permissions,
            sessionId: session.id,
          };
          return next();
        }
      }
    }

    throw AppError.unauthorized(
      "Authentication required. Missing, invalid, or expired session credentials.",
      "AUTH_UNAUTHORIZED"
    );
  } catch (err) {
    next(err);
  }
};
