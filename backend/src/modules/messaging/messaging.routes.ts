/**
 * 3G MeLife Messaging Routes
 *
 * Mounts secure, authenticated endpoints for student-counsellor messaging.
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../middleware/authenticate.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import { messagingController } from "./messaging.controller";
import { env } from "../../config/env";

const messagingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "development" || env.NODE_ENV === "test",
  message: {
    success: false,
    error: {
      code: "MESSAGING_RATE_LIMITED",
      message: "Too many messaging requests. Please slow down.",
    },
  },
});

export const messagingRouter = Router();

// Enforce authentication & allowed roles across all messaging endpoints
messagingRouter.use(authenticate);
messagingRouter.use(
  requireRole("PARTICIPANT", "CAREER_COUNSELLOR", "SUPER_ADMIN")
);
messagingRouter.use(messagingLimiter);

// Access Check
messagingRouter.get("/access", (req, res, next) =>
  messagingController.getAccess(req, res, next)
);

// Conversations
messagingRouter.get("/conversations", (req, res, next) =>
  messagingController.listConversations(req, res, next)
);
messagingRouter.get("/conversations/:conversationId", (req, res, next) =>
  messagingController.getConversation(req, res, next)
);
messagingRouter.post("/conversations", (req, res, next) =>
  messagingController.createConversation(req, res, next)
);

// Messages
messagingRouter.get("/conversations/:conversationId/messages", (req, res, next) =>
  messagingController.getMessages(req, res, next)
);
messagingRouter.post("/conversations/:conversationId/messages", (req, res, next) =>
  messagingController.sendMessage(req, res, next)
);

// Read Receipts
messagingRouter.patch("/conversations/:conversationId/read", (req, res, next) =>
  messagingController.markAsRead(req, res, next)
);

// Unread Badge
messagingRouter.get("/unread-count", (req, res, next) =>
  messagingController.getUnreadCount(req, res, next)
);
