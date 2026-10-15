/**
 * Centralized Socket.IO Event Constants
 */

export const SOCKET_EVENTS = {
  // Client -> Server
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  MESSAGE_READ: "message:read",

  // Server -> Client
  MESSAGE_NEW: "message:new",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ_RECEIPT: "message:read",
  CONVERSATION_UPDATED: "conversation:updated",
  USER_TYPING: "user:typing",
  PRESENCE_UPDATE: "presence:update",
  ERROR: "error:event",
} as const;

export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
