import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  FileText,
  CheckCircle,
} from "lucide-react";
import { UserRole } from "@/pages/SignUp";

interface ProfileCompletionProps {
  role: UserRole;
  onComplete: () => void;
  onBack?: () => void;
}

const ProfileCompletion = ({
  role,
  onComplete,
  onBack,
}: ProfileCompletionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    fullName: "",
    country: "",
    city: "",
    address: "",
    phoneNumber: "",

    // About (Step 2)
    bio: "",
    experience: "",

    // Role-specific (Step 3)
    specialization: "",
    institution: "",
    yearsExperience: "",
    certifications: "",
    subjects: "",
    companyName: "",
    companySize: "",
    services: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "South Korea",
    "Singapore",
    "UAE",
    "Other",
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate profile creation
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 2000);
  };

  const getRoleSpecificFields = () => {
    switch (role) {
      case "teacher":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="specialization">Subject Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Mathematics, English, Science"
                value={formData.specialization}
                onChange={(e) =>
                  updateFormData("specialization", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">
                Years of Teaching Experience
              </Label>
              <Select
                onValueChange={(value) =>
                  updateFormData("yearsExperience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">
                Certifications & Qualifications
              </Label>
              <Textarea
                id="certifications"
                placeholder="List your teaching certifications, degrees, etc."
                value={formData.certifications}
                onChange={(e) =>
                  updateFormData("certifications", e.target.value)
                }
                rows={3}
              />
            </div>
          </>
        );

      case "school":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution Name</Label>
              <Input
                id="institution"
                placeholder="Name of your school or institution"
                value={formData.institution}
                onChange={(e) => updateFormData("institution", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">School Size</Label>
              <Select
                onValueChange={(value) => updateFormData("companySize", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select school size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-200 students)</SelectItem>
                  <SelectItem value="medium">
                    Medium (201-500 students)
                  </SelectItem>
                  <SelectItem value="large">
                    Large (501-1000 students)
                  </SelectItem>
                  <SelectItem value="xlarge">
                    Very Large (1000+ students)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects Offered</Label>
              <Textarea
                id="subjects"
                placeholder="List the main subjects and programs your school offers"
                value={formData.subjects}
                onChange={(e) => updateFormData("subjects", e.target.value)}
                rows={3}
              />
            </div>
          </>
        );

      case "recruiter":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Recruitment Agency</Label>
              <Input
                id="companyName"
                placeholder="Name of your recruitment agency"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years in Recruitment</Label>
              <Select
                onValueChange={(value) =>
                  updateFormData("yearsExperience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11+">11+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Recruitment Specialization</Label>
              <Textarea
                id="specialization"
                placeholder="e.g., International teaching placements, Higher education, K-12 education"
                value={formData.specialization}
                onChange={(e) =>
                  updateFormData("specialization", e.target.value)
                }
                rows={3}
              />
            </div>
          </>
        );

      case "supplier":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Name of your company"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="services">Products & Services</Label>
              <Textarea
                id="services"
                placeholder="Describe what educational products or services you provide"
                value={formData.services}
                onChange={(e) => updateFormData("services", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years in Education Sector</Label>
              <Select
                onValueChange={(value) =>
                  updateFormData("yearsExperience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11+">11+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep)
      return <CheckCircle className="w-5 h-5 text-brand-accent-green" />;
    if (step === 1) return <User className="w-5 h-5" />;
    if (step === 2) return <FileText className="w-5 h-5" />;
    if (step === 3) return <MapPin className="w-5 h-5" />;
    return (
      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
    );
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Complete Your Profile
        </h1>
        <p className="text-muted-foreground">
          Tell us more about yourself to personalize your experience
        </p>
        <div className="flex items-center justify-center mt-6 space-x-4">
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step <= currentStep
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-0.5 ml-4 ${
                      step < currentStep ? "bg-brand-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Basic Info</span>
          <span>About You</span>
          <span>Additional Info</span>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Step {currentStep} of 3
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Let's start with your basic information"}
            {currentStep === 2 &&
              "Tell us about your background and experience"}
            {currentStep === 3 && "A few more details to complete your profile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    onValueChange={(value) => updateFormData("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* Step 2: About */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your passion for education, and what drives you"
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This will be visible on your profile to help others understand
                  your background.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Key Experience & Achievements
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Highlight your most relevant experience and any notable achievements"
                  value={formData.experience}
                  onChange={(e) => updateFormData("experience", e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}

          {/* Step 3: Role-specific */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-semibold mb-4 capitalize">
                  {role}-Specific Information
                </h3>
                <div className="space-y-4">{getRoleSpecificFields()}</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 && !onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 && onBack ? "Back to Verification" : "Back"}
            </Button>

            <Button onClick={handleNext} variant="hero" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Profile...
                </>
              ) : currentStep === 3 ? (
                <>
                  Complete Profile
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
