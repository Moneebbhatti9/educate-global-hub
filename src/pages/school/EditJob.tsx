import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CurrencySelect } from "@/components/ui/currency-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  ArrowLeft,
  Save,
  Send,
  X,
  Plus,
  DollarSign,
  Calendar,
  Globe,
  Users,
  GraduationCap,
  MapPin,
  Loader2,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { postJobFormSchema } from "@/helpers/validation";
import { Country } from "@/components/ui/country-dropdown";
import { useJob, useUpdateJob } from "@/hooks/useJobs";
import { customToast } from "@/components/ui/sonner";
import type { CreateJobRequest, JobType, EducationLevel } from "@/types/job";
import { useAuth } from "@/contexts/AuthContext";
import { EditJobFormSkeleton } from "@/components/skeletons/form-skeleton";

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const updateJobMutation = useUpdateJob();

  // Fetch existing job data
  const {
    data: jobData,
    isLoading: jobLoading,
    error: jobError,
  } = useJob(jobId || "");

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
    schema: postJobFormSchema,
    mode: "onTouched",
    defaultValues: {
      title: "",
      organization: "Dubai International School",
      country: "",
      city: "",
      educationLevel: "",
      jobType: "full_time",
      subjects: [],
      position: {
        category: "",
        subcategory: "",
      },
      organizationType: [],
      description: "",
      requirements: [],
      salaryMin: "",
      salaryMax: "",
      currency: "USD",
      benefits: [],
      salaryDisclose: true,
      visaSponsorship: false,
      quickApply: true,
      externalLink: "",
      minExperience: "",
      qualification: "",
      applicationDeadline: undefined,
      applicantEmail: "",
      screeningQuestions: [],
      tags: [],
      isUrgent: false,
      isFeatured: false,
    },
  });

  const formData = watch();
  const [newSubject, setNewSubject] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newTag, setNewTag] = useState("");

  // Populate form when job data is loaded
  useEffect(() => {
    if ((jobData?.data as any)?.job) {
      const job = (jobData?.data as any)?.job;
      reset({
        title: job.title || "",
        organization: "",
        country: job.country || "",
        city: job.city || "",
        educationLevel: job.educationLevel || "",
        jobType: job.jobType || "full_time",
        subjects: job.subjects || [],
        position: {
          category: job.positionCategory || "",
          subcategory: job.positionSubcategory || "",
        },
        organizationType: [],
        description: job.description || "",
        requirements: job.requirements || [],
        salaryMin: job.salaryMin?.toString() || "",
        salaryMax: job.salaryMax?.toString() || "",
        currency: job.currency || "USD",
        benefits: job.benefits || [],
        salaryDisclose: job.salaryDisclose !== false,
        visaSponsorship: job.visaSponsorship || false,
        quickApply: job.quickApply !== false,
        externalLink: job.externalLink || "",
        minExperience: job.minExperience?.toString() || "",
        qualification: job.qualification || "",
        applicationDeadline: job.applicationDeadline
          ? new Date(job.applicationDeadline)
          : undefined,
        applicantEmail: job.applicantEmail || "",
        screeningQuestions: job.screeningQuestions || [],
        tags: job.tags || [],
        isUrgent: job.isUrgent || false,
        isFeatured: job.isFeatured || false,
      });
    }
  }, [jobData, reset]);

  // Handle authentication redirects
  useEffect(() => {
    if (!user || user.role !== "school") {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate]);

  // Don't render if not authenticated or not a school
  if (!user || user.role !== "school") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (jobLoading) {
    return (
      <DashboardLayout role="school">
        <EditJobFormSkeleton />
      </DashboardLayout>
    );
  }

  if (jobError || !jobData?.data) {
    return (
      <DashboardLayout role="school">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job you're looking for doesn't exist or you don't have
              permission to edit it.
            </p>
            <Button onClick={() => navigate("/dashboard/school/postings")}>
              Back to Job Postings
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const educationLevels: EducationLevel[] = [
    "early_years",
    "primary",
    "secondary",
    "high_school",
    "foundation",
    "higher_education",
  ];

  const jobTypes: JobType[] = [
    "full_time",
    "part_time",
    "contract",
    "substitute",
  ];

  const positionCategories = [
    "Teaching",
    "Administration",
    "Support Staff",
    "Leadership",
    "Specialist",
  ];

  const teachingSubcategories = [
    "Subject Teacher",
    "Class Teacher",
    "Special Education",
    "ESL/EAL",
    "Gifted Education",
    "Remedial Education",
  ];

  const adminSubcategories = [
    "Principal",
    "Vice Principal",
    "Head of Department",
    "Coordinator",
    "Registrar",
    "Business Manager",
  ];

  const supportSubcategories = [
    "Librarian",
    "IT Support",
    "Maintenance",
    "Security",
    "Transportation",
    "Cafeteria",
  ];

  const commonBenefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "Life Insurance",
    "Disability Insurance",
    "Retirement Plan",
    "Professional Development",
    "Tuition Reimbursement",
    "Housing Allowance",
    "Transportation Allowance",
    "Annual Flight",
    "Relocation Assistance",
    "Visa Sponsorship",
    "Paid Time Off",
    "Sick Leave",
    "Maternity/Paternity Leave",
    "Wellness Programs",
    "Gym Membership",
    "Meal Allowance",
    "Childcare Support",
  ];

  const onSubmit = async (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault();

    if (!jobId) {
      customToast.error("Job ID is required");
      return;
    }

    try {
      // Transform form data to match API structure
      const jobData: CreateJobRequest = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || [],
        organization: formData.organization,
        benefits: formData.benefits || [],
        subjects: formData.subjects || [],
        educationLevel: formData.educationLevel as EducationLevel,
        jobType: formData.jobType as JobType,
        positionCategory: formData.position.category,
        positionSubcategory: formData.position.subcategory,
        country: formData.country,
        city: formData.city,
        salaryMin:
          formData.salaryDisclose && formData.salaryMin
            ? parseFloat(formData.salaryMin)
            : undefined,
        salaryMax:
          formData.salaryDisclose && formData.salaryMax
            ? parseFloat(formData.salaryMax)
            : undefined,
        currency: formData.currency,
        salaryDisclose: formData.salaryDisclose,
        minExperience: formData.minExperience
          ? parseFloat(formData.minExperience)
          : undefined,
        qualification: formData.qualification,
        visaSponsorship: formData.visaSponsorship,
        quickApply: formData.quickApply,
        externalLink: formData.externalLink,
        applicationDeadline: formData.applicationDeadline?.toISOString() || "",
        applicantEmail: formData.applicantEmail,
        screeningQuestions: formData.screeningQuestions || [],
        tags: formData.tags || [],
        isUrgent: formData.isUrgent || false,
        isFeatured: formData.isFeatured || false,
        action: action === "draft" ? "save_draft" : "publish",
      };

      await updateJobMutation.mutateAsync({
        jobId,
        data: jobData,
      });

      if (action === "draft") {
        customToast.success("Job updated and saved as draft successfully!");
      } else {
        customToast.success("Job updated and published successfully!");
      }

      navigate("/dashboard/school/postings");
    } catch (error: unknown) {
      console.error("Error updating job:", error);
      customToast.error("Failed to update job. Please try again.");
    }
  };

  const addItem = (
    item: string,
    field:
      | "subjects"
      | "benefits"
      | "screeningQuestions"
      | "requirements"
      | "tags",
    setter: (value: string) => void
  ) => {
    if (item.trim()) {
      const currentItems = formData[field] || [];
      setValue(field, [...currentItems, item.trim()]);
      setter("");
    }
  };

  const removeItem = (
    index: number,
    field:
      | "subjects"
      | "benefits"
      | "organizationType"
      | "screeningQuestions"
      | "requirements"
      | "tags"
  ) => {
    const currentItems = formData[field] || [];
    setValue(
      field,
      currentItems.filter((_, i) => i !== index)
    );
  };

  const handleCountryChange = (country: Country) => {
    setValue("country", country.name);
  };

  const getSubcategories = () => {
    switch (formData.position.category) {
      case "Teaching":
        return teachingSubcategories;
      case "Administration":
        return adminSubcategories;
      case "Support Staff":
        return supportSubcategories;
      default:
        return [];
    }
  };

  const getEducationLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      early_years: "Early Years (Ages 3-5)",
      primary: "Primary (Grades 1-6)",
      secondary: "Secondary (Grades 7-9)",
      high_school: "High School (Grades 10-12)",
      foundation: "Foundation Program",
      higher_education: "Higher Education",
    };
    return labels[level] || level;
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full_time: "Full-time",
      part_time: "Part-time",
      contract: "Contract",
      substitute: "Substitute",
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/school/postings")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Postings</span>
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Edit Job
            </h1>
            <p className="text-muted-foreground">
              Update your job posting to attract qualified candidates
            </p>
          </div>
        </div>

        {/* Show skeleton when submitting */}
        {updateJobMutation.isPending ? (
          <EditJobFormSkeleton />
        ) : (
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  Essential details about the position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mathematics Teacher - Secondary"
                      {...register("title")}
                      className={
                        isFieldInvalid("title") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("title") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("title")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      {...register("organization")}
                      className={
                        isFieldInvalid("organization") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("organization") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("organization")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level *</Label>
                    <Select
                      value={formData.educationLevel}
                      onValueChange={(value) =>
                        setValue("educationLevel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {getEducationLevelLabel(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isFieldInvalid("educationLevel") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("educationLevel")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select
                      value={formData.jobType || "full_time"}
                      onValueChange={(value) => setValue("jobType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {getJobTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="positionCategory">
                      Position Category *
                    </Label>
                    <Select
                      value={formData.position.category}
                      onValueChange={(value) => {
                        setValue("position.category", value);
                        setValue("position.subcategory", "");
                      }}
                    >
                      <SelectTrigger
                        className={
                          isFieldInvalid("position.category")
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select position category" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isFieldInvalid("position.category") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("position.category")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="positionSubcategory">
                      Position Subcategory *
                    </Label>
                    <Select
                      value={formData.position.subcategory}
                      onValueChange={(value) =>
                        setValue("position.subcategory", value)
                      }
                      disabled={!formData.position.category}
                    >
                      <SelectTrigger
                        className={
                          isFieldInvalid("position.subcategory")
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubcategories().map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isFieldInvalid("position.subcategory") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("position.subcategory")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the role, responsibilities, and what makes this position unique..."
                    rows={6}
                    {...register("description")}
                    className={
                      isFieldInvalid("description") ? "border-red-500" : ""
                    }
                  />
                  {isFieldInvalid("description") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("description")}
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a requirement and press Enter or click Add"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItem(
                              newRequirement,
                              "requirements",
                              setNewRequirement
                            );
                          }
                        }}
                        className="flex-1"
                        disabled={(formData.requirements || []).length >= 20}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          addItem(
                            newRequirement,
                            "requirements",
                            setNewRequirement
                          )
                        }
                        disabled={
                          !newRequirement.trim() ||
                          (formData.requirements || []).length >= 20
                        }
                        className="min-w-[80px]"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 Press Enter or click Add to include each requirement
                      {(formData.requirements || []).length >= 20 && (
                        <span className="text-red-500">
                          {" "}
                          • Maximum 20 requirements reached
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-muted/30">
                    {(formData.requirements || []).map((requirement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1 px-3 py-1"
                      >
                        <span>{requirement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent hover:text-destructive"
                          onClick={() => removeItem(index, "requirements")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                    {(formData.requirements || []).length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No requirements added yet
                      </span>
                    )}
                  </div>
                  {isFieldInvalid("requirements") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("requirements")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <CountryDropdown
                      onChange={handleCountryChange}
                      defaultValue={formData.country}
                      placeholder="Select country"
                    />
                    {isFieldInvalid("country") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("country")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Dubai"
                      {...register("city")}
                      className={isFieldInvalid("city") ? "border-red-500" : ""}
                    />
                    {isFieldInvalid("city") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("city")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects & Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Subjects & Skills</span>
                </CardTitle>
                <CardDescription>
                  What subjects or skills are required for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a subject or skill and press Enter or click Add"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(newSubject, "subjects", setNewSubject);
                        }
                      }}
                      className="flex-1"
                      disabled={(formData.subjects || []).length >= 10}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        addItem(newSubject, "subjects", setNewSubject)
                      }
                      disabled={
                        !newSubject.trim() ||
                        (formData.subjects || []).length >= 10
                      }
                      className="min-w-[80px]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Press Enter or click Add to include each subject or skill
                    {(formData.subjects || []).length >= 10 && (
                      <span className="text-red-500">
                        {" "}
                        • Maximum 10 subjects reached
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-muted/30">
                  {(formData.subjects || []).map((subject, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1 px-3 py-1"
                    >
                      <span>{subject}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent hover:text-destructive"
                        onClick={() => removeItem(index, "subjects")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                  {(formData.subjects || []).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No subjects or skills added yet
                    </span>
                  )}
                </div>
                {isFieldInvalid("subjects") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("subjects")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Requirements & Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">
                      Required Qualification *
                    </Label>
                    <Input
                      id="qualification"
                      placeholder="e.g., Bachelor's Degree in Education"
                      {...register("qualification")}
                      className={
                        isFieldInvalid("qualification") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("qualification") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("qualification")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minExperience">
                      Minimum Experience (Years)
                    </Label>
                    <Input
                      id="minExperience"
                      type="number"
                      placeholder="e.g., 2"
                      {...register("minExperience")}
                      className={
                        isFieldInvalid("minExperience") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("minExperience") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("minExperience")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary & Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Salary & Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="salaryDisclose"
                    checked={formData.salaryDisclose}
                    onCheckedChange={(checked) =>
                      setValue("salaryDisclose", !!checked)
                    }
                  />
                  <Label htmlFor="salaryDisclose">
                    Disclose salary information
                  </Label>
                </div>

                {formData.salaryDisclose && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Minimum Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        placeholder="e.g., 4000"
                        min={1}
                        {...register("salaryMin")}
                        className={
                          isFieldInvalid("salaryMin") ? "border-red-500" : ""
                        }
                      />
                      {isFieldInvalid("salaryMin") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("salaryMin")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Maximum Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        placeholder="e.g., 6000"
                        {...register("salaryMax")}
                        className={
                          isFieldInvalid("salaryMax") ? "border-red-500" : ""
                        }
                      />
                      {isFieldInvalid("salaryMax") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("salaryMax")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <CurrencySelect
                        value={formData.currency}
                        onValueChange={(value) => setValue("currency", value)}
                        name="currency"
                      />
                    </div>
                  </div>
                )}

                {formData.salaryDisclose &&
                  formData.salaryMin &&
                  formData.salaryMax &&
                  parseFloat(formData.salaryMin) >=
                    parseFloat(formData.salaryMax) && (
                    <p className="text-sm text-red-500">
                      Maximum salary must be greater than minimum salary
                    </p>
                  )}

                <div className="space-y-4">
                  <Label>Benefits & Perks</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border rounded-lg bg-muted/20">
                      {commonBenefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={benefit}
                            checked={(formData.benefits || []).includes(
                              benefit
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue("benefits", [
                                  ...(formData.benefits || []),
                                  benefit,
                                ]);
                              } else {
                                setValue(
                                  "benefits",
                                  (formData.benefits || []).filter(
                                    (b) => b !== benefit
                                  )
                                );
                              }
                            }}
                          />
                          <Label htmlFor={benefit} className="text-sm">
                            {benefit}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ✅ Check the benefits you offer, or add custom ones below
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a custom benefit and press Enter or click Add"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItem(newBenefit, "benefits", setNewBenefit);
                          }
                        }}
                        className="flex-1"
                        disabled={(formData.benefits || []).length >= 20}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          addItem(newBenefit, "benefits", setNewBenefit)
                        }
                        disabled={
                          !newBenefit.trim() ||
                          (formData.benefits || []).length >= 20
                        }
                        className="min-w-[80px]"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 Press Enter or click Add to include each custom benefit
                      {(formData.benefits || []).length >= 20 && (
                        <span className="text-red-500">
                          {" "}
                          • Maximum 20 benefits reached
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">
                      Application Deadline *
                    </Label>
                    <DatePicker
                      id="applicationDeadline"
                      value={formData.applicationDeadline || undefined}
                      onValueChange={(date) => {
                        if (date) {
                          setValue("applicationDeadline", date);
                        }
                      }}
                      placeholder="Select deadline"
                    />
                    {isFieldInvalid("applicationDeadline") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("applicationDeadline")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="applicantEmail">
                        Application Collection Email *
                      </Label>
                      <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border">
                          This email will receive all job applications from
                          candidates
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                        </div>
                      </div>
                    </div>
                    <Input
                      id="applicantEmail"
                      type="email"
                      placeholder="e.g., careers@school.edu"
                      {...register("applicantEmail")}
                      className={
                        isFieldInvalid("applicantEmail") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("applicantEmail") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("applicantEmail")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quickApply"
                      checked={formData.quickApply}
                      onCheckedChange={(checked) =>
                        setValue("quickApply", !!checked)
                      }
                    />
                    <Label htmlFor="quickApply">
                      Enable Quick Apply (candidates can apply with one click)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visaSponsorship"
                      checked={formData.visaSponsorship}
                      onCheckedChange={(checked) =>
                        setValue("visaSponsorship", !!checked)
                      }
                    />
                    <Label htmlFor="visaSponsorship">
                      Offer visa sponsorship for international candidates
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="externalLink">
                      External Application Link
                    </Label>
                    <Input
                      id="externalLink"
                      type="url"
                      placeholder="https://external-application-system.com"
                      {...register("externalLink")}
                      className={
                        isFieldInvalid("externalLink") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("externalLink") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("externalLink")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Optional: If you have an external application system
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screening Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Screening Questions</CardTitle>
                <CardDescription>
                  Add questions to help filter candidates (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a screening question and press Enter or click Add"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(
                            newQuestion,
                            "screeningQuestions",
                            setNewQuestion
                          );
                        }
                      }}
                      className="flex-1"
                      disabled={
                        (formData.screeningQuestions || []).length >= 10
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        addItem(
                          newQuestion,
                          "screeningQuestions",
                          setNewQuestion
                        )
                      }
                      disabled={
                        !newQuestion.trim() ||
                        (formData.screeningQuestions || []).length >= 10
                      }
                      className="min-w-[80px]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Press Enter or click Add to include each screening
                    question
                    {(formData.screeningQuestions || []).length >= 10 && (
                      <span className="text-red-500">
                        {" "}
                        • Maximum 10 questions reached
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-2 min-h-[40px]">
                  {(formData.screeningQuestions || []).map(
                    (question, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                      >
                        <span className="text-sm">{question}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeItem(index, "screeningQuestions")
                          }
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )
                  )}
                  {(formData.screeningQuestions || []).length === 0 && (
                    <div className="p-3 border rounded-lg bg-muted/30 text-center">
                      <span className="text-sm text-muted-foreground">
                        No screening questions added yet
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/school/postings")}
              >
                Cancel
              </Button>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => onSubmit(e, "draft")}
                  disabled={updateJobMutation.isPending}
                >
                  {updateJobMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={(e) => onSubmit(e, "publish")}
                  disabled={updateJobMutation.isPending}
                >
                  {updateJobMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Update & Publish
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditJob;
