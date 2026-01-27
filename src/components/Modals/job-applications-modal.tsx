import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Globe,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Building,
  GraduationCap,
  DollarSign,
  Star,
  CheckCircle2,
  X,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useAdminJobApplications } from "@/hooks/useAdminJobs";
import type { Job } from "@/types/job";

interface JobApplication {
  _id: string;
  jobId: string;
  teacherId: string | null;
  coverLetter: string;
  expectedSalary: number;
  availableFrom: string;
  reasonForApplying: string;
  screeningAnswers: Record<string, string>;
  status: string;
  resumeUrl: string;
  documents: string[];
  isWithdrawn: boolean;
  createdAt: string;
  updatedAt: string;
  teacher: {
    fullName: string;
    email: string;
    location: {
      country: string;
      city: string;
      province: string;
      address: string;
      zipCode: string;
    };
    phoneNumber: string;
    qualification: string;
    subject: string;
    yearsOfTeachingExperience: number;
  };
}

interface JobApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobApplicationsModal = ({
  isOpen,
  onClose,
  job,
}: JobApplicationsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch applications
  const {
    data: applicationsData,
    isLoading,
    error,
  } = useAdminJobApplications(job?._id || "", {
    page: currentPage,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const applications = applicationsData?.data?.data || [];
  const pagination = applicationsData?.data?.pagination;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-brand-accent-orange text-white",
          icon: <Clock className="w-3 h-3" />,
          label: "Pending",
        };
      case "reviewed":
        return {
          color: "bg-blue-500 text-white",
          icon: <Eye className="w-3 h-3" />,
          label: "Reviewed",
        };
      case "shortlisted":
        return {
          color: "bg-brand-accent-green text-white",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Shortlisted",
        };
      case "rejected":
        return {
          color: "bg-red-500 text-white",
          icon: <XCircle className="w-3 h-3" />,
          label: "Rejected",
        };
      case "accepted":
        return {
          color: "bg-green-600 text-white",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Accepted",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: <Clock className="w-3 h-3" />,
          label: status,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysAgo = (dateString: string) => {
    const applied = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - applied.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedApplication(null);
  };

  if (!job) return null;

  // If showing details, render the detailed view
  if (showDetails && selectedApplication) {
    const teacher = selectedApplication.teacher;
    const statusInfo = getStatusInfo(selectedApplication.status);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Applications
                </Button>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Application Details
                </DialogTitle>
                <DialogDescription>
                  {teacher.fullName || "Anonymous"} - {job.title}
                </DialogDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={statusInfo.color}>
                  <span className="flex items-center space-x-1">
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </span>
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Teacher Profile Section */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-brand-primary" />
                <span>Teacher Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-lg">
                        {teacher.fullName
                          ? teacher.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "N/A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-semibold">
                        {teacher.fullName || "Anonymous"}
                      </h4>
                      <p className="text-muted-foreground">
                        {teacher.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{teacher.phoneNumber || "No phone number"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {teacher.location.city && teacher.location.country
                          ? `${teacher.location.city}, ${teacher.location.country}`
                          : "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {teacher.qualification || "Qualification not specified"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {teacher.yearsOfTeachingExperience || 0} years of
                        experience
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{teacher.subject || "Subject not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h5 className="font-medium mb-2">Application Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applied:</span>
                        <span>{formatDate(selectedApplication.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Expected Salary:
                        </span>
                        <span className="font-medium">
                          $
                          {selectedApplication.expectedSalary?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Available From:
                        </span>
                        <span>
                          {formatDate(selectedApplication.availableFrom)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={statusInfo.color} variant="secondary">
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedApplication.documents &&
                    selectedApplication.documents.length > 0 && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h5 className="font-medium mb-2">Documents</h5>
                        <div className="space-y-2">
                          {selectedApplication.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-brand-primary hover:underline"
                              >
                                Document {index + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Cover Letter Section */}
            {selectedApplication.coverLetter && (
              <>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-brand-primary" />
                    <span>Cover Letter</span>
                  </h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Reason for Applying Section */}
            {selectedApplication.reasonForApplying && (
              <>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span>Reason for Applying</span>
                  </h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {selectedApplication.reasonForApplying}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Screening Answers Section */}
            {Object.keys(selectedApplication.screeningAnswers).length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Screening Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedApplication.screeningAnswers).map(
                      ([question, answer]) => (
                        <div
                          key={question}
                          className="p-4 bg-muted/30 rounded-lg"
                        >
                          <p className="font-medium text-sm mb-2">{question}</p>
                          <p className="text-sm text-muted-foreground">
                            {String(answer)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Resume Section */}
            {selectedApplication.resumeUrl && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Resume</span>
                </h3>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline font-medium"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main applications list view
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Applications for {job.title}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>{job.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {job.city}, {job.country}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{applications.length} applications</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications by teacher name, email, or location..."
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
                <SelectItem value="accepted">Accepted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Error Loading Applications
              </h3>
              <p className="text-muted-foreground">
                Failed to load application data. Please try again later.
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Applications Found
              </h3>
              <p className="text-muted-foreground">
                No applications match your current filters.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Expected Salary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application: JobApplication) => {
                    const statusInfo = getStatusInfo(application.status);
                    const daysAgo = getDaysAgo(application.createdAt);
                    const teacher = application.teacher;

                    return (
                      <TableRow key={application._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-brand-primary/10 text-brand-primary">
                                {teacher.fullName
                                  ? teacher.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {teacher.fullName || "Anonymous"}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span>{teacher.email || "No email"}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span>
                              {teacher.location.city && teacher.location.country
                                ? `${teacher.location.city}, ${teacher.location.country}`
                                : "Location not specified"}
                            </span>
                          </div>
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
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {formatDate(application.createdAt)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {daysAgo}d ago
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {teacher.yearsOfTeachingExperience
                              ? `${teacher.yearsOfTeachingExperience} years`
                              : "Not specified"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            $
                            {application.expectedSalary?.toLocaleString() ||
                              "Not specified"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Full Details"
                              onClick={() => handleViewDetails(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
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
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationsModal;
