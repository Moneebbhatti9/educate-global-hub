import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { secureStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import { socketConfig } from "../config/socket";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      socketRef.current = io(socketConfig.url, {
        auth: { token },
        ...socketConfig.options,
      });

      // Connection event handlers
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    []
  );

  const off = useCallback(
    (event: string, callback?: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        if (callback) {
          socketRef.current.off(event, callback);
        } else {
          socketRef.current.off(event);
        }
      }
    },
    []
  );

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketRef.current?.connected || false,
  };
};
