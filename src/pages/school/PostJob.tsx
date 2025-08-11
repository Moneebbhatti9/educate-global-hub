import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { postJobFormSchema } from "@/helpers/validation";
import { Country } from "@/components/ui/country-dropdown";

const PostJob = () => {
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
    schema: postJobFormSchema,
    mode: "onTouched",
    defaultValues: {
      title: "",
      organization: "Dubai International School",
      country: "",
      city: "",
      educationLevel: "",
      subjects: [],
      position: {
        category: "",
        subcategory: "",
      },
      organizationType: [],
      description: "",
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
    },
  });

  const formData = watch();
  const [newSubject, setNewSubject] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  const educationLevels = [
    "Early Years (Ages 3-5)",
    "Primary (Grades 1-6)",
    "Secondary (Grades 7-9)",
    "High School (Grades 10-12)",
    "Foundation Program",
    "Higher Education",
    "All Levels",
  ];

  const positionCategories = {
    Teaching: [
      "Subject Teacher",
      "Head of Department",
      "Assistant Teacher",
      "Supply Teacher",
      "Learning Support",
    ],
    Leadership: [
      "Principal",
      "Vice Principal",
      "Academic Director",
      "Curriculum Coordinator",
      "Department Head",
    ],
    Support: [
      "Teaching Assistant",
      "Lab Technician",
      "Librarian",
      "IT Support",
      "Administrative Staff",
    ],
    Specialist: [
      "Special Education",
      "Counselor",
      "Nurse",
      "Athletic Coach",
      "Arts Specialist",
    ],
  };

  const qualifications = [
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Teaching Certificate",
    "PGCE",
    "QTS",
    "Other",
  ];

  const commonBenefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "Life Insurance",
    "Retirement Plan",
    "Paid Time Off",
    "Professional Development",
    "Housing Allowance",
    "Transportation Allowance",
    "Meal Allowance",
    "Annual Flight",
    "Relocation Assistance",
    "Performance Bonus",
    "End of Service Gratuity",
  ];

  const onSubmit = (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault();
    console.log("Form submitted:", { action, formData });
    // Handle form submission logic here
    navigate("/dashboard/school/job-post-success");
  };

  const addItem = (
    item: string,
    field: "subjects" | "benefits" | "screeningQuestions",
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
    field: "subjects" | "benefits" | "organizationType" | "screeningQuestions"
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

  return (
    <DashboardLayout
      role="school"
      userName="Dubai International School"
      userEmail="admin@dubaiinternational.edu.ae"
    >
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
              Post New Job
            </h1>
            <p className="text-muted-foreground">
              Create a comprehensive job posting to attract qualified candidates
            </p>
          </div>
        </div>

        <form className="space-y-8">
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
                    className={isFieldInvalid("title") ? "border-red-500" : ""}
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

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value) => setValue("educationLevel", value)}
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("educationLevel") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
                  <Label htmlFor="qualification">
                    Required Qualification *
                  </Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(value) => setValue("qualification", value)}
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("qualification") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map((qual) => (
                        <SelectItem key={qual} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isFieldInvalid("qualification") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("qualification")}
                    </p>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-3">
                <Label>Subjects *</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add subject (e.g., Mathematics)"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(newSubject, "subjects", setNewSubject);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addItem(newSubject, "subjects", setNewSubject)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.subjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{subject}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeItem(index, "subjects")}
                      />
                    </Badge>
                  ))}
                </div>
                {isFieldInvalid("subjects") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("subjects")}
                  </p>
                )}
              </div>

              {/* Position Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Position Category *</Label>
                  <Select
                    value={formData.position.category}
                    onValueChange={(value) =>
                      setValue("position.category", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("position.category")
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(positionCategories).map((category) => (
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

                {formData.position.category && (
                  <div className="space-y-2">
                    <Label>Position Type *</Label>
                    <Select
                      value={formData.position.subcategory}
                      onValueChange={(value) =>
                        setValue("position.subcategory", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          isFieldInvalid("position.subcategory")
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select position type" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionCategories[
                          formData.position
                            .category as keyof typeof positionCategories
                        ]?.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Provide detailed information about the role and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  {...register("description")}
                  rows={8}
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

              <div className="space-y-2">
                <Label htmlFor="minExperience">
                  Minimum Experience (years)
                </Label>
                <Input
                  id="minExperience"
                  type="number"
                  placeholder="e.g., 2"
                  {...register("minExperience")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compensation & Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Compensation & Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary *</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="3000"
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
                  <Label htmlFor="salaryMax">Maximum Salary *</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="5000"
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
                  <Label htmlFor="currency">Currency *</Label>
                  <CurrencySelect
                    name="currency"
                    value={formData.currency}
                    onValueChange={(value) => setValue("currency", value)}
                    placeholder="Select currency"
                    currencies="custom"
                  />
                  {isFieldInvalid("currency") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("currency")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="salaryDisclose"
                  checked={formData.salaryDisclose}
                  onCheckedChange={(checked) =>
                    setValue("salaryDisclose", !!checked)
                  }
                />
                <Label htmlFor="salaryDisclose">
                  Disclose salary range to applicants
                </Label>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <Label>Benefits</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={(formData.benefits || []).includes(benefit)}
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

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add custom benefit"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(newBenefit, "benefits", setNewBenefit);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addItem(newBenefit, "benefits", setNewBenefit)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
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
                    placeholder="Select application deadline"
                    min={new Date()}
                    className={
                      isFieldInvalid("applicationDeadline")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {isFieldInvalid("applicationDeadline") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("applicationDeadline")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicantEmail">
                    Applicant Collection Email *
                  </Label>
                  <Input
                    id="applicantEmail"
                    type="email"
                    placeholder="hr@school.com"
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
                    Enable Quick Apply (Applications on our platform)
                  </Label>
                </div>

                {!formData.quickApply && (
                  <div className="space-y-2">
                    <Label htmlFor="externalLink">
                      External Application Link
                    </Label>
                    <Input
                      id="externalLink"
                      placeholder="https://your-website.com/apply"
                      {...register("externalLink")}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visaSponsorship"
                    checked={formData.visaSponsorship}
                    onCheckedChange={(checked) =>
                      setValue("visaSponsorship", !!checked)
                    }
                  />
                  <Label htmlFor="visaSponsorship">
                    Visa sponsorship available
                  </Label>
                </div>
              </div>

              {/* Screening Questions */}
              <div className="space-y-3">
                <Label>Screening Questions (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Add questions to help filter candidates before interviews
                </p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., Do you have experience with IB curriculum?"
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
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addItem(newQuestion, "screeningQuestions", setNewQuestion)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.screeningQuestions || []).map(
                    (question, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <span className="text-sm">{question}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeItem(index, "screeningQuestions")
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => onSubmit(e, "draft")}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="default"
              onClick={(e) => onSubmit(e, "publish")}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Job
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
