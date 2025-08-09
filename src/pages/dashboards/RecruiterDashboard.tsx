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
  Building2,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Phone,
  Calendar,
  ArrowRight,
  UserCheck,
  Target,
  Award,
} from "lucide-react";

const RecruiterDashboard = () => {
  const stats = [
    {
      title: "Active Placements",
      value: "12",
      change: "+3",
      icon: Briefcase,
      color: "text-brand-primary",
    },
    {
      title: "Total Candidates",
      value: "89",
      change: "+15",
      icon: Users,
      color: "text-brand-accent-green",
    },
    {
      title: "Client Schools",
      value: "24",
      change: "+4",
      icon: Building2,
      color: "text-brand-secondary",
    },
    {
      title: "Commission This Month",
      value: "$12,500",
      change: "+28%",
      icon: DollarSign,
      color: "text-brand-accent-orange",
    },
  ];

  const activePlacements = [
    {
      id: 1,
      position: "Mathematics Teacher",
      client: "International School of Bangkok",
      candidate: "Sarah Johnson",
      status: "Interview Stage",
      commission: "$3,200",
      progress: 75,
      deadline: "March 30, 2024",
    },
    {
      id: 2,
      position: "English Head of Department",
      client: "British School Dubai",
      candidate: "Michael Chen",
      status: "Contract Negotiation",
      commission: "$4,800",
      progress: 90,
      deadline: "April 5, 2024",
    },
    {
      id: 3,
      position: "Science Teacher",
      client: "American School Singapore",
      candidate: "Emily Rodriguez",
      status: "Reference Check",
      commission: "$2,900",
      progress: 60,
      deadline: "April 10, 2024",
    },
  ];

  const topCandidates = [
    {
      id: 1,
      name: "Dr. James Wilson",
      specialization: "Physics & Mathematics",
      experience: "12 years",
      location: "London, UK",
      rating: 4.9,
      status: "Available",
      lastContact: "2 days ago",
      placements: 8,
    },
    {
      id: 2,
      name: "Maria Santos",
      specialization: "Primary Education",
      experience: "7 years",
      location: "Madrid, Spain",
      rating: 4.7,
      status: "In Process",
      lastContact: "5 days ago",
      placements: 5,
    },
    {
      id: 3,
      name: "David Kim",
      specialization: "Computer Science",
      experience: "9 years",
      location: "Seoul, South Korea",
      rating: 4.8,
      status: "Available",
      lastContact: "1 week ago",
      placements: 6,
    },
  ];

  const clientRequests = [
    {
      id: 1,
      school: "Qatar International School",
      position: "IB Mathematics Teacher",
      urgency: "High",
      budget: "$65,000",
      deadline: "March 25, 2024",
      requirements: "IB certification required",
    },
    {
      id: 2,
      school: "German School Shanghai",
      position: "German Language Teacher",
      urgency: "Medium",
      budget: "$55,000",
      deadline: "April 15, 2024",
      requirements: "Native German speaker",
    },
    {
      id: 3,
      school: "International School Mumbai",
      position: "Art Teacher",
      urgency: "Low",
      budget: "$42,000",
      deadline: "May 1, 2024",
      requirements: "Portfolio required",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-brand-accent-green text-white";
      case "In Process":
        return "bg-brand-secondary text-white";
      case "Interview Stage":
        return "bg-brand-primary text-white";
      case "Contract Negotiation":
        return "bg-brand-accent-orange text-white";
      case "Reference Check":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-brand-accent-green text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout
      role="recruiter"
      userName="Alexandra Smith"
      userEmail="alex.smith@recruitment.com"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Good morning, Alexandra! 🎯
          </h1>
          <p className="text-muted-foreground">
            You have 3 urgent client requests and 5 candidates ready for
            placement.
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
          {/* Active Placements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">
                    Active Placements
                  </CardTitle>
                  <Button variant="default">
                    <Target className="w-4 h-4 mr-2" />
                    New Placement
                  </Button>
                </div>
                <CardDescription>
                  Track your current placement pipeline and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activePlacements.map((placement) => (
                  <div
                    key={placement.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {placement.position}
                        </h3>
                        <p className="text-muted-foreground">
                          {placement.client}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Candidate: {placement.candidate}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(placement.status)}>
                          {placement.status}
                        </Badge>
                        <div className="text-sm font-semibold text-brand-accent-green mt-1">
                          {placement.commission}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{placement.progress}%</span>
                      </div>
                      <Progress value={placement.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {placement.deadline}
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                        <Button variant="default" size="sm">
                          Details
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
            {/* Client Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  New Client Requests
                </CardTitle>
                <CardDescription>
                  Recent job requests from schools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {clientRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {request.position}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {request.school}
                        </p>
                      </div>
                      <Badge
                        className={`${getUrgencyColor(
                          request.urgency
                        )} text-xs`}
                      >
                        {request.urgency}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {request.budget}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {request.deadline}
                      </div>
                      <div className="text-xs">{request.requirements}</div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  View All Requests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Top Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Top Candidates
                </CardTitle>
                <CardDescription>
                  Your most promising candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCandidates.slice(0, 3).map((candidate) => (
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
                          {candidate.specialization}
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
                          <div className="text-xs text-muted-foreground">
                            <Award className="w-3 h-3 inline mr-1" />
                            {candidate.placements} placements
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  Browse All Candidates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-brand-primary">
                      8
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Successful Placements
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brand-accent-green">
                      94%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Client Satisfaction
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Placement Success Rate</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Avg. placement time:</span>
                    <span>22 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top placement type:</span>
                    <span>Math Teachers</span>
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

export default RecruiterDashboard;
