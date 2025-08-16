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
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  AlertCircle,
  DollarSign,
  Archive,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolJobs } from "@/hooks/useJobs";
import { useApplications } from "@/hooks/useApplications";
import { useApplicationStats } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStats } from "@/hooks/useNotifications";
import { useState } from "react";
import { ApplicationStatus } from "@/types/job";
import type {
  InterviewScheduleRequest,
  ApplicationAcceptanceRequest,
  ApplicationRejectionRequest,
  ApplicationShortlistRequest,
  ApplicationReviewRequest,
} from "@/types/application";
import { useUpdateApplicationStatus } from "@/hooks/useApplications";
import { useScheduleInterview } from "@/hooks/useApplications";
import { useAcceptApplication } from "@/hooks/useApplications";
import { useRejectApplication } from "@/hooks/useApplications";
import { useShortlistApplication } from "@/hooks/useApplications";
import { useMoveToReviewing } from "@/hooks/useApplications";
import { customToast } from "@/components/ui/sonner";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

const SchoolDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch real-time data
  const { data: schoolJobs, isLoading: schoolJobsLoading } = useSchoolJobs(
    user?.id || "",
    {
      page: 1,
      limit: 10,
    }
  );

  const { data: applicationStats, isLoading: applicationStatsLoading } =
    useApplicationStats();
  const { data: notificationStats, isLoading: notificationStatsLoading } =
    useNotificationStats();
  const { data: unreadNotifications, isLoading: notificationsLoading } =
    useNotifications({
      isRead: false,
      limit: 5,
    });

  // Application management mutations
  const updateStatus = useUpdateApplicationStatus();
  const scheduleInterview = useScheduleInterview();
  const acceptApplication = useAcceptApplication();
  const rejectApplication = useRejectApplication();
  const shortlistApplication = useShortlistApplication();
  const moveToReviewing = useMoveToReviewing();

  // Get applications for selected job
  const { data: jobApplications, isLoading: jobApplicationsLoading } =
    useApplications({
      jobId: selectedJobId || "",
      page: 1,
      limit: 20,
    });

  // Check if any data is still loading
  const isLoading =
    schoolJobsLoading ||
    applicationStatsLoading ||
    notificationStatsLoading ||
    notificationsLoading;

  // Show skeleton loading state while data is loading
  if (isLoading) {
    return (
      <DashboardLayout role="school">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Active Job Postings",
      value: schoolJobs?.data?.pagination?.total || "0",
      change: "+2",
      icon: Briefcase,
      color: "text-brand-primary",
    },
    {
      title: "Total Applicants",
      value: applicationStats?.data?.total || "0",
      change: "+18",
      icon: Users,
      color: "text-brand-accent-green",
    },
    {
      title: "Interviews Scheduled",
      value: applicationStats?.data?.interviewed || "0",
      change: "+3",
      icon: Calendar,
      color: "text-brand-secondary",
    },
    {
      title: "New Messages",
      value: notificationStats?.data?.unreadCount || "0",
      change: "+7",
      icon: MessageCircle,
      color: "text-brand-accent-orange",
    },
  ];

  const handleApplicationAction = async (
    applicationId: string,
    action: string,
    data?: Record<string, unknown>
  ) => {
    try {
      switch (action) {
        case "schedule_interview":
          if (!data || !("interviewDate" in data)) {
            customToast.error("Interview date is required");
            return;
          }
          await scheduleInterview.mutateAsync({
            applicationId,
            data: data as unknown as InterviewScheduleRequest,
          });
          customToast.success("Interview scheduled successfully");
          break;
        case "accept":
          await acceptApplication.mutateAsync({
            applicationId,
            data: data as ApplicationAcceptanceRequest,
          });
          customToast.success("Application accepted successfully");
          break;
        case "reject":
          if (!data || !("reason" in data)) {
            customToast.error("Rejection reason is required");
            return;
          }
          await rejectApplication.mutateAsync({
            applicationId,
            data: data as unknown as ApplicationRejectionRequest,
          });
          customToast.success("Application rejected successfully");
          break;
        case "shortlist":
          await shortlistApplication.mutateAsync({
            applicationId,
            data: data as ApplicationShortlistRequest,
          });
          customToast.success("Application shortlisted successfully");
          break;
        case "reviewing":
          await moveToReviewing.mutateAsync({
            applicationId,
            data: data as ApplicationReviewRequest,
          });
          customToast.success("Application moved to reviewing");
          break;
        default:
          break;
      }
    } catch (error) {
      customToast.error("Failed to update application status");
    }
  };

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

  const getJobStatusBadge = (status: string) => {
    const statusConfig = {
      draft: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: FileText,
        label: "Draft",
      },
      published: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Eye,
        label: "Published",
      },
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Active",
      },
      expired: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Clock,
        label: "Expired",
      },
      closed: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Closed",
      },
      archived: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Archive,
        label: "Archived",
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border font-medium px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Access jobs from the actual API response structure
  const jobPostings = (schoolJobs?.data as any)?.jobs || [];

  const recentCandidates = jobApplications?.data?.data || [];

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
    <DashboardLayout role="school">
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
                {jobPostings.length > 0 ? (
                  jobPostings.map((job) => (
                    <div
                      key={job._id}
                      className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-muted-foreground">
                            {job.positionCategory} • {job.positionSubcategory}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {job.schoolId?.schoolName} • {job.city},{" "}
                            {job.country}
                          </p>
                        </div>
                        {getJobStatusBadge(job.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{job.applicantsCount || 0} applicants</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{job.viewsCount || 0} views</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            {job.salaryMin && job.salaryMax
                              ? `${job.currency} ${job.salaryMin} - ${job.salaryMax}`
                              : "Salary not disclosed"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{job.jobType}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Expires:{" "}
                          {job.applicationDeadline
                            ? new Date(
                                job.applicationDeadline
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedJobId(job._id)}
                          >
                            View Applications
                          </Button>
                          <Button variant="default" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No job postings yet</p>
                    <p className="text-sm">
                      Create your first job posting to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Applications Management */}
            {selectedJobId && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-xl">
                      Applications Management
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJobId(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <CardDescription>
                    Review and manage applications for this position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobApplications?.data?.data &&
                  jobApplications.data.data.length > 0 ? (
                    <div className="space-y-4">
                      {jobApplications.data.data.map((application) => (
                        <div
                          key={application._id}
                          className="p-4 border border-border rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">
                                Teacher ID: {application.teacherId}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Applied:{" "}
                                {new Date(
                                  application.createdAt
                                ).toLocaleDateString()}
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
                              <span className="font-medium">
                                Available From:
                              </span>
                              <p>
                                {new Date(
                                  application.availableFrom
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">
                                Expected Salary:
                              </span>
                              <p>
                                {application.expectedSalary
                                  ? `$${application.expectedSalary}`
                                  : "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {application.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "reviewing"
                                    )
                                  }
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "shortlist"
                                    )
                                  }
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Shortlist
                                </Button>
                              </>
                            )}
                            {application.status === "reviewing" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "shortlist"
                                    )
                                  }
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Shortlist
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "schedule_interview",
                                      {
                                        interviewDate: new Date(
                                          Date.now() + 7 * 24 * 60 * 60 * 1000
                                        ).toISOString(),
                                        type: "video",
                                      }
                                    )
                                  }
                                >
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Schedule Interview
                                </Button>
                              </>
                            )}
                            {application.status === "shortlisted" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "schedule_interview",
                                      {
                                        interviewDate: new Date(
                                          Date.now() + 7 * 24 * 60 * 60 * 1000
                                        ).toISOString(),
                                        type: "video",
                                      }
                                    )
                                  }
                                >
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Schedule Interview
                                </Button>
                              </>
                            )}
                            {application.status === "interviewed" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "accept"
                                    )
                                  }
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleApplicationAction(
                                      application._id,
                                      "reject",
                                      {
                                        reason:
                                          "Not a good fit for the position",
                                      }
                                    )
                                  }
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No applications yet for this position</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
                    key={candidate?._id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>
                          {candidate?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "NA"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">
                          {candidate?.name || "Unknown Candidate"}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {candidate?.position || "Position not specified"}
                        </div>

                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs">
                            {candidate?.rating || "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •{" "}
                            {candidate?.experience ||
                              "Experience not specified"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${getStatusColor(
                              candidate?.status
                            )} text-xs`}
                          >
                            {candidate?.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {candidate?.appliedDate || "Date not available"}
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
