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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

const JobPostings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const jobPostings = [
    {
      id: 1,
      title: "Mathematics Teacher - Secondary",
      department: "Mathematics Department",
      location: "Dubai, UAE",
      educationLevel: "Secondary (Grades 9-12)",
      subjects: ["Mathematics", "Statistics"],
      salaryRange: "$4,000 - $6,000",
      currency: "USD",
      status: "Active",
      applicants: 23,
      views: 156,
      postedDate: "March 15, 2024",
      expiryDate: "April 15, 2024",
      quickApply: true,
      visaSponsorship: true,
      benefits: ["Health Insurance", "Housing Allowance", "Annual Flight"],
      minExperience: 3,
      qualification: "Bachelor's Degree",
    },
    {
      id: 2,
      title: "English Language Teacher - Primary",
      department: "English Department",
      location: "Dubai, UAE",
      educationLevel: "Primary (Grades 1-6)",
      subjects: ["English Language", "Literature"],
      salaryRange: "$3,500 - $5,500",
      currency: "USD",
      status: "Active",
      applicants: 31,
      views: 204,
      postedDate: "March 10, 2024",
      expiryDate: "April 10, 2024",
      quickApply: true,
      visaSponsorship: true,
      benefits: ["Health Insurance", "Housing Allowance"],
      minExperience: 2,
      qualification: "Bachelor's Degree",
    },
    {
      id: 3,
      title: "Science Lab Coordinator",
      department: "Science Department",
      location: "Dubai, UAE",
      educationLevel: "Secondary (Grades 7-12)",
      subjects: ["Physics", "Chemistry", "Biology"],
      salaryRange: "$3,000 - $4,500",
      currency: "USD",
      status: "Draft",
      applicants: 0,
      views: 12,
      postedDate: "March 12, 2024",
      expiryDate: "April 20, 2024",
      quickApply: false,
      visaSponsorship: true,
      benefits: ["Health Insurance"],
      minExperience: 1,
      qualification: "Bachelor's Degree in Science",
    },
    {
      id: 4,
      title: "Art & Design Teacher",
      department: "Creative Arts",
      location: "Dubai, UAE",
      educationLevel: "Primary & Secondary",
      subjects: ["Visual Arts", "Design Technology"],
      salaryRange: "$3,200 - $4,800",
      currency: "USD",
      status: "Paused",
      applicants: 18,
      views: 98,
      postedDate: "March 8, 2024",
      expiryDate: "April 25, 2024",
      quickApply: true,
      visaSponsorship: false,
      benefits: ["Health Insurance", "Professional Development"],
      minExperience: 2,
      qualification: "Bachelor's in Art/Design",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-brand-accent-green text-white";
      case "Draft":
        return "bg-yellow-500 text-white";
      case "Paused":
        return "bg-brand-accent-orange text-white";
      case "Expired":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobPostings.length,
    active: jobPostings.filter((j) => j.status === "Active").length,
    draft: jobPostings.filter((j) => j.status === "Draft").length,
    totalApplicants: jobPostings.reduce((sum, job) => sum + job.applicants, 0),
  };

  return (
    <DashboardLayout
      role="school"
      userName="Dubai International School"
      userEmail="admin@isdubai.edu"
    >
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Users className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time postings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Eye className="h-4 w-4 text-brand-accent-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently accepting applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Jobs</CardTitle>
              <Edit className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting publication
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applicants
              </CardTitle>
              <Users className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplicants}</div>
              <p className="text-xs text-muted-foreground">Across all jobs</p>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-md transition-all"
                >
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-heading font-semibold text-xl">
                          {job.title}
                        </h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
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
                      <p className="text-muted-foreground">{job.department}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{job.educationLevel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {job.salaryRange} {job.currency}
                      </span>
                    </div>
                  </div>

                  {/* Subjects */}
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

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{job.applicants}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Applicants
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{job.views}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Views
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-xs">
                          {job.postedDate}
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
                          {job.expiryDate}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Expires
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
                      <span className="text-xs text-muted-foreground">
                        Min {job.minExperience} years experience
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Link to={`/dashboard/school/candidates?job=${job.id}`}>
                        <Button variant="default" size="sm">
                          View Candidates ({job.applicants})
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobPostings;
