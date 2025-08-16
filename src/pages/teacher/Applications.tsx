import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Loader2,
} from "lucide-react";
import { useTeacherApplications } from "@/hooks/useApplications";
import { customToast } from "@/components/ui/sonner";
import type { ApplicationStatus } from "@/types/job";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "status" | "name">("date");

  // API hooks
  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useTeacherApplications({
    page: 1,
    limit: 20,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm || undefined,
    sortBy,
    sortOrder: "desc",
  });

  // Extract applications from response
  // Handle both possible response structures: { data: JobApplication[] } or { data: { applications: JobApplication[] } }
  const applications = Array.isArray(applicationsResponse?.data)
    ? applicationsResponse.data
    : (applicationsResponse?.data as any)?.applications || [];

  // Get status badge variant and icon
  const getStatusDisplay = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: ClockIcon,
          label: "Pending",
          color: "text-yellow-600",
        };
      case "reviewing":
        return {
          variant: "default" as const,
          icon: Eye,
          label: "Under Review",
          color: "text-blue-600",
        };
      case "shortlisted":
        return {
          variant: "default" as const,
          icon: TrendingUp,
          label: "Shortlisted",
          color: "text-green-600",
        };
      case "interviewed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Interviewed",
          color: "text-purple-600",
        };
      case "accepted":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Accepted",
          color: "text-green-600",
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Rejected",
          color: "text-red-600",
        };
      case "withdrawn":
        return {
          variant: "outline" as const,
          icon: AlertCircle,
          label: "Withdrawn",
          color: "text-gray-600",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: ClockIcon,
          label: "Unknown",
          color: "text-gray-600",
        };
    }
  };

  // Get days ago from date
  const getDaysAgo = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  // Format salary
  const formatSalary = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Handle application withdrawal
  const handleWithdraw = async (applicationId: string) => {
    try {
      // TODO: Implement withdrawal API call
      customToast.success("Application withdrawn successfully");
    } catch (error) {
      customToast.error("Failed to withdraw application");
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ApplicationStatus | "all");
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value as "date" | "status" | "name");
  };

  if (error) {
    return (
      <DashboardLayout role="teacher">
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">Failed to load applications</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              My Applications
            </h1>
            <p className="text-muted-foreground">
              Track the status of your job applications and manage your
              submissions
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications, schools, or job titles..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Most Recent</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : applications.length === 0 ? (
            // Empty state
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium mb-2">
                  No applications found
                </p>
                <p className="mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't submitted any job applications yet"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link to="/dashboard/teacher/jobs">
                    <Button>Browse Available Jobs</Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div>
              {/* Applications list */}
              {Array.isArray(applications) && applications.length > 0 ? (
                applications.map((application) => {
                  const statusDisplay = getStatusDisplay(application.status);
                  const StatusIcon = statusDisplay.icon;

                  return (
                    <Card
                      key={application._id}
                      className="group hover:shadow-card-hover transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Application Details */}
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-heading font-semibold text-xl group-hover:text-brand-primary transition-colors">
                                  {application.job?.title || "Job Title"}
                                </h3>
                                <div className="flex items-center space-x-4 text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-medium">
                                      {application.job?.organization ||
                                        "School Name"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      {application.job?.city},{" "}
                                      {application.job?.country}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={statusDisplay.variant}
                                  className={`${statusDisplay.color} border-current`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusDisplay.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Application Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Applied {getDaysAgo(application.createdAt)}
                                </span>
                              </div>
                              {application.expectedSalary && (
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Expected:{" "}
                                    {formatSalary(
                                      application.expectedSalary,
                                      application.job?.currency || "USD"
                                    )}
                                  </span>
                                </div>
                              )}
                              {application.availableFrom && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Available:{" "}
                                    {new Date(
                                      application.availableFrom
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Cover Letter Preview */}
                            {application.coverLetter && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Cover Letter Preview
                                </Label>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}

                            {/* Reason for Applying */}
                            {application.reasonForApplying && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Why You Applied
                                </Label>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {application.reasonForApplying}
                                </p>
                              </div>
                            )}

                            {/* Additional Comments */}
                            {application.additionalComments && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Additional Comments
                                </Label>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {application.additionalComments}
                                </p>
                              </div>
                            )}

                            {/* Documents */}
                            {(application.resumeUrl ||
                              (application.documents &&
                                application.documents.length > 0)) && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Documents
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {application.resumeUrl && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      Resume
                                    </Badge>
                                  )}
                                  {application.documents?.map((doc, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      Document {index + 1}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes from School */}
                            {application.notes && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Notes from School
                                </Label>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <p className="text-sm">{application.notes}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2 lg:items-end">
                            <div className="flex space-x-2">
                              <Link
                                to={`/dashboard/teacher/job/${application.jobId}`}
                              >
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Job
                                </Button>
                              </Link>
                              {application.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleWithdraw(application._id)
                                  }
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Withdraw
                                </Button>
                              )}
                            </div>

                            {/* Status Timeline */}
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Last updated:{" "}
                                {getDaysAgo(application.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found</p>
                  <p className="text-sm">
                    {Array.isArray(applications) && applications.length === 0
                      ? "Start applying to jobs to see them here"
                      : "Unable to load applications"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Application Statistics */}
        {!isLoading && applications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Application Overview</CardTitle>
              <CardDescription>
                Summary of your application statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-sm text-blue-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      applications.filter((app) => app.status === "reviewing")
                        .length
                    }
                  </div>
                  <div className="text-sm text-yellow-600">Under Review</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      applications.filter((app) => app.status === "shortlisted")
                        .length
                    }
                  </div>
                  <div className="text-sm text-green-600">Shortlisted</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      applications.filter((app) => app.status === "accepted")
                        .length
                    }
                  </div>
                  <div className="text-sm text-purple-600">Accepted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;
