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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Briefcase,
  Eye,
  MessageCircle,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  UserPlus,
  ArrowRight,
  MapPin,
  GraduationCap,
} from "lucide-react";

const SchoolDashboard = () => {
  const stats = [
    {
      title: "Active Job Postings",
      value: "6",
      change: "+2",
      icon: Briefcase,
      color: "text-brand-primary",
    },
    {
      title: "Total Applicants",
      value: "124",
      change: "+18",
      icon: Users,
      color: "text-brand-accent-green",
    },
    {
      title: "Interviews Scheduled",
      value: "8",
      change: "+3",
      icon: Calendar,
      color: "text-brand-secondary",
    },
    {
      title: "New Messages",
      value: "15",
      change: "+7",
      icon: MessageCircle,
      color: "text-brand-accent-orange",
    },
  ];

  const jobPostings = [
    {
      id: 1,
      title: "Mathematics Teacher",
      department: "Secondary School",
      applicants: 23,
      status: "Active",
      posted: "3 days ago",
      views: 156,
      expires: "March 30, 2024",
    },
    {
      id: 2,
      title: "English Language Teacher",
      department: "Primary School",
      applicants: 31,
      status: "Active",
      posted: "1 week ago",
      views: 204,
      expires: "April 5, 2024",
    },
    {
      id: 3,
      title: "Science Lab Coordinator",
      department: "Science Department",
      applicants: 12,
      status: "Draft",
      posted: "2 weeks ago",
      views: 89,
      expires: "April 15, 2024",
    },
  ];

  const recentCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Mathematics Teacher",
      experience: "8 years",
      education: "MSc Mathematics, University of Oxford",
      location: "London, UK",
      rating: 4.8,
      status: "Interview Scheduled",
      appliedDate: "March 15, 2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "English Language Teacher",
      experience: "5 years",
      education: "BA English Literature, Cambridge",
      location: "Singapore",
      rating: 4.6,
      status: "Under Review",
      appliedDate: "March 14, 2024",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Science Lab Coordinator",
      experience: "12 years",
      education: "PhD Chemistry, MIT",
      location: "Dubai, UAE",
      rating: 4.9,
      status: "New Application",
      appliedDate: "March 13, 2024",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-brand-accent-green text-white";
      case "Draft":
        return "bg-yellow-500 text-white";
      case "Interview Scheduled":
        return "bg-brand-secondary text-white";
      case "Under Review":
        return "bg-brand-primary text-white";
      case "New Application":
        return "bg-brand-accent-orange text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout
      role="school"
      userName="International School Dubai"
      userEmail="admin@isdubai.edu"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Welcome back! 🏫
          </h1>
          <p className="text-muted-foreground">
            Manage your recruitment activities and connect with qualified
            educators.
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
          {/* Job Postings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">
                    Active Job Postings
                  </CardTitle>
                  <Button variant="default">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
                <CardDescription>
                  Manage your current job listings and their performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobPostings.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">
                          {job.department}
                        </p>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{job.views} views</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{job.posted}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Expires: {job.expires}
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="default" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Recent Candidates
                </CardTitle>
                <CardDescription>
                  New applications requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCandidates.slice(0, 3).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {candidate.position}
                        </div>

                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{candidate.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            • {candidate.experience}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${getStatusColor(
                              candidate.status
                            )} text-xs`}
                          >
                            {candidate.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {candidate.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  View All Candidates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
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
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse Teachers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Candidates
                </Button>
              </CardContent>
            </Card>

            {/* Hiring Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Hiring Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Application Response Rate</span>
                    <span className="font-semibold">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Interview to Hire Ratio</span>
                    <span className="font-semibold">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Average time to hire:</span>
                    <span>18 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most successful posting:</span>
                    <span>English Teacher</span>
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

export default SchoolDashboard;
