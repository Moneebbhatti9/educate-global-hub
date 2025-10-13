/**
 * LinkedIn-Style Notification Bell Component
 * Shows real-time notifications with dropdown
 */
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import socketService from "@/services/socketService";
import { useAuth } from "@/contexts/AuthContext";
import { forumAPI } from "@/apis/forum";
import { toast } from "@/hooks/use-toast";

interface Notification {
  _id: string;
  sender: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  type: "like" | "comment" | "reply" | "mention";
  message: string;
  discussion?: {
    _id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: any) => {
      // Add new notification to the top
      setNotifications(prev => [notification, ...prev].slice(0, 20));
      setUnreadCount(prev => prev + 1);

      // Show toast notification (LinkedIn-style)
      toast({
        title: "New Notification",
        description: notification.message,
        duration: 3000,
      });

      // Play notification sound (optional)
      playNotificationSound();
    };

    socketService.onNewNotification(handleNewNotification);

    return () => {
      socketService.off("notification:new", handleNewNotification);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await forumAPI.getForumNotifications({ page: 1, limit: 20 });
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await forumAPI.getUnreadNotificationCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const markAsRead = async (notificationIds: string[] | "all") => {
    try {
      await forumAPI.markNotificationsAsRead(notificationIds);

      if (notificationIds === "all") {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      } else {
        setNotifications(prev =>
          prev.map(n =>
            notificationIds.includes(n._id) ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead([notification._id]);
    }

    // Navigate to discussion
    if (notification.discussion?._id) {
      window.location.href = `/forum/${notification.discussion._id}`;
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAsRead("all");
  };

  const playNotificationSound = () => {
    // Optional: Play a subtle notification sound
    try {
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore if audio doesn't play (e.g., user hasn't interacted with page)
      });
    } catch (error) {
      // Ignore errors
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      like: "👍",
      comment: "💬",
      reply: "↩️",
      mention: "@",
    };
    return icons[type as keyof typeof icons] || "🔔";
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-red-500 text-white text-xs font-semibold p-1 animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-[#0A66C2] hover:text-[#004182]"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <DropdownMenuItem
                  key={notification._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={notification.sender.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white text-sm">
                        {notification.sender.firstName[0]}
                        {notification.sender.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm">
                          <span className="font-semibold">
                            {notification.sender.firstName}{" "}
                            {notification.sender.lastName}
                          </span>{" "}
                          <span className="text-gray-600">{notification.message}</span>
                        </p>
                        <span className="text-lg flex-shrink-0 ml-2">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      {notification.discussion && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {notification.discussion.title}
                        </p>
                      )}

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-[#0A66C2]">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#0A66C2] rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-[#0A66C2] hover:bg-gray-100 font-medium"
            onClick={() => {
              window.location.href = "/notifications";
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
