/**
 * 3G MeLife Messaging Socket Client Singleton Service
 *
 * Manages one persistent authenticated Socket.IO connection per client session.
 */

import { io, Socket } from "socket.io-client";
import { API_BASE_URL, ACCESS_TOKEN_KEY } from "@/services/api/client";
import { SocketConnectionState } from "../types/messaging.types";

const rawSocketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const SOCKET_URL = rawSocketUrl;

class MessagingSocketService {
  private socket: Socket | null = null;
  private connectionState: SocketConnectionState = "OFFLINE";
  private stateListeners: Set<(state: SocketConnectionState) => void> = new Set();

  /**
   * Returns or initializes the authenticated socket singleton.
   */
  getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (!this.socket) {
      this.initSocket();
    }

    return this.socket;
  }

  /**
   * Initializes connection with authentication handshake.
   */
  private initSocket(): Socket | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      this.updateState("OFFLINE");
      return null;
    }

    this.updateState("CONNECTING");

    this.socket = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 10000,
    });

    this.socket.on("connect", () => {
      this.updateState("CONNECTED");
    });

    this.socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, reconnect manually if authenticated
        this.updateState("OFFLINE");
      } else {
        this.updateState("RECONNECTING");
      }
    });

    this.socket.on("connect_error", () => {
      this.updateState("RECONNECTING");
    });

    return this.socket;
  }

  /**
   * Updates authentication token on existing or next connection.
   */
  updateToken(token: string | null): void {
    if (!token) {
      this.disconnect();
      return;
    }

    if (this.socket) {
      this.socket.auth = { token };
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else {
      this.initSocket();
    }
  }

  /**
   * Disconnects and destroys the socket instance on logout.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.updateState("OFFLINE");
  }

  /**
   * Subscribes to connection state changes.
   */
  subscribeConnectionState(listener: (state: SocketConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.connectionState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  getConnectionState(): SocketConnectionState {
    return this.connectionState;
  }

  private updateState(state: SocketConnectionState): void {
    this.connectionState = state;
    for (const listener of this.stateListeners) {
      listener(state);
    }
  }

  // --- Room Actions ---

  joinConversation(conversationId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("conversation:join", { conversationId });
    }
  }

  leaveConversation(conversationId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("conversation:leave", { conversationId });
    }
  }

  startTyping(conversationId: string, userName: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("typing:start", { conversationId, userName });
    }
  }

  stopTyping(conversationId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("typing:stop", { conversationId });
    }
  }
}

export const messagingSocketService = new MessagingSocketService();
