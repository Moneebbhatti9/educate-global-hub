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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const jobs = [
    {
      id: 1,
      title: "Mathematics Teacher",
      school: "International School Dubai",
      location: "Dubai, UAE",
      type: "Full-time",
      status: "active",
      applicants: 23,
      views: 156,
      posted: "2024-03-10",
      expires: "2024-04-10",
      salary: "$3,500 - $4,500",
    },
    {
      id: 2,
      title: "English Language Teacher",
      school: "British School Singapore",
      location: "Singapore",
      type: "Part-time",
      status: "active",
      applicants: 31,
      views: 204,
      posted: "2024-03-08",
      expires: "2024-04-08",
      salary: "$2,800 - $3,200",
    },
    {
      id: 3,
      title: "Science Lab Coordinator",
      school: "American Academy Kuwait",
      location: "Kuwait City, Kuwait",
      type: "Contract",
      status: "pending",
      applicants: 12,
      views: 89,
      posted: "2024-03-12",
      expires: "2024-04-12",
      salary: "$4,000 - $5,000",
    },
    {
      id: 4,
      title: "Primary School Teacher",
      school: "International School Qatar",
      location: "Doha, Qatar",
      type: "Full-time",
      status: "suspended",
      applicants: 8,
      views: 45,
      posted: "2024-03-05",
      expires: "2024-04-05",
      salary: "$3,200 - $3,800",
    },
    {
      id: 5,
      title: "Art & Design Teacher",
      school: "Creative Learning Center",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      status: "expired",
      applicants: 19,
      views: 78,
      posted: "2024-02-15",
      expires: "2024-03-15",
      salary: "$3,000 - $3,500",
    },
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
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const jobStats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === "active").length,
    pending: jobs.filter(j => j.status === "pending").length,
    suspended: jobs.filter(j => j.status === "suspended").length,
    expired: jobs.filter(j => j.status === "expired").length,
  };

  return (
    <DashboardLayout
      role="admin"
      userName="Admin User"
      userEmail="admin@educatelink.com"
    >
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{jobStats.total}</p>
                </div>
                <Briefcase className="w-8 h-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-brand-accent-green">{jobStats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-brand-accent-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-brand-accent-orange">{jobStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-brand-accent-orange" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-red-500">{jobStats.suspended}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-gray-500">{jobStats.expired}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gray-500" />
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
                    placeholder="Search jobs by title, school, or location..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Job Postings ({filteredJobs.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
            <CardDescription>
              Review and manage all job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.school}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(job.type)}>
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1 w-fit`}>
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{job.applicants}</span>
                        <span className="text-muted-foreground">({job.views} views)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{job.salary}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {job.posted}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {job.expires}
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            View Applications
                          </DropdownMenuItem>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobManagement;