import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { generateRandomToken, hashToken } from "../../common/utils/crypto";
import { JwtAccessPayload } from "./auth.types";
import { UserRole } from "../users/user.types";

export class AuthTokenService {
  /**
   * Signs a short-lived (15 min) JWT access token with minimal security claims.
   */
  signAccessToken(params: {
    userId: string;
    sessionId: string;
    role: UserRole;
    permissions: string[];
  }): string {
    const payload = {
      sessionId: params.sessionId,
      role: params.role,
      permissions: params.permissions,
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      subject: params.userId,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      algorithm: "HS256",
    });
  }

  /**
   * Cryptographically verifies an access JWT and validates issuer, audience, and signature.
   */
  verifyAccessToken(token: string): JwtAccessPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        algorithms: ["HS256"],
      }) as jwt.JwtPayload;

      return {
        sub: decoded.sub as string,
        sessionId: decoded.sessionId as string,
        role: decoded.role as UserRole,
        permissions: (decoded.permissions as string[]) || [],
        iss: decoded.iss as string,
        aud: decoded.aud as string,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized(
          "Access token has expired. Please refresh your session.",
          "AUTH_TOKEN_EXPIRED"
        );
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw AppError.unauthorized(
          "Invalid access token signature or claims.",
          "AUTH_TOKEN_INVALID"
        );
      }
      throw AppError.unauthorized("Authentication failed.", "AUTH_UNAUTHORIZED");
    }
  }

  /**
   * Generates a cryptographically random opaque 64-byte refresh token.
   */
  generateOpaqueRefreshToken(): string {
    return generateRandomToken(env.REFRESH_TOKEN_BYTES);
  }

  /**
   * Computes SHA-256 hash of the opaque refresh token for database lookup.
   */
  hashRefreshToken(token: string): string {
    return hashToken(token);
  }
}

export const authTokenService = new AuthTokenService();
