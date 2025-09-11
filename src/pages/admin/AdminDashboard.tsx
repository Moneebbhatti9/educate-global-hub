import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  MessageSquare,
  TrendingUp,
  UserPlus,
  ArrowRight,
  BarChart3,
  FileText,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,547",
      change: "+12%",
      icon: Users,
      color: "text-brand-primary",
    },
    {
      title: "Active Jobs",
      value: "342",
      change: "+8%",
      icon: Briefcase,
      color: "text-brand-accent-green",
    },
    {
      title: "Forum Posts",
      value: "1,234",
      change: "+15%",
      icon: MessageSquare,
      color: "text-brand-secondary",
    },
    {
      title: "Platform Revenue",
      value: "$45,672",
      change: "+23%",
      icon: TrendingUp,
      color: "text-brand-accent-orange",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "New school registration",
      details: "International School Dubai joined the platform",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "job",
      action: "Job posting reported",
      details: "Mathematics Teacher position flagged for review",
      time: "4 hours ago",
      status: "warning",
    },
    {
      id: 3,
      type: "system",
      action: "System maintenance completed",
      details: "Database optimization and security updates",
      time: "6 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "user",
      action: "Bulk user import",
      details: "125 teacher profiles imported from partner platform",
      time: "1 day ago",
      status: "success",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-brand-accent-green" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-brand-accent-orange" />;
      default:
        return <Shield className="w-4 h-4 text-brand-primary" />;
    }
  };

  const navigate = useNavigate();

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-muted-foreground">
            Monitor platform performance and manage system operations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-card-hover transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-brand-accent-green">
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">
                    Recent Activities
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <CardDescription>
                  Latest system activities and user actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <h4 className="font-semibold text-sm">
                          {activity.action}
                        </h4>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("jobs")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("forum")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forum Management
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-brand-accent-green text-white">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-brand-accent-green text-white">
                    Healthy
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <Badge className="bg-brand-accent-green text-white">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  <Badge className="bg-brand-accent-orange text-white">
                    Degraded
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">
                    +127
                  </div>
                  <p className="text-sm text-muted-foreground">New users this week</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Teachers</span>
                    <span>78 (+12%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Schools</span>
                    <span>34 (+15%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recruiters</span>
                    <span>12 (+8%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Suppliers</span>
                    <span>3 (+25%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;