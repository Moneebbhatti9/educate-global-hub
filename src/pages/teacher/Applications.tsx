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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ExternalLink,
  Download,
} from "lucide-react";
import {
  useMyApplications,
  useWithdrawApplication,
} from "@/hooks/useApplications";
import { customToast } from "@/components/ui/sonner";
import type { ApplicationStatus } from "@/types/job";

// Interface for the API response structure
interface ApplicationResponse {
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
  additionalComments?: string;
  screeningAnswers: Record<string, string>;
  status: ApplicationStatus;
  resumeUrl?: string;
  documents: string[];
  isWithdrawn: boolean;
  createdAt: string;
  updatedAt: string;
}

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "status" | "name">("date");
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useMyApplications({
    page: currentPage,
    limit: 20,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm || undefined,
    sortBy,
    sortOrder: "desc",
  });

  // Withdraw application mutation
  const withdrawApplication = useWithdrawApplication();

  // Extract applications and pagination from response
  const applications =
    (
      applicationsResponse?.data as {
        applications?: ApplicationResponse[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }
    )?.applications || [];
  const pagination = (
    applicationsResponse?.data as {
      applications?: ApplicationResponse[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }
  )?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

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
  const formatSalary = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Format job type
  const formatJobType = (jobType: string) => {
    return jobType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Handle application withdrawal
  const handleWithdraw = async (applicationId: string) => {
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

  // Handle view details
  const handleViewDetails = (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ApplicationStatus | "all");
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value as "date" | "status" | "name");
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <div className="space-y-6">
              {/* Applications list */}
              {applications.map((application: ApplicationResponse) => {
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
                                {application.jobId.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Building2 className="w-4 h-4" />
                                  <span className="font-medium">
                                    {application.jobId.schoolName}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {application.jobId.city},{" "}
                                    {application.jobId.country}
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
                                  {formatSalary(application.expectedSalary)}
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

                          {/* Job Type and Education Level */}
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                Job Type:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {formatJobType(application.jobId.jobType)}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                Education:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {formatJobType(
                                  application.jobId.educationLevel
                                )}
                              </Badge>
                            </div>
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
                                  <Badge variant="outline" className="text-xs">
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
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 lg:items-end">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Link
                              to={`/dashboard/teacher/job/${application.jobId._id}`}
                            >
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Job
                              </Button>
                            </Link>
                            {application.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleWithdraw(application._id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                disabled={withdrawApplication.isPending}
                              >
                                {withdrawApplication.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-2" />
                                )}
                                Withdraw
                              </Button>
                            )}
                          </div>

                          {/* Status Timeline */}
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Last updated: {getDaysAgo(application.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete information about your application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Job Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedApplication.jobId.title}
                  </CardTitle>
                  <CardDescription>
                    {selectedApplication.jobId.schoolName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedApplication.jobId.city},{" "}
                        {selectedApplication.jobId.country}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatJobType(selectedApplication.jobId.jobType)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatJobType(
                          selectedApplication.jobId.educationLevel
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Deadline:{" "}
                        {new Date(
                          selectedApplication.jobId.applicationDeadline
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">
                    {selectedApplication.coverLetter}
                  </div>
                </CardContent>
              </Card>

              {/* Reason for Applying */}
              <Card>
                <CardHeader>
                  <CardTitle>Why You Applied</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {selectedApplication.reasonForApplying}
                  </p>
                </CardContent>
              </Card>

              {/* Additional Comments */}
              {selectedApplication.additionalComments && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedApplication.additionalComments}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Screening Answers */}
              {Object.keys(selectedApplication.screeningAnswers).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(selectedApplication.screeningAnswers).map(
                      ([question, answer]) => (
                        <div key={question} className="space-y-2">
                          <Label className="text-sm font-medium">
                            {question}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {answer}
                          </p>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedApplication.resumeUrl && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-primary" />
                        <span className="font-medium">Resume</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(selectedApplication.resumeUrl, "_blank")
                        }
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}

                  {selectedApplication.documents?.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-primary" />
                        <span className="font-medium">
                          Document {index + 1}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Expected Salary
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplication.expectedSalary
                          ? formatSalary(selectedApplication.expectedSalary)
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Available From
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedApplication.availableFrom
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Application Date
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedApplication.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Last Updated
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedApplication.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Applications;
