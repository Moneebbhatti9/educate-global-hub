import { useState } from "react";
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
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CurrencySelect } from "@/components/ui/currency-select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Plus,
  X,
  Send,
  DollarSign,
  Calendar,
  Globe,
  Users,
  GraduationCap,
  MapPin,
  Megaphone,
} from "lucide-react";
import type { Country } from "@/components/ui/country-dropdown";

const JobAdRequestForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    country: "",
    city: "",
    educationLevel: "",
    jobType: "full_time",
    subjects: [] as string[],
    positionCategory: "",
    positionSubcategory: "",
    description: "",
    requirements: [] as string[],
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
    applicationDeadline: undefined as Date | undefined,
    applicantEmail: "",
    adType: "standard",
    adSize: "medium",
    adDuration: "30",
    contactName: "",
    contactPhone: "",
    specialRequests: "",
  });

  const [newSubject, setNewSubject] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const educationLevels = [
    { value: "early_years", label: "Early Years (Ages 3-5)" },
    { value: "primary", label: "Primary (Grades 1-6)" },
    { value: "secondary", label: "Secondary (Grades 7-9)" },
    { value: "high_school", label: "High School (Grades 10-12)" },
    { value: "foundation", label: "Foundation Program" },
    { value: "higher_education", label: "Higher Education" },
  ];

  const jobTypes = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "substitute", label: "Substitute" },
  ];

  const positionCategories = [
    "Teaching",
    "Administration",
    "Support Staff",
    "Leadership",
    "Specialist",
  ];

  const commonBenefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "Life Insurance",
    "Retirement Plan",
    "Professional Development",
    "Housing Allowance",
    "Transportation Allowance",
    "Annual Flight",
    "Relocation Assistance",
    "Visa Sponsorship",
    "Paid Time Off",
    "Sick Leave",
    "Wellness Programs",
    "Gym Membership",
    "Meal Allowance",
  ];

  const addItem = (
    item: string,
    field: "subjects" | "benefits" | "requirements",
    setter: (value: string) => void
  ) => {
    if (item.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], item.trim()],
      }));
      setter("");
    }
  };

  const removeItem = (
    index: number,
    field: "subjects" | "benefits" | "requirements"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleCountryChange = (country: Country) => {
    setFormData((prev) => ({ ...prev, country: country.name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle form submission
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-brand-primary/10 p-3 rounded-full">
            <Megaphone className="w-8 h-8 text-brand-primary" />
          </div>
        </div>
        <CardTitle className="font-heading text-2xl">
          Request Job Advertisement
        </CardTitle>
        <CardDescription>
          Submit your job posting request with advertisement preferences. Our
          team will review and publish your listing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-brand-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactName: e.target.value,
                    }))
                  }
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicantEmail">Email Address *</Label>
                <Input
                  id="applicantEmail"
                  type="email"
                  value={formData.applicantEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicantEmail: e.target.value,
                    }))
                  }
                  placeholder="contact@school.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPhone: e.target.value,
                    }))
                  }
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                  placeholder="School or Institution Name"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-brand-primary" />
              Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Mathematics Teacher - Secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionCategory">Position Category *</Label>
                <Select
                  value={formData.positionCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      positionCategory: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level *</Label>
                <Select
                  value={formData.educationLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, educationLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, jobType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minExperience">Min. Experience (years)</Label>
                <Input
                  id="minExperience"
                  type="number"
                  min="0"
                  value={formData.minExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minExperience: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-brand-primary" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <CountryDropdown
                  onChange={handleCountryChange}
                  placeholder="Select country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="Enter city name"
                />
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <Label>Subjects/Specializations</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.subjects.map((subject, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{subject}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index, "subjects")}
                    className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter subject"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  addItem(newSubject, "subjects", setNewSubject))
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(newSubject, "subjects", setNewSubject)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the role, responsibilities, and working environment..."
              rows={6}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <Label>Requirements</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.requirements.map((requirement, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{requirement}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index, "requirements")}
                    className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Enter requirement"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  addItem(newRequirement, "requirements", setNewRequirement))
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  addItem(newRequirement, "requirements", setNewRequirement)
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-brand-primary" />
              Salary Information
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="salaryDisclose"
                checked={formData.salaryDisclose}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryDisclose: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="salaryDisclose">Disclose salary range</Label>
            </div>
            {formData.salaryDisclose && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <CurrencySelect
                    name="currency"
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currency: value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryMin: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryMax: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <Label>Benefits & Perks</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {commonBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Checkbox
                    id={benefit}
                    checked={formData.benefits.includes(benefit)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData((prev) => ({
                          ...prev,
                          benefits: [...prev.benefits, benefit],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          benefits: prev.benefits.filter((b) => b !== benefit),
                        }));
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
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add custom benefit"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  addItem(newBenefit, "benefits", setNewBenefit))
                }
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

          {/* Advertisement Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-brand-primary" />
              Advertisement Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adType">Advertisement Type</Label>
                <Select
                  value={formData.adType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, adType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Listing</SelectItem>
                    <SelectItem value="featured">Featured (+$50)</SelectItem>
                    <SelectItem value="premium">Premium (+$100)</SelectItem>
                    <SelectItem value="urgent">Urgent Hire (+$75)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adSize">Advertisement Size</Label>
                <Select
                  value={formData.adSize}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, adSize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">
                      Small (7 days highlight)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium (15 days feature)
                    </SelectItem>
                    <SelectItem value="large">
                      Large (30 days premium)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adDuration">Duration (days)</Label>
                <Select
                  value={formData.adDuration}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, adDuration: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-brand-primary" />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">
                  Application Deadline
                </Label>
                <DatePicker
                  value={formData.applicationDeadline}
                  onValueChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDeadline: date,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Required Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      qualification: e.target.value,
                    }))
                  }
                  placeholder="e.g., Bachelor's in Education"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visaSponsorship"
                  checked={formData.visaSponsorship}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      visaSponsorship: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="visaSponsorship">
                  Visa sponsorship available
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quickApply"
                  checked={formData.quickApply}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      quickApply: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="quickApply">Enable quick apply</Label>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-4">
            <Label htmlFor="specialRequests">Special Requests or Notes</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
              placeholder="Any specific requirements for the advertisement placement or special instructions..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="min-w-48">
              <Send className="w-4 h-4 mr-2" />
              Submit Advertisement Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobAdRequestForm;
