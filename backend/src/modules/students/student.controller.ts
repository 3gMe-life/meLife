import { Request, Response, NextFunction } from "express";
import { studentService } from "./student.service";
import { sessionRepository } from "../sessions/session.repository";
import { authTokenService } from "../auth/auth.token.service";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";

export class StudentController {
  /**
   * POST /api/v1/students/onboarding
   */
  async onboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let userId = req.user?.id;

      // If Bearer token was not sent in header, fallback to HttpOnly session cookie
      if (!userId) {
        const rawRefreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
        if (rawRefreshToken) {
          const tokenHash = authTokenService.hashRefreshToken(rawRefreshToken);
          const session = await sessionRepository.findActiveSessionByTokenHash(tokenHash);
          if (session) {
            userId = session.user_id;
          }
        }
      }

      if (!userId) {
        throw AppError.unauthorized(
          "Authentication required to complete student onboarding.",
          "AUTH_UNAUTHORIZED"
        );
      }

      const result = await studentService.completeOnboarding(userId, req.body);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const studentController = new StudentController();
