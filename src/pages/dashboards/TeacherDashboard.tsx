import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageCircle,
  Star,
  Clock,
  DollarSign,
  Eye,
  ArrowRight
} from "lucide-react";

const TeacherDashboard = () => {
  const stats = [
    {
      title: "Profile Views",
      value: "47",
      change: "+12%",
      icon: Eye,
      color: "text-brand-primary"
    },
    {
      title: "Applications Sent",
      value: "8",
      change: "+3",
      icon: Briefcase,
      color: "text-brand-accent-green"
    },
    {
      title: "Interview Requests",
      value: "3",
      change: "+1",
      icon: Users,
      color: "text-brand-secondary"
    },
    {
      title: "Messages",
      value: "12",
      change: "+5",
      icon: MessageCircle,
      color: "text-brand-accent-orange"
    }
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Mathematics Teacher",
      school: "International School of Dubai",
      location: "Dubai, UAE",
      salary: "$45,000 - $65,000",
      type: "Full-time",
      posted: "2 days ago",
      applicants: 23
    },
    {
      id: 2,
      title: "High School Science Teacher",
      school: "British School of Singapore",
      location: "Singapore",
      salary: "$55,000 - $75,000",
      type: "Full-time",
      posted: "5 days ago",
      applicants: 18
    },
    {
      id: 3,
      title: "Elementary Teacher",
      school: "American International School",
      location: "Bangkok, Thailand",
      salary: "$35,000 - $50,000",
      type: "Full-time",
      posted: "1 week ago",
      applicants: 31
    }
  ];

  const applications = [
    {
      id: 1,
      position: "English Teacher",
      school: "International School of London",
      status: "Interview Scheduled",
      appliedDate: "March 15, 2024",
      statusColor: "bg-brand-accent-green text-white"
    },
    {
      id: 2,
      position: "Mathematics Teacher",
      school: "Dubai International Academy",
      status: "Under Review",
      appliedDate: "March 12, 2024",
      statusColor: "bg-brand-secondary text-white"
    },
    {
      id: 3,
      position: "Science Teacher",
      school: "Singapore American School",
      status: "Rejected",
      appliedDate: "March 8, 2024",
      statusColor: "bg-red-500 text-white"
    }
  ];

  return (
    <DashboardLayout role="teacher" userName="Sarah Johnson" userEmail="sarah.johnson@email.com">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your teaching career today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-card-hover transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-brand-accent-green">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Job Opportunities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">Recommended Jobs</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <CardDescription>
                  Jobs matched to your profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">{job.school}</p>
                      </div>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.posted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Profile Completion</CardTitle>
                <CardDescription>
                  Complete your profile to get more job matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Strength</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Add Profile Photo</span>
                    <span className="text-brand-accent-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Complete Work Experience</span>
                    <span className="text-brand-accent-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Add Certifications</span>
                    <span className="text-muted-foreground">○</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Upload CV/Resume</span>
                    <span className="text-brand-accent-green">✓</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 border border-border rounded-lg">
                    <div className="font-semibold text-sm mb-1">{app.position}</div>
                    <div className="text-sm text-muted-foreground mb-2">{app.school}</div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${app.statusColor}`}>
                        {app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{app.appliedDate}</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Schools
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Teaching Resources
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Forum Discussions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;