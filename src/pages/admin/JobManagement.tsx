import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AdminJobManagementSkeleton } from "@/components/skeletons";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptyJobPostings, EmptySearchResults } from "@/components/ui/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  Trash2,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminJobs,
  useAdminJobStatistics,
  useAdminUpdateJobStatus,
  useAdminDeleteJob,
  useAdminExportJobs,
} from "@/hooks/useAdminJobs";
import DeleteConfirmationModal from "@/components/Modals/delete-confirmation-modal";
import JobStatusChangeModal from "@/components/Modals/job-status-change-modal";
import JobDetailsModal from "@/components/Modals/job-details-modal";
import JobApplicationsModal from "@/components/Modals/job-applications-modal";
import type { Job } from "@/types/job";
import { useDropdownOptions } from "@/components/ui/dynamic-select";

const JobManagement = () => {
  const { toast } = useToast();

  // Fetch dynamic dropdown options
  const { data: jobTypeOptions, isLoading: loadingJobTypes } = useDropdownOptions("jobType");
  const { data: jobStatusOptions, isLoading: loadingJobStatuses } = useDropdownOptions("jobStatus");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);

  // API hooks
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useAdminJobs({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    jobType: typeFilter !== "all" ? typeFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: statsData, isLoading: isLoadingStats } =
    useAdminJobStatistics();
  const updateJobStatus = useAdminUpdateJobStatus();
  const deleteJob = useAdminDeleteJob();

  const jobs = (jobsData?.data as any)?.jobs || [];
  const pagination = jobsData?.data?.pagination;
  const stats = statsData?.data;

  // Handle status change
  const handleStatusChange = async (
    jobId: string,
    newStatus: string,
    reason?: string
  ) => {
    try {
      await updateJobStatus.mutateAsync({ jobId, status: newStatus, reason });
      toast({
        title: "Status Updated",
        description: `Job status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  // Handle job deletion
  const handleJobDelete = async () => {
    if (!selectedJob) return;

    try {
      await deleteJob.mutateAsync({
        jobId: selectedJob._id,
        reason: "Admin deletion",
      });
      toast({
        title: "Job Deleted",
        description: "Job has been deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "published":
        return {
          color: "bg-brand-accent-green text-white",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Active",
        };
      case "draft":
        return {
          color: "bg-brand-accent-orange text-white",
          icon: <Clock className="w-3 h-3" />,
          label: "Draft",
        };
      case "closed":
        return {
          color: "bg-gray-500 text-white",
          icon: <Archive className="w-3 h-3" />,
          label: "Closed",
        };
      case "expired":
        return {
          color: "bg-red-500 text-white",
          icon: <AlertTriangle className="w-3 h-3" />,
          label: "Expired",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: <Clock className="w-3 h-3" />,
          label: status,
        };
    }
  };

  // Get type display info
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "full_time":
        return { color: "bg-brand-primary text-white", label: "Full-time" };
      case "part_time":
        return { color: "bg-brand-secondary text-white", label: "Part-time" };
      case "contract":
        return {
          color: "bg-brand-accent-orange text-white",
          label: "Contract",
        };
      case "substitute":
        return { color: "bg-purple-500 text-white", label: "Substitute" };
      default:
        return { color: "bg-muted text-muted-foreground", label: type };
    }
  };

  // Format salary range
  const formatSalaryRange = (job: Job) => {
    if (job.salaryRange) return job.salaryRange;
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin} - ${job.salaryMax} ${job.currency}`;
    }
    if (job.salaryMin) {
      return `From ${job.salaryMin} ${job.currency}`;
    }
    if (job.salaryMax) {
      return `Up to ${job.salaryMax} ${job.currency}`;
    }
    return "Salary not disclosed";
  };

  // Calculate days posted
  const getDaysPosted = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (jobsError) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error Loading Jobs
            </h3>
            <p className="text-muted-foreground">
              Failed to load job data. Please try again later.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoadingJobs || isLoadingStats) {
    return (
      <DashboardLayout role="admin">
        <AdminJobManagementSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Job Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all job postings on the platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Jobs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats?.totalJobs || 0}
              </div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                All job postings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Active
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats?.activeJobs || 0}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Currently live
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Draft
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {stats?.pendingJobs || 0}
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                Awaiting publication
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/10 border-gray-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Closed
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
                <Archive className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.suspendedJobs || 0}
              </div>
              <p className="text-xs text-gray-600/70 dark:text-gray-400/70 mt-1">
                No longer active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border-red-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                Expired
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                {stats?.expiredJobs || 0}
              </div>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                Past deadline
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, organization, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loadingJobStatuses}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={loadingJobStatuses ? "Loading..." : "Filter by status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {jobStatusOptions.map((option) => (
                    <SelectItem key={option._id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter} disabled={loadingJobTypes}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={loadingJobTypes ? "Loading..." : "Filter by type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypeOptions.map((option) => (
                    <SelectItem key={option._id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Job Postings ({jobs.length})
              </CardTitle>
            </div>
            <CardDescription>
              Review and manage all job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Jobs Found
                </h3>
                <p className="text-muted-foreground">
                  No jobs match your current filters.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => {
                      const statusInfo = getStatusInfo(job.status);
                      const typeInfo = getTypeInfo(job.jobType);
                      const daysPosted = getDaysPosted(job.createdAt);

                      return (
                        <TableRow key={job._id} className="group hover:bg-muted/50 transition-all duration-300 hover:shadow-sm">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium group-hover:text-brand-primary transition-colors duration-300">{job.title}</div>
                              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {job.organization}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                <MapPin className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
                                {job.city}, {job.country}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${statusInfo.color} flex items-center space-x-1 w-fit`}
                            >
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                              <Users className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300" />
                              <span className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                {job.applicantsCount || 0}
                              </span>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                ({job.viewsCount || 0} views)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatSalaryRange(job)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                              <Calendar className="w-3 h-3 mr-1 group-hover:text-brand-primary transition-colors duration-300" />
                              {daysPosted}d ago
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                              <Calendar className="w-3 h-3 mr-1 group-hover:text-brand-primary transition-colors duration-300" />
                              {job.applicationDeadline
                                ? new Date(
                                    job.applicationDeadline
                                  ).toLocaleDateString()
                                : "No expiry"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300">
                                  <MoreHorizontal className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsDetailsModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsStatusModalOpen(true);
                                  }}
                                >
                                  <Settings className="w-4 h-4 mr-2" />
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsApplicationsModalOpen(true);
                                  }}
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  View Applications
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="hover:bg-brand-primary/10 hover:border-brand-primary hover:scale-105 transition-all duration-300"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="hover:bg-brand-primary/10 hover:border-brand-primary hover:scale-105 transition-all duration-300"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={handleJobDelete}
        job={selectedJob}
        isLoading={deleteJob.isPending}
      />

      <JobStatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={handleStatusChange}
        job={selectedJob}
        isLoading={updateJobStatus.isPending}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
      />

      <JobApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => {
          setIsApplicationsModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
      />
    </DashboardLayout>
  );
};

export default JobManagement;
