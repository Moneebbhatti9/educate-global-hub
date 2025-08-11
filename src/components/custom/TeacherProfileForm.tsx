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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  FileText,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { PhoneInput } from "../ui/phone-input";
import { TeacherProfileRequest, QUALIFICATION_OPTIONS } from "@/types/profiles";
import { teacherProfileApi } from "@/apis/profiles";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useFormValidation } from "@/hooks/useFormValidation";
import { teacherProfileFormSchema } from "@/helpers/validation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { customToast } from "@/components/ui/sonner";

interface TeacherProfileFormProps {
  onComplete: (profileData: TeacherProfileRequest) => void;
  onBack?: () => void;
  initialData?: Partial<TeacherProfileRequest>;
}

const TeacherProfileForm = ({
  onComplete,
  onBack,
  initialData,
}: TeacherProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getFieldError,
    isFieldInvalid,
  } = useFormValidation({
    schema: teacherProfileFormSchema,
    mode: "onTouched",
    defaultValues: {
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      province: initialData?.province || "",
      zipCode: initialData?.zipCode || "",
      address: initialData?.address || "",
      qualification: initialData?.qualification || "Bachelor",
      subject: initialData?.subject || "",
      pgce: initialData?.pgce || false,
      yearsOfTeachingExperience: initialData?.yearsOfTeachingExperience || 0,
      professionalBio: initialData?.professionalBio || "",
      keyAchievements: initialData?.keyAchievements || [],
      certifications: initialData?.certifications || [],
      additionalQualifications: initialData?.additionalQualifications || [],
    },
  });

  const formData = watch();

  const addAchievement = () => {
    if (newAchievement.trim()) {
      const currentAchievements = formData.keyAchievements || [];
      setValue("keyAchievements", [
        ...currentAchievements,
        newAchievement.trim(),
      ]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = formData.keyAchievements || [];
    setValue(
      "keyAchievements",
      currentAchievements.filter((_, i) => i !== index)
    );
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      const currentCertifications = formData.certifications || [];
      setValue("certifications", [
        ...currentCertifications,
        newCertification.trim(),
      ]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const currentCertifications = formData.certifications || [];
    setValue(
      "certifications",
      currentCertifications.filter((_, i) => i !== index)
    );
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      const currentQualifications = formData.additionalQualifications || [];
      setValue("additionalQualifications", [
        ...currentQualifications,
        newQualification.trim(),
      ]);
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    const currentQualifications = formData.additionalQualifications || [];
    setValue(
      "additionalQualifications",
      currentQualifications.filter((_, i) => i !== index)
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const validateCurrentStep = () => {
    const currentFormData = watch();
    let hasErrors = false;
    let firstErrorStep = 1;

    // Validate step 1 fields
    if (
      !currentFormData.fullName ||
      !currentFormData.phoneNumber ||
      !currentFormData.country ||
      !currentFormData.city ||
      !currentFormData.province ||
      !currentFormData.zipCode ||
      !currentFormData.address ||
      !currentFormData.qualification ||
      !currentFormData.subject
    ) {
      hasErrors = true;
      firstErrorStep = 1;
    }

    // Validate step 2 fields
    if (
      !hasErrors &&
      (!currentFormData.professionalBio ||
        currentFormData.professionalBio.length < 50)
    ) {
      hasErrors = true;
      firstErrorStep = 2;
    }

    if (hasErrors && currentStep !== firstErrorStep) {
      customToast.error(
        "Validation Error",
        `Please complete step ${firstErrorStep} before proceeding.`
      );
      setCurrentStep(firstErrorStep);
      return false;
    }

    return true;
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const onSubmit = async (data: TeacherProfileRequest) => {
    setIsLoading(true);
    try {
      await teacherProfileApi.createOrUpdate(data);

      // Show success toast
      customToast.success(
        "Profile Created Successfully!",
        "Your teacher profile has been created. Redirecting to dashboard..."
      );

      // Call the onComplete callback
      onComplete(data);

      // Navigate to teacher dashboard
      if (user?.role) {
        navigate(`/dashboard/${user.role.toLowerCase()}`);
      } else {
        navigate("/dashboard/teacher");
      }
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      customToast.error(
        "Profile Creation Failed",
        "There was an error creating your profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100;
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="w-5 h-5" />;
      case 2:
        return <FileText className="w-5 h-5" />;
      case 3:
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Complete Your Teacher Profile
        </h1>
        <p className="text-muted-foreground">
          Tell us more about yourself to personalize your experience
        </p>
        <div className="flex items-center justify-center mt-6 space-x-4">
          <Badge variant="secondary" className="capitalize">
            Teacher
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
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
                  getStepIcon(step)
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {step === 1 && "Basic Info"}
                {step === 2 && "Professional Info"}
                {step === 3 && "Review"}
              </div>
            </div>
          ))}
        </div>

        {/* Connecting lines */}
        <div className="flex items-center w-full mb-4">
          <div className="flex-1 h-0.5 bg-muted"></div>
          <div className="flex-1 h-0.5 bg-muted"></div>
        </div>

        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {/* Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Step {currentStep} of 3
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Let's start with your basic information"}
            {currentStep === 2 && "Tell us about your professional background"}
            {currentStep === 3 && "Review your profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                  className={isFieldInvalid("fullName") ? "border-red-500" : ""}
                />
                {getFieldError("fullName") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("fullName")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <PhoneInput
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(value) => setValue("phoneNumber", value || "")}
                  className={
                    isFieldInvalid("phoneNumber") ? "border-red-500" : ""
                  }
                />
                {getFieldError("phoneNumber") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("phoneNumber")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <CountryDropdown
                    onChange={(country) => setValue("country", country.name)}
                    defaultValue={
                      formData.country ? formData.country : undefined
                    }
                    placeholder="Select country"
                  />
                  {getFieldError("country") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("country")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    {...register("city")}
                    className={isFieldInvalid("city") ? "border-red-500" : ""}
                  />
                  {getFieldError("city") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("city")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province/State *</Label>
                  <Input
                    id="province"
                    placeholder="Enter your province/state"
                    {...register("province")}
                    className={
                      isFieldInvalid("province") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("province") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("province")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="Enter your ZIP code"
                    {...register("zipCode")}
                    className={
                      isFieldInvalid("zipCode") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("zipCode") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("zipCode")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  {...register("address")}
                  className={isFieldInvalid("address") ? "border-red-500" : ""}
                />
                {getFieldError("address") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("address")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(value) =>
                      setValue(
                        "qualification",
                        value as
                          | "Bachelor"
                          | "Master"
                          | "PhD"
                          | "Diploma"
                          | "Certificate"
                          | "Other"
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("qualification") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALIFICATION_OPTIONS.map((qual) => (
                        <SelectItem key={qual} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("qualification") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("qualification")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Teaching Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, English, Science"
                    {...register("subject")}
                    className={
                      isFieldInvalid("subject") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("subject") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("subject")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsOfTeachingExperience">
                    Years of Teaching Experience *
                  </Label>
                  <Input
                    id="yearsOfTeachingExperience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    {...register("yearsOfTeachingExperience", {
                      valueAsNumber: true,
                    })}
                    className={
                      isFieldInvalid("yearsOfTeachingExperience")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {getFieldError("yearsOfTeachingExperience") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("yearsOfTeachingExperience")}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="pgce"
                    checked={formData.pgce}
                    onCheckedChange={(checked) =>
                      setValue("pgce", checked as boolean)
                    }
                  />
                  <Label htmlFor="pgce">
                    Postgraduate Certificate in Education (PGCE)
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="professionalBio">Professional Bio *</Label>
                <Textarea
                  id="professionalBio"
                  placeholder="Tell us about your teaching experience, passion for education, and what drives you as an educator"
                  {...register("professionalBio")}
                  rows={4}
                  className={
                    isFieldInvalid("professionalBio") ? "border-red-500" : ""
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formData.professionalBio.length}/1000 characters
                </p>
                {getFieldError("professionalBio") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("professionalBio")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Key Achievements</Label>
                <div className="space-y-2">
                  {formData.keyAchievements?.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex-1">
                        {achievement}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an achievement"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAchievement}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="space-y-2">
                  {formData.certifications?.map((certification, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="flex-1">
                        {certification}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCertification()
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCertification}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Qualifications</Label>
                <div className="space-y-2">
                  {formData.additionalQualifications?.map(
                    (qualification, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1">
                          {qualification}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQualification(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an additional qualification"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addQualification()
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addQualification}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  Review Your Profile
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {formData.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {formData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {formData.city}, {formData.province}, {formData.country}
                  </div>
                  <div>
                    <span className="font-medium">Qualification:</span>{" "}
                    {formData.qualification}
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span>{" "}
                    {formData.subject}
                  </div>
                  <div>
                    <span className="font-medium">Experience:</span>{" "}
                    {formData.yearsOfTeachingExperience} years
                  </div>
                  <div>
                    <span className="font-medium">PGCE:</span>{" "}
                    {formData.pgce ? "Yes" : "No"}
                  </div>
                </div>
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

export default TeacherProfileForm;
