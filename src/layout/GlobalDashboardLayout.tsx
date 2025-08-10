import { ReactNode, useState } from "react";
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
  Globe,
  User,
  Building2,
  UserCheck,
  Truck,
  Shield,
  CreditCard,
  FileText,
  PlusCircle,
  Filter,
  Calendar
} from "lucide-react";
import { UserRole } from "@/types/auth";

interface GlobalDashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName?: string;
  userEmail?: string;
  showComingSoon?: boolean;
}

const GlobalDashboardLayout = ({ 
  children, 
  role, 
  userName = "John Doe", 
  userEmail = "john@example.com",
  showComingSoon = false 
}: GlobalDashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const roleConfig = {
    teacher: {
      name: "Teacher",
      icon: User,
      color: "bg-brand-primary text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
        { name: "Job Search", href: `/dashboard/${role}/jobs`, icon: Briefcase },
        { name: "Applications", href: `/dashboard/${role}/applications`, icon: FileText },
        { name: "Messages", href: `/dashboard/${role}/messages`, icon: MessageSquare },
        { name: "Profile", href: `/dashboard/${role}/profile`, icon: User },
      ]
    },
    school: {
      name: "School",
      icon: Building2,
      color: "bg-brand-accent-green text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
        { name: "Post Jobs", href: `/dashboard/${role}/post-job`, icon: PlusCircle },
        { name: "Job Postings", href: `/dashboard/${role}/postings`, icon: Briefcase },
        { name: "Candidates", href: `/dashboard/${role}/candidates`, icon: Users },
        { name: "Messages", href: `/dashboard/${role}/messages`, icon: MessageSquare },
        { name: "Profile", href: `/dashboard/${role}/profile`, icon: Building2 },
      ]
    },
    recruiter: {
      name: "Recruiter",
      icon: UserCheck,
      color: "bg-brand-secondary text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
        { name: "Placements", href: `/dashboard/${role}/placements`, icon: Briefcase },
        { name: "Candidates", href: `/dashboard/${role}/candidates`, icon: Users },
        { name: "Clients", href: `/dashboard/${role}/clients`, icon: Building2 },
        { name: "Messages", href: `/dashboard/${role}/messages`, icon: MessageSquare },
      ]
    },
    supplier: {
      name: "Supplier",
      icon: Truck,
      color: "bg-brand-accent-orange text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
        { name: "Products", href: `/dashboard/${role}/products`, icon: BookOpen },
        { name: "Orders", href: `/dashboard/${role}/orders`, icon: Briefcase },
        { name: "Clients", href: `/dashboard/${role}/clients`, icon: Building2 },
        { name: "Messages", href: `/dashboard/${role}/messages`, icon: MessageSquare },
      ]
    },
    admin: {
      name: "Admin",
      icon: Shield,
      color: "bg-red-600 text-white",
      navigation: [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
        { name: "Users", href: `/dashboard/${role}/users`, icon: Users },
        { name: "Jobs", href: `/dashboard/${role}/jobs`, icon: Briefcase },
        { name: "Forum", href: `/dashboard/${role}/forum`, icon: MessageSquare },
        { name: "Subscriptions", href: `/dashboard/${role}/subscriptions`, icon: CreditCard },
      ]
    }
  };

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const handleSignOut = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate(`/dashboard/${role}/profile-management`);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white border-r border-border shadow-sm fixed left-0 top-0 h-full z-30">
        {/* Logo & Role */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg">Educate Link</div>
              <Badge variant="outline" className={`${config.color} text-xs mt-1`}>
                {config.name} Portal
              </Badge>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {config.navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  active 
                    ? 'bg-brand-primary text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-border bg-white">
          <Link
            to={`/dashboard/${role}/settings`}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Top Navbar */}
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between fixed top-0 right-0 left-64 z-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <RoleIcon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{config.name} Dashboard</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-96 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">{userName}</div>
                    <div className="text-xs text-muted-foreground">{userEmail}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile Management
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/${role}/settings`} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-6 bg-background mt-16 overflow-y-auto">
          {showComingSoon ? (
            <div className="relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                  <p className="text-gray-600">
                    This feature is currently under development and will be available soon.
                  </p>
                </div>
              </div>
              {/* Blurred content underneath */}
              <div className="filter blur-sm">
                {children}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default GlobalDashboardLayout;