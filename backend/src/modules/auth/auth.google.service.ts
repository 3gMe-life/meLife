import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";

export interface VerifiedGoogleIdentity {
  provider: "GOOGLE";
  providerAccountId: string; // Google "sub" identifier
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export class AuthGoogleService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(env.GOOGLE_CLIENT_ID || undefined);
  }

  /**
   * Cryptographically verifies a Google ID token credential against Google's public keys
   * and extracts verified identity claims.
   */
  async verifyGoogleCredential(idToken: string): Promise<VerifiedGoogleIdentity> {
    try {
      if (!env.GOOGLE_CLIENT_ID) {
        logger.warn("GOOGLE_CLIENT_ID is not configured in backend environment.");
      }

      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID || undefined,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw AppError.unauthorized(
          "Invalid Google ID token claims. Missing sub or email.",
          "AUTH_INVALID_GOOGLE_TOKEN"
        );
      }

      // Enforce verified email requirement
      if (!payload.email_verified) {
        throw AppError.unauthorized(
          "Your Google email address is unverified. Please verify your Google account first.",
          "AUTH_GOOGLE_EMAIL_UNVERIFIED"
        );
      }

      return {
        provider: "GOOGLE",
        providerAccountId: payload.sub,
        email: payload.email.toLowerCase().trim(),
        emailVerified: true,
        firstName: payload.given_name || payload.name?.split(" ")[0] || "User",
        lastName:
          payload.family_name ||
          payload.name?.split(" ").slice(1).join(" ") ||
          "",
        avatarUrl: payload.picture,
      };
    } catch (error: unknown) {
      logger.error({ error }, "Google ID token verification failed");
      if (error instanceof AppError) throw error;
      throw AppError.unauthorized(
        "Failed to verify Google identity credential.",
        "AUTH_GOOGLE_VERIFICATION_FAILED"
      );
    }
  }
}

export const authGoogleService = new AuthGoogleService();
