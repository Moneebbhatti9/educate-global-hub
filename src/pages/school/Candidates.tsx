import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import type { ApplicationStatus } from "@/types/job";
import { CandidatesSkeleton } from "@/components/skeletons/candidates-skeleton";

const Candidates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedJob = searchParams.get("job");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { data: jobsData, isLoading: jobsLoading } = useSchoolJobs(
    user?.id || "",
    { page: 1, limit: 100 } // Get all jobs for filtering
  );

  // Mock candidates data - in real implementation, this would come from the applications API
  // For now, using mock data to demonstrate the UI
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "/api/placeholder/60/60",
      jobId: "1",
      jobTitle: "Mathematics Teacher - Secondary",
      experience: "8 years",
      education: "MSc Mathematics, University of Oxford",
      location: "London, UK",
      currentPosition: "Senior Mathematics Teacher",
      rating: 4.8,
      status: "pending" as ApplicationStatus,
      applicationDate: "March 15, 2024",
      resumeUrl: "#",
      skills: ["Advanced Mathematics", "IB Curriculum", "Student Mentoring"],
      languages: ["English (Native)", "French (Intermediate)"],
      certifications: ["PGCE", "IB Mathematics Certificate"],
      salaryExpectation: "$4,500 - $6,000",
      availableFrom: "June 2024",
      notes:
        "Excellent experience with IB curriculum and proven track record in student achievement.",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "/api/placeholder/60/60",
      jobId: "2",
      jobTitle: "English Language Teacher - Primary",
      experience: "5 years",
      education: "BA English Literature, Cambridge University",
      location: "Singapore",
      currentPosition: "Primary English Teacher",
      rating: 4.6,
      status: "reviewing" as ApplicationStatus,
      applicationDate: "March 14, 2024",
      resumeUrl: "#",
      skills: ["Phonics", "Reading Comprehension", "Creative Writing"],
      languages: ["English (Native)", "Mandarin (Native)", "Spanish (Basic)"],
      certifications: ["TESOL", "Cambridge CELTA"],
      salaryExpectation: "$3,500 - $5,000",
      availableFrom: "August 2024",
      notes:
        "Strong background in primary education with multicultural experience.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      avatar: "/api/placeholder/60/60",
      jobId: "3",
      jobTitle: "Science Lab Coordinator",
      experience: "12 years",
      education: "PhD Chemistry, MIT",
      location: "Dubai, UAE",
      currentPosition: "Science Department Head",
      rating: 4.9,
      status: "pending" as ApplicationStatus,
      applicationDate: "March 13, 2024",
      resumeUrl: "#",
      skills: [
        "Laboratory Management",
        "Safety Protocols",
        "Equipment Maintenance",
      ],
      languages: [
        "English (Native)",
        "Spanish (Native)",
        "Arabic (Conversational)",
      ],
      certifications: ["Lab Safety Certification", "Advanced Chemistry"],
      salaryExpectation: "$3,000 - $4,500",
      availableFrom: "Immediately",
      notes: "Extensive lab management experience with strong safety record.",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@email.com",
      avatar: "/api/placeholder/60/60",
      jobId: "1",
      jobTitle: "Mathematics Teacher - Secondary",
      experience: "6 years",
      education: "MEd Mathematics Education, Harvard",
      location: "Seoul, South Korea",
      currentPosition: "Mathematics Teacher",
      rating: 4.7,
      status: "shortlisted" as ApplicationStatus,
      applicationDate: "March 12, 2024",
      resumeUrl: "#",
      skills: ["Calculus", "Statistics", "Educational Technology"],
      languages: [
        "English (Fluent)",
        "Korean (Native)",
        "Japanese (Intermediate)",
      ],
      certifications: ["Teaching License", "EdTech Certification"],
      salaryExpectation: "$4,000 - $5,500",
      availableFrom: "July 2024",
      notes: "Technology-forward approach to mathematics education.",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      avatar: "/api/placeholder/60/60",
      jobId: "4",
      jobTitle: "Art & Design Teacher",
      experience: "10 years",
      education: "MFA Fine Arts, Royal College of Art",
      location: "Manchester, UK",
      currentPosition: "Head of Art Department",
      rating: 4.8,
      status: "rejected" as ApplicationStatus,
      applicationDate: "March 10, 2024",
      resumeUrl: "#",
      skills: ["Digital Art", "Traditional Media", "Portfolio Development"],
      languages: ["English (Native)", "Italian (Intermediate)"],
      certifications: ["Art Education Certificate", "Digital Design"],
      salaryExpectation: "$3,200 - $4,800",
      availableFrom: "September 2024",
      notes: "Award-winning art educator with exhibition experience.",
    },
  ];

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
    const matchesJob = !selectedJob || candidate.jobId === selectedJob;

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

  const groupedCandidates = (jobsData?.data?.data || []).map((job) => ({
    ...job,
    candidates: filteredCandidates.filter(
      (candidate) => candidate.jobId === job._id
    ),
  }));

  const stats = {
    total: candidates.length,
    new: candidates.filter((c) => c.status === "pending").length,
    reviewing: candidates.filter((c) => c.status === "reviewing").length,
    shortlisted: candidates.filter((c) => c.status === "shortlisted").length,
  };

  const handleStatusUpdate = async (
    candidateId: number,
    newStatus: ApplicationStatus
  ) => {
    try {
      // In real implementation, this would call the API to update application status
      toast.success(`Candidate status updated to ${getStatusLabel(newStatus)}`);
      // Refresh candidates list
    } catch (error) {
      toast.error("Failed to update candidate status");
    }
  };

  const handleSendMessage = (candidateEmail: string) => {
    // In real implementation, this would open a messaging interface
    toast.info(`Opening message interface for ${candidateEmail}`);
  };

  const handleScheduleInterview = (candidateId: number) => {
    // In real implementation, this would open interview scheduling
    toast.info("Opening interview scheduling interface");
  };

  const handleDownloadResume = (candidateId: number) => {
    // In real implementation, this would download the resume
    toast.info("Downloading resume...");
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
              <CardTitle>Candidate Applications</CardTitle>
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grouped">Grouped by Job</TabsTrigger>
                <TabsTrigger value="all">All Candidates</TabsTrigger>
              </TabsList>

              <TabsContent value="grouped" className="space-y-6 mt-6">
                {groupedCandidates.map((job) => (
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
                                        handleDownloadResume(candidate.id)
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
                                        handleScheduleInterview(candidate.id)
                                      }
                                    >
                                      <Calendar className="w-4 h-4 mr-2" />
                                      Schedule Interview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          candidate.id,
                                          "shortlisted"
                                        )
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Shortlist
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          candidate.id,
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
                                      handleStatusUpdate(
                                        candidate.id,
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
                                      handleStatusUpdate(
                                        candidate.id,
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
                ))}
              </TabsContent>

              <TabsContent value="all" className="space-y-4 mt-6">
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
                                  handleDownloadResume(candidate.id)
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
                                  handleScheduleInterview(candidate.id)
                                }
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(
                                    candidate.id,
                                    "shortlisted"
                                  )
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(candidate.id, "rejected")
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
                                handleStatusUpdate(candidate.id, "rejected")
                              }
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(candidate.id, "shortlisted")
                              }
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Shortlist
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
