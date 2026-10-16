/**
 * 3G MeLife Messaging Socket.IO Gateway Layer
 *
 * Real-time event handling, handshake authentication, and room authorization.
 */

import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { env } from "../../config/env";
import { logger } from "../../common/utils/logger";
import { authTokenService } from "../auth/auth.token.service";
import { userRepository } from "../users/user.repository";
import { messagingRepository } from "./messaging.repository";
import { messagingService } from "./messaging.service";
import { SOCKET_EVENTS } from "./messaging.events";
import {
  MessageDTO,
  SocketUserContext,
  ReadReceiptPayload,
} from "./messaging.types";

interface ExtendedSocket extends Socket {
  data: {
    user: SocketUserContext;
  };
}

let ioInstance: SocketIOServer | null = null;

// Process-local active presence tracker: Set of online user IDs
const onlineUserIds = new Set<string>();

/**
 * Initializes Socket.IO attached to existing HTTP server.
 */
export const initMessagingSocket = (server: http.Server): SocketIOServer => {
  const io = new SocketIOServer(server, {
    path: "/socket.io",
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/+$/, "");
        const normalizedFrontend = (env.FRONTEND_URL || "").replace(/\/+$/, "");
        if (
          normalizedOrigin === normalizedFrontend ||
          env.NODE_ENV === "development" ||
          env.NODE_ENV === "test"
        ) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not permitted by Socket.IO CORS`));
      },
      credentials: true,
    },
    transports: ["polling", "websocket"],
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // 1. Handshake Authentication Middleware
  io.use(async (socket, next) => {
    try {
      // Extract access token strictly from auth handshake or Authorization header
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization?.startsWith("Bearer ")
          ? socket.handshake.headers.authorization.split(" ")[1]
          : null);

      if (!token) {
        return next(new Error("AUTH_UNAUTHORIZED: Missing access token in handshake"));
      }

      // Cryptographically verify access token
      const payload = authTokenService.verifyAccessToken(token);

      // Verify user in database
      const user = await userRepository.findById(payload.sub);
      if (!user || user.status === "SUSPENDED" || user.status === "DISABLED") {
        return next(new Error("AUTH_FORBIDDEN: User account is inactive or suspended"));
      }

      // If user is a counsellor, verify approved status
      let counsellorId: string | undefined;
      if (payload.role === "CAREER_COUNSELLOR") {
        const counsellor = await messagingRepository.findCounsellorByUserId(user.id);
        if (!counsellor || counsellor.approvalStatus !== "APPROVED") {
          return next(
            new Error("AUTH_FORBIDDEN: Counsellor account is not approved for messaging")
          );
        }
        counsellorId = counsellor.id;
      }

      (socket as ExtendedSocket).data = {
        user: {
          userId: user.id,
          email: user.email,
          role: payload.role,
          permissions: payload.permissions,
          counsellorId,
        },
      };

      next();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      logger.warn({ err: message }, "Socket handshake authentication rejected");
      next(new Error(`AUTH_UNAUTHORIZED: ${message}`));
    }
  });

  // 2. Connection Event Handler
  io.on("connection", (socket: Socket) => {
    const extSocket = socket as ExtendedSocket;
    const { userId, role, email } = extSocket.data.user;

    logger.info(
      { userId, role, socketId: socket.id, clientsCount: io.engine.clientsCount },
      "Real-time socket client connected"
    );

    // Join personal user room for direct user-targeted events
    const userRoom = `user:${userId}`;
    socket.join(userRoom);

    // Track presence
    onlineUserIds.add(userId);
    io.emit(SOCKET_EVENTS.PRESENCE_UPDATE, { userId, isOnline: true });

    // Handle Conversation Room Join with Authoritative Relationship & Membership Guard
    socket.on(SOCKET_EVENTS.CONVERSATION_JOIN, async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data || {};
        if (!conversationId) return;

        const access = await messagingService.verifyConversationSocketAccess(
          conversationId,
          userId,
          role
        );

        if (!access.conversation) {
          socket.emit(SOCKET_EVENTS.ERROR, {
            code: "MESSAGING_CONVERSATION_NOT_FOUND",
            message: "Conversation not found",
          });
          return;
        }

        if (!access.eligible) {
          logger.warn(
            { userId, conversationId },
            "Unauthorized socket conversation:join attempt blocked: Ineligible counselling relationship"
          );
          socket.emit(SOCKET_EVENTS.ERROR, {
            code: "MESSAGING_RELATIONSHIP_REQUIRED",
            message: "Messaging is locked. An accepted counselling session is required.",
          });
          return;
        }

        const convRoom = `conversation:${conversationId}`;
        socket.join(convRoom);
        logger.debug({ userId, conversationId }, "Socket joined conversation room");
      } catch (err) {
        logger.error({ err }, "Error during conversation:join");
      }
    });

    // Handle Conversation Room Leave
    socket.on(SOCKET_EVENTS.CONVERSATION_LEAVE, (data: { conversationId: string }) => {
      if (data?.conversationId) {
        socket.leave(`conversation:${data.conversationId}`);
      }
    });

    // Handle Typing Start (Ephemeral) - Re-checking relationship authorization
    socket.on(SOCKET_EVENTS.TYPING_START, async (data: { conversationId: string; userName: string }) => {
      try {
        if (!data?.conversationId) return;
        const access = await messagingService.verifyConversationSocketAccess(
          data.conversationId,
          userId,
          role
        );
        if (!access.eligible) return;

        socket.to(`conversation:${data.conversationId}`).emit(SOCKET_EVENTS.USER_TYPING, {
          conversationId: data.conversationId,
          userId,
          userName: data.userName || email,
          isTyping: true,
        });
      } catch {
        // Ignore typing event error
      }
    });

    // Handle Typing Stop (Ephemeral) - Re-checking relationship authorization
    socket.on(SOCKET_EVENTS.TYPING_STOP, async (data: { conversationId: string }) => {
      try {
        if (!data?.conversationId) return;
        const access = await messagingService.verifyConversationSocketAccess(
          data.conversationId,
          userId,
          role
        );
        if (!access.eligible) return;

        socket.to(`conversation:${data.conversationId}`).emit(SOCKET_EVENTS.USER_TYPING, {
          conversationId: data.conversationId,
          userId,
          userName: email,
          isTyping: false,
        });
      } catch {
        // Ignore typing event error
      }
    });

    // Handle Disconnect
    socket.on("disconnect", (reason) => {
      logger.info(
        { userId, socketId: socket.id, reason, clientsCount: io.engine.clientsCount },
        "Real-time socket client disconnected"
      );

      // Check if user has other active sockets
      const userSockets = io.sockets.adapter.rooms.get(userRoom);
      if (!userSockets || userSockets.size === 0) {
        onlineUserIds.delete(userId);
        io.emit(SOCKET_EVENTS.PRESENCE_UPDATE, { userId, isOnline: false });
      }
    });
  });

  ioInstance = io;
  return io;
};

/**
 * Returns the active Socket.IO server instance.
 */
export const getMessagingIO = (): SocketIOServer | null => {
  return ioInstance;
};

/**
 * Cleanly closes Socket.IO during graceful server shutdown.
 */
export const closeMessagingSocket = async (): Promise<void> => {
  if (ioInstance) {
    logger.info("Closing Socket.IO connections...");
    await new Promise<void>((resolve) => {
      ioInstance!.close(() => {
        logger.info("Socket.IO closed cleanly.");
        resolve();
      });
    });
    ioInstance = null;
  }
};

/**
 * Real-time event broadcasting helpers
 */
export const broadcastNewMessage = (
  conversationId: string,
  message: MessageDTO,
  recipientUserId: string
): void => {
  if (!ioInstance) return;

  // Emit to conversation room (for users currently viewing the thread)
  ioInstance.to(`conversation:${conversationId}`).emit(SOCKET_EVENTS.MESSAGE_NEW, message);

  // Also emit to recipient's personal user room (for unread count updates/toast notifications)
  ioInstance.to(`user:${recipientUserId}`).emit(SOCKET_EVENTS.MESSAGE_NEW, message);
};

export const broadcastMessageRead = (
  conversationId: string,
  payload: ReadReceiptPayload
): void => {
  if (!ioInstance) return;
  ioInstance.to(`conversation:${conversationId}`).emit(SOCKET_EVENTS.MESSAGE_READ_RECEIPT, payload);
};

export const broadcastConversationUpdated = (
  conversationId: string,
  participantUserIds: string[]
): void => {
  if (!ioInstance) return;
  for (const uid of participantUserIds) {
    ioInstance.to(`user:${uid}`).emit(SOCKET_EVENTS.CONVERSATION_UPDATED, { conversationId });
  }
};

export const broadcastAccessChanged = (
  userId: string,
  hasAccess: boolean
): void => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(SOCKET_EVENTS.ACCESS_CHANGED, { hasAccess });
};

export const broadcastConversationAvailable = (
  userId: string,
  conversationId: string
): void => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(SOCKET_EVENTS.CONVERSATION_AVAILABLE, { conversationId });
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUserIds.has(userId);
};
