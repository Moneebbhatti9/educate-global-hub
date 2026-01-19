/**
 * LinkedIn-Style Notifications Page
 * Displays all notifications with filtering and actions
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  ThumbsUp,
  MessageCircle,
  AtSign,
  Reply,
  Check,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { forumAPI } from "@/apis/forum";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import socketService from "@/services/socketService";

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

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter, page]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socketService.onNewNotification(handleNewNotification);

    return () => {
      socketService.off("notification:new", handleNewNotification);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await forumAPI.getForumNotifications({
        page,
        limit: 20,
        unreadOnly: filter === "unread",
      });

      if (page === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setHasMore(data.pagination.page < data.pagination.totalPages);
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
  };

  const markAsRead = async (notificationIds: string[] | "all") => {
    try {
      await forumAPI.markNotificationsAsRead(notificationIds);

      if (notificationIds === "all") {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      } else {
        setNotifications((prev) =>
          prev.map((n) =>
            notificationIds.includes(n._id) ? { ...n, isRead: true } : n
          )
        );
      }

      toast({
        title: "Success",
        description: "Notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await forumAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

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

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      like: <ThumbsUp className="w-5 h-5 text-[#0A66C2]" />,
      comment: <MessageCircle className="w-5 h-5 text-[#057642]" />,
      reply: <Reply className="w-5 h-5 text-[#7C3AED]" />,
      mention: <AtSign className="w-5 h-5 text-[#F97316]" />,
    };
    return iconMap[type as keyof typeof iconMap] || <Bell className="w-5 h-5 text-gray-500" />;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/forum"
                className="inline-flex items-center text-sm text-gray-600 hover:text-[#0A66C2] mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Forum
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={() => markAsRead("all")}
                className="flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="mb-4">
          <TabsList className="bg-white w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All Notifications
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 sm:flex-initial">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {loading && page === 1 ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0A66C2] mb-3" />
                <p className="text-gray-600">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={notification.sender.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white font-semibold">
                          {notification.sender.firstName[0]}
                          {notification.sender.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">
                                {notification.sender.firstName}{" "}
                                {notification.sender.lastName}
                              </span>{" "}
                              <span className="text-gray-600">{notification.message}</span>
                            </p>
                            {notification.discussion && (
                              <Link
                                to={`/forum/${notification.discussion._id}`}
                                className="text-sm text-[#0A66C2] hover:underline mt-1 block line-clamp-1"
                                onClick={() => !notification.isRead && markAsRead([notification._id])}
                              >
                                {notification.discussion.title}
                              </Link>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Badge className="bg-[#0A66C2] text-white text-xs px-2 py-0.5">
                              New
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-3">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead([notification._id])}
                              className="h-7 text-xs text-[#0A66C2] hover:text-[#004182]"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification._id)}
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
            {hasMore && notifications.length > 0 && (
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
