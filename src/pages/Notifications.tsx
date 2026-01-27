/**
 * Unified Notifications Page
 * Displays both job and forum notifications with filtering
 */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  ThumbsUp,
  MessageCircle,
  AtSign,
  Reply,
  Check,
  Trash2,
  Loader2,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  ShoppingCart,
  FileCheck,
} from "lucide-react";
import { forumAPI } from "@/apis/forum";
import { notificationsAPI } from "@/apis/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import socketService from "@/services/socketService";

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

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "job" | "forum">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const unified: UnifiedNotification[] = [];

      // Fetch job notifications
      try {
        const jobResponse = await notificationsAPI.getNotifications({
          page,
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
          page,
          limit: 20,
          unreadOnly: filter === "unread",
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

      if (page === 1) {
        setNotifications(unified);
      } else {
        setNotifications((prev) => [...prev, ...unified]);
      }

      setHasMore(unified.length >= 20);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, page, filter]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: any) => {
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

      setNotifications((prev) => [unifiedNotification, ...prev]);
    };

    socketService.onNewNotification(handleNewNotification);

    return () => {
      socketService.off("notification:new", handleNewNotification);
    };
  }, []);

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

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notification: UnifiedNotification) => {
    try {
      if (notification.source === "forum") {
        await forumAPI.deleteNotification(notification._id);
      } else {
        await notificationsAPI.deleteNotifications({
          notificationIds: [notification._id],
        });
      }

      setNotifications((prev) => prev.filter((n) => n._id !== notification._id));

      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const getNotificationIcon = (notification: UnifiedNotification) => {
    if (notification.source === "forum") {
      const forumIcons: Record<string, React.ReactNode> = {
        like: <ThumbsUp className="w-5 h-5 text-blue-500" />,
        comment: <MessageCircle className="w-5 h-5 text-green-500" />,
        reply: <Reply className="w-5 h-5 text-purple-500" />,
        mention: <AtSign className="w-5 h-5 text-orange-500" />,
      };
      return forumIcons[notification.type] || <MessageCircle className="w-5 h-5 text-gray-500" />;
    } else {
      const jobIcons: Record<string, React.ReactNode> = {
        job_match: <Briefcase className="w-5 h-5 text-blue-500" />,
        application_status: <FileCheck className="w-5 h-5 text-green-500" />,
        system_alert: <AlertCircle className="w-5 h-5 text-orange-500" />,
        sale: <ShoppingCart className="w-5 h-5 text-purple-500" />,
      };
      return jobIcons[notification.type] || <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSourceBadge = (source: "job" | "forum") => {
    if (source === "forum") {
      return (
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
          Forum
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
        System
      </Badge>
    );
  };

  const handleNotificationClick = (notification: UnifiedNotification) => {
    if (!notification.isRead) {
      markAsRead(notification);
    }

    if (notification.source === "forum" && notification.discussion?._id) {
      window.location.href = `/forum/${notification.discussion._id}`;
    } else if (notification.actionUrl) {
      if (notification.actionUrl.startsWith("http")) {
        window.open(notification.actionUrl, "_blank");
      } else {
        window.location.href = notification.actionUrl;
      }
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.source === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {/* Filters */}
        <Tabs
          value={filter}
          onValueChange={(v) => {
            setFilter(v as typeof filter);
            setPage(1);
          }}
          className="mb-4"
        >
          <TabsList className="bg-white w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 sm:flex-initial">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="job" className="flex-1 sm:flex-initial">
              System
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex-1 sm:flex-initial">
              Forum
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {loading && page === 1 ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                <p className="text-gray-600">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : filter === "job"
                    ? "No system notifications yet"
                    : filter === "forum"
                    ? "No forum notifications yet"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={`${notification.source}-${notification._id}`}
                    className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-blue-50/30" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar or Icon */}
                      {notification.sender ? (
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={notification.sender.avatarUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                            {notification.sender.firstName?.[0] || "U"}
                            {notification.sender.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification)}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {notification.title && (
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>
                            )}
                            <p className="text-sm text-gray-900">
                              {notification.sender && (
                                <span className="font-semibold">
                                  {notification.sender.firstName} {notification.sender.lastName}{" "}
                                </span>
                              )}
                              <span className="text-gray-600">{notification.message}</span>
                            </p>
                            {notification.discussion && (
                              <p className="text-sm text-primary hover:underline mt-1 line-clamp-1">
                                {notification.discussion.title}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {getNotificationIcon(notification)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          {getSourceBadge(notification.source)}
                          {!notification.isRead && (
                            <Badge className="bg-primary text-white text-xs px-2 py-0.5">New</Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-3">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification);
                              }}
                              className="h-7 text-xs text-primary hover:text-primary/80"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification);
                            }}
                            className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && filteredNotifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
