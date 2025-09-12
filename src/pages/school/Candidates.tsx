import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  GraduationCap,
  Clock,
  Eye,
  MessageCircle,
  Download,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  BookOpen,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolJobs } from "@/hooks/useJobs";
import { applicationsAPI } from "@/apis/applications";
import { customToast } from "@/components/ui/sonner";
import type { ApplicationStatus } from "@/types/job";
import { CandidatesSkeleton } from "@/components/skeletons/candidates-skeleton";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptyCandidates, EmptySearchResults } from "@/components/ui/empty-state";

const Candidates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedJob = searchParams.get("job");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsData, setApplicationsData] = useState<any>(null);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  // Get job data from navigation state if available
  const jobFromState = location.state as { jobId?: string; jobTitle?: string } | null;
  const effectiveJobId = jobFromState?.jobId || selectedJob;

  // Debug logging
  console.log("Navigation state:", location.state);
  console.log("Job from state:", jobFromState);
  console.log("Effective job ID:", effectiveJobId);
  console.log("Selected job from URL:", selectedJob);

  // API hooks
  const { data: jobsData, isLoading: jobsLoading } = useSchoolJobs(
    user?.id || "",
    { page: 1, limit: 100 } // Get all jobs for filtering
  );

  // Fetch applications by job when effectiveJobId changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (effectiveJobId) {
        // Fetch applications for a specific job
        setIsLoadingApplications(true);
        try {
          const response = await applicationsAPI.getApplicationsByJob(effectiveJobId, {
            page: currentPage,
            limit: 20,
            status: statusFilter === "all" ? undefined : statusFilter,
            search: searchTerm || undefined,
          });
          
          console.log("Applications by job response:", response);
          
          // Store the API response data
          setApplicationsData(response.data);
          
        } catch (error) {
          console.error("Error fetching applications by job:", error);
          customToast.error("Failed to fetch applications. Please try again.");
        } finally {
          setIsLoadingApplications(false);
        }
      } else {
        // Fetch all school applications when no specific job is selected
        setIsLoadingApplications(true);
        try {
          const response = await applicationsAPI.getAllSchoolApplications({
            page: currentPage,
            limit: 20,
            status: statusFilter === "all" ? undefined : statusFilter,
            querySearch: searchTerm || undefined,
          });
          
          console.log("All school applications response:", response);
          
          // Store the API response data
          setApplicationsData(response.data);
          
        } catch (error) {
          console.error("Error fetching all school applications:", error);
          customToast.error("Failed to fetch all applications. Please try again.");
        } finally {
          setIsLoadingApplications(false);
        }
      }
    };

    fetchApplications();
  }, [effectiveJobId, currentPage, statusFilter, searchTerm]);

  // Map API response to candidates format
  const mapApplicationsToCandidates = (applications: any[]) => {
    return applications.map((app, index) => ({
      id: app._id || index + 1,
      name: app.teacher?.fullName || "Name Not Provided",
      email: "Email Not Provided", // Email not in API response
      avatar: "/api/placeholder/60/60", // Default avatar
      jobId: app.job?._id || app.jobId || "Job ID Not Provided",
      jobTitle: app.job?.title || jobFromState?.jobTitle || "Job Title Not Provided",
      experience: "Experience Not Provided", // Experience not in API response
      education: "Education Not Provided", // Education not in API response
      location: app.teacher?.city && app.teacher?.country 
        ? `${app.teacher.city}, ${app.teacher.country}`
        : "Location Not Provided",
      currentPosition: "Current Position Not Provided", // Current position not in API response
      rating: 0, // Rating not in API response
      status: app.status || "pending",
      applicationDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Application Date Not Provided",
      resumeUrl: app.resumeUrl || "#",
      skills: ["Skills Not Provided"], // Skills not in API response
      languages: ["Languages Not Provided"], // Languages not in API response
      certifications: ["Certifications Not Provided"], // Certifications not in API response
      salaryExpectation: app.expectedSalary ? `$${app.expectedSalary}` : "Salary Expectation Not Provided",
      availableFrom: app.availableFrom ? new Date(app.availableFrom).toLocaleDateString() : "Available From Not Provided",
      notes: app.coverLetter || app.reasonForApplying || "Notes Not Provided",
      // Additional fields from API
      coverLetter: app.coverLetter || "Cover Letter Not Provided",
      reasonForApplying: app.reasonForApplying || "Reason for Applying Not Provided",
      screeningAnswers: app.screeningAnswers || {},
      documents: app.documents || [],
      isWithdrawn: app.isWithdrawn || false,
      // New fields from the updated API response
      job: app.job || {},
      teacher: app.teacher || {},
    }));
  };

  // Get candidates from API response or fallback to empty array
  const candidates = applicationsData?.applications 
    ? mapApplicationsToCandidates(applicationsData.applications)
    : [];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "reviewing":
        return "bg-brand-primary text-white";
      case "shortlisted":
        return "bg-brand-accent-green text-white";
      case "interviewed":
        return "bg-brand-secondary text-white";
      case "accepted":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "withdrawn":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "New Application";
      case "reviewing":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "interviewed":
        return "Interviewed";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "withdrawn":
        return "Withdrawn";
      default:
        return status;
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.education.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    const matchesJob = !effectiveJobId || candidate.jobId === effectiveJobId;

    const candidateYears = parseInt(candidate.experience);
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "0-2" && candidateYears <= 2) ||
      (experienceFilter === "3-5" &&
        candidateYears >= 3 &&
        candidateYears <= 5) ||
      (experienceFilter === "6-10" &&
        candidateYears >= 6 &&
        candidateYears <= 10) ||
      (experienceFilter === "10+" && candidateYears > 10);

    return matchesSearch && matchesStatus && matchesJob && matchesExperience;
  });

  const groupedCandidates = effectiveJobId && applicationsData?.applications ? [
    {
      _id: effectiveJobId,
      title: jobFromState?.jobTitle || "Selected Job",
      candidates: candidates
    }
  ] : applicationsData?.applications ? [
    // When viewing all applications, create a single group
    {
      _id: "all",
      title: "All Applications",
      candidates: candidates
    }
  ] : [];

  const stats = {
    total: applicationsData?.summary?.totalApplications || applicationsData?.applications?.length || 0,
    new: applicationsData?.applications?.filter((app: any) => app.status === "pending").length || 0,
    reviewing: applicationsData?.applications?.filter((app: any) => app.status === "reviewing").length || 0,
    shortlisted: applicationsData?.applications?.filter((app: any) => app.status === "shortlisted").length || 0,
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      // In real implementation, this would call the API to update application status
      customToast.success(
        `Candidate status updated to ${getStatusLabel(newStatus)}`
      );
      // Refresh candidates list
    } catch (error) {
      customToast.error("Failed to update candidate status");
    }
  };

  const handleSendMessage = (candidateEmail: string) => {
    customToast.info(`Opening message interface for ${candidateEmail}`);
    // TODO: Implement message interface
  };

  const handleScheduleInterview = (candidateEmail: string) => {
    customToast.info("Opening interview scheduling interface");
    // TODO: Implement interview scheduling interface
  };

  const handleDownloadResume = (resumeUrl: string) => {
    if (resumeUrl && resumeUrl !== "#") {
      // Create a temporary link to download the resume
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      customToast.success("Resume download started");
    } else {
      customToast.error("Resume not available for download");
    }
  };

  if (jobsLoading) {
    return (
      <DashboardLayout role="school">
        <CandidatesSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Candidates
          </h1>
          <p className="text-muted-foreground">
            Review and manage applications for your job postings
          </p>
          {jobFromState?.jobTitle ? (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground">
                Currently viewing candidates for: <span className="text-brand-primary">{jobFromState.jobTitle}</span>
              </p>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground">
                Viewing all applications across all jobs
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Candidates
              </CardTitle>
              <Users className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Across all jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Applications
              </CardTitle>
              <Eye className="h-4 w-4 text-brand-accent-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.new}</div>
              <p className="text-xs text-muted-foreground">Require review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Under Review
              </CardTitle>
              <Calendar className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviewing}</div>
              <p className="text-xs text-muted-foreground">
                Currently reviewing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <CheckCircle className="h-4 w-4 text-brand-accent-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shortlisted}</div>
              <p className="text-xs text-muted-foreground">Top candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {jobFromState?.jobTitle ? `Candidates for ${jobFromState.jobTitle}` : "All Candidates"}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as ApplicationStatus | "all")
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">New</SelectItem>
                    <SelectItem value="reviewing">Under Review</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={experienceFilter}
                  onValueChange={setExperienceFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grouped" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grouped">Grouped by Job</TabsTrigger>
                <TabsTrigger value="all">All Candidates</TabsTrigger>
              </TabsList> */}

              <TabsContent value="grouped" className="space-y-6 mt-6">
                {isLoadingApplications ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50 animate-spin" />
                    <p>Loading candidates...</p>
                  </Card>
                ) : groupedCandidates.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>
                      {effectiveJobId 
                        ? "No candidates found for this position." 
                        : "Please select a job to view candidates."
                      }
                    </p>
                  </Card>
                ) : (
                  groupedCandidates.map((job) => (
                    <div key={job._id}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-lg">
                          {job.title}
                        </h3>
                        <Badge variant="outline">
                          {job.candidates.length} candidates
                        </Badge>
                      </div>

                      {job.candidates.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>
                            No candidates match the current filters for this
                            position.
                          </p>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {job.candidates.map((candidate) => (
                            <Card
                              key={candidate.id}
                              className="hover:shadow-card-hover transition-all"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-start space-x-4">
                                    <Avatar className="w-16 h-16">
                                      <AvatarImage src={candidate.avatar} />
                                      <AvatarFallback className="text-lg">
                                        {candidate.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="font-heading font-semibold text-lg">
                                          {candidate.name}
                                        </h4>
                                        <Badge
                                          className={getStatusColor(
                                            candidate.status
                                          )}
                                        >
                                          {getStatusLabel(candidate.status)}
                                        </Badge>
                                      </div>

                                      <p className="text-muted-foreground mb-2">
                                        {candidate.currentPosition}
                                      </p>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                          <MapPin className="w-4 h-4 text-muted-foreground" />
                                          <span>{candidate.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                                          <span>{candidate.experience}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                          <span>{candidate.rating}</span>
                                        </div>
                                      </div>
                                    </div>
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
                                          navigate(
                                            `/dashboard/school/candidate-profile/${candidate.id}`
                                          )
                                        }
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Full Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDownloadResume(
                                            candidate.resumeUrl
                                          )
                                        }
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleSendMessage(candidate.email)
                                        }
                                      >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Send Message
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleScheduleInterview(candidate.email)
                                        }
                                      >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Interview
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(
                                            candidate.id.toString(),
                                            "shortlisted"
                                          )
                                        }
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Shortlist
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(
                                            candidate.id.toString(),
                                            "rejected"
                                          )
                                        }
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="mb-4">
                                  <p className="text-sm mb-2">
                                    <span className="font-medium">
                                      Education:
                                    </span>{" "}
                                    {candidate.education}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.notes}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {candidate.skills
                                    .slice(0, 3)
                                    .map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {candidate.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{candidate.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-4">
                                    <span>
                                      Applied: {candidate.applicationDate}
                                    </span>
                                    <span>
                                      Available: {candidate.availableFrom}
                                    </span>
                                    <span>
                                      Salary: {candidate.salaryExpectation}
                                    </span>
                                  </div>

                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleStatusChange(
                                          candidate.id.toString(),
                                          "rejected"
                                        )
                                      }
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() =>
                                        handleStatusChange(
                                          candidate.id.toString(),
                                          "shortlisted"
                                        )
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Shortlist
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              {/* <TabsContent value="all" className="space-y-4 mt-6">
                {filteredCandidates.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No candidates match the current filters.</p>
                  </Card>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="hover:shadow-card-hover transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback className="text-lg">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-heading font-semibold text-lg">
                                  {candidate.name}
                                </h4>
                                <Badge
                                  className={getStatusColor(candidate.status)}
                                >
                                  {getStatusLabel(candidate.status)}
                                </Badge>
                              </div>

                              <p className="text-muted-foreground mb-1">
                                Applied for: {candidate.jobTitle}
                              </p>
                              <p className="text-muted-foreground mb-2">
                                {candidate.currentPosition}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span>{candidate.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                                  <span>{candidate.experience}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span>{candidate.rating}</span>
                                </div>
                              </div>
                            </div>
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
                                  navigate(
                                    `/dashboard/school/candidate-profile/${candidate.id}`
                                  )
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownloadResume(candidate.resumeUrl)
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Resume
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSendMessage(candidate.email)
                                }
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleScheduleInterview(candidate.email)
                                }
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    candidate.id.toString(),
                                    "shortlisted"
                                  )
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    candidate.id.toString(),
                                    "rejected"
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm mb-2">
                            <span className="font-medium">Education:</span>{" "}
                            {candidate.education}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.notes}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>Applied: {candidate.applicationDate}</span>
                            <span>Available: {candidate.availableFrom}</span>
                            <span>Salary: {candidate.salaryExpectation}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  candidate.id.toString(),
                                  "rejected"
                                )
                              }
                            >
                              <XCircle className="w-4 h-4 ml-1" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  candidate.id.toString(),
                                  "shortlisted"
                                )
                              }
                            >
                              <CheckCircle className="w-4 h-4 ml-1" />
                              Shortlist
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent> */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
