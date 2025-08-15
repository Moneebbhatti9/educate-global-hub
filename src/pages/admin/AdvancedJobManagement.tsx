import { useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { JobDetailsModal } from "@/components/Modals/job-details-modal";
import { CandidatesModal } from "@/components/Modals/candidates-modal";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
  TrendingUp,
  BarChart3,
  FileText,
  Star,
  Globe,
  Building2,
} from "lucide-react";

const AdvancedJobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidatesJobTitle, setCandidatesJobTitle] = useState("");
  const [candidatesJobId, setCandidatesJobId] = useState("");

  // Extended mock jobs data
  const jobs = [
    {
      id: "1",
      title: "Mathematics Teacher",
      school: "International School Dubai",
      location: "Dubai, UAE",
      country: "UAE",
      city: "Dubai",
      type: "Full-time",
      status: "active",
      description: "We are seeking an experienced Mathematics Teacher...",
      requirements: ["Bachelor's degree in Mathematics", "3+ years teaching experience"],
      responsibilities: ["Plan and deliver mathematics lessons", "Assess student progress"],
      benefits: ["Health insurance", "Housing allowance", "Annual flights"],
      salaryMin: 3500,
      salaryMax: 4500,
      currency: "USD",
      salaryDisclosed: true,
      visaSponsorship: true,
      quickApply: true,
      applicationDeadline: "2024-04-15",
      postedDate: "2024-03-10",
      educationLevel: "Secondary",
      subjects: ["Mathematics", "Statistics"],
      minExperience: 3,
      qualification: "Bachelor's in Mathematics",
      applicantEmail: "hr@isdubai.com",
      screeningQuestions: ["What is your experience with IB curriculum?"],
      applicants: 23,
      views: 156,
      isUrgent: false,
      isFeatured: true,
      schoolId: "school1",
      rating: 4.5,
      lastUpdated: "2024-03-15"
    },
    {
      id: "2",
      title: "Science Lab Coordinator",
      school: "British School Singapore",
      location: "Singapore",
      country: "Singapore",
      city: "Singapore",
      type: "Full-time",
      status: "pending",
      description: "Join our science department as a Lab Coordinator...",
      requirements: ["Science degree", "Lab management experience"],
      responsibilities: ["Manage science laboratories", "Support science teachers"],
      benefits: ["Medical coverage", "Professional development"],
      salaryMin: 4000,
      salaryMax: 5000,
      currency: "SGD",
      salaryDisclosed: true,
      visaSponsorship: true,
      quickApply: true,
      applicationDeadline: "2024-04-20",
      postedDate: "2024-03-08",
      educationLevel: "Secondary",
      subjects: ["Biology", "Chemistry", "Physics"],
      minExperience: 2,
      qualification: "Bachelor's in Science",
      applicantEmail: "careers@britishschool.sg",
      screeningQuestions: ["Experience with lab equipment?", "Safety protocols knowledge?"],
      applicants: 31,
      views: 204,
      isUrgent: true,
      isFeatured: false,
      schoolId: "school2",
      rating: 4.2,
      lastUpdated: "2024-03-18"
    },
    {
      id: "3",
      title: "Primary School Teacher",
      school: "American Academy Kuwait",
      location: "Kuwait City, Kuwait",
      country: "Kuwait",
      city: "Kuwait City",
      type: "Contract",
      status: "suspended",
      description: "Seeking a dedicated Primary School Teacher...",
      requirements: ["Education degree", "Primary teaching experience"],
      responsibilities: ["Teach primary curriculum", "Classroom management"],
      benefits: ["Accommodation", "Transportation", "Medical"],
      salaryMin: 3200,
      salaryMax: 3800,
      currency: "USD",
      salaryDisclosed: false,
      visaSponsorship: true,
      quickApply: false,
      externalUrl: "https://americanacademy.edu.kw/careers",
      applicationDeadline: "2024-04-25",
      postedDate: "2024-03-05",
      educationLevel: "Primary",
      subjects: ["General Primary"],
      minExperience: 2,
      qualification: "Bachelor's in Education",
      applicantEmail: "hr@aakuwait.edu.kw",
      screeningQuestions: ["Experience with American curriculum?"],
      applicants: 12,
      views: 89,
      isUrgent: false,
      isFeatured: false,
      schoolId: "school3",
      rating: 3.8,
      lastUpdated: "2024-03-12"
    },
    // Add more jobs for demonstration
    {
      id: "4",
      title: "Art & Design Teacher",
      school: "Creative Learning Center",
      location: "Abu Dhabi, UAE",
      country: "UAE",
      city: "Abu Dhabi",
      type: "Part-time",
      status: "expired",
      description: "We need a creative Art & Design Teacher...",
      requirements: ["Art degree", "Portfolio of work"],
      responsibilities: ["Teach art classes", "Organize exhibitions"],
      benefits: ["Flexible hours", "Art supplies provided"],
      salaryMin: 3000,
      salaryMax: 3500,
      currency: "USD",
      salaryDisclosed: true,
      visaSponsorship: false,
      quickApply: true,
      applicationDeadline: "2024-03-20",
      postedDate: "2024-02-15",
      educationLevel: "Secondary",
      subjects: ["Art", "Design"],
      minExperience: 1,
      qualification: "Bachelor's in Fine Arts",
      applicantEmail: "admin@creativecenter.ae",
      screeningQuestions: ["Can you provide a portfolio?"],
      applicants: 19,
      views: 78,
      isUrgent: false,
      isFeatured: false,
      schoolId: "school4",
      rating: 4.1,
      lastUpdated: "2024-03-20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-accent-green text-white";
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "suspended":
        return "bg-red-500 text-white";
      case "expired":
        return "bg-gray-500 text-white";
      case "draft":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "suspended":
        return <AlertTriangle className="w-3 h-3" />;
      case "expired":
        return <AlertTriangle className="w-3 h-3" />;
      case "draft":
        return <Edit className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-brand-primary text-white";
      case "Part-time":
        return "bg-brand-secondary text-white";
      case "Contract":
        return "bg-brand-accent-orange text-white";
      case "Temporary":
        return "bg-purple-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesLocation = locationFilter === "all" || job.country === locationFilter;
    const matchesSchool = schoolFilter === "all" || job.schoolId === schoolFilter;
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "recent" && new Date(job.postedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === "week" && new Date(job.postedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === "month" && new Date(job.postedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesSchool && matchesDate;
  });

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleViewCandidates = (job: any) => {
    setCandidatesJobTitle(job.title);
    setCandidatesJobId(job.id);
    setShowCandidates(true);
  };

  const jobStats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === "active").length,
    pending: jobs.filter(j => j.status === "pending").length,
    suspended: jobs.filter(j => j.status === "suspended").length,
    expired: jobs.filter(j => j.status === "expired").length,
    totalApplications: jobs.reduce((sum, job) => sum + job.applicants, 0),
    totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
    featured: jobs.filter(j => j.isFeatured).length,
    urgent: jobs.filter(j => j.isUrgent).length
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Advanced Job Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive job management with advanced filtering, analytics, and bulk operations.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-primary">{jobStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-accent-green">{jobStats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-accent-orange">{jobStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{jobStats.suspended}</p>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-500">{jobStats.expired}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{jobStats.totalApplications}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{jobStats.totalViews}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{jobStats.featured}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list">Job List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Advanced Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Search & Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs, schools, locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Schools" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Schools</SelectItem>
                      <SelectItem value="school1">International School Dubai</SelectItem>
                      <SelectItem value="school2">British School Singapore</SelectItem>
                      <SelectItem value="school3">American Academy Kuwait</SelectItem>
                      <SelectItem value="school4">Creative Learning Center</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="recent">Last 24 hours</SelectItem>
                      <SelectItem value="week">Last week</SelectItem>
                      <SelectItem value="month">Last month</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Jobs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export ({filteredJobs.length})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Jobs Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Jobs ({filteredJobs.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">Select All</span>
                    {selectedJobs.size > 0 && (
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          Bulk Edit ({selectedJobs.size})
                        </Button>
                        <Button variant="destructive" size="sm">
                          Bulk Delete ({selectedJobs.size})
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Job Details</TableHead>
                        <TableHead>School & Location</TableHead>
                        <TableHead>Type & Status</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Special</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow 
                          key={job.id} 
                          className={selectedJobs.has(job.id) ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedJobs.has(job.id)}
                              onCheckedChange={() => handleSelectJob(job.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium cursor-pointer hover:text-brand-primary" 
                                   onClick={() => handleViewJob(job)}>
                                {job.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {job.subjects.join(", ")}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {job.id} • Rating: {job.rating}/5
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Building2 className="w-3 h-3 mr-1" />
                                {job.school}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge className={getTypeColor(job.type)}>
                                {job.type}
                              </Badge>
                              <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1 w-fit`}>
                                {getStatusIcon(job.status)}
                                <span className="capitalize">{job.status}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                <span className="font-medium">{job.applicants}</span>
                                <span className="text-muted-foreground ml-1">apps</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                <span className="font-medium">{job.views}</span>
                                <span className="text-muted-foreground ml-1">views</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {job.views > 0 ? ((job.applicants / job.views) * 100).toFixed(1) : 0}% conversion
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Posted: {new Date(job.postedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Updated: {new Date(job.lastUpdated).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {job.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  <Star className="w-2 h-2 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {job.isUrgent && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <AlertTriangle className="w-2 h-2 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                              {job.visaSponsorship && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="w-2 h-2 mr-1" />
                                  Visa
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewJob(job)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewCandidates(job)}>
                                  <Users className="w-4 h-4 mr-2" />
                                  View Candidates ({job.applicants})
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Job
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Duplicate Job
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Data
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {job.status === "active" && (
                                  <DropdownMenuItem className="text-orange-600">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Suspend Job
                                  </DropdownMenuItem>
                                )}
                                {job.status === "suspended" && (
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activate Job
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    Analytics charts would be implemented here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Performing Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job, index) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">{job.school}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{job.applicants} apps</div>
                          <div className="text-xs text-muted-foreground">{job.views} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">UAE</span>
                      <span className="text-sm font-medium">2 jobs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Singapore</span>
                      <span className="text-sm font-medium">1 job</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Kuwait</span>
                      <span className="text-sm font-medium">1 job</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bulk Operations</CardTitle>
                <CardDescription>
                  Perform actions on multiple jobs at once. Select jobs from the list tab first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" disabled={selectedJobs.size === 0}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate Selected ({selectedJobs.size})
                  </Button>
                  <Button variant="outline" disabled={selectedJobs.size === 0}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Suspend Selected ({selectedJobs.size})
                  </Button>
                  <Button variant="outline" disabled={selectedJobs.size === 0}>
                    <Star className="w-4 h-4 mr-2" />
                    Feature Selected ({selectedJobs.size})
                  </Button>
                  <Button variant="outline" disabled={selectedJobs.size === 0}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected ({selectedJobs.size})
                  </Button>
                  <Button variant="outline" disabled={selectedJobs.size === 0}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report ({selectedJobs.size})
                  </Button>
                  <Button variant="destructive" disabled={selectedJobs.size === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedJobs.size})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reports & Analytics</CardTitle>
                <CardDescription>
                  Generate detailed reports for job management insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Job Performance Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Application Analytics
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    School Activity Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Monthly Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {selectedJob && (
          <JobDetailsModal
            isOpen={showJobDetails}
            onClose={() => {
              setShowJobDetails(false);
              setSelectedJob(null);
            }}
            job={selectedJob}
            userRole="admin"
            onViewCandidates={() => {
              setShowJobDetails(false);
              handleViewCandidates(selectedJob);
            }}
          />
        )}

        <CandidatesModal
          isOpen={showCandidates}
          onClose={() => setShowCandidates(false)}
          jobTitle={candidatesJobTitle}
          jobId={candidatesJobId}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdvancedJobManagement;