import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CurrencySelect } from "@/components/ui/currency-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  ArrowLeft,
  Upload,
  Send,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Star,
  FileText,
  User,
  Phone,
  Mail,
  Globe,
  X,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { jobApplicationFormSchema } from "@/helpers/validation";
import { Country } from "@/components/ui/country-dropdown";
import { useJob } from "@/hooks/useJobs";
import { useSubmitApplication } from "@/hooks/useApplications";
import { customToast } from "@/components/ui/sonner";
import type { Job } from "@/types/job";

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch job data
  const {
    data: jobData,
    isLoading: jobLoading,
    error: jobError,
  } = useJob(jobId || "");
  const job = (jobData?.data as any)?.job;

  // Submit application mutation
  const submitApplicationMutation = useSubmitApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getFieldError,
    isFieldInvalid,
    reset,
  } = useFormValidation({
    schema: jobApplicationFormSchema,
    mode: "onTouched",
    defaultValues: {
      coverLetter: "",
      expectedSalary: "",
      availableFrom: undefined,
      reasonForApplying: "",
      additionalComments: "",
      agreeToTerms: false,
      screeningAnswers: {},
    },
  });

  const formData = watch();
  const [screeningAnswers, setScreeningAnswers] = useState<
    Record<string, string>
  >({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    resume: File | null;
    documents: File[];
  }>({
    resume: null,
    documents: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when job data is loaded
  useEffect(() => {
    if (job) {
      // Initialize screening answers if job has screening questions
      if (job.screeningQuestions && job.screeningQuestions.length > 0) {
        const initialAnswers: Record<string, string> = {};
        job.screeningQuestions.forEach((question) => {
          initialAnswers[question] = "";
        });
        setScreeningAnswers(initialAnswers);
        setValue("screeningAnswers", initialAnswers);
      }
    }
  }, [job, setValue]);

  // Focus on first error when form validation fails
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        // Focus on first field with error
        if (isFieldInvalid("coverLetter")) {
          document.getElementById("coverLetter")?.focus();
        } else if (isFieldInvalid("availableFrom")) {
          document.getElementById("availableFrom")?.focus();
        } else if (isFieldInvalid("reasonForApplying")) {
          document.getElementById("reasonForApplying")?.focus();
        } else if (isFieldInvalid("agreeToTerms")) {
          document.getElementById("agreeToTerms")?.focus();
        }
      }, 100);
    }
  }, [errors]);

  // Handle file upload for resume
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        customToast.error("Resume file size must be less than 5MB");
        return;
      }
      if (
        !file.type.includes("pdf") &&
        !file.type.includes("doc") &&
        !file.type.includes("docx")
      ) {
        customToast.error("Please upload a PDF, DOC, or DOCX file");
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, resume: file }));
    }
  };

  // Handle file upload for additional documents
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        customToast.error(
          `${file.name} is too large. File size must be less than 5MB`
        );
        return false;
      }
      if (
        !file.type.includes("pdf") &&
        !file.type.includes("doc") &&
        !file.type.includes("docx")
      ) {
        customToast.error(
          `${file.name} is not a valid file type. Please upload PDF, DOC, or DOCX files`
        );
        return false;
      }
      return true;
    });

    if (uploadedFiles.documents.length + validFiles.length > 5) {
      customToast.error("You can upload a maximum of 5 additional documents");
      return;
    }

    setUploadedFiles((prev) => ({
      ...prev,
      documents: [...prev.documents, ...validFiles],
    }));
  };

  // Remove document
  const removeDocument = (index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Remove resume
  const removeResume = () => {
    setUploadedFiles((prev) => ({ ...prev, resume: null }));
  };

  // Handle screening answer
  const handleScreeningAnswer = (question: string, answer: string) => {
    const newAnswers = {
      ...screeningAnswers,
      [question]: answer,
    };
    setScreeningAnswers(newAnswers);
    setValue("screeningAnswers", newAnswers);
  };

  // Validate screening questions
  const validateScreeningQuestions = () => {
    if (!job?.screeningQuestions || job.screeningQuestions.length === 0) {
      return true;
    }

    const unansweredQuestions = job.screeningQuestions.filter(
      (question) =>
        !screeningAnswers[question] || screeningAnswers[question].trim() === ""
    );

    if (unansweredQuestions.length > 0) {
      customToast.error(
        `Please answer all screening questions: ${unansweredQuestions.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  };

  // Handle form submission
  const onSubmit = async (data: {
    coverLetter: string;
    expectedSalary?: string;
    availableFrom: Date;
    reasonForApplying: string;
    additionalComments?: string;
    agreeToTerms: boolean;
    screeningAnswers?: Record<string, string>;
  }) => {
    if (!job || !jobId) {
      customToast.error("Job information not available");
      return;
    }

    // Validate screening questions
    if (!validateScreeningQuestions()) {
      return;
    }

    // Validate file uploads
    if (!uploadedFiles.resume) {
      customToast.error("Please upload your CV/Resume");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement file upload to cloud storage (AWS S3, etc.)
      // For now, we'll simulate the upload and use placeholder URLs
      const resumeUrl = "https://example.com/resume.pdf"; // This would be the actual uploaded file URL
      const documentUrls = uploadedFiles.documents.map(
        () => "https://example.com/document.pdf"
      ); // These would be actual uploaded file URLs

      const applicationData = {
        coverLetter: data.coverLetter,
        expectedSalary: data.expectedSalary
          ? parseFloat(data.expectedSalary)
          : undefined,
        availableFrom: data.availableFrom.toISOString(),
        reasonForApplying: data.reasonForApplying,
        additionalComments: data.additionalComments || "",
        screeningAnswers: screeningAnswers,
        resumeUrl,
        documents: documentUrls,
      };

      await submitApplicationMutation.mutateAsync({
        jobId,
        data: applicationData,
      });

      customToast.success("Application submitted successfully!");
      navigate("/dashboard/teacher/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
      customToast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (jobLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (jobError || !job) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Job</h2>
            <p className="text-muted-foreground mb-4">
              {jobError ? "Failed to load job details" : "Job not found"}
            </p>
            <Button onClick={() => navigate("/dashboard/teacher/jobs")}>
              Back to Job Search
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/teacher/jobs")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Search</span>
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Job Application
            </h1>
            <p className="text-muted-foreground">
              Submit your application for {job.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>{job.title}</span>
                </CardTitle>
                <CardDescription>{job.organization}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job.city}, {job.country}
                    </span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        ${job.salaryMin.toLocaleString()} - $
                        {job.salaryMax.toLocaleString()} {job.currency || "USD"}
                      </span>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{job.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job.jobType
                        ? job.jobType.replace("_", " ")
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job.educationLevel
                        ? job.educationLevel.replace("_", " ")
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                <Separator />

                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Requirements</h4>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2 mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-muted-foreground">
                            {req}
                          </span>
                        </li>
                      ))}
                      {job.requirements.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{job.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Benefits</h4>
                      <ul className="space-y-1">
                        {job.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent-green mr-2 mt-2 flex-shrink-0"></div>
                            <span className="text-xs text-muted-foreground">
                              {benefit}
                            </span>
                          </li>
                        ))}
                        {job.benefits.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{job.benefits.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}

                {job.screeningQuestions &&
                  job.screeningQuestions.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          Screening Questions
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {job.screeningQuestions.length} question
                          {job.screeningQuestions.length !== 1 ? "s" : ""} to
                          answer
                        </p>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                  <CardDescription>
                    Explain why you're the perfect candidate for this position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Write a compelling cover letter explaining your interest in this position, relevant experience, and why you would be a great fit for the role..."
                      {...register("coverLetter")}
                      rows={6}
                      className={
                        isFieldInvalid("coverLetter") ? "border-red-500" : ""
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimum 200 characters</span>
                      <span>{formData.coverLetter.length}/2000</span>
                    </div>
                    {isFieldInvalid("coverLetter") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("coverLetter")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                  <CardDescription>
                    Provide additional information about your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedSalary">
                        Expected Salary (Optional)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="expectedSalary"
                          type="number"
                          placeholder="45000"
                          {...register("expectedSalary")}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Available From *</Label>
                      <DatePicker
                        value={formData.availableFrom}
                        onValueChange={(date) =>
                          setValue("availableFrom", date || new Date())
                        }
                        placeholder="Select date"
                        min={new Date()}
                        className={
                          isFieldInvalid("availableFrom")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {isFieldInvalid("availableFrom") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("availableFrom")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonForApplying">
                      Why are you applying for this position? *
                    </Label>
                    <Textarea
                      id="reasonForApplying"
                      placeholder="Explain your motivation for applying and what interests you about this role..."
                      {...register("reasonForApplying")}
                      rows={4}
                      className={
                        isFieldInvalid("reasonForApplying")
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {isFieldInvalid("reasonForApplying") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("reasonForApplying")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalComments">
                      Additional Comments (Optional)
                    </Label>
                    <Textarea
                      id="additionalComments"
                      placeholder="Any additional information you'd like to share..."
                      {...register("additionalComments")}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Screening Questions */}
              {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span>Screening Questions *</span>
                    </CardTitle>
                    <CardDescription>
                      These questions are compulsory and must be answered to
                      complete your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {job.screeningQuestions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label
                          htmlFor={`question-${index}`}
                          className="text-sm font-medium"
                        >
                          {index + 1}. {question} *
                        </Label>
                        <Textarea
                          id={`question-${index}`}
                          placeholder="Your answer..."
                          value={screeningAnswers[question] || ""}
                          onChange={(e) =>
                            handleScreeningAnswer(question, e.target.value)
                          }
                          rows={3}
                          className={
                            screeningAnswers[question] ? "" : "border-amber-500"
                          }
                        />
                        {!screeningAnswers[question] && (
                          <p className="text-sm text-amber-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            This question must be answered to submit your
                            application
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Upload your CV and any additional documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>CV/Resume *</Label>
                    {uploadedFiles.resume ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-medium">
                            {uploadedFiles.resume.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {(uploadedFiles.resume.size / 1024 / 1024).toFixed(
                              2
                            )}{" "}
                            MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeResume}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("resume-upload")?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload CV
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          PDF, DOC, DOCX (Max 5MB)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Documents (Optional)</Label>
                    <div className="space-y-3">
                      {uploadedFiles.documents.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.documents.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-brand-primary" />
                                <span className="text-sm font-medium">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {uploadedFiles.documents.length < 5 && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleDocumentUpload}
                            className="hidden"
                            id="document-upload"
                            multiple
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById("document-upload")
                                ?.click()
                            }
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Up to {5 - uploadedFiles.documents.length} more
                            files (Max 5MB each)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setValue("agreeToTerms", !!checked)
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the terms and conditions and confirm that all
                      information provided is accurate *
                    </Label>
                  </div>
                  {isFieldInvalid("agreeToTerms") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("agreeToTerms")}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobApplication;
