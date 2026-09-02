import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";
import { authTokenService } from "../modules/auth/auth.token.service";
import { userRepository } from "../modules/users/user.repository";

/**
 * Authentication middleware that verifies the Bearer JWT access token
 * and attaches the security context to req.user.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized(
        "Authentication required. Missing or malformed Bearer token.",
        "AUTH_UNAUTHORIZED"
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw AppError.unauthorized(
        "Authentication required. Bearer token is empty.",
        "AUTH_UNAUTHORIZED"
      );
    }

    // Cryptographically verify signature, issuer, audience, and expiration
    const payload = authTokenService.verifyAccessToken(token);

    // Optional quick check to ensure user still exists and is not suspended/disabled
    const user = await userRepository.findById(payload.sub);
    if (!user || user.status === "SUSPENDED" || user.status === "DISABLED") {
      throw AppError.unauthorized(
        "User account is inactive or no longer exists.",
        "AUTH_ACCOUNT_INACTIVE"
      );
    }

    req.user = {
      id: payload.sub,
      email: user.email,
      role: payload.role,
      permissions: payload.permissions,
      sessionId: payload.sessionId,
    };

    next();
  } catch (err) {
    next(err);
  }
};
