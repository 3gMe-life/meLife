import { pool } from "../../config/database";
import { AppError } from "../../common/errors/app-error";
import { hashPassword, verifyPassword } from "../../common/utils/crypto";
import { logger } from "../../common/utils/logger";
import { env } from "../../config/env";
import { userRepository } from "../users/user.repository";
import { sessionRepository } from "../sessions/session.repository";
import { toPublicUser } from "../users/user.mapper";
import { UserRole } from "../users/user.types";
import { authRepository } from "./auth.repository";
import { authTokenService } from "./auth.token.service";
import { authGoogleService } from "./auth.google.service";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  GoogleAuthRequestDTO,
  AuthResult,
  ApplicationSubmissionResult,
  MeResponseDTO,
} from "./auth.types";

export class AuthService {
  /**
   * Universal registration handler.
   * Dispatches to participant, parent, counsellor application, or institution application.
   */
  async register(
    dto: RegisterRequestDTO,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResult | ApplicationSubmissionResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // 1. Path: School / Institution Application
    if (dto.registrationPath === "INSTITUTION") {
      if (!dto.institutionName || !dto.institutionType || !dto.contactName || !dto.phoneNumber) {
        throw AppError.badRequest(
          "Institution name, type, contact name, and phone number are required.",
          "AUTH_MISSING_INSTITUTION_FIELDS"
        );
      }

      await authRepository.createInstitutionApplication({
        institutionName: dto.institutionName,
        institutionType: dto.institutionType,
        officialEmail: normalizedEmail,
        contactName: dto.contactName,
        phoneNumber: dto.phoneNumber,
      });

      return {
        success: true,
        applicationType: "INSTITUTION",
        status: "PENDING",
        message:
          "Your institution application has been received and is pending review by the MeLife team.",
      };
    }

    // 2. Check for duplicate email across all account creation paths
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw AppError.conflict(
        "An account with this email address already exists. Please sign in instead.",
        "AUTH_EMAIL_EXISTS"
      );
    }

    if (!dto.password) {
      throw AppError.badRequest("Password is required for registration.", "AUTH_PASSWORD_REQUIRED");
    }

    const passwordHash = await hashPassword(dto.password);

