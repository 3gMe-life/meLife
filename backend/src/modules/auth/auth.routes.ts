import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/authenticate.middleware";
import { registerSchema, loginSchema, googleAuthSchema, changePasswordSchema } from "./auth.schema";

const authRouter = Router();

// Stricter rate limiter for authentication endpoints to protect against brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "AUTH_TOO_MANY_REQUESTS",
      message: "Too many authentication attempts from this IP. Please try again later.",
    },
  },
});

// Apply rate limiter to all auth routes
authRouter.use(authLimiter);

/**
 * Primary Unified Registration Endpoint
 */
authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register
);

/**
 * Route Aliases for Specific Registration Paths
 */
authRouter.post(
  "/register/student",
  (req: Request, _res: Response, next: NextFunction) => {
    req.body.registrationPath = "STUDENT";
    next();
  },
  validateBody(registerSchema),
  authController.register
);

authRouter.post(
  "/register/parent",
  (req: Request, _res: Response, next: NextFunction) => {
    req.body.registrationPath = "PARENT";
    next();
  },
  validateBody(registerSchema),
  authController.register
);

authRouter.post(
  "/apply/counsellor",
  (req: Request, _res: Response, next: NextFunction) => {
    req.body.registrationPath = "COUNSELLOR";
    if (!req.body.email && req.body.professionalEmail) {
      req.body.email = req.body.professionalEmail;
    }
    next();
  },
  validateBody(registerSchema),
  authController.register
);

authRouter.post(
  "/apply/institution",
  (req: Request, _res: Response, next: NextFunction) => {
    req.body.registrationPath = "INSTITUTION";
    if (!req.body.email && req.body.officialEmail) {
      req.body.email = req.body.officialEmail;
    }
    if (req.body.contactName) {
      const parts = req.body.contactName.trim().split(" ");
      if (!req.body.firstName) req.body.firstName = parts[0] || "Admin";
      if (!req.body.lastName) req.body.lastName = parts.slice(1).join(" ") || "Contact";
    }
    next();
  },
  validateBody(registerSchema),
  authController.register
);

/**
 * Login & OAuth Endpoints
 */
authRouter.post(
  "/login",
  validateBody(loginSchema),
  authController.login
);

authRouter.post(
  "/google",
  validateBody(googleAuthSchema),
  authController.google
);

authRouter.post(
  "/refresh",
  authController.refresh
);

authRouter.post(
  "/logout",
  authController.logout
);

/**
 * Protected Authentication Endpoints (Bearer Access Token Required)
 */
authRouter.post(
  "/logout-all",
  authenticate,
  authController.logoutAll
);

authRouter.get(
  "/me",
  authenticate,
  authController.getMe
);

authRouter.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

export { authRouter };
