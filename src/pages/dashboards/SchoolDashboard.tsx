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
import {
  useApplications,
  useGetRecentCandidates,
} from "@/hooks/useApplications";
import { useSchoolDashboardCardData } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStats } from "@/hooks/useNotifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  DashboardErrorFallback,
  SectionErrorFallback,
} from "@/components/ui/error-fallback";
import { EmptyJobPostings, EmptyCandidates } from "@/components/ui/empty-state";

// Interface for the recent candidates API response
interface RecentCandidate {
  avatar: string | null;
  firstName: string;
  lastName: string;
  position: string;
  experience: string;
  appliedDate: string;
  status: string;
}

interface RecentCandidatesResponse {
  success: boolean;
  message: string;
  data: RecentCandidate[];
}

// Interface for job postings
interface JobPosting {
  _id: string;
  title: string;
  positionCategory: string;
  positionSubcategory: string;
  schoolId?: { schoolName: string };
  city: string;
  country: string;
  status: string;
  applicantsCount?: number;
  viewsCount?: number;
  createdAt?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  jobType: string;
  applicationDeadline?: string;
}

const SchoolDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch real-time data
  const { data: schoolJobs, isLoading: schoolJobsLoading } = useSchoolJobs(
    user?.id || "",
    {
      page: 1,
      limit: 10,
    }
  );

  const { data: schoolCardsCount, isLoading: applicationStatsLoading } =
    useSchoolDashboardCardData();
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

  const { data: recentCandidates, isLoading: recentCandidatesLoading } =
    useGetRecentCandidates();

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
    notificationsLoading ||
    recentCandidatesLoading ||
    jobApplicationsLoading;

  // Check for errors
  const hasErrors =
    schoolJobs?.error ||
    schoolCardsCount?.error ||
    notificationStats?.error ||
    unreadNotifications?.error ||
    recentCandidates?.error ||
    jobApplications?.error;

  // Show skeleton loading state while data is loading
  if (isLoading) {
    return (
      <DashboardLayout role="school">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  // Show error fallback if there are errors
  if (hasErrors) {
    return (
      <DashboardLayout role="school">
        <DashboardErrorFallback
          error="Failed to load school dashboard data"
          onRetry={() => window.location.reload()}
          title="School Dashboard Unavailable"
          description="We're having trouble loading your dashboard data. This could be due to a temporary network issue or server maintenance."
        />
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Total Job",
      value: schoolCardsCount?.data?.totalJobs || "0",
      change: "+2",
      icon: Briefcase,
      color: "text-brand-primary",
    },
    {
      title: "Active Jobs",
      value: schoolCardsCount?.data?.activeJobs || "0",
      change: "+18",
      icon: CheckCircle,
      color: "text-brand-accent-green",
    },
    {
      title: "Total Applicants",
      value: schoolCardsCount?.data?.totalApplicants || "0",
      change: "+3",
      icon: Users,
      color: "text-brand-secondary",
    },
    {
      title: "Hiring Ratio",
      value: schoolCardsCount?.data?.hiringRatio || "0",
      change: "+7",
      icon: TrendingUp,
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
  const jobPostings = (schoolJobs?.data as { jobs?: JobPosting[] })?.jobs || [];

  // Access recent candidates from the API response with proper fallback
  const recentCandidatesData =
    (recentCandidates as unknown as RecentCandidatesResponse)?.data || [];

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
            educators. Track job performance, review applications, and find the
            best candidates.
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
                  <Button
                    variant="default"
                    onClick={() => navigate("/dashboard/school/post-job")}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
                <CardDescription>
                  Manage your current job listings and their performance. Track
                  applications, views, and engagement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobPostings.length > 0 ? (
                  jobPostings.map((job: JobPosting) => (
                    <div
                      key={job._id}
                      className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Position:</span>{" "}
                            {job.positionCategory} • {job.positionSubcategory}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Location:</span>{" "}
                            {job.schoolId?.schoolName} • {job.city},{" "}
                            {job.country}
                          </p>
                        </div>
                        {getJobStatusBadge(job.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Applicants:</span>{" "}
                            {job.applicantsCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Views:</span>{" "}
                            {job.viewsCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Posted:</span>{" "}
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
                            <span className="font-medium">Salary:</span>{" "}
                            {job.salaryMin && job.salaryMax
                              ? `${job.currency} ${job.salaryMin} - ${job.salaryMax}`
                              : "Salary not disclosed"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Type:</span>{" "}
                            {job.jobType}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          <span className="font-medium">Expires:</span>{" "}
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
                            onClick={() =>
                              navigate(
                                `/dashboard/school/candidates?job=${job._id}`,
                                {
                                  state: {
                                    jobId: job._id,
                                    jobTitle: job.title,
                                  },
                                }
                              )
                            }
                          >
                            View Applications
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              navigate("/dashboard/school/postings")
                            }
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyJobPostings
                    onCreateJob={() => navigate("/dashboard/school/post-job")}
                  />
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
                    Review and manage applications for this position. Update
                    status, schedule interviews, and make hiring decisions.
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
                    <EmptyCandidates
                      onPostJob={() => navigate("/dashboard/school/post-job")}
                    />
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
                  New applications requiring your attention. Review these
                  candidates to find the best fit for your positions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCandidatesData.length > 0 ? (
                  recentCandidatesData.map(
                    (candidate: RecentCandidate, index: number) => (
                      <div
                        key={`${candidate.firstName}-${candidate.lastName}-${index}`}
                        className="p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={candidate.avatar || undefined} />
                            <AvatarFallback>
                              {candidate.firstName?.charAt(0) || ""}
                              {candidate.lastName?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">
                              {candidate.firstName && candidate.lastName
                                ? `${candidate.firstName} ${candidate.lastName}`
                                : "Unknown Candidate"}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              <span className="font-medium">Position:</span>{" "}
                              {candidate.position !== "N/A"
                                ? candidate.position
                                : "Position not specified"}
                            </div>

                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">
                                <span className="font-medium">Experience:</span>{" "}
                                {candidate.experience !== "N/A"
                                  ? candidate.experience
                                  : "Experience not specified"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge
                                className={`${getStatusColor(
                                  candidate.status
                                )} text-xs`}
                              >
                                <span className="font-medium">Status:</span>{" "}
                                {candidate.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                <span className="font-medium">Applied:</span>{" "}
                                {candidate.appliedDate
                                  ? new Date(
                                      candidate.appliedDate
                                    ).toLocaleDateString()
                                  : "Date not available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center py-4">
                    <EmptyCandidates
                      onPostJob={() => navigate("/dashboard/school/post-job")}
                    />
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/dashboard/school/candidates")}
                >
                  View All Candidates
                  <ArrowRight className="w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks to help you manage your recruitment process
                  efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("/dashboard/school/post-job")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("/dashboard/school/candidates")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse Teachers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolDashboard;
