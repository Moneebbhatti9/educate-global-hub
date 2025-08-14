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
  ArrowRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  AlertCircle,
  Bookmark,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherApplications } from "@/hooks/useApplications";
import { useApplicationStats } from "@/hooks/useApplications";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useSavedJobStats } from "@/hooks/useSavedJobs";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStats } from "@/hooks/useNotifications";
import { useState } from "react";
import { ApplicationStatus } from "@/types/job";
import { useWithdrawApplication } from "@/hooks/useApplications";
import { useSaveJob } from "@/hooks/useSavedJobs";
import { useRemoveSavedJob } from "@/hooks/useSavedJobs";
import { toast } from "sonner";

const TeacherDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "applications" | "saved"
  >("overview");

  // Fetch real-time data
  const { data: teacherApplications } = useTeacherApplications(user?.id || "", {
    page: 1,
    limit: 10,
  });

  const { data: applicationStats } = useApplicationStats();
  const { data: savedJobStats } = useSavedJobStats();
  const { data: savedJobs } = useSavedJobs({ page: 1, limit: 10 });
  const { data: notificationStats } = useNotificationStats();
  const { data: unreadNotifications } = useNotifications({
    isRead: false,
    limit: 5,
  });

  // Application management mutations
  const withdrawApplication = useWithdrawApplication();
  const saveJob = useSaveJob();
  const removeSavedJob = useRemoveSavedJob();

  const stats = [
    {
      title: "Profile Views",
      value: "47",
      change: "+12%",
      icon: Eye,
      color: "text-brand-primary",
    },
    {
      title: "Applications Sent",
      value: applicationStats?.data?.total || "0",
      change: "+3",
      icon: Briefcase,
      color: "text-brand-accent-green",
    },
    {
      title: "Interview Requests",
      value: applicationStats?.data?.interviewed || "0",
      change: "+1",
      icon: Users,
      color: "text-brand-secondary",
    },
    {
      title: "Messages",
      value: notificationStats?.data?.unreadCount || "0",
      change: "+5",
      icon: MessageCircle,
      color: "text-brand-accent-orange",
    },
  ];

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock3,
        label: "Pending",
      },
      reviewing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Eye,
        label: "Under Review",
      },
      shortlisted: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Star,
        label: "Shortlisted",
      },
      interviewed: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Calendar,
        label: "Interviewed",
      },
      accepted: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Accepted",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Rejected",
      },
      withdrawn: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        label: "Withdrawn",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border font-medium px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getJobTypeBadge = (jobType: string) => {
    const typeConfig = {
      full_time: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Briefcase,
        label: "Full Time",
      },
      part_time: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Clock,
        label: "Part Time",
      },
      contract: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FileText,
        label: "Contract",
      },
      substitute: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Users,
        label: "Substitute",
      },
    };

    const config = typeConfig[jobType] || typeConfig.full_time;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border font-medium px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
        label: "Low Priority",
      },
      medium: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Star,
        label: "Medium Priority",
      },
      high: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
        label: "High Priority",
      },
      urgent: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
        label: "Urgent",
      },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border font-medium px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      await withdrawApplication.mutateAsync({
        applicationId,
        reason: "Withdrawn by applicant",
      });
      toast.success("Application withdrawn successfully");
    } catch (error) {
      toast.error("Failed to withdraw application");
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await saveJob.mutateAsync({ jobId, data: { priority: "medium" } });
      toast.success("Job saved successfully");
    } catch (error) {
      toast.error("Failed to save job");
    }
  };

  const handleRemoveSavedJob = async (savedJobId: string) => {
    try {
      await removeSavedJob.mutateAsync(savedJobId);
      toast.success("Job removed from saved list");
    } catch (error) {
      toast.error("Failed to remove saved job");
    }
  };

  const recentJobs = [
    {
      id: 1,
      title: "Mathematics Teacher",
      school: "International School of Dubai",
      location: "Dubai, UAE",
      salary: "$45,000 - $65,000",
      type: "Full-time",
      posted: "2 days ago",
      applicants: 23,
    },
    {
      id: 2,
      title: "High School Science Teacher",
      school: "British School of Singapore",
      location: "Singapore",
      salary: "$55,000 - $75,000",
      type: "Full-time",
      posted: "5 days ago",
      applicants: 18,
    },
    {
      id: 3,
      title: "Elementary Teacher",
      school: "American International School",
      location: "Bangkok, Thailand",
      salary: "$35,000 - $50,000",
      type: "Full-time",
      posted: "1 week ago",
      applicants: 31,
    },
  ];

  const applications = teacherApplications?.data?.data || [];

  return (
    <DashboardLayout role="teacher">
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "applications" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("applications")}
            className="flex-1"
          >
            My Applications ({applications.length})
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("saved")}
            className="flex-1"
          >
            Saved Jobs ({savedJobs?.data?.data?.length || 0})
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Job Opportunities */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-xl">
                      Recommended Jobs
                    </CardTitle>
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
                    <div
                      key={job.id}
                      className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all cursor-pointer"
                    >
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
                  <CardTitle className="font-heading text-lg">
                    Profile Completion
                  </CardTitle>
                  <CardDescription>
                    Complete your profile to get more job matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Personal Information</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Education & Experience</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certifications</span>
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>References</span>
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Recent Applications
                  </CardTitle>
                  <CardDescription>
                    Track your application status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div
                      key={application._id}
                      className="p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`/api/placeholder/32/32`} />
                          <AvatarFallback>
                            {application?.job?.title?.charAt(0) || "J"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            Job ID: {application.jobId}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Applied for position
                          </div>

                          <div className="flex items-center justify-between">
                            {getStatusBadge(application.status)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                application.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" className="w-full">
                    View All Applications
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                My Job Applications
              </CardTitle>
              <CardDescription>
                Track and manage all your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            Job ID: {application.jobId}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Applied for position
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Cover Letter:</strong>
                        </p>
                        <p className="text-sm bg-muted p-3 rounded">
                          {application.coverLetter}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Available From:</span>
                          <p>
                            {new Date(
                              application.availableFrom
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Expected Salary:</span>
                          <p>
                            {application.expectedSalary
                              ? `$${application.expectedSalary}`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Applied:{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          {application.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleWithdrawApplication(application._id)
                              }
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Withdraw
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No applications yet</p>
                  <p className="text-sm">
                    Start applying to jobs to see them here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === "saved" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Saved Jobs</CardTitle>
              <CardDescription>
                Jobs you've saved for later review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedJobs?.data?.data && savedJobs.data.data.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs.data.data.map((savedJob) => (
                    <div
                      key={savedJob._id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {savedJob?.job?.title || "Job Title"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {savedJob?.job?.school || "School Name"} •{" "}
                            {savedJob?.job?.location || "Location"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(savedJob.priority)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveSavedJob(savedJob._id)}
                          >
                            <Bookmark className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Salary:</span>
                          <p>
                            {savedJob?.job?.salaryMin &&
                            savedJob?.job?.salaryMax
                              ? `$${savedJob?.job?.salaryMin} - $${savedJob?.job?.salaryMax}`
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Job Type:</span>
                          <p>{savedJob?.job?.jobType || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Saved:{" "}
                          {new Date(savedJob?.createdAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            View Job
                          </Button>
                          <Button variant="default" size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved jobs yet</p>
                  <p className="text-sm">
                    Save interesting jobs to review them later
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Job Opportunities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">
                    Recommended Jobs
                  </CardTitle>
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
                  <div
                    key={job.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  >
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
                <CardTitle className="font-heading text-lg">
                  Profile Completion
                </CardTitle>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