    // 3. Path: Career Counsellor Professional Application
    if (dto.registrationPath === "COUNSELLOR") {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const user = await userRepository.createUser(
          {
            email: normalizedEmail,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            status: "PENDING_VERIFICATION",
          },
          client
        );

        await userRepository.assignRole(user.id, "PARTICIPANT", true, client);
        await authRepository.createAuthIdentity(
          { userId: user.id, provider: "LOCAL", providerAccountId: user.id },
          client
        );

        await authRepository.createCounsellorApplication(
          {
            userId: user.id,
            qualification: dto.qualification,
            organization: dto.organization,
          },
          client
        );

        await client.query("COMMIT");

        logger.info(
          { userId: user.id, email: user.email },
          "Counsellor professional application registered"
        );

        return {
          success: true,
          applicationType: "COUNSELLOR",
          status: "PENDING",
          message:
            "Your professional counsellor profile has been submitted and is currently pending verification.",
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    // 4. Path: Student / Individual or Parent / Guardian Account Creation
    const assignedRole: UserRole =
      dto.registrationPath === "PARENT" ? "PARENT_GUARDIAN" : "PARTICIPANT";

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const user = await userRepository.createUser(
        {
          email: normalizedEmail,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          status: "ACTIVE",
          emailVerifiedAt: null,
        },
        client
      );

      await userRepository.assignRole(user.id, assignedRole, true, client);
      await authRepository.createAuthIdentity(
        { userId: user.id, provider: "LOCAL", providerAccountId: user.id },
        client
      );

      if (assignedRole === "PARTICIPANT") {
        await authRepository.createStudentProfile({ userId: user.id }, client);
      }

      const { permissions } = await userRepository.getUserRolesAndPermissions(user.id, client);

      // Session & Token Generation
      const refreshToken = authTokenService.generateOpaqueRefreshToken();
      const refreshTokenHash = authTokenService.hashRefreshToken(refreshToken);
      const expiresAt = new Date(
        Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
      );

      const session = await sessionRepository.createSession(
        {
          userId: user.id,
          refreshTokenHash,
          expiresAt,
          ipAddress,
          userAgent,
        },
        client
      );

      const accessToken = authTokenService.signAccessToken({
        userId: user.id,
        sessionId: session.id,
        role: assignedRole,
        permissions,
      });

      await client.query("COMMIT");

      logger.info(
        { userId: user.id, role: assignedRole },
        "New user registered successfully"
      );

      return {
        user: toPublicUser(user),
        role: assignedRole,
        permissions,
        accessToken,
        refreshToken,
        requiresOnboarding: assignedRole === "PARTICIPANT",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Universal login handler for all platform personas.
   */
  async login(
    dto: LoginRequestDTO,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user || !user.password_hash) {
      throw AppError.unauthorized(
        "Invalid email or password.",
        "AUTH_INVALID_CREDENTIALS"
      );
    }

    const isPasswordValid = await verifyPassword(user.password_hash, dto.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized(
        "Invalid email or password.",
        "AUTH_INVALID_CREDENTIALS"
      );
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      throw AppError.forbidden(
        "Your account is currently suspended. Please contact platform support.",
        "AUTH_ACCOUNT_SUSPENDED"
      );
    }
    if (user.status === "DISABLED") {
      throw AppError.forbidden(
        "Your account has been deactivated.",
        "AUTH_ACCOUNT_DISABLED"
      );
    }

    // Load roles & permissions
    const { roles, permissions } = await userRepository.getUserRolesAndPermissions(user.id);
    const primaryRole: UserRole = roles[0] || "PARTICIPANT";

    // Refresh token & Session creation
    const refreshToken = authTokenService.generateOpaqueRefreshToken();
    const refreshTokenHash = authTokenService.hashRefreshToken(refreshToken);

    const expiresInDays = dto.rememberMe ? 30 : env.REFRESH_TOKEN_EXPIRES_IN_DAYS;
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const session = await sessionRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    const accessToken = authTokenService.signAccessToken({
      userId: user.id,
      sessionId: session.id,
      role: primaryRole,
      permissions,
    });

    await userRepository.updateLastLogin(user.id);

    // Check for counsellor application details
    const counsellorApp = await authRepository.findCounsellorApplicationByUserId(user.id);
    const counsellorApplication = counsellorApp
      ? {
          id: counsellorApp.id,
          status: counsellorApp.status,
          qualification: counsellorApp.qualification,
          organization: counsellorApp.organization,
          submittedAt: counsellorApp.createdAt.toISOString(),
        }
      : null;

    // Check student onboarding status if participant (and not a pending counsellor applicant)
    let requiresOnboarding = false;
    if (primaryRole === "PARTICIPANT" && !counsellorApp) {
      const studentProfile = await userRepository.getStudentProfile(user.id);
      requiresOnboarding = !studentProfile?.isOnboarded;
    }

    logger.info(
      { userId: user.id, role: primaryRole, hasCounsellorApp: Boolean(counsellorApp) },
      "User authenticated successfully"
    );

    return {
      user: toPublicUser(user),
      role: primaryRole,
      permissions,
      accessToken,
      refreshToken,
      requiresOnboarding,
      counsellorApplication,
    };
  }

  /**
   * Google OAuth token verification, account linking, and registration handler.
   */
  async googleLogin(
    dto: GoogleAuthRequestDTO,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResult | ApplicationSubmissionResult> {
    const googleUser = await authGoogleService.verifyGoogleCredential(dto.credential);

    // 1. Check if identity with provider=GOOGLE and provider_account_id=googleUser.providerAccountId (sub) already exists
    const existingIdentity = await authRepository.findAuthIdentity(
      "GOOGLE",
      googleUser.providerAccountId
    );

    let userId: string;
    let user = existingIdentity
      ? await userRepository.findById(existingIdentity.user_id)
      : null;

    if (user) {
      userId = user.id;
    } else {
      // 2. Check if a user with this verified email already exists in MeLife
      const existingEmailUser = await userRepository.findByEmail(googleUser.email);

      if (existingEmailUser) {
        userId = existingEmailUser.id;
        user = existingEmailUser;

        // Link Google auth identity to existing account (Account Linking Policy)
        await authRepository.createAuthIdentity({
          userId: existingEmailUser.id,
          provider: "GOOGLE",
          providerAccountId: googleUser.providerAccountId,
        });

        logger.info(
          { userId: existingEmailUser.id, email: googleUser.email },
          "Linked Google identity to existing MeLife account"
        );
      } else {
        // 3. User does not exist. If in login mode (no registrationPath supplied), do not silently auto-register
        if (!dto.registrationPath) {
          throw AppError.notFound(
            "No 3G MeLife account found for this Google email. Please choose a registration path to create your account.",
            "AUTH_ACCOUNT_NOT_FOUND"
          );
        }

        // 4. Create new user via Google signup based on registrationPath
        if (dto.registrationPath === "INSTITUTION") {
          // For institutions, Google only captures contact person details and submits inquiry
          await authRepository.createInstitutionApplication({
            institutionName: `${googleUser.firstName}'s Institution`,
            institutionType: "other",
            officialEmail: googleUser.email,
            contactName: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
            phoneNumber: "",
          });

          return {
            success: true,
            applicationType: "INSTITUTION",
            status: "PENDING",
            message:
              "Your institution application has been received and is pending review by the MeLife team.",
          };
        }

        const assignedRole: UserRole =
          dto.registrationPath === "PARENT" ? "PARENT_GUARDIAN" : "PARTICIPANT";

        const client = await pool.connect();
        try {
          await client.query("BEGIN");

          const newUser = await userRepository.createUser(
            {
              email: googleUser.email,
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              status: dto.registrationPath === "COUNSELLOR" ? "PENDING_VERIFICATION" : "ACTIVE",
              emailVerifiedAt: new Date(),
            },
            client
          );

          await userRepository.assignRole(newUser.id, assignedRole, true, client);
          await authRepository.createAuthIdentity(
            {
              userId: newUser.id,
              provider: "GOOGLE",
              providerAccountId: googleUser.providerAccountId,
            },
            client
          );

          if (dto.registrationPath === "COUNSELLOR") {
            await authRepository.createCounsellorApplication(
              {
                userId: newUser.id,
              },
              client
            );
            await client.query("COMMIT");

            logger.info(
              { userId: newUser.id, email: newUser.email },
              "Counsellor application registered via Google"
            );

            return {
              success: true,
              applicationType: "COUNSELLOR",
              status: "PENDING",
              message:
                "Your professional counsellor profile has been submitted and is currently pending verification.",
            };
          }

          if (assignedRole === "PARTICIPANT") {
            await authRepository.createStudentProfile({ userId: newUser.id }, client);
          }

          await client.query("COMMIT");
          userId = newUser.id;
          user = newUser;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      }
    }

    if (!user) {
      throw AppError.internal("Failed to resolve Google user account.");
    }

    if (user.status === "SUSPENDED") {
      throw AppError.forbidden(
        "Your account is currently suspended. Please contact platform support.",
        "AUTH_ACCOUNT_SUSPENDED"
      );
    }
    if (user.status === "DISABLED") {
      throw AppError.forbidden(
        "Your account has been deactivated.",
        "AUTH_ACCOUNT_DISABLED"
      );
    }

    const { roles, permissions } = await userRepository.getUserRolesAndPermissions(userId);
    const primaryRole: UserRole = roles[0] || "PARTICIPANT";

    const refreshToken = authTokenService.generateOpaqueRefreshToken();
    const refreshTokenHash = authTokenService.hashRefreshToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );

    const session = await sessionRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    const accessToken = authTokenService.signAccessToken({
      userId: user.id,
      sessionId: session.id,
      role: primaryRole,
      permissions,
    });

    await userRepository.updateLastLogin(user.id);

    const counsellorApp = await authRepository.findCounsellorApplicationByUserId(user.id);
    const counsellorApplication = counsellorApp
      ? {
          id: counsellorApp.id,
          status: counsellorApp.status,
          qualification: counsellorApp.qualification,
          organization: counsellorApp.organization,
          submittedAt: counsellorApp.createdAt.toISOString(),
        }
      : null;

    let requiresOnboarding = false;
    if (primaryRole === "PARTICIPANT" && !counsellorApp) {
      const studentProfile = await userRepository.getStudentProfile(user.id);
      requiresOnboarding = !studentProfile?.isOnboarded;
    }

    logger.info(
      { userId: user.id, role: primaryRole, provider: "GOOGLE", hasCounsellorApp: Boolean(counsellorApp) },
      "Google login/signup succeeded"
    );

    return {
      user: toPublicUser(user),
      role: primaryRole,
      permissions,
      accessToken,
      refreshToken,
      requiresOnboarding,
      counsellorApplication,
    };
  }

  /**
   * Rotates an active refresh token and returns a new access token.
   */
  async refreshToken(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; newRefreshToken: string; user: ReturnType<typeof toPublicUser>; role: UserRole }> {
    const tokenHash = authTokenService.hashRefreshToken(rawRefreshToken);

    const session = await sessionRepository.findActiveSessionByTokenHash(tokenHash);
    if (!session) {
      // Check if this was a previously used/revoked token (detect potential compromise)
      const historicalSession = await sessionRepository.findSessionByTokenHash(tokenHash);
      if (historicalSession) {
        logger.warn(
          { sessionId: historicalSession.id, userId: historicalSession.user_id },
          "Potential refresh token reuse detected! Revoking session."
        );
        await sessionRepository.revokeSession(historicalSession.id);
      }

      throw AppError.unauthorized(
        "Invalid or expired refresh token. Please sign in again.",
        "AUTH_SESSION_INVALID"
      );
    }

    const user = await userRepository.findById(session.user_id);
    if (!user || user.status === "SUSPENDED" || user.status === "DISABLED") {
      await sessionRepository.revokeSession(session.id);
      throw AppError.forbidden(
        "Account is inactive. Please log in again.",
        "AUTH_ACCOUNT_INACTIVE"
      );
    }

    const { roles, permissions } = await userRepository.getUserRolesAndPermissions(user.id);
    const primaryRole: UserRole = roles[0] || "PARTICIPANT";

    // Rotate refresh token
    const newRefreshToken = authTokenService.generateOpaqueRefreshToken();
    const newRefreshTokenHash = authTokenService.hashRefreshToken(newRefreshToken);
    const newExpiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );

    await sessionRepository.updateRefreshToken(
      session.id,
      newRefreshTokenHash,
      newExpiresAt,
      ipAddress,
      userAgent
    );

    const accessToken = authTokenService.signAccessToken({
      userId: user.id,
      sessionId: session.id,
      role: primaryRole,
      permissions,
    });

    return {
      accessToken,
      newRefreshToken,
      user: toPublicUser(user),
      role: primaryRole,
    };
  }

  /**
   * Revokes a session on logout. Idempotent.
   */
  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;

    try {
      const tokenHash = authTokenService.hashRefreshToken(rawRefreshToken);
      const session = await sessionRepository.findSessionByTokenHash(tokenHash);
      if (session) {
        await sessionRepository.revokeSession(session.id);
        logger.info({ sessionId: session.id }, "Session revoked on logout");
      }
    } catch (err) {
      logger.error({ err }, "Error revoking session during logout");
    }
  }

  /**
   * Revokes all active sessions for a user across all devices.
   */
  async logoutAll(userId: string): Promise<void> {
    const revokedCount = await sessionRepository.revokeAllUserSessions(userId);
    logger.info({ userId, revokedCount }, "All user sessions revoked");
  }

  /**
   * Returns current authenticated user profile, permissions, and onboarding state.
   */
  async getMe(userId: string): Promise<MeResponseDTO> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found.", "AUTH_USER_NOT_FOUND");
    }

