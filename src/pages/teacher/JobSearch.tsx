import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Filter,
  GraduationCap,
  Users,
  Globe,
  Star,
  Eye,
  Loader2,
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { JobListingsSkeleton } from "@/components/skeletons";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptySearchResults } from "@/components/ui/empty-state";
import {
  useSaveJob,
  useRemoveSavedJob,
  useIsJobSaved,
} from "@/hooks/useSavedJobs";
import { customToast } from "@/components/ui/sonner";
import type { JobSearchParams, Job } from "@/types/job";
import { CountryDropdown } from "@/components/ui/country-dropdown";

// Interface for the actual API response structure
interface JobSearchResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: string;
    };
  };
}

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<JobSearchParams>({
    page: 1,
    limit: 10,
    q: "",
    location: "",
    subject: "",
    educationLevel: undefined,
    jobType: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    country: "",
    city: "",
    isUrgent: undefined,
    isFeatured: undefined,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  // API hooks
  const {
    data: jobsResponse,
    isLoading,
    error,
    refetch,
  } = useJobs(filters) as {
    data: JobSearchResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  const saveJobMutation = useSaveJob();
  const removeSavedJobMutation = useRemoveSavedJob();

  // Update filters when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        q: searchTerm || undefined,
        page: 1, // Reset to first page when searching
      }));
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Extract jobs from response
  const jobs = jobsResponse?.data?.jobs || [];
  const pagination = jobsResponse?.data?.pagination;

  // Handle job saving
  const toggleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.has(jobId)) {
        await removeSavedJobMutation.mutateAsync(jobId);
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        customToast.success("Job removed from saved jobs");
      } else {
        await saveJobMutation.mutateAsync({
          jobId,
          data: { priority: "medium" },
        });
        setSavedJobs((prev) => new Set([...prev, jobId]));
        customToast.success("Job saved successfully");
      }
    } catch (error) {
      customToast.error("Failed to update saved job status");
    }
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof JobSearchParams,
    value: string | number | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      q: "",
      location: "",
      subject: "",
      educationLevel: undefined,
      jobType: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      country: "",
      city: "",
      isUrgent: undefined,
      isFeatured: undefined,
      sortBy: "date",
      sortOrder: "desc",
    });
    setSearchTerm("");
  };

  // Load more jobs
  const loadMore = () => {
    if (pagination?.hasNextPage) {
      setFilters((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
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

  // Format salary range
  const formatSalaryRange = (job: Job) => {
    if (!job.salaryDisclose) return "Salary not disclosed";
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `From $${job.salaryMin.toLocaleString()}`;
    if (job.salaryMax) return `Up to $${job.salaryMax.toLocaleString()}`;
    return "Salary not disclosed";
  };

  // Education level options
  const educationLevels = [
    { value: "early_years", label: "Early Years (Ages 3-5)" },
    { value: "primary", label: "Primary (Grades 1-6)" },
    { value: "secondary", label: "Secondary (Grades 7-9)" },
    { value: "high_school", label: "High School (Grades 10-12)" },
    { value: "foundation", label: "Foundation" },
    { value: "higher_education", label: "Higher Education" },
  ];

  // Job type options
  const jobTypes = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "substitute", label: "Substitute" },
  ];

  // Common subjects
  const subjects = [
    "Mathematics",
    "English Language",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Art & Design",
    "Physical Education",
    "Music",
    "Computer Science",
  ];

  // Common locations
  const locations = [
    "Dubai, UAE",
    "Abu Dhabi, UAE",
    "Kuwait City, Kuwait",
    "Doha, Qatar",
    "Riyadh, Saudi Arabia",
    "Manama, Bahrain",
    "Muscat, Oman",
  ];

  if (error) {
    return (
      <DashboardLayout role="teacher">
        <DashboardErrorFallback 
          error={error}
          onRetry={refetch}
          title="Job Search Unavailable"
          description="We're having trouble loading job listings. This could be due to a temporary network issue."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">


              {/* Country Filter */}
              <div className="space-y-2">
                <Label>Country</Label>
                <CountryDropdown
                  defaultValue={filters.country || "any"}
                  onChange={(value) => handleFilterChange("country", value.name === "any" ? "" : value.name)}
                />
                  </div>

              {/* Location Filter */}
              {/* <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={filters.location || "any"}
                  onValueChange={(value) =>
                    handleFilterChange("location", value === "any" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any location</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* Education Level Filter */}
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select
                  value={filters.educationLevel || "any"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "educationLevel",
                      value === "any" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any level</SelectItem>
                    {educationLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={filters.subject || "any"}
                  onValueChange={(value) =>
                    handleFilterChange("subject", value === "any" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Filter */}
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={filters.jobType || "any"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "jobType",
                      value === "any" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="space-y-3">
                <Label>Salary Range (USD)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="salaryMin" className="text-sm text-muted-foreground">
                      Min Salary
                    </Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="1"
                      value={filters.salaryMin || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        if (value !== undefined && filters.salaryMax && value > filters.salaryMax) {
                          customToast.error("Minimum salary cannot be greater than maximum salary");
                          return;
                        }
                        handleFilterChange("salaryMin", value);
                      }}
                      min={1}
                      max={filters.salaryMax || 100000}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="salaryMax" className="text-sm text-muted-foreground">
                      Max Salary
                    </Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="10000"
                      value={filters.salaryMax || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        if (value !== undefined && filters.salaryMin && value < filters.salaryMin) {
                          customToast.error("Maximum salary cannot be less than minimum salary");
                          return;
                        }
                        handleFilterChange("salaryMax", value);
                      }}
                      min={filters.salaryMin || 1}
                      max={100000}
                    />
                  </div>
                </div>
                {(filters.salaryMin || filters.salaryMax) && (
                  <div className="text-sm text-muted-foreground">
                    Range: ${(filters.salaryMin || 0).toLocaleString()} - ${(filters.salaryMax || 100000).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={filters.isUrgent || false}
                    onCheckedChange={(checked) =>
                      handleFilterChange("isUrgent", checked || undefined)
                    }
                  />
                  <Label htmlFor="urgent" className="text-sm">
                    Urgent Jobs Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.isFeatured || false}
                    onCheckedChange={(checked) =>
                      handleFilterChange("isFeatured", checked || undefined)
                    }
                  />
                  <Label htmlFor="featured" className="text-sm">
                    Featured Jobs Only
                  </Label>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Header */}
          <div className="space-y-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                Find Your Dream Teaching Job
              </h1>
              <p className="text-muted-foreground">
                Discover exciting opportunities at top international schools
                worldwide
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, schools, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `Showing ${jobs.length} jobs`}
              {pagination && ` of ${pagination.total} total jobs`}
            </p>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Most Recent</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
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
          )}

          {/* Job Cards */}
          {!isLoading && (
            <div className="space-y-6">
              {jobs.length === 0 ? (
                <EmptySearchResults
                  onClearSearch={() => {
                    setSearchTerm("");
                    setFilters(prev => ({ ...prev, q: undefined }));
                  }}
                />
              ) : (
                jobs.map((job: Job) => (
                  <Card
                    key={job._id}
                    className="group hover:shadow-card-hover transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-heading font-semibold text-xl group-hover:text-brand-primary transition-colors">
                              {job.title}
                            </h3>
                            {job.quickApply && (
                              <Badge className="bg-brand-accent-green text-white">
                                Quick Apply
                              </Badge>
                            )}
                            {job.visaSponsorship && (
                              <Badge
                                variant="outline"
                                className="border-brand-secondary text-brand-secondary"
                              >
                                Visa Sponsorship
                              </Badge>
                            )}
                            {job.isUrgent && (
                              <Badge className="bg-red-500 text-white">
                                Urgent
                              </Badge>
                            )}
                            {job.isFeatured && (
                              <Badge className="bg-yellow-500 text-white">
                                Featured
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">
                                {job.organization ||
                                  job.school?.name ||
                                  "School Name"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {job.city}, {job.country}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaveJob(job._id)}
                          disabled={
                            saveJobMutation.isPending ||
                            removeSavedJobMutation.isPending
                          }
                          className={
                            savedJobs.has(job._id) ? "text-brand-primary" : ""
                          }
                        >
                          {saveJobMutation.isPending ||
                          removeSavedJobMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Heart
                              className={`w-4 h-4 ${
                                savedJobs.has(job._id) ? "fill-current" : ""
                              }`}
                            />
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {educationLevels.find(
                              (level) => level.value === job.educationLevel
                            )?.label || job.educationLevel}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {formatSalaryRange(job)} {job.currency}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {jobTypes.find((type) => type.value === job.jobType)
                              ?.label || job.jobType}
                          </span>
                        </div>
                      </div>

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

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {job.benefits && job.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.benefits.slice(0, 3).map((benefit, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {benefit}
                            </Badge>
                          ))}
                          {job.benefits.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.benefits.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Posted {getDaysAgo(job.createdAt)}</span>

                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Deadline:{" "}
                              {new Date(
                                job.applicationDeadline
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link to={`/dashboard/teacher/job/${job._id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Link
                            to={`/dashboard/teacher/job-application/${job._id}`}
                          >
                            <Button variant="default" size="sm">
                              {job.quickApply ? "Quick Apply" : "Apply Now"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Load More */}
          {!isLoading && pagination?.hasNextPage && (
            <div className="text-center">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Jobs"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobSearch;
