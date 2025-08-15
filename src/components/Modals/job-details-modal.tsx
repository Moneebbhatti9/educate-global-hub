import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Clock,
  School,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Share2,
  Download,
  Briefcase,
  GraduationCap,
  Globe,
  Heart,
} from "lucide-react";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    school: string;
    location: string;
    country: string;
    city: string;
    type: string;
    status: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    salaryMin: number;
    salaryMax: number;
    currency: string;
    salaryDisclosed: boolean;
    visaSponsorship: boolean;
    quickApply: boolean;
    externalUrl?: string;
    applicationDeadline: string;
    postedDate: string;
    educationLevel: string;
    subjects: string[];
    minExperience: number;
    qualification: string;
    applicantEmail: string;
    screeningQuestions: string[];
    views: number;
    applicants: number;
    isUrgent?: boolean;
    isFeatured?: boolean;
  };
  userRole?: "admin" | "school" | "teacher";
  onEdit?: () => void;
  onDelete?: () => void;
  onViewCandidates?: () => void;
}

export const JobDetailsModal = ({ 
  isOpen, 
  onClose, 
  job, 
  userRole = "admin",
  onEdit,
  onDelete,
  onViewCandidates
}: JobDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "suspended":
        return <XCircle className="w-3 h-3" />;
      case "expired":
        return <AlertTriangle className="w-3 h-3" />;
      case "draft":
        return <Edit className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "bg-brand-primary text-white";
      case "part-time":
        return "bg-brand-secondary text-white";
      case "contract":
        return "bg-brand-accent-orange text-white";
      case "temporary":
        return "bg-purple-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isExpired = new Date(job.applicationDeadline) < new Date();
  const daysUntilDeadline = Math.ceil(
    (new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl pr-8">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center space-x-2">
            <School className="w-4 h-4" />
            <span>{job.school}</span>
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{job.city}, {job.country}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with badges and stats */}
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1`}>
                {getStatusIcon(job.status)}
                <span className="capitalize">{job.status}</span>
              </Badge>
              <Badge className={getTypeColor(job.type)}>
                {job.type}
              </Badge>
              <Badge variant="outline">
                <GraduationCap className="w-3 h-3 mr-1" />
                {job.educationLevel}
              </Badge>
              {job.isUrgent && (
                <Badge className="bg-red-600 text-white">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              {job.isFeatured && (
                <Badge className="bg-yellow-600 text-white">
                  <Heart className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {job.visaSponsorship && (
                <Badge variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  Visa Sponsored
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {job.views} views
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {job.applicants} applicants
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-brand-primary" />
                  <div>
                    <div className="font-medium">
                      {job.salaryDisclosed 
                        ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                        : "Salary not disclosed"
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.salaryDisclosed ? "per month" : "Contact for details"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-brand-primary" />
                  <div>
                    <div className="font-medium">
                      {isExpired ? "Expired" : `${daysUntilDeadline} days left`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-brand-primary" />
                  <div>
                    <div className="font-medium">{job.minExperience}+ years</div>
                    <div className="text-sm text-muted-foreground">Experience required</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {job.responsibilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-brand-accent-green mt-0.5 mr-2 flex-shrink-0" />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-brand-accent-green mr-2" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Minimum Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-brand-primary mr-2" />
                      <span><strong>Education:</strong> {job.qualification}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-brand-primary mr-2" />
                      <span><strong>Experience:</strong> Minimum {job.minExperience} years</span>
                    </div>
                    <div className="flex items-center">
                      <School className="w-4 h-4 text-brand-primary mr-2" />
                      <span><strong>Level:</strong> {job.educationLevel}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-brand-primary mt-0.5 mr-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="application" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Application Method</label>
                      <div className="mt-1">
                        {job.quickApply ? (
                          <Badge className="bg-brand-accent-green text-white">Quick Apply Enabled</Badge>
                        ) : (
                          <Badge variant="outline">External Application</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                      <div className="mt-1 font-mono text-sm">{job.applicantEmail}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Application Deadline</label>
                      <div className="mt-1">
                        <span className={isExpired ? "text-red-600 font-medium" : ""}>
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Posted Date</label>
                      <div className="mt-1">{new Date(job.postedDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {!job.quickApply && job.externalUrl && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">External Application URL</label>
                      <div className="mt-1">
                        <a 
                          href={job.externalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-primary hover:underline"
                        >
                          {job.externalUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {job.screeningQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Questions</CardTitle>
                    <CardDescription>
                      Applicants will be asked to answer these questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {job.screeningQuestions.map((question, index) => (
                        <li key={index} className="flex">
                          <span className="font-medium text-brand-primary mr-2">{index + 1}.</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                        <p className="text-2xl font-bold text-brand-primary">{job.views}</p>
                      </div>
                      <Eye className="w-8 h-8 text-brand-primary opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-2xl font-bold text-brand-accent-green">{job.applicants}</p>
                      </div>
                      <Users className="w-8 h-8 text-brand-accent-green opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold text-brand-accent-orange">
                          {job.views > 0 ? ((job.applicants / job.views) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-brand-accent-orange opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Days Active</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {Math.ceil((new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-600 opacity-60" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Job
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
              {onViewCandidates && (
                <Button variant="outline" size="sm" onClick={onViewCandidates}>
                  <Users className="w-4 h-4 mr-2" />
                  View Candidates ({job.applicants})
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {userRole !== "teacher" && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
              )}
              
              {userRole === "admin" && onDelete && (
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};