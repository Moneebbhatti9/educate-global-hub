/**
 * Unified Notification Bell Component
 * Shows both job notifications and forum notifications
 */
import React, { useState, useEffect, useCallback } from "react";
import { Bell, Briefcase, MessageCircle, ThumbsUp, AtSign, Reply, AlertCircle, ShoppingCart, FileCheck } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import socketService from "@/services/socketService";
import { useAuth } from "@/contexts/AuthContext";
import { forumAPI } from "@/apis/forum";
import { notificationsAPI } from "@/apis/notifications";
import { toast } from "@/hooks/use-toast";

// Unified notification type
interface UnifiedNotification {
  _id: string;
  source: "job" | "forum";
  type: string;
  title?: string;
  message: string;
  sender?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  discussion?: {
    _id: string;
    title: string;
  };
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  category?: string;
  priority?: string;
}

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "job" | "forum">("all");

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const unified: UnifiedNotification[] = [];

      // Fetch job notifications
      try {
        const jobResponse = await notificationsAPI.getNotifications({
          page: 1,
          limit: 20,
        });

        if (jobResponse.success && jobResponse.data?.notifications) {
          const jobNotifications = jobResponse.data.notifications.map((n: any) => ({
            _id: n._id,
            source: "job" as const,
            type: n.type,
            title: n.title,
            message: n.message,
            actionUrl: n.actionUrl,
            isRead: n.isRead,
            createdAt: n.createdAt,
            category: n.category,
            priority: n.priority,
          }));
          unified.push(...jobNotifications);
        }
      } catch (error) {
        console.error("Failed to fetch job notifications:", error);
      }

      // Fetch forum notifications
      try {
        const forumResponse = await forumAPI.getForumNotifications({
          page: 1,
          limit: 20,
        });

        if (forumResponse.notifications) {
          const forumNotifications = forumResponse.notifications.map((n: any) => ({
            _id: n._id,
            source: "forum" as const,
            type: n.type,
            message: n.message,
            sender: n.sender,
            discussion: n.discussion,
            isRead: n.isRead,
            createdAt: n.createdAt,
          }));
          unified.push(...forumNotifications);
        }
      } catch (error) {
        console.error("Failed to fetch forum notifications:", error);
      }

      // Sort by date (newest first)
      unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(unified);
      setUnreadCount(unified.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: any) => {
      // Determine source based on notification structure
      const isForumNotification = notification.sender && notification.discussion;

      const unifiedNotification: UnifiedNotification = isForumNotification
        ? {
            _id: notification._id,
            source: "forum",
            type: notification.type,
            message: notification.message,
            sender: notification.sender,
            discussion: notification.discussion,
            isRead: false,
            createdAt: notification.createdAt || new Date().toISOString(),
          }
        : {
            _id: notification._id,
            source: "job",
            type: notification.type,
            title: notification.title,
            message: notification.message,
            actionUrl: notification.actionUrl,
            isRead: false,
            createdAt: notification.createdAt || new Date().toISOString(),
            category: notification.category,
            priority: notification.priority,
          };

      // Add new notification to the top
      setNotifications((prev) => [unifiedNotification, ...prev].slice(0, 50));
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast({
        title: unifiedNotification.title || "New Notification",
        description: unifiedNotification.message,
        duration: 4000,
      });

      // Play notification sound
      playNotificationSound();
    };

    socketService.onNewNotification(handleNewNotification);

    return () => {
      socketService.off("notification:new", handleNewNotification);
    };
  }, []);

  // Mark notifications as read
  const markAsRead = async (notification: UnifiedNotification) => {
    try {
      if (notification.source === "forum") {
        await forumAPI.markNotificationsAsRead([notification._id]);
      } else {
        await notificationsAPI.markAsRead({
          notificationIds: [notification._id],
          isRead: true,
        });
      }

      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all forum notifications as read
      await forumAPI.markNotificationsAsRead("all");

      // Mark all job notifications as read
      const unreadJobIds = notifications
        .filter((n) => n.source === "job" && !n.isRead)
        .map((n) => n._id);

      if (unreadJobIds.length > 0) {
        await notificationsAPI.markAsRead({
          notificationIds: unreadJobIds,
          isRead: true,
        });
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = (notification: UnifiedNotification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification);
    }

    // Navigate based on notification type
    if (notification.source === "forum" && notification.discussion?._id) {
      window.location.href = `/forum/${notification.discussion._id}`;
    } else if (notification.actionUrl) {
      // Handle relative or absolute URL
      if (notification.actionUrl.startsWith("http")) {
        window.open(notification.actionUrl, "_blank");
      } else {
        window.location.href = notification.actionUrl;
      }
    }

    setIsOpen(false);
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
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

  const getNotificationIcon = (notification: UnifiedNotification) => {
    if (notification.source === "forum") {
      const forumIcons: Record<string, React.ReactNode> = {
        like: <ThumbsUp className="w-4 h-4 text-blue-500" />,
        comment: <MessageCircle className="w-4 h-4 text-green-500" />,
        reply: <Reply className="w-4 h-4 text-purple-500" />,
        mention: <AtSign className="w-4 h-4 text-orange-500" />,
      };
      return forumIcons[notification.type] || <MessageCircle className="w-4 h-4 text-gray-500" />;
    } else {
      const jobIcons: Record<string, React.ReactNode> = {
        job_match: <Briefcase className="w-4 h-4 text-blue-500" />,
        application_status: <FileCheck className="w-4 h-4 text-green-500" />,
        system_alert: <AlertCircle className="w-4 h-4 text-orange-500" />,
        sale: <ShoppingCart className="w-4 h-4 text-purple-500" />,
      };
      return jobIcons[notification.type] || <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceBadge = (source: "job" | "forum") => {
    if (source === "forum") {
      return (
        <Badge variant="outline" className="text-[10px] px-1 py-0 bg-purple-50 text-purple-600 border-purple-200">
          Forum
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] px-1 py-0 bg-blue-50 text-blue-600 border-blue-200">
        System
      </Badge>
    );
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    return n.source === activeTab;
  });

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
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-red-500 text-white text-xs font-semibold p-1 animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "job" | "forum")}>
            <TabsList className="w-full h-8">
              <TabsTrigger value="all" className="flex-1 text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="job" className="flex-1 text-xs">
                System
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex-1 text-xs">
                Forum
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <DropdownMenuItem
                  key={`${notification.source}-${notification._id}`}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    {/* Avatar or Icon */}
                    {notification.sender ? (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={notification.sender.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm">
                          {notification.sender.firstName?.[0] || "U"}
                          {notification.sender.lastName?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {notification.title && (
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {notification.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.sender && (
                              <span className="font-medium text-gray-900">
                                {notification.sender.firstName} {notification.sender.lastName}{" "}
                              </span>
                            )}
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex-shrink-0">{getNotificationIcon(notification)}</div>
                      </div>

                      {notification.discussion && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {notification.discussion.title}
                        </p>
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-primary">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        {getSourceBadge(notification.source)}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
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
            className="w-full text-primary hover:bg-gray-100 font-medium"
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
