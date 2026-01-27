/**
 * Socket.IO Service for LinkedIn-style Real-time Forum Updates
 * Handles connection, rooms, and event listeners
 */
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize socket connection
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on("connect", () => {
      
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
      }
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Join user's personal room for notifications
   */
  joinUserRoom(userId: string): void {
    if (this.socket) {
      this.socket.emit("user:join", userId);
    }
  }

  /**
   * Join discussion room for real-time updates
   */
  joinDiscussionRoom(discussionId: string): void {
    if (this.socket) {
      this.socket.emit("discussion:join", discussionId);
    }
  }

  /**
   * Leave discussion room
   */
  leaveDiscussionRoom(discussionId: string): void {
    if (this.socket) {
      this.socket.emit("discussion:leave", discussionId);
    }
  }

  /**
   * Emit typing indicator
   */
  emitTyping(discussionId: string, userId: string, userName: string): void {
    if (this.socket) {
      this.socket.emit("user:typing", { discussionId, userId, userName });
    }
  }

  /**
   * Emit stop typing indicator
   */
  emitStopTyping(discussionId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit("user:stop-typing", { discussionId, userId });
    }
  }

  /**
   * Track post view
   */
  trackPostView(discussionId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit("post:view", { discussionId, userId });
    }
  }

  // ========== Event Listeners ==========

  /**
   * Listen for new posts (LinkedIn-style feed updates)
   */
  onNewPost(callback: (post: any) => void): void {
    this.socket?.on("post:new", callback);
  }

  /**
   * Listen for post updates (likes, comments count)
   */
  onPostUpdated(callback: (data: { discussionId: string; likes: number }) => void): void {
    this.socket?.on("post:updated", callback);
  }

  /**
   * Listen for new comments
   */
  onNewComment(callback: (comment: any) => void): void {
    this.socket?.on("comment:new", callback);
  }

  /**
   * Listen for comment updates (likes)
   */
  onCommentUpdated(callback: (data: { commentId: string; likes: number }) => void): void {
    this.socket?.on("comment:updated", callback);
  }

  /**
   * Listen for new notifications
   */
  onNewNotification(callback: (notification: any) => void): void {
    this.socket?.on("notification:new", callback);
  }

  /**
   * Listen for typing indicators
   */
  onUserTyping(callback: (data: { userId: string; userName: string }) => void): void {
    this.socket?.on("user:typing:indicator", callback);
  }

  /**
   * Listen for stop typing indicators
   */
  onUserStopTyping(callback: (data: { userId: string }) => void): void {
    this.socket?.on("user:stop-typing:indicator", callback);
  }

  // ========== Remove Event Listeners ==========

  /**
   * Remove specific event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
