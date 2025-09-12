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

const JobManagement = () => {
  const { toast } = useToast();
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-brand-primary transition-colors duration-300">Total Jobs</p>
                  <p className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">{stats?.totalJobs || 0}</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <Briefcase className="w-8 h-8 text-brand-primary group-hover:scale-110  transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-accent-green/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-brand-accent-green transition-colors duration-300">Active</p>
                  <p className="text-2xl font-bold text-brand-accent-green group-hover:scale-110 transition-transform duration-300">
                    {stats?.activeJobs || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-accent-green rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats?.totalJobs ? (stats.activeJobs / stats.totalJobs) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <CheckCircle className="w-8 h-8 text-brand-accent-green group-hover:scale-110  transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-accent-orange/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-brand-accent-orange transition-colors duration-300">Draft</p>
                  <p className="text-2xl font-bold text-brand-accent-orange group-hover:scale-110 transition-transform duration-300">
                    {stats?.pendingJobs || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-accent-orange rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats?.totalJobs ? (stats.pendingJobs / stats.totalJobs) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <Clock className="w-8 h-8 text-brand-accent-orange group-hover:scale-110  transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-gray-500 transition-colors duration-300">Closed</p>
                  <p className="text-2xl font-bold text-gray-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.suspendedJobs || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats?.totalJobs ? (stats.suspendedJobs / stats.totalJobs) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <Archive className="w-8 h-8 text-gray-500 group-hover:scale-110  transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-red-500 transition-colors duration-300">Expired</p>
                  <p className="text-2xl font-bold text-red-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.expiredJobs || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats?.totalJobs ? (stats.expiredJobs / stats.totalJobs) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <AlertTriangle className="w-8 h-8 text-red-500 group-hover:scale-110  transition-all duration-300" />
                </div>
              </div>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="substitute">Substitute</SelectItem>
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
