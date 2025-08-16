import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Building,
  Users,
  DollarSign,
  Calendar,
  GraduationCap,
  Award,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Bookmark,
} from "lucide-react";
import { useJob } from "@/hooks/useJobs";
import { useSaveJob, useRemoveSavedJob } from "@/hooks/useSavedJobs";
import { useAuth } from "@/contexts/AuthContext";
import { customToast } from "@/components/ui/sonner";
import type { Job } from "@/types/job";

// Interface for the job detail API response
interface JobDetailResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
    school: {
      name: string;
      country: string;
      city: string;
      description: string;
    };
    relatedJobs: Job[];
    isSaved: boolean;
    hasApplied: boolean;
    isAuthenticated: boolean;
  };
}

const JobDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  // Fetch job data using the useJob hook
  const {
    data: jobData,
    isLoading,
    error,
  } = useJob(id || "") as {
    data: JobDetailResponse | undefined;
    isLoading: boolean;
    error: unknown;
  };

  // Save job hooks
  const saveJobMutation = useSaveJob();
  const removeSavedJobMutation = useRemoveSavedJob();

  // Extract job from API response - the structure is data.job
  const job = jobData?.data?.job;
  const school = jobData?.data?.school;
  const isSaved = jobData?.data?.isSaved;
  const hasApplied = jobData?.data?.hasApplied;
  const isAuthenticatedFromAPI = jobData?.data?.isAuthenticated;

  // Handle save job functionality
  const handleSaveJob = async () => {
    if (!isAuthenticated || !user) {
      customToast.error("Please login first to save this job");
      return;
    }

    if (!job?._id) {
      customToast.error("Job information not available");
      return;
    }

    try {
      if (isSaved) {
        // Remove from saved jobs
        await removeSavedJobMutation.mutateAsync(job._id);
        customToast.success("Job removed from saved list");
      } else {
        // Save job
        await saveJobMutation.mutateAsync({
          jobId: job._id,
          data: {
            priority: "medium",
            notes: "",
          },
        });
        customToast.success("Job saved successfully!");
      }
    } catch (error) {
      customToast.error(
        isSaved ? "Failed to remove job from saved list" : "Failed to save job"
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">
              {error ? "Error loading job details" : "Job not found"}
            </p>
            <Button variant="outline" asChild>
              <Link to="/jobs">Back to Jobs</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper function to format job type display
  const formatJobType = (jobType: string) => {
    switch (jobType) {
      case "full_time":
        return "Full-time";
      case "part_time":
        return "Part-time";
      case "contract":
        return "Contract";
      case "substitute":
        return "Substitute";
      default:
        return jobType;
    }
  };

  // Helper function to format salary display
  const formatSalary = () => {
    if (job.salaryDisclose && job.salaryMin && job.salaryMax) {
      return `${
        job.currency
      } ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    return "Salary not disclosed";
  };

  // Helper function to format experience display
  const formatExperience = () => {
    if (job.minExperience) {
      return `${job.minExperience}+ years`;
    }
    return "Experience not specified";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days posted
  const getDaysPosted = () => {
    const postedDate = new Date(job.publishedAt || job.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/jobs" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <CardTitle className="font-heading text-2xl sm:text-3xl text-foreground">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {school?.name || job.positionCategory || "School"}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.city}, {job.country}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {formatJobType(job.jobType)}
                      </Badge>
                      <Badge variant="outline">
                        {job.educationLevel.replace("_", " ")}
                      </Badge>
                      {job.isUrgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                      {job.isFeatured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveJob}
                      disabled={
                        saveJobMutation.isPending ||
                        removeSavedJobMutation.isPending
                      }
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? "fill-current text-brand-primary" : ""
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-brand-accent-green" />
                    <div className="text-sm font-medium">Salary</div>
                    <div className="text-xs text-muted-foreground">
                      {formatSalary()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-brand-secondary" />
                    <div className="text-sm font-medium">Experience</div>
                    <div className="text-xs text-muted-foreground">
                      {formatExperience()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <GraduationCap className="w-6 h-6 mx-auto mb-2 text-brand-primary" />
                    <div className="text-sm font-medium">Qualification</div>
                    <div className="text-xs text-muted-foreground">
                      {job.qualification}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-brand-accent-orange" />
                    <div className="text-sm font-medium">Deadline</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(job.applicationDeadline)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  About This Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Subjects & Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.subjects && job.subjects.length > 0 ? (
                    job.subjects.map((subject, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm px-3 py-1"
                      >
                        {subject}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      General
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements && job.requirements.length > 0 ? (
                    job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-brand-accent-green mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">
                      No specific requirements listed
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Screening Questions */}
            {job.screeningQuestions && job.screeningQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    Screening Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.screeningQuestions.map((question, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-primary mr-3 mt-2.5 flex-shrink-0"></div>
                        <span className="text-muted-foreground">
                          {question}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Apply for this Position
                </CardTitle>
                <CardDescription>
                  Join our team and make a difference in students' lives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated ? (
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/login">Sign In to Apply</Link>
                  </Button>
                ) : hasApplied ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to={`/dashboard/teacher/job-application/${id}`}>
                      Apply Now
                    </Link>
                  </Button>
                )}
                <Button
                  variant="hero-outline"
                  size="lg"
                  className="w-full"
                  onClick={handleSaveJob}
                  disabled={
                    saveJobMutation.isPending ||
                    removeSavedJobMutation.isPending
                  }
                >
                  {saveJobMutation.isPending ||
                  removeSavedJobMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Bookmark
                      className={`w-4 h-4 mr-2 ${
                        isSaved ? "fill-current" : ""
                      }`}
                    />
                  )}
                  {isSaved ? "Saved" : "Save for Later"}
                </Button>
                <Separator />
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Posted {getDaysPosted()}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Apply by {formatDate(job.applicationDeadline)}
                  </div>
                  {job.quickApply && (
                    <div className="flex items-center text-brand-accent-green">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Quick Apply Available
                    </div>
                  )}
                  {!isAuthenticated && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Sign in to apply for this position
                    </div>
                  )}
                  {hasApplied && (
                    <div className="flex items-center text-brand-accent-green">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Applied
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.benefits && job.benefits.length > 0 ? (
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-brand-accent-green mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Benefits not specified
                  </p>
                )}
              </CardContent>
            </Card>

            {/* School Information */}
            {school && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    About the School
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {school.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <div className="font-medium">
                          {school.city}, {school.country}
                        </div>
                      </div>
                    </div>
                    {/* school Description */}
                    <div>
                      <h5 className="font-medium text-foreground mb-2">
                        Position Description
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {school?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Position Category:
                    </span>
                    <div className="font-medium">{job.positionCategory}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subcategory:</span>
                    <div className="font-medium">{job.positionSubcategory}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Education Level:
                    </span>
                    <div className="font-medium">
                      {job.educationLevel.replace("_", " ")}
                    </div>
                  </div>
                  {job.visaSponsorship && (
                    <div className="flex items-center text-brand-accent-green">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Visa Sponsorship Available
                    </div>
                  )}
                  {job.externalLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={job.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply on External Site
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
