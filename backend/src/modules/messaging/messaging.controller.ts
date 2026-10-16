/**
 * 3G MeLife Messaging Controller
 *
 * REST API Controller for student-counsellor real-time messaging.
 */

import { Request, Response, NextFunction } from "express";
import { messagingService } from "./messaging.service";
import {
  createConversationSchema,
  sendMessageSchema,
  getMessagesQuerySchema,
} from "./messaging.schema";

export class MessagingController {
  /**
   * GET /api/v1/messaging/conversations
   */
  async listConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversations = await messagingService.listUserConversations(
        req.user!.id,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/messaging/conversations/:conversationId
   */
  async getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const conversation = await messagingService.getConversationById(
        conversationId,
        req.user!.id,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/messaging/conversations
   */
  async createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input = createConversationSchema.parse(req.body);
      const conversation = await messagingService.getOrCreateConversation(
        req.user!.id,
        req.user!.role,
        input
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/messaging/conversations/:conversationId/messages
   */
  async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const query = getMessagesQuerySchema.parse(req.query);
      const page = await messagingService.getMessages(
        conversationId,
        req.user!.id,
        req.user!.role,
        query
      );

      res.status(200).json({
        success: true,
        data: page.items,
        pagination: {
          nextCursor: page.nextCursor,
          hasMore: page.hasMore,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/messaging/conversations/:conversationId/messages
   */
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const input = sendMessageSchema.parse(req.body);
      const message = await messagingService.sendMessage(
        conversationId,
        req.user!.id,
        req.user!.role,
        input
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/messaging/conversations/:conversationId/read
   */
  async markAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const result = await messagingService.markAsRead(
        conversationId,
        req.user!.id,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/messaging/access
   */
  async getAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const access = await messagingService.getMessagingAccess(
        req.user!.id,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: access,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/messaging/unread-count
   */
  async getUnreadCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const unreadCount = await messagingService.getUnreadCount(req.user!.id);

      res.status(200).json({
        success: true,
        data: {
          unreadCount,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const messagingController = new MessagingController();
