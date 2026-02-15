import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import DeleteConfirmationModal from "@/components/Modals/delete-confirmation-modal";
import BulkDeleteConfirmationModal from "@/components/Modals/bulk-delete-confirmation-modal";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Eye,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  MoreHorizontal,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  Trash2,
  Pause,
  Play,
  Archive,
  Loader2,
  AlertCircle,
  Megaphone,
  CheckCircle,
  Star,
  Sparkles,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSchoolJobs,
  useSchoolDashboardStats,
  useUpdateJobStatus,
  useDeleteJob,
} from "@/hooks/useJobs";
import { adApi } from "@/apis/ads";
import type { AdTier } from "@/apis/ads";
import { customToast } from "@/components/ui/sonner";
import type { JobStatus, Job, PaginatedResponse } from "@/types/job";
import { JobPostingsSkeleton } from "@/components/skeletons/job-postings-skeleton";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptyJobPostings, EmptySearchResults } from "@/components/ui/empty-state";
import { useDropdownOptions } from "@/components/ui/dynamic-select";

// Custom type for your API response structure
interface SchoolJobsResponse {
  data: {
    jobs: Job[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const JobPostings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dynamic dropdown options
  const { data: jobStatusOptions, isLoading: loadingJobStatuses } = useDropdownOptions("jobStatus");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Promote modal state
  const [promoteJob, setPromoteJob] = useState<Job | null>(null);
  const [adTiers, setAdTiers] = useState<AdTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<AdTier | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [adHeadline, setAdHeadline] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [adSubmitting, setAdSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: dashboardStats, isLoading: statsLoading } =
    useSchoolDashboardStats(user?.id || "");
  const {
    data: jobsData,
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = useSchoolJobs(user?.id || "", { page: currentPage, limit: 10 }) as {
    data: SchoolJobsResponse | undefined;
    isLoading: boolean;
    refetch: () => void;
  };
  const updateJobStatusMutation = useUpdateJobStatus();
  const deleteJobMutation = useDeleteJob();

  // Refetch jobs when user ID changes or page changes
  useEffect(() => {
    if (user?.id) {
      refetchJobs();
    }
  }, [user?.id, currentPage, refetchJobs]);

  // Filter jobs based on search and status
  const filteredJobs =
    (jobsData?.data?.jobs || []).filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.positionCategory
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.subjects?.some((subject) =>
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  // Calculate stats from API data
  const stats = {
    total: dashboardStats?.data?.totalJobs || 0,
    published: dashboardStats?.data?.activeJobs || 0, // Using activeJobs for published jobs
    draft: dashboardStats?.data?.draftJobs || 0,
    totalApplicants: dashboardStats?.data?.totalApplications || 0,
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500 text-white";
      case "published":
        return "bg-brand-accent-green text-white";
      case "expired":
        return "bg-red-500 text-white";
      case "closed":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "published":
        return "Published";
      case "expired":
        return "Expired";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (jobId: string, newStatus: JobStatus) => {
    try {
      // Find the current job to check its status
      const currentJob = filteredJobs.find((job) => job._id === jobId);
      if (!currentJob) {
        customToast.error("Job not found");
        return;
      }

      // Prevent invalid status transitions
      if (currentJob.status === "closed" && newStatus === "closed") {
        customToast.error("Job is already closed");
        return;
      }

      if (currentJob.status === "expired" && newStatus === "expired") {
        customToast.error("Job is already expired");
        return;
      }

      // Create appropriate notes based on status change
      let notes = `Status changed to ${newStatus}`;
      if (newStatus === "published") {
        notes = "Job published and is now accepting applications";
      } else if (newStatus === "draft") {
        notes = "Job paused and moved to draft status";
      } else if (newStatus === "closed") {
        notes = "Job closed and no longer accepting applications";
      } else if (newStatus === "expired") {
        notes = "Job expired due to deadline";
      }

      await updateJobStatusMutation.mutateAsync({
        jobId,
        status: newStatus,
        notes,
      });
      customToast.success(`Job status updated to ${getStatusLabel(newStatus)}`);
      refetchJobs();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        customToast.error(
          `Failed to update job status: ${error.response.data.message}`
        );
      } else {
        customToast.error("Failed to update job status");
      }
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const job = filteredJobs.find((j) => j._id === jobId);
    if (job) {
      setJobToDelete(job);
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      await deleteJobMutation.mutateAsync(jobToDelete._id);
      customToast.success("Job deleted successfully");
      refetchJobs();
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      customToast.error("Failed to delete job");
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedJobs.map((jobId) => deleteJobMutation.mutateAsync(jobId))
      );
      customToast.success(`${selectedJobs.length} jobs deleted successfully`);
      setSelectedJobs([]);
      refetchJobs();
      setBulkDeleteModalOpen(false);
    } catch (error: any) {
      customToast.error("Failed to delete some jobs");
    }
  };

  const closeBulkDeleteModal = () => {
    setBulkDeleteModalOpen(false);
  };

  // Promote Job handlers
  const handlePromoteJob = async (job: Job) => {
    setPromoteJob(job);
    setTiersLoading(true);
    try {
      const tiers = await adApi.getAdTiers();
      setAdTiers(tiers);
    } catch (error) {
      console.error("Failed to fetch ad tiers:", error);
      customToast.error("Failed to load promotion options");
    } finally {
      setTiersLoading(false);
    }
  };

  const handleTierSelect = (tier: AdTier) => {
    setSelectedTier(tier);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      customToast.error("File too large", "Maximum file size is 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      customToast.error("Invalid file type", "Please upload a JPEG, PNG, or WebP image");
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitAdRequest = async () => {
    if (!selectedTier || !bannerFile || !promoteJob) return;
    setAdSubmitting(true);
    try {
      await adApi.createAdRequest({
        jobId: promoteJob._id,
        tierId: selectedTier._id,
        banner: bannerFile,
        headline: adHeadline || undefined,
        description: adDescription || undefined,
      });
      customToast.success("Ad request submitted!", "Our team will review your ad and notify you when it's approved.");
      closePromoteModal();
    } catch (error) {
      console.error("Failed to submit ad request:", error);
      customToast.error("Submission failed", "Please try again or contact support");
    } finally {
      setAdSubmitting(false);
    }
  };

  const closePromoteModal = () => {
    setPromoteJob(null);
    setSelectedTier(null);
    setBannerFile(null);
    setBannerPreview(null);
    setAdHeadline("");
    setAdDescription("");
    setAdTiers([]);
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(0)}`;

  const handleBulkAction = async (action: JobStatus | "delete") => {
    if (selectedJobs.length === 0) {
      customToast.error("Please select jobs first");
      return;
    }

    if (action === "delete") {
      setBulkDeleteModalOpen(true);
    } else {
      // Check if any selected jobs are already closed and prevent invalid transitions
      const selectedJobObjects = filteredJobs.filter((job) =>
        selectedJobs.includes(job._id)
      );
      const hasClosedJobs = selectedJobObjects.some(
        (job) => job.status === "closed"
      );

      if (action === "closed" && hasClosedJobs) {
        customToast.error("Cannot close jobs that are already closed");
        return;
      }

      try {
        // Create appropriate notes based on status change
        let notes = `Bulk status update to ${action}`;
        if (action === "published") {
          notes = "Jobs published and are now accepting applications";
        } else if (action === "draft") {
          notes = "Jobs paused and moved to draft status";
        } else if (action === "closed") {
          notes = "Jobs closed and no longer accepting applications";
        } else if (action === "expired") {
          notes = "Jobs expired due to deadline";
        }

        await Promise.all(
          selectedJobs.map((jobId) =>
            updateJobStatusMutation.mutateAsync({
              jobId,
              status: action,
              notes,
            })
          )
        );
        customToast.success(
          `${selectedJobs.length} jobs updated to ${getStatusLabel(action)}`
        );
        setSelectedJobs([]);
        refetchJobs();
      } catch (error: any) {
        if (error?.response?.data?.message) {
          customToast.error(
            `Failed to update some job statuses: ${error.response.data.message}`
          );
        } else {
          customToast.error("Failed to update some job statuses");
        }
      }
    }
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAllJobs = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((job) => job._id));
    }
  };

  if (statsLoading || jobsLoading) {
    return (
      <DashboardLayout role="school">
        <JobPostingsSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Job Postings
            </h1>
            <p className="text-muted-foreground">
              Manage your active job listings and track their performance
            </p>
          </div>
          <Link to="/dashboard/school/post-job">
            <Button variant="hero" className="shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Jobs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.total}
              </div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                All time postings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Published Jobs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats.published}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Currently accepting applications
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Draft Jobs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Edit className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {stats.draft}
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                Awaiting publication
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Applicants
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {stats.totalApplicants}
              </div>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Across all jobs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Job Listings</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as JobStatus | "all")
                  }
                  disabled={loadingJobStatuses}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={loadingJobStatuses ? "Loading..." : "Status"} />
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {selectedJobs.length > 0 && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedJobs.length} job(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("published")}
                      disabled={updateJobStatusMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("draft")}
                      disabled={updateJobStatusMutation.isPending}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("closed")}
                      disabled={updateJobStatusMutation.isPending}
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                      disabled={deleteJobMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "No jobs match the current filters."
                      : "No job postings found. Create your first job posting to get started!"}
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`p-6 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-md transition-all ${
                      selectedJobs.includes(job._id)
                        ? "ring-2 ring-brand-primary"
                        : ""
                    }`}
                  >
                    {/* Job Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedJobs.includes(job._id)}
                            onChange={() => toggleJobSelection(job._id)}
                            className="rounded border-gray-300"
                            aria-label={`Select ${job.title} for bulk action`}
                            title={`Select ${job.title} for bulk action`}
                          />
                          <h3 className="font-heading font-semibold text-xl">
                            {job.title}
                          </h3>
                          <Badge className={getStatusColor(job.status)}>
                            {getStatusLabel(job.status)}
                          </Badge>
                          {job.quickApply && (
                            <Badge
                              variant="outline"
                              className="text-brand-primary border-brand-primary"
                            >
                              Quick Apply
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {job.positionCategory}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/dashboard/school/edit-job/${job._id}`)
                            }
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/dashboard/school/candidates?job=${job._id}`,
                                {
                                  state: {
                                    jobId: job._id,
                                    jobTitle: job.title
                                  }
                                }
                              )
                            }
                          >
                            <Users className="w-4 h-4 mr-2" />
                            View Candidates ({job.applicantsCount || 0})
                          </DropdownMenuItem>
                          {job.status === "published" && (
                            <DropdownMenuItem
                              onClick={() => handlePromoteJob(job)}
                            >
                              <Megaphone className="w-4 h-4 mr-2" />
                              Promote Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {job.status === "published" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(job._id, "draft")
                              }
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Job
                            </DropdownMenuItem>
                          )}
                          {job.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(job._id, "published")
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Publish Job
                            </DropdownMenuItem>
                          )}
                          {job.status !== "closed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(job._id, "closed")
                              }
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Close Job
                            </DropdownMenuItem>
                          )}
                          {job.status === "closed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(job._id, "published")
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Reopen Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {job.city}, {job.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{job.educationLevel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {job.salaryMin && job.salaryMax
                            ? `${job.salaryMin} - ${job.salaryMax} ${job.currency}`
                            : "Salary not disclosed"}
                        </span>
                      </div>
                    </div>

                    {/* Subjects */}
                    {job.subjects && job.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {job.applicantsCount || 0}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Applicants
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {job.viewsCount || 0}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Views
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-xs">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Posted
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-xs">
                            {job.applicationDeadline
                              ? new Date(
                                  job.applicationDeadline
                                ).toLocaleDateString()
                              : "No deadline"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Deadline
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {job.visaSponsorship && (
                          <Badge variant="outline" className="text-xs">
                            Visa Sponsorship
                          </Badge>
                        )}
                        {job.minExperience && (
                          <span className="text-xs text-muted-foreground">
                            Min {job.minExperience} years experience
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/dashboard/school/edit-job/${job._id}`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Link
                          to={`/dashboard/school/candidates?job=${job._id}`}
                          state={{
                            jobId: job._id,
                            jobTitle: job.title
                          }}
                        >
                          <Button variant="default" size="sm">
                            <Users className="w-4 h-4 mr-1" />
                            View Candidates ({job.applicantsCount || 0})
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {jobsData?.data?.pagination &&
              jobsData.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * 10 + 1} to{" "}
                    {Math.min(currentPage * 10, jobsData.data.pagination.total)}{" "}
                    of {jobsData.data.pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={
                        currentPage >= jobsData.data.pagination.totalPages
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteJob}
        job={jobToDelete}
        isLoading={deleteJobMutation.isPending}
      />

      {/* Bulk Delete Confirmation Modal */}
      <BulkDeleteConfirmationModal
        isOpen={bulkDeleteModalOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={confirmBulkDelete}
        jobs={filteredJobs.filter((job) => selectedJobs.includes(job._id))}
        isLoading={deleteJobMutation.isPending}
      />

      {/* Promote Job Modal */}
      <Dialog
        open={promoteJob !== null && selectedTier === null}
        onOpenChange={(open) => { if (!open) closePromoteModal(); }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Megaphone className="w-5 h-5 text-brand-primary" />
              Promote Your Job
            </DialogTitle>
            <DialogDescription>
              Boost visibility for <span className="font-semibold">{promoteJob?.title}</span> with a premium banner ad.
            </DialogDescription>
          </DialogHeader>

          {tiersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : adTiers.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No promotion tiers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {adTiers.map((tier) => {
                const isPopular = tier.highlight !== null;
                return (
                  <Card
                    key={tier._id}
                    className={`relative cursor-pointer hover:shadow-md transition-all duration-200 ${
                      isPopular ? "border-brand-primary ring-2 ring-brand-primary/20" : ""
                    }`}
                    onClick={() => handleTierSelect(tier)}
                  >
                    {isPopular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <Badge className="bg-brand-primary text-white px-2 py-0.5 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {tier.highlight}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={`pb-2 ${isPopular ? "pt-5" : ""}`}>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{tier.name}</CardTitle>
                        <div className="text-right">
                          {tier.hasActiveLaunchPricing && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(tier.normalPrice)}
                            </div>
                          )}
                          <div className="text-xl font-bold text-brand-primary">
                            {formatPrice(tier.effectivePrice)}
                          </div>
                          <div className="text-xs text-muted-foreground">{tier.durationLabel}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                      {tier.hasActiveLaunchPricing && (
                        <Badge variant="secondary" className="bg-brand-accent-green/10 text-brand-accent-green text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Launch Offer
                        </Badge>
                      )}
                      <ul className="space-y-1.5">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-accent-green flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant={isPopular ? "hero" : "outline"} className="w-full" size="sm">
                        Select {tier.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ad Request (Banner Upload) Modal */}
      <Dialog
        open={selectedTier !== null && promoteJob !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTier(null);
            setBannerFile(null);
            setBannerPreview(null);
            setAdHeadline("");
            setAdDescription("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Megaphone className="w-5 h-5 text-brand-primary" />
              Create Ad Request
            </DialogTitle>
            <DialogDescription>
              {selectedTier && (
                <>
                  Submit a banner ad for <span className="font-semibold">{promoteJob?.title}</span> using the{" "}
                  <span className="font-semibold">{selectedTier.name}</span> tier ({formatPrice(selectedTier.effectivePrice)}/{selectedTier.durationLabel}).
                  Our team will review it and notify you when approved.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Banner Upload */}
            <div className="space-y-2">
              <Label htmlFor="promote-banner" className="text-sm font-medium">
                Banner Image <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Recommended: 1200x400px. Max 2MB. JPEG, PNG, or WebP.
              </p>
              {bannerPreview ? (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-auto rounded-lg border object-cover"
                    style={{ aspectRatio: "3/1" }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveBanner}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-brand-primary/50 hover:bg-muted/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ aspectRatio: "3/1" }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Click to upload banner image</p>
                    <p className="text-xs text-muted-foreground mt-1">1200x400px recommended</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="promote-banner"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleBannerFileChange}
              />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="promote-headline" className="text-sm font-medium">
                Headline <span className="text-muted-foreground font-normal">(optional, max 80 characters)</span>
              </Label>
              <Input
                id="promote-headline"
                placeholder="e.g., Join Our Award-Winning Team!"
                value={adHeadline}
                onChange={(e) => setAdHeadline(e.target.value.slice(0, 80))}
                maxLength={80}
              />
              <p className="text-xs text-muted-foreground text-right">{adHeadline.length}/80</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="promote-desc" className="text-sm font-medium">
                Description <span className="text-muted-foreground font-normal">(optional, max 150 characters)</span>
              </Label>
              <Textarea
                id="promote-desc"
                placeholder="e.g., Competitive salary, modern facilities, and professional development opportunities."
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value.slice(0, 150))}
                maxLength={150}
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right">{adDescription.length}/150</p>
            </div>

            {/* Tier Summary */}
            {selectedTier && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{selectedTier.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedTier.durationLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-brand-primary">{formatPrice(selectedTier.effectivePrice)}</p>
                      {selectedTier.hasActiveLaunchPricing && (
                        <p className="text-xs text-muted-foreground line-through">{formatPrice(selectedTier.normalPrice)}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Payment is required only after admin approval.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedTier(null)}
              disabled={adSubmitting}
            >
              Back
            </Button>
            <Button
              variant="hero"
              onClick={handleSubmitAdRequest}
              disabled={!bannerFile || adSubmitting}
            >
              {adSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Ad Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default JobPostings;
