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
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Archive,
  Building,
  GraduationCap,
  Globe,
  FileText,
  Star,
  Eye,
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobDetailsModal = ({ isOpen, onClose, job }: JobDetailsModalProps) => {
  if (!job) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "published":
        return {
          color: "bg-brand-accent-green text-white",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Active",
        };
      case "draft":
        return {
          color: "bg-brand-accent-orange text-white",
          icon: <Clock className="w-4 h-4" />,
          label: "Draft",
        };
      case "closed":
        return {
          color: "bg-gray-500 text-white",
          icon: <Archive className="w-4 h-4" />,
          label: "Closed",
        };
      case "expired":
        return {
          color: "bg-red-500 text-white",
          icon: <AlertTriangle className="w-4 h-4" />,
          label: "Expired",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: <Clock className="w-4 h-4" />,
          label: status,
        };
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusInfo = getStatusInfo(job.status);
  const typeInfo = getTypeInfo(job.jobType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {job.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.organization}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={statusInfo.color}>
                <span className="flex items-center space-x-1">
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </span>
              </Badge>
              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-5 h-5 text-brand-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {job.city}, {job.country}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{formatSalaryRange(job)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Education Level</p>
                <p className="font-medium capitalize">
                  {job.educationLevel.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{formatDate(job.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Application Deadline
                </p>
                <p className="font-medium">
                  {formatDate(job.applicationDeadline)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Applications & Views
                </p>
                <p className="font-medium">
                  {job.applicantsCount || 0} • {job.viewsCount || 0}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              <span>Job Description</span>
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Requirements</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span>Benefits</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg"
                    >
                      <Star className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Subjects */}
          {job.subjects && job.subjects.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Subjects</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Position Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium capitalize">
                    {job.positionCategory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subcategory:</span>
                  <span className="font-medium capitalize">
                    {job.positionSubcategory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Experience Required:
                  </span>
                  <span className="font-medium">
                    {job.minExperience || 0} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qualification:</span>
                  <span className="font-medium">{job.qualification}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Additional Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Visa Sponsorship:
                  </span>
                  <span className="font-medium">
                    {job.visaSponsorship ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quick Apply:</span>
                  <span className="font-medium">
                    {job.quickApply ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Urgent Position:
                  </span>
                  <span className="font-medium">
                    {job.isUrgent ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Featured Job:</span>
                  <span className="font-medium">
                    {job.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Application Email
                </p>
                <p className="font-medium">{job.applicantEmail}</p>
              </div>
              {job.externalLink && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    External Link
                  </p>
                  <a
                    href={job.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-primary hover:underline"
                  >
                    View External Application
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Screening Questions */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Screening Questions</h3>
                <div className="space-y-2">
                  {job.screeningQuestions.map((question, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium">
                        {index + 1}. {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
