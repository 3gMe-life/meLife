import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { setRefreshCookie, clearRefreshCookie } from "./auth.cookie";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(
        req.body,
        req.ip,
        req.headers["user-agent"]
      );

      // If full account creation with session
      if ("refreshToken" in result) {
        setRefreshCookie(res, result.refreshToken);
        res.status(HttpStatus.CREATED).json({
          success: true,
          data: {
            user: result.user,
            role: result.role,
            permissions: result.permissions,
            accessToken: result.accessToken,
            requiresOnboarding: result.requiresOnboarding,
          },
        });
        return;
      }

      // Application submission (Counsellor / Institution review)
      res.status(HttpStatus.ACCEPTED).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(
        req.body,
        req.ip,
        req.headers["user-agent"]
      );

      const expiresInDays = req.body.rememberMe ? 30 : env.REFRESH_TOKEN_EXPIRES_IN_DAYS;
      setRefreshCookie(res, result.refreshToken, expiresInDays);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          user: result.user,
          role: result.role,
          permissions: result.permissions,
          accessToken: result.accessToken,
          requiresOnboarding: result.requiresOnboarding,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/google
   */
  async google(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.googleLogin(
        req.body,
        req.ip,
        req.headers["user-agent"]
      );

      if ("refreshToken" in result) {
        setRefreshCookie(res, result.refreshToken);
        res.status(HttpStatus.OK).json({
          success: true,
          data: {
            user: result.user,
            role: result.role,
            permissions: result.permissions,
            accessToken: result.accessToken,
            requiresOnboarding: result.requiresOnboarding,
          },
        });
        return;
      }

      res.status(HttpStatus.ACCEPTED).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
      if (!rawRefreshToken) {
        throw AppError.unauthorized(
          "Refresh token is required in HttpOnly cookie.",
          "AUTH_REFRESH_TOKEN_MISSING"
        );
      }

      const result = await authService.refreshToken(
        rawRefreshToken,
        req.ip,
        req.headers["user-agent"]
      );

      setRefreshCookie(res, result.newRefreshToken);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user,
          role: result.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
      await authService.logout(rawRefreshToken);
      clearRefreshCookie(res);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          message: "Logged out successfully.",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/logout-all
   */
  async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      await authService.logoutAll(req.user.id);
      clearRefreshCookie(res);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          message: "All active sessions have been terminated.",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const me = await authService.getMe(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: me,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
