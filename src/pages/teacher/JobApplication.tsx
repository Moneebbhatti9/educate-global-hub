import { useState } from "react";
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
} from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { jobApplicationFormSchema } from "@/helpers/validation";
import { Country } from "@/components/ui/country-dropdown";

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getFieldError,
    isFieldInvalid,
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

  // Mock job data - in real app this would be fetched based on jobId
  const job = {
    id: parseInt(jobId || "1"),
    title: "Mathematics Teacher - Secondary",
    school: "Dubai International School",
    location: "Dubai, UAE",
    educationLevel: "Secondary (Grades 9-12)",
    subjects: ["Mathematics", "Statistics"],
    salaryRange: "$4,000 - $6,000",
    currency: "USD",
    type: "Full-time",
    description:
      "We are seeking an experienced Mathematics teacher to join our Secondary department. The ideal candidate will have strong classroom management skills and experience with international curricula.",
    requirements: [
      "Bachelor's degree in Mathematics or related field",
      "3+ years teaching experience",
      "International curriculum experience preferred",
      "PGCE or equivalent teaching qualification",
      "Strong communication skills in English",
    ],
    benefits: [
      "Health Insurance",
      "Housing Allowance",
      "Annual Flight",
      "Professional Development",
    ],
    rating: 4.8,
    reviews: 156,
    quickApply: true,
    visaSponsorship: true,
    screeningQuestions: [
      "Do you have experience teaching the IB Mathematics curriculum?",
      "Are you comfortable using educational technology in your teaching?",
      "How would you handle a classroom with diverse learning abilities?",
      "What is your preferred teaching methodology for mathematics?",
    ],
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", {
      formData,
      screeningAnswers,
    });
    // Handle form submission logic here
    navigate("/dashboard/teacher/applications");
  };

  const handleScreeningAnswer = (question: string, answer: string) => {
    setScreeningAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
    setValue("screeningAnswers", {
      ...screeningAnswers,
      [question]: answer,
    });
  };

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
                <CardDescription>{job.school}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job.salaryRange} {job.currency}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{job.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({job.reviews} reviews)
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Requirements</h4>
                  <div className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Benefits</h4>
                  <div className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {job.visaSponsorship && (
                  <div className="p-3 bg-brand-accent-green/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-brand-accent-green" />
                      <span className="text-sm font-medium text-brand-accent-green">
                        Visa Sponsorship Available
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your profile information will be automatically included
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value="Sarah Johnson" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value="sarah.johnson@email.com" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <PhoneInput value="+44 20 1234 5678" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Location</Label>
                      <CountryDropdown
                        onChange={() => {}}
                        defaultValue="United Kingdom"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      To update your personal information, visit your{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal"
                        onClick={() => navigate("/profile")}
                      >
                        profile settings
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Cover Letter</span>
                  </CardTitle>
                  <CardDescription>
                    Tell the school why you're the perfect fit for this role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Your Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Dear Hiring Manager,

I am writing to express my interest in the Mathematics Teacher position at Dubai International School. With over 8 years of experience teaching secondary mathematics and a proven track record of improving student outcomes, I am excited about the opportunity to contribute to your academic team.

Throughout my career, I have..."
                      {...register("coverLetter")}
                      rows={8}
                      className={
                        isFieldInvalid("coverLetter") ? "border-red-500" : ""
                      }
                    />
                    {isFieldInvalid("coverLetter") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("coverLetter")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Minimum 200 characters recommended
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedSalary">Expected Salary *</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="expectedSalary"
                          placeholder="e.g., 4500"
                          {...register("expectedSalary")}
                          className={
                            isFieldInvalid("expectedSalary")
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <CurrencySelect
                          name="currency"
                          value="USD"
                          onValueChange={() => {}}
                          placeholder="USD"
                          currencies="custom"
                          variant="small"
                        />
                      </div>
                      {isFieldInvalid("expectedSalary") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("expectedSalary")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Available From *</Label>
                      <DatePicker
                        id="availableFrom"
                        value={formData.availableFrom || undefined}
                        onValueChange={(date) => {
                          if (date) {
                            setValue("availableFrom", date);
                          }
                        }}
                        placeholder="Select available date"
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
                      Why are you interested in this position? *
                    </Label>
                    <Textarea
                      id="reasonForApplying"
                      placeholder="Explain what attracts you to this role and school..."
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
              {job.screeningQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Questions</CardTitle>
                    <CardDescription>
                      Please answer these questions to help us understand your
                      background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {job.screeningQuestions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`question-${index}`}>
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
                            screeningAnswers[question] ? "" : "border-red-500"
                          }
                        />
                        {!screeningAnswers[question] && (
                          <p className="text-sm text-red-500">
                            Answer is required
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
                    <Label>CV/Resume</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CV
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        PDF, DOC, DOCX (Max 5MB)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Documents (Optional)</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Certificates, references, etc.
                      </span>
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

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
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
