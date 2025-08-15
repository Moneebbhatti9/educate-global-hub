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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Building2,
  MessageSquare,
  Download,
  RefreshCw,
} from "lucide-react";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock applications data
  const applications = [
    {
      id: "1",
      job: {
        _id: "job1",
        title: "Mathematics Teacher",
        school: "International School Dubai",
        location: "Dubai, UAE",
        salaryMin: 3500,
        salaryMax: 4500,
        currency: "USD",
        jobType: "Full-time",
        applicationDeadline: "2024-04-15"
      },
      applicationDate: "2024-03-12",
      status: "pending",
      applicationMethod: "quick_apply",
      resume: "john_doe_resume.pdf",
      coverLetter: "Dear Hiring Manager, I am excited to apply...",
      screeningAnswers: [
        "I have 5 years of experience teaching mathematics at the secondary level.",
        "I am available to start in August 2024.",
        "My teaching philosophy focuses on making mathematics accessible to all students."
      ],
      lastUpdated: "2024-03-12",
      feedback: null,
      interviewScheduled: null,
      applicationId: "APP-2024-001"
    },
    {
      id: "2",
      job: {
        _id: "job2",
        title: "Science Lab Coordinator",
        school: "British School Singapore",
        location: "Singapore",
        salaryMin: 4000,
        salaryMax: 5000,
        currency: "SGD",
        jobType: "Full-time",
        applicationDeadline: "2024-03-20"
      },
      applicationDate: "2024-03-10",
      status: "reviewed",
      applicationMethod: "quick_apply",
      resume: "john_doe_resume.pdf",
      coverLetter: "I am writing to express my interest...",
      screeningAnswers: [
        "I have experience managing science laboratories and equipment.",
        "I can relocate to Singapore within 2 months.",
        "I believe in hands-on learning and student safety in lab environments."
      ],
      lastUpdated: "2024-03-18",
      feedback: "Your application is currently under review by our hiring team.",
      interviewScheduled: null,
      applicationId: "APP-2024-002"
    },
    {
      id: "3",
      job: {
        _id: "job3",
        title: "Primary School Teacher",
        school: "American Academy Kuwait",
        location: "Kuwait City, Kuwait",
        salaryMin: 3200,
        salaryMax: 3800,
        currency: "USD",
        jobType: "Full-time",
        applicationDeadline: "2024-04-25"
      },
      applicationDate: "2024-03-08",
      status: "shortlisted",
      applicationMethod: "external",
      externalUrl: "https://americanacademy.edu.kw/careers",
      resume: "john_doe_resume.pdf",
      coverLetter: "I am pleased to submit my application...",
      screeningAnswers: [
        "I have 3 years of experience in primary education.",
        "I am excited about the opportunity to work in Kuwait.",
        "I use differentiated instruction to meet diverse learning needs."
      ],
      lastUpdated: "2024-03-20",
      feedback: "Congratulations! You have been shortlisted for the next round.",
      interviewScheduled: {
        date: "2024-03-25",
        time: "14:00",
        type: "video",
        link: "https://zoom.us/j/123456789"
      },
      applicationId: "APP-2024-003"
    },
    {
      id: "4",
      job: {
        _id: "job4",
        title: "English Language Teacher",
        school: "International School Qatar",
        location: "Doha, Qatar",
        salaryMin: 3800,
        salaryMax: 4200,
        currency: "QAR",
        jobType: "Part-time",
        applicationDeadline: "2024-03-15"
      },
      applicationDate: "2024-02-28",
      status: "rejected",
      applicationMethod: "quick_apply",
      resume: "john_doe_resume.pdf",
      coverLetter: "I would like to apply for the English teacher position...",
      screeningAnswers: [
        "I have experience teaching English as a second language.",
        "I am available for part-time positions.",
        "I use communicative approaches to language teaching."
      ],
      lastUpdated: "2024-03-10",
      feedback: "Thank you for your interest. We have decided to move forward with other candidates whose experience more closely matches our requirements.",
      interviewScheduled: null,
      applicationId: "APP-2024-004"
    },
    {
      id: "5",
      job: {
        _id: "job5",
        title: "Art & Design Teacher",
        school: "Creative Learning Center",
        location: "Abu Dhabi, UAE",
        salaryMin: 3000,
        salaryMax: 3500,
        currency: "USD",
        jobType: "Full-time",
        applicationDeadline: "2024-04-30"
      },
      applicationDate: "2024-03-15",
      status: "hired",
      applicationMethod: "quick_apply",
      resume: "john_doe_resume.pdf",
      coverLetter: "I am thrilled to apply for the Art teacher position...",
      screeningAnswers: [
        "I have a strong background in visual arts and design.",
        "I am excited to join your creative team.",
        "I believe art education develops critical thinking and creativity."
      ],
      lastUpdated: "2024-03-22",
      feedback: "Congratulations! We are pleased to offer you the position. HR will contact you with next steps.",
      interviewScheduled: null,
      applicationId: "APP-2024-005",
      offerDetails: {
        salary: 3200,
        startDate: "2024-08-01",
        contractLength: "2 years"
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "reviewed":
        return "bg-blue-500 text-white";
      case "shortlisted":
        return "bg-brand-accent-green text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "hired":
        return "bg-purple-600 text-white";
      case "withdrawn":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "reviewed":
        return <Eye className="w-3 h-3" />;
      case "shortlisted":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      case "hired":
        return <CheckCircle className="w-3 h-3" />;
      case "withdrawn":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = application.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "recent" && new Date(application.applicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === "older" && new Date(application.applicationDate) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    reviewed: applications.filter(app => app.status === "reviewed").length,
    shortlisted: applications.filter(app => app.status === "shortlisted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
    hired: applications.filter(app => app.status === "hired").length,
    interviews: applications.filter(app => app.interviewScheduled).length
  };

  const upcomingInterviews = applications.filter(app => app.interviewScheduled && new Date(app.interviewScheduled.date) > new Date());

  const ApplicationCard = ({ application }: { application: any }) => {
    const daysSinceApplication = Math.floor((new Date().getTime() - new Date(application.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <Card className="hover:shadow-card-hover transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </Badge>
                <Badge variant="outline">
                  {application.applicationMethod === "quick_apply" ? "Quick Apply" : "External"}
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                {application.job.title}
              </h3>
              <div className="flex items-center text-muted-foreground mb-2">
                <Building2 className="w-4 h-4 mr-1" />
                <span className="mr-4">{application.job.school}</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{application.job.location}</span>
              </div>
            </div>
            
            <div className="text-right text-sm text-muted-foreground">
              <div>Applied {daysSinceApplication} days ago</div>
              <div className="text-xs">ID: {application.applicationId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>
                {application.job.currency} {application.job.salaryMin.toLocaleString()} - {application.job.salaryMax.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Applied: {new Date(application.applicationDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Feedback */}
          {application.feedback && (
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <div className="text-sm">
                <strong>Feedback:</strong> {application.feedback}
              </div>
            </div>
          )}

          {/* Interview Info */}
          {application.interviewScheduled && (
            <div className="bg-brand-accent-green/10 border border-brand-accent-green/20 rounded-lg p-3 mb-4">
              <div className="text-sm text-brand-accent-green">
                <strong>Interview Scheduled:</strong>
                <div className="mt-1">
                  <div>Date: {new Date(application.interviewScheduled.date).toLocaleDateString()}</div>
                  <div>Time: {application.interviewScheduled.time}</div>
                  <div>Type: {application.interviewScheduled.type}</div>
                  {application.interviewScheduled.link && (
                    <div>
                      <a 
                        href={application.interviewScheduled.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        Join Interview
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Offer Details */}
          {application.status === "hired" && application.offerDetails && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-purple-800">
                <strong>Job Offer:</strong>
                <div className="mt-1">
                  <div>Salary: {application.job.currency} {application.offerDetails.salary.toLocaleString()}</div>
                  <div>Start Date: {new Date(application.offerDetails.startDate).toLocaleDateString()}</div>
                  <div>Contract: {application.offerDetails.contractLength}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message School
              </Button>
              {application.applicationMethod === "external" && application.externalUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={application.externalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View External
                  </a>
                </Button>
              )}
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Track the status of your job applications and manage your career progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-accent-orange">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{stats.reviewed}</p>
                <p className="text-sm text-muted-foreground">Reviewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-accent-green">{stats.shortlisted}</p>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.hired}</p>
                <p className="text-sm text-muted-foreground">Hired</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-secondary">{stats.interviews}</p>
                <p className="text-sm text-muted-foreground">Interviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
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
                        placeholder="Search by job title, school, or location..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="recent">Last 30 days</SelectItem>
                      <SelectItem value="older">Older than 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}

              {filteredApplications.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      No applications found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                        ? "Try adjusting your search criteria or filters."
                        : "You haven't submitted any job applications yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {applications.filter(app => !["rejected", "hired", "withdrawn"].includes(app.status)).map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                <CardDescription>
                  Your scheduled interviews and next steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      No upcoming interviews
                    </h3>
                    <p className="text-muted-foreground">
                      Your scheduled interviews will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Applications;