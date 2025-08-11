import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalDashboardLayout from "@/layout/GlobalDashboardLayout";
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

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    organization: "Dubai International School",
    country: "",
    city: "",
    educationLevel: "",
    subjects: [] as string[],
    position: {
      category: "",
      subcategory: "",
    },
    organizationType: [] as string[],
    description: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    benefits: [] as string[],
    salaryDisclose: true,
    visaSponsorship: false,
    quickApply: true,
    externalLink: "",
    minExperience: "",
    qualification: "",
    applicationDeadline: "",
    applicantEmail: "",
    screeningQuestions: [] as string[],
  });

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
    "Teaching": [
      "Subject Teacher",
      "Head of Department",
      "Assistant Teacher",
      "Supply Teacher",
      "Learning Support",
    ],
    "Leadership": [
      "Principal",
      "Vice Principal",
      "Academic Director",
      "Curriculum Coordinator",
      "Department Head",
    ],
    "Support": [
      "Teaching Assistant",
      "Lab Technician",
      "Librarian",
      "Counselor",
      "IT Support",
    ],
    "Administrative": [
      "Admissions Officer",
      "HR Manager",
      "Finance Officer",
      "Operations Manager",
      "Marketing Coordinator",
    ],
  };

  const organizationTypes = [
    "International School",
    "Public School",
    "Private School",
    "Charter School",
    "Online School",
    "Homeschool Co-op",
    "Education Center",
    "University",
  ];

  const commonBenefits = [
    "Health Insurance",
    "Housing Allowance",
    "Annual Flight Tickets",
    "Professional Development",
    "Visa Sponsorship",
    "End of Service Gratuity",
    "Transportation",
    "Tuition Fee Discount",
    "Performance Bonus",
    "Paid Vacation",
  ];

  const qualifications = [
    "High School Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Teaching Certificate/License",
    "PGCE",
    "Subject-specific Certification",
  ];

  const handleSubmit = (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault();
    console.log("Submitting job posting:", { ...formData, status: action });
    
    if (action === "publish") {
      navigate("/dashboard/school/post-job/success");
    } else {
      navigate("/dashboard/school/postings");
    }
  };

  const addItem = (
    item: string,
    field: "subjects" | "benefits" | "screeningQuestions",
    setter: (value: string) => void
  ) => {
    if (item.trim() && !formData[field].includes(item.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], item.trim()],
      });
      setter("");
    }
  };

  const removeItem = (
    index: number,
    field: "subjects" | "benefits" | "organizationType" | "screeningQuestions"
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <GlobalDashboardLayout
      role="school"
      userName="Dubai International School"
      userEmail="admin@isdubai.edu"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/school/postings")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Postings
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ae">United Arab Emirates</SelectItem>
                      <SelectItem value="sa">Saudi Arabia</SelectItem>
                      <SelectItem value="qa">Qatar</SelectItem>
                      <SelectItem value="kw">Kuwait</SelectItem>
                      <SelectItem value="bh">Bahrain</SelectItem>
                      <SelectItem value="om">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Dubai"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, educationLevel: value })
                    }
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Required Qualification *</Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(value) =>
                      setFormData({ ...formData, qualification: value })
                    }
                  >
                    <SelectTrigger>
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
                    onClick={() => addItem(newSubject, "subjects", setNewSubject)}
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
              </div>

              {/* Position Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Position Category *</Label>
                  <Select
                    value={formData.position.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        position: { ...formData.position, category: value, subcategory: "" },
                      })
                    }
                  >
                    <SelectTrigger>
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
                </div>

                {formData.position.category && (
                  <div className="space-y-2">
                    <Label>Position Type *</Label>
                    <Select
                      value={formData.position.subcategory}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          position: { ...formData.position, subcategory: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position type" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionCategories[formData.position.category as keyof typeof positionCategories]?.map(
                          (position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minExperience">Minimum Experience (years)</Label>
                <Input
                  id="minExperience"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.minExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, minExperience: e.target.value })
                  }
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
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="3000"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryMin: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="5000"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryMax: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="SAR">SAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="salaryDisclose"
                  checked={formData.salaryDisclose}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, salaryDisclose: !!checked })
                  }
                />
                <Label htmlFor="salaryDisclose">Disclose salary range to applicants</Label>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <Label>Benefits</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              benefits: [...formData.benefits, benefit],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              benefits: formData.benefits.filter((b) => b !== benefit),
                            });
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
                    onClick={() => addItem(newBenefit, "benefits", setNewBenefit)}
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
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationDeadline: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicantEmail">Applicant Collection Email</Label>
                  <Input
                    id="applicantEmail"
                    type="email"
                    placeholder="hr@school.com"
                    value={formData.applicantEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, applicantEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quickApply"
                    checked={formData.quickApply}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, quickApply: !!checked })
                    }
                  />
                  <Label htmlFor="quickApply">Enable Quick Apply (Applications on our platform)</Label>
                </div>

                {!formData.quickApply && (
                  <div className="space-y-2">
                    <Label htmlFor="externalLink">External Application Link</Label>
                    <Input
                      id="externalLink"
                      placeholder="https://your-website.com/apply"
                      value={formData.externalLink}
                      onChange={(e) =>
                        setFormData({ ...formData, externalLink: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visaSponsorship"
                    checked={formData.visaSponsorship}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, visaSponsorship: !!checked })
                    }
                  />
                  <Label htmlFor="visaSponsorship">Visa sponsorship available</Label>
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
                        addItem(newQuestion, "screeningQuestions", setNewQuestion);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem(newQuestion, "screeningQuestions", setNewQuestion)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.screeningQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <span className="text-sm">{question}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, "screeningQuestions")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, "draft")}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="hero"
              onClick={(e) => handleSubmit(e, "publish")}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Job
            </Button>
          </div>
        </form>
      </div>
    </GlobalDashboardLayout>
  );
};

export default PostJob;