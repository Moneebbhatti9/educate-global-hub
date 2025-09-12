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
  Building2,
  Upload,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMyApplications,
  useTeacherDashboardCardData,
  useTeacherRecentApplications,
} from "@/hooks/useApplications";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useSavedJobStats } from "@/hooks/useSavedJobs";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStats } from "@/hooks/useNotifications";
import { useState } from "react";
import { ApplicationStatus } from "@/types/job";
import {
  TeacherDashboardCardsResponse,
  JobApplication,
} from "@/types/application";
import { useWithdrawApplication } from "@/hooks/useApplications";
import { useSaveJob } from "@/hooks/useSavedJobs";
import { useRemoveSavedJob } from "@/hooks/useSavedJobs";
import { customToast } from "@/components/ui/sonner";
import { useTeacherRecommendedJobs } from "@/hooks/useJobs";
import { TeacherDashboardSkeleton } from "@/components/skeletons";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptyApplications, EmptySavedJobs, EmptyRecommendations } from "@/components/ui/empty-state";

// Interface for the actual API response structure
interface TeacherApplicationResponse {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    educationLevel: string;
    country: string;
    city: string;
    jobType: string;
    applicationDeadline: string;
    status: string;
    schoolName: string;
  };
  teacherId: string;
  coverLetter: string;
  expectedSalary?: number;
  availableFrom: string;
  reasonForApplying: string;
  screeningAnswers: Record<string, string>;
  status: ApplicationStatus;
  resumeUrl?: string;
  documents: string[];
  isWithdrawn: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for notifications
interface NotificationResponse {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

const TeacherDashboard = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "applications" | "saved"
  >("overview");

  // Fetch real-time data
  const {
    data: teacherRecentApplications,
    isLoading: recentApplicationsLoading,
  } = useTeacherRecentApplications({
    page: 1,
    limit: 10,
  });

  const { data: teacherApplications, isLoading: applicationsLoading } =
    useMyApplications({
      page: 1,
      limit: 10,
    });

  const { data: dashboardCardData, isLoading: dashboardLoading } =
    useTeacherDashboardCardData();
  const { data: savedJobStats, isLoading: savedJobsStatsLoading } =
    useSavedJobStats();
  const { data: savedJobs, isLoading: savedJobsLoading } = useSavedJobs({
    page: 1,
    limit: 10,
  });
  const { data: notificationStats, isLoading: notificationStatsLoading } =
    useNotificationStats();
  const { data: unreadNotifications, isLoading: notificationsLoading } =
    useNotifications({
      isRead: false,
      limit: 5,
    });

  // Fetch recommended jobs
  const { data: recommendedJobsResponse, isLoading: recommendedJobsLoading } =
    useTeacherRecommendedJobs(5);

  // Application management mutations
  const withdrawApplication = useWithdrawApplication();
  const saveJob = useSaveJob();
  const removeSavedJob = useRemoveSavedJob();

  // Check if any data is still loading
  const isLoading =
    authLoading ||
    dashboardLoading ||
    savedJobsStatsLoading ||
    savedJobsLoading ||
    notificationStatsLoading ||
    notificationsLoading ||
    recommendedJobsLoading ||
    recentApplicationsLoading ||
    applicationsLoading;

  // Check if there are any errors
  const hasErrors =
    dashboardCardData?.error ||
    savedJobStats?.error ||
    savedJobs?.error ||
    notificationStats?.error ||
    unreadNotifications?.error ||
    recommendedJobsResponse?.error ||
    teacherRecentApplications?.error ||
    teacherApplications?.error;

  // Show skeleton loading state while data is loading
  if (isLoading) {
    return (
      <DashboardLayout role="teacher">
        <TeacherDashboardSkeleton />
      </DashboardLayout>
    );
  }

  // Show error message if there are API errors
  if (hasErrors) {
    return (
      <DashboardLayout role="teacher">
        <DashboardErrorFallback 
          error="Failed to load dashboard data"
          onRetry={() => window.location.reload()}
          title="Teacher Dashboard Unavailable"
          description="We're having trouble loading your dashboard data. This could be due to a temporary network issue or server maintenance."
        />
      </DashboardLayout>
    );
  }

  // Extract data from API responses based on actual API structure
  // Handle both possible response structures for applications
  const recentApplications =
    (
      teacherRecentApplications?.data as unknown as {
        applications?: TeacherApplicationResponse[];
      }
    )?.applications || [];

  const myApplications =
    (
      teacherApplications?.data as unknown as {
        applications?: TeacherApplicationResponse[];
      }
    )?.applications || [];

  const notifications =
    (
      unreadNotifications?.data as unknown as {
        notifications?: NotificationResponse[];
      }
    )?.notifications || [];
  // Recommended jobs API returns { data: Job[] }
  const recommendedJobs = Array.isArray(recommendedJobsResponse?.data)
    ? recommendedJobsResponse.data
    : [];
  // Saved jobs API returns { data: { savedJobs: [], pagination: {} } }
  const savedJobsList = savedJobs?.data?.savedJobs || [];