    const { roles, permissions } = await userRepository.getUserRolesAndPermissions(userId);
    const primaryRole: UserRole = roles[0] || "PARTICIPANT";
    const dashboardFeatures = await userRepository.getUserDashboardFeatures(userId);

    const counsellorApp = await authRepository.findCounsellorApplicationByUserId(userId);
    const counsellorApplication = counsellorApp
      ? {
          id: counsellorApp.id,
          status: counsellorApp.status,
          qualification: counsellorApp.qualification,
          organization: counsellorApp.organization,
          submittedAt: counsellorApp.createdAt.toISOString(),
        }
      : null;

    const studentProfile =
      primaryRole === "PARTICIPANT" && !counsellorApp
        ? await userRepository.getStudentProfile(userId)
        : null;

    return {
      user: toPublicUser(user),
      role: primaryRole,
      permissions,
      dashboardFeatures,
      institution: null,
      relationships: {},
      onboarding: {
        completed: Boolean(studentProfile?.isOnboarded),
        educationStage: studentProfile?.educationStage || null,
        gradeLevel: studentProfile?.gradeLevel || null,
        dateOfBirth: studentProfile?.dateOfBirth || null,
      },
      counsellorApplication,
    };
  }

  /**
   * Securely changes password for authenticated user.
   */
  async changePassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string }
  ): Promise<{ success: boolean; message: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found.", "AUTH_USER_NOT_FOUND");
    }

    if (!user.password_hash) {
      throw AppError.badRequest(
        "Account was created via social login (Google). Password cannot be changed this way.",
        "AUTH_PASSWORD_NOT_SET"
      );
    }

    const isValid = await verifyPassword(user.password_hash, dto.currentPassword);
    if (!isValid) {
      throw AppError.unauthorized(
        "Current password entered is incorrect.",
        "AUTH_INVALID_CURRENT_PASSWORD"
      );
    }

    const newHash = await hashPassword(dto.newPassword);
    await userRepository.updatePassword(userId, newHash);

    logger.info({ userId }, "User password changed successfully");
    return {
      success: true,
      message: "Password changed successfully.",
    };
  }
}

export const authService = new AuthService();
