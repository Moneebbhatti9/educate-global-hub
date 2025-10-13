/**
 * Socket Context - LinkedIn-style Real-time Updates
 * Provides socket connection and event handling throughout the app
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Socket } from "socket.io-client";
import socketService from "@/services/socketService";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDiscussion: (discussionId: string) => void;
  leaveDiscussion: (discussionId: string) => void;
  emitTyping: (discussionId: string, userName: string) => void;
  emitStopTyping: (discussionId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect socket when user is authenticated
    if (user) {
      const newSocket = socketService.connect();
      setSocket(newSocket);

      // Listen for connection status
      newSocket.on("connect", () => {
        setIsConnected(true);
        // Join user's personal room for notifications
        if (user.id) {
          socketService.joinUserRoom(user.id);
        }
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      return () => {
        socketService.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user]);

  const joinDiscussion = (discussionId: string) => {
    socketService.joinDiscussionRoom(discussionId);
  };

  const leaveDiscussion = (discussionId: string) => {
    socketService.leaveDiscussionRoom(discussionId);
  };

  const emitTyping = (discussionId: string, userName: string) => {
    if (user?.id) {
      socketService.emitTyping(discussionId, user.id, userName);
    }
  };

  const emitStopTyping = (discussionId: string) => {
    if (user?.id) {
      socketService.emitStopTyping(discussionId, user.id);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinDiscussion,
        leaveDiscussion,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