  // Dynamic stats based on API data
  const dashboardData = dashboardCardData?.data || null;
  const stats = [
    {
      title: "Applications Sent",
      value: dashboardData?.cards?.applicationsSent?.toString() || "0",
      change: "+0",
      icon: Briefcase,
      color: "text-brand-accent-green",
    },
    {
      title: "Resources Uploaded",
      value: dashboardData?.cards?.resourcesUploaded?.toString() || "0",
      change: "+0",
      icon: Upload,
      color: "text-brand-primary",
    },
    {
      title: "Resources Downloaded",
      value: dashboardData?.cards?.resourcesDownloaded?.toString() || "0",
      change: "+0",
      icon: Download,
      color: "text-brand-secondary",
    },
    {
      title: "Earnings",
      value: `$${dashboardData?.cards?.earnings?.toFixed(2) || "0.00"}`,
      change: "+0",
      icon: DollarSign,
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

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      await withdrawApplication.mutateAsync({
        applicationId,
        reason: "Withdrawn by applicant",
      });
      customToast.success("Application withdrawn successfully");
    } catch (error) {
      customToast.error("Failed to withdraw application");
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await saveJob.mutateAsync({ jobId, data: { priority: "medium" } });
      customToast.success("Job saved successfully");
    } catch (error) {
      customToast.error("Failed to save job");
    }
  };

  const handleRemoveSavedJob = async (savedJobId: string) => {
    try {
      await removeSavedJob.mutateAsync(savedJobId);
      customToast.success("Job removed from saved list");
    } catch (error) {
      customToast.error("Failed to remove saved job");
    }
  };

  const getDaysAgo = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Welcome back, {user?.firstName || "Teacher"}! 👋
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
            My Applications ({myApplications?.length || 0})
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("saved")}
            className="flex-1"
          >
            Saved Jobs ({savedJobsList.length || 0})
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended Jobs */}
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
                  {Array.isArray(recommendedJobs) &&
                  recommendedJobs.length > 0 ? (
                    recommendedJobs.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 border border-border rounded-lg hover:border-brand-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-1">
                                <Building2 className="w-4 h-4" />
                                <span>
                                  {job.organization || job.school?.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {job.city}, {job.country}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>
                                  {formatSalary(
                                    job.salaryMin || 0,
                                    job.salaryMax || 0,
                                    job.currency
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {getDaysAgo(job.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveJob(job._id)}
                            >
                              <Bookmark className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyRecommendations
                      onUpdateProfile={() => console.log("Navigate to profile")}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    Recent Applications
                  </CardTitle>
                  <CardDescription>
                    Track your application status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentApplications && recentApplications.length > 0 ? (
                    recentApplications.slice(0, 3).map((application) => (
                      <div
                        key={application._id}
                        className="p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`/api/placeholder/32/32`} />
                            <AvatarFallback>
                              {application?.jobId?.title?.charAt(0) || "J"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">
                              {application.jobId?.title || "Job Title"}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {application.jobId?.schoolName || "School Name"}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {application.jobId?.city},{" "}
                              {application.jobId?.country} •{" "}
                              {application.jobId?.jobType?.replace("_", " ")}
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
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <EmptyApplications
                        onBrowseJobs={() => console.log("Navigate to jobs")}
                      />
                    </div>
                  )}

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
              {myApplications && myApplications.length > 0 ? (
                <div className="space-y-4">
                  {myApplications.map((application) => (
                    <div
                      key={application._id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {application.jobId?.title || "Job Title"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {application.jobId?.schoolName || "School Name"}
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      {application.coverLetter && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Cover Letter:</strong>
                          </p>
                          <p className="text-sm bg-muted p-3 rounded">
                            {application.coverLetter.length > 200
                              ? `${application.coverLetter.substring(
                                  0,
                                  200
                                )}...`
                              : application.coverLetter}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Location:</span>
                          <p>
                            {application.jobId?.city},{" "}
                            {application.jobId?.country}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Job Type:</span>
                          <p className="capitalize">
                            {application.jobId?.jobType?.replace("_", " ") ||
                              "Not specified"}
                          </p>
                        </div>
                        {application.availableFrom && (
                          <div>
                            <span className="font-medium">Available From:</span>
                            <p>
                              {new Date(
                                application.availableFrom
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {application.expectedSalary && (
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
                        )}
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
                <EmptyApplications
                  onBrowseJobs={() => console.log("Navigate to jobs")}
                />
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
              {savedJobsList && savedJobsList.length > 0 ? (
                <div className="space-y-4">
                  {savedJobsList.map((savedJob) => (
                    <div
                      key={savedJob._id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {savedJob.jobId?.title || "Job Title"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {savedJob.jobId?.city}, {savedJob.jobId?.country}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveSavedJob(savedJob._id)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Location:</span>
                          <p>
                            {savedJob.jobId?.city}, {savedJob.jobId?.country}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Salary:</span>
                          <p>
                            {formatSalary(
                              savedJob.jobId?.salaryMin || 0,
                              savedJob.jobId?.salaryMax || 0,
                              savedJob.jobId?.currency || "USD"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Saved:{" "}
                          {new Date(savedJob.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/dashboard/teacher/job/${savedJob.jobId._id}`)
                          }
                        >
                          View Job
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySavedJobs
                  onBrowseJobs={() => console.log("Navigate to jobs")}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
