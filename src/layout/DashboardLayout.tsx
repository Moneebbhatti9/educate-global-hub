import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Building2,
  UserCheck,
  Truck,
  PlusCircle,
  FileText,
  BarChart3,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  MessagesSquare,
  Upload,
  DollarSign,
  FolderOpen,
  ShoppingCart,
  Wallet,
  List,
  ChevronDown,
  Sliders,
  CreditCard,
  Check,
  MailOpen,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import EducateLink2 from "@/assets/Educate-Link-2.png";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  useNotifications,
  useNotificationStats,
  useMarkAsRead,
} from "@/hooks/useNotifications";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "teacher" | "school" | "recruiter" | "supplier" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings: siteSettings } = useSiteSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Get notifications data
  const { data: notifications, refetch: refetchNotifications } = useNotifications({
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "desc",
  });
  const { data: notificationStats, refetch: refetchStats } = useNotificationStats();
  const markAsReadMutation = useMarkAsRead();

  // Handle mark single notification as read/unread
  const handleMarkAsRead = (notificationId: string, currentIsRead: boolean) => {
    markAsReadMutation.mutate(
      { notificationIds: [notificationId], isRead: !currentIsRead },
      {
        onSuccess: () => {
          refetchNotifications();
          refetchStats();
        },
      }
    );
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    const unreadIds = notifications?.data?.notifications
      ?.filter((n: any) => !n.isRead)
      ?.map((n: any) => n._id) || [];

    if (unreadIds.length > 0) {
      markAsReadMutation.mutate(
        { notificationIds: unreadIds, isRead: true },
        {
          onSuccess: () => {
            refetchNotifications();
            refetchStats();
          },
        }
      );
    }
  };

  const roleConfig = {
    teacher: {
      name: "Teacher",
      icon: GraduationCap,
      color: "bg-brand-primary text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/teacher`, icon: Home },
        {
          name: "Job Search",
          href: `/dashboard/teacher/jobs`,
          icon: Briefcase,
        },
        {
          name: "Applications",
          href: `/dashboard/teacher/applications`,
          icon: FileText,
        },
        // {
        //   name: "Upload Resource",
        //   href: `/dashboard/teacher/upload-resource`,
        //   icon: Upload,
        // },
        {
          name: "My Resources",
          href: `/dashboard/teacher/resource-management`,
          icon: FolderOpen,
        },
        {
          name: "My Library",
          href: `/my-library`,
          icon: BookOpen,
        },
        {
          name: "Earnings",
          href: `/dashboard/teacher/earnings`,
          icon: BarChart3,
        },
        {
          name: "Earnings & Withdraw",
          href: `/dashboard/teacher/withdraw`,
          icon: DollarSign,
        },
        {
          name: "Profile",
          href: `/dashboard/teacher/teacher-profile`,
          icon: User,
        },
        {
          name: "Settings",
          href: `/dashboard/teacher/settings`,
          icon: Settings,
        },
      ],
    },
    school: {
      name: "School",
      icon: Building2,
      color: "bg-brand-accent-green text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/school`, icon: Home },
        {
          name: "Job Postings",
          href: `/dashboard/school/postings`,
          icon: Briefcase,
        },
        {
          name: "Post Job",
          href: `/dashboard/school/post-job`,
          icon: PlusCircle,
        },
        {
          name: "Candidates",
          href: `/dashboard/school/candidates`,
          icon: Users,
        },
        {
          name: "Profile",
          href: `/dashboard/school/profile`,
          icon: User,
        },
        {
          name: "Settings",
          href: `/dashboard/school/settings`,
          icon: Settings,
        },
      ],
    },

    admin: {
      name: "Admin",
      icon: ShieldCheck,
      color: "bg-red-600 text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/admin`, icon: Home },
        { name: "Users", href: `/dashboard/admin/users`, icon: Users },
        { name: "Jobs", href: `/dashboard/admin/jobs`, icon: Briefcase },
        {
          name: "Forum",
          href: `/dashboard/admin/forum`,
          icon: MessagesSquare,
        },
        {
          name: "Resources",
          href: `/dashboard/admin/resources`,
          icon: FolderOpen,
        },
        {
          name: "Sales Management",
          href: `/dashboard/admin/sales-management`,
          icon: ShoppingCart,
        },
        {
          name: "Payout Management",
          href: `/dashboard/admin/payout-management`,
          icon: Wallet,
        },
        {
          name: "Platform Settings",
          href: `/dashboard/admin/general-settings`,
          icon: Settings,
          children: [
            {
              name: "General Settings",
              href: `/dashboard/admin/general-settings`,
              icon: Sliders,
            },
            {
              name: "Subscription & Financial",
              href: `/dashboard/admin/platform-settings`,
              icon: CreditCard,
            },
            {
              name: "Dropdown Options",
              href: `/dashboard/admin/dropdown-management`,
              icon: List,
            },
          ],
        },
      ],
    },
  };

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href: string) => location.pathname === href;

  const isChildActive = (children: any[]) => {
    return children?.some((child: any) => location.pathname === child.href);
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  // Auto-expand menu if a child is active
  useEffect(() => {
    config.navigation.forEach((item: any) => {
      if (item.children && isChildActive(item.children)) {
        if (!expandedMenus.includes(item.name)) {
          setExpandedMenus((prev) => [...prev, item.name]);
        }
      }
    });
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
    // Add visual feedback
    const button = document.querySelector("[data-sidebar-toggle]");
    if (button) {
      button.classList.add("scale-95");
      setTimeout(() => button.classList.remove("scale-95"), 150);
    }
  }, [sidebarOpen]);

  // Close sidebar on mobile when navigating and set initial state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcut for toggling sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job_posted":
      case "job_updated":
        return <Briefcase className="w-4 h-4" />;
      case "application_submitted":
      case "application_reviewed":
        return <Users className="w-4 h-4" />;
      case "reminder_apply":
      case "deadline_approaching":
        return <Clock className="w-4 h-4" />;
      case "system_alert":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  // Get user display info
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const displayEmail = user?.email;
  const unreadCount = notificationStats?.data?.stats?.unreadCount || notificationStats?.data?.unreadCount || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? "w-64" : "w-16"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className={`h-14 sm:h-16 border-b border-gray-200 flex items-center ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="flex-1 flex items-center justify-center">
                <img
                  src={siteSettings.logo || EducateLink2}
                  alt={siteSettings.siteName || "Educate Link"}
                  className="h-9 max-w-[180px] object-contain"
                />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden ml-2 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/" className="w-full flex items-center justify-center">
              <img
                src={siteSettings.logo || EducateLink2}
                alt={siteSettings.siteName || "Educate Link"}
                className="h-8 w-8 object-contain"
              />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${sidebarOpen ? 'p-3' : 'p-2'}`}>
          <div className="space-y-1">
            {config.navigation.map((item: any) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.includes(item.name);
              const childActive = hasChildren && isChildActive(item.children);

              // If item has children, render expandable menu
              if (hasChildren) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        childActive
                          ? "bg-brand-primary/10 text-brand-primary font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      } ${sidebarOpen ? "justify-between" : "justify-center"}`}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && (
                          <span className="text-sm">{item.name}</span>
                        )}
                      </div>
                      {sidebarOpen && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Sub-menu items */}
                    {sidebarOpen && isExpanded && (
                      <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                        {item.children.map((child: any) => {
                          const ChildIcon = child.icon;
                          const childIsActive = isActive(child.href);

                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                childIsActive
                                  ? "bg-brand-primary text-white font-medium"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              <ChildIcon className="w-4 h-4 flex-shrink-0" />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular menu item without children
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? "bg-brand-primary text-white font-medium shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-0 lg:ml-64" : "ml-0 lg:ml-16"
        }`}
      >
        {/* Fixed Top Bar */}
        <header className="sticky top-0 h-14 sm:h-16 bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between z-40">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              data-sidebar-toggle
              title={sidebarOpen ? "Collapse Sidebar (Ctrl+B)" : "Expand Sidebar (Ctrl+B)"}
              className="hover:bg-gray-100 transition-all duration-200 p-2"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-gray-600" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 text-gray-600" />
              )}
            </Button>

            {/* Portal Badge */}
            <Badge className={`${config.color} text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 flex items-center gap-2 shadow-sm`}>
              <RoleIcon className="w-4 h-4" />
              <span className="font-medium">{config.name} Portal</span>
            </Badge>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden p-2"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Desktop Search Input */}
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-brand-primary" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 w-48 md:w-64 lg:w-80 xl:w-96 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 hover:border-brand-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleNotifications}
                className="relative hover:bg-brand-primary/10 hover:scale-110 transition-all duration-300 p-2"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 hover:rotate-12" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              {/* Notifications Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Notifications
                      </h3>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-brand-primary hover:text-brand-primary/80"
                            disabled={markAsReadMutation.isPending}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark all read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleNotifications}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                    {notifications?.data?.notifications &&
                    notifications.data.notifications.length > 0 ? (
                      notifications.data.notifications.map((notification: any) => (
                        <div
                          key={notification._id}
                          className={`p-3 sm:p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-all duration-300 ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div
                              className={`mt-1 ${getNotificationColor(
                                notification.priority
                              )}`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                                  {notification.title}
                                </p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {!notification.isRead && (
                                    <span className="w-2 h-2 bg-brand-primary rounded-full" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification._id, notification.isRead);
                                  }}
                                  disabled={markAsReadMutation.isPending}
                                >
                                  {notification.isRead ? (
                                    <>
                                      <Mail className="w-3 h-3 mr-1" />
                                      Mark unread
                                    </>
                                  ) : (
                                    <>
                                      <MailOpen className="w-3 h-3 mr-1" />
                                      Mark read
                                    </>
                                  )}
                                </Button>
                                {notification.actionUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(
                                        notification.actionUrl,
                                        "_blank"
                                      );
                                      setNotificationsOpen(false);
                                    }}
                                  >
                                    {notification.actionText || "View"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 sm:p-8 text-center text-muted-foreground">
                        <Bell className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm sm:text-base">
                          No notifications yet
                        </p>
                        <p className="text-xs sm:text-sm">
                          We'll notify you when something important happens
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2"
                >
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarImage
                      src={
                        user?.avatarUrl ||
                        user?.avatar ||
                        "/api/placeholder/32/32"
                      }
                    />
                    <AvatarFallback className="text-xs">
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium">{displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {displayEmail}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/${
                      role === "teacher"
                        ? "teacher"
                        : role === "school"
                        ? "school"
                        : "admin"
                    }/profile`}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/${
                      role === "teacher"
                        ? "teacher"
                        : role === "school"
                        ? "school"
                        : "admin"
                    }/settings`}
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-500 hover:bg-red-100 hover:text-red-600 focus:bg-red-100 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2 text-red-500 group-hover:text-red-600" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-3 sm:p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
