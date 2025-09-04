import { useState, useEffect } from "react";
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
  Building,
  MapPin,
  FileText,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { PhoneInput } from "../ui/phone-input";
import {
  SchoolProfileRequest,
  CURRICULUM_OPTIONS,
  SCHOOL_SIZE_OPTIONS,
  SCHOOL_TYPE_OPTIONS,
  GENDER_TYPE_OPTIONS,
  AGE_GROUP_OPTIONS,
} from "@/types/profiles";
import { schoolProfileApi } from "@/apis/profiles";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useFormValidation } from "@/hooks/useFormValidation";
import { schoolProfileFormSchema } from "@/helpers/validation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { customToast } from "@/components/ui/sonner";

interface SchoolProfileFormProps {
  onComplete: (profileData: SchoolProfileRequest) => void;
  onBack?: () => void;
  initialData?: Partial<SchoolProfileRequest>;
}

const SchoolProfileForm = ({
  onComplete,
  onBack,
  initialData,
}: SchoolProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newCurriculum, setNewCurriculum] = useState("");
  const [newAgeGroup, setNewAgeGroup] = useState("");
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
    schema: schoolProfileFormSchema,
    mode: "onTouched",
    defaultValues: {
      schoolName: initialData?.schoolName || "",
      schoolEmail: initialData?.schoolEmail || "",
      schoolContactNumber: initialData?.schoolContactNumber || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      province: initialData?.province || "",
      zipCode: initialData?.zipCode || "",
      address: initialData?.address || "",
      curriculum: initialData?.curriculum || [],
      schoolSize: initialData?.schoolSize || "Medium (501-1000 students)",
      schoolType: initialData?.schoolType || "Private",
      genderType: initialData?.genderType || "Mixed",
      ageGroup: initialData?.ageGroup || [],
      schoolWebsite: initialData?.schoolWebsite || "",
      aboutSchool: initialData?.aboutSchool || "",
    },
  });

  const formData = watch();

  // Pre-fill form with initial data when component mounts
  useEffect(() => {
    if (initialData) {
      // Pre-fill basic information that was collected during signup
      if (initialData.schoolEmail) {
        setValue("schoolEmail", initialData.schoolEmail);
      }
    }
  }, [initialData, setValue]);

  const addCurriculum = () => {
    if (
      newCurriculum.trim() &&
      !formData.curriculum.includes(newCurriculum.trim())
    ) {
      setValue("curriculum", [...formData.curriculum, newCurriculum.trim()]);
      setNewCurriculum("");
    }
  };

  const removeCurriculum = (index: number) => {
    setValue(
      "curriculum",
      formData.curriculum.filter((_, i) => i !== index)
    );
  };

  const addAgeGroup = () => {
    if (newAgeGroup.trim() && !formData.ageGroup.includes(newAgeGroup.trim())) {
      setValue("ageGroup", [...formData.ageGroup, newAgeGroup.trim()]);
      setNewAgeGroup("");
    }
  };

  const removeAgeGroup = (index: number) => {
    setValue(
      "ageGroup",
      formData.ageGroup.filter((_, i) => i !== index)
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

  const isStepComplete = (step: number) => {
    const currentFormData = watch();

    if (step === 1) {
      return !!(
        currentFormData.schoolName &&
        currentFormData.schoolEmail &&
        currentFormData.schoolContactNumber &&
        currentFormData.country &&
        currentFormData.city &&
        currentFormData.province &&
        currentFormData.zipCode &&
        currentFormData.address &&
        currentFormData.curriculum.length > 0 &&
        currentFormData.schoolSize &&
        currentFormData.schoolType &&
        currentFormData.genderType &&
        currentFormData.ageGroup.length > 0
      );
    } else if (step === 2) {
      return !!(
        currentFormData.aboutSchool && currentFormData.aboutSchool.length >= 100
      );
    }

    return true;
  };

  const validateCurrentStep = () => {
    const currentFormData = watch();

    // Validate only the current step
    if (currentStep === 1) {
      // Validate step 1 fields
      if (
        !currentFormData.schoolName ||
        !currentFormData.schoolEmail ||
        !currentFormData.schoolContactNumber ||
        !currentFormData.country ||
        !currentFormData.city ||
        !currentFormData.province ||
        !currentFormData.zipCode ||
        !currentFormData.address ||
        currentFormData.curriculum.length === 0 ||
        !currentFormData.schoolSize ||
        !currentFormData.schoolType ||
        !currentFormData.genderType ||
        currentFormData.ageGroup.length === 0
      ) {
        customToast.error(
          "Validation Error",
          "Please complete all required fields in Step 1 before proceeding."
        );
        return false;
      }
    } else if (currentStep === 2) {
      // Validate step 2 fields
      if (
        !currentFormData.aboutSchool ||
        currentFormData.aboutSchool.length < 100
      ) {
        customToast.error(
          "Validation Error",
          "Please complete all required fields in Step 2 before proceeding."
        );
        return false;
      }
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

  const onSubmit = async (data: SchoolProfileRequest) => {
    setIsLoading(true);
    try {
      await schoolProfileApi.createOrUpdate(data);

      // Show success toast
      customToast.success(
        "Profile Created Successfully!",
        "Your school profile has been created. Redirecting to dashboard..."
      );

      // Call the onComplete callback - navigation will be handled by ProfileCompletionPage
      onComplete(data);
    } catch (error) {
      console.error("Error creating school profile:", error);
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
        return <Building className="w-5 h-5" />;
      case 2:
        return <FileText className="w-5 h-5" />;
      case 3:
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Complete Your School Profile
        </h1>
        <p className="text-muted-foreground">
          Tell us more about your school to personalize your experience
        </p>
        <div className="flex items-center justify-center mt-6 space-x-4">
          <Badge variant="secondary" className="capitalize">
            School
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
                  step < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : step === currentStep
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
                {step === 2 && "About School"}
                {step === 3 && "Review"}
              </div>
              {/* Show completion status */}
              {step < currentStep && (
                <div className="mt-1 text-xs text-green-600 font-medium">
                  ✓ Complete
                </div>
              )}
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
          <CardTitle className="font-heading text-xl text-center">
            Complete Your School Profile
          </CardTitle>
          <CardDescription className="text-center">
            {initialData?.schoolEmail ? (
              <div className="space-y-2">
                <p>Welcome! Let's complete your school profile.</p>
                <p className="text-sm text-muted-foreground">
                  Some fields have been pre-filled based on your signup
                  information.
                </p>
              </div>
            ) : (
              "Fill in your school details to complete your profile"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Basic Info</span>
              <span>School Details</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    placeholder="Enter your school name"
                    {...register("schoolName")}
                    className={
                      isFieldInvalid("schoolName") ? "border-red-500" : ""
                    }
                    readOnly
                  />
                  {getFieldError("schoolName") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("schoolName")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">School Email *</Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    placeholder="info@school.edu"
                    {...register("schoolEmail")}
                    className={
                      isFieldInvalid("schoolEmail") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("schoolEmail") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("schoolEmail")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolContactNumber">
                    School Contact Number *
                  </Label>
                  <PhoneInput
                    id="schoolContactNumber"
                    placeholder="Enter school contact number"
                    value={formData.schoolContactNumber}
                    onChange={(value) =>
                      setValue("schoolContactNumber", value || "")
                    }
                    className={
                      isFieldInvalid("schoolContactNumber")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {getFieldError("schoolContactNumber") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("schoolContactNumber")}
                    </p>
                  )}
                </div>
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
                <Label htmlFor="address">School Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your school address"
                  {...register("address")}
                  className={isFieldInvalid("address") ? "border-red-500" : ""}
                />
                {getFieldError("address") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("address")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Curriculum *</Label>
                <div className="space-y-2">
                  {formData.curriculum.map((curriculum, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex-1">
                        {curriculum}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCurriculum(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Select
                      value={newCurriculum}
                      onValueChange={setNewCurriculum}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRICULUM_OPTIONS.map((curriculum) => (
                          <SelectItem key={curriculum} value={curriculum}>
                            {curriculum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCurriculum}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {getFieldError("curriculum") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("curriculum")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolSize">School Size *</Label>
                  <Select
                    value={formData.schoolSize}
                    onValueChange={(value) =>
                      setValue(
                        "schoolSize",
                        value as
                          | "Small (1-500 students)"
                          | "Medium (501-1000 students)"
                          | "Large (1001+ students)"
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("schoolSize") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOL_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("schoolSize") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("schoolSize")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolType">School Type *</Label>
                  <Select
                    value={formData.schoolType}
                    onValueChange={(value) =>
                      setValue(
                        "schoolType",
                        value as
                          | "Public"
                          | "Private"
                          | "International"
                          | "Charter"
                          | "Religious"
                          | "Other"
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("schoolType") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOL_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("schoolType") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("schoolType")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genderType">Gender Type *</Label>
                  <Select
                    value={formData.genderType}
                    onValueChange={(value) =>
                      setValue(
                        "genderType",
                        value as "Boys Only" | "Girls Only" | "Mixed"
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        isFieldInvalid("genderType") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select gender type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_TYPE_OPTIONS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("genderType") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("genderType")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Age Groups *</Label>
                <div className="space-y-2">
                  {formData.ageGroup.map((ageGroup, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="flex-1">
                        {ageGroup}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgeGroup(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Select value={newAgeGroup} onValueChange={setNewAgeGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_GROUP_OPTIONS.map((ageGroup) => (
                          <SelectItem key={ageGroup} value={ageGroup}>
                            {ageGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAgeGroup}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {getFieldError("ageGroup") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("ageGroup")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolWebsite">School Website</Label>
                <Input
                  id="schoolWebsite"
                  type="url"
                  placeholder="https://www.school.edu"
                  {...register("schoolWebsite")}
                  className={
                    isFieldInvalid("schoolWebsite") ? "border-red-500" : ""
                  }
                />
                {getFieldError("schoolWebsite") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("schoolWebsite")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: About School */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Validation Summary */}
              {!isStepComplete(2) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">
                    ⚠️ Please complete the following required fields:
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {(!formData.aboutSchool ||
                      formData.aboutSchool.length < 100) && (
                      <li>• About School (minimum 100 characters)</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="aboutSchool">About School *</Label>
                <Textarea
                  id="aboutSchool"
                  placeholder="Tell us about your school, its mission, values, and what makes it unique"
                  {...register("aboutSchool")}
                  rows={6}
                  className={
                    isFieldInvalid("aboutSchool") ? "border-red-500" : ""
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formData.aboutSchool.length}/2000 characters
                </p>
                {getFieldError("aboutSchool") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("aboutSchool")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  Review Your School Profile
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">School Name:</span>{" "}
                    {formData.schoolName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {formData.schoolEmail}
                  </div>
                  <div>
                    <span className="font-medium">Contact:</span>{" "}
                    {formData.schoolContactNumber}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {formData.city}, {formData.province}, {formData.country}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {formData.schoolType} - {formData.genderType}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>{" "}
                    {formData.schoolSize}
                  </div>
                  <div>
                    <span className="font-medium">Curriculum:</span>{" "}
                    {formData.curriculum.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Age Groups:</span>{" "}
                    {formData.ageGroup.join(", ")}
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

            <Button
              onClick={handleNext}
              variant="hero"
              disabled={isLoading || !isStepComplete(currentStep)}
              className={
                !isStepComplete(currentStep)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
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

          {/* Help text when Next button is disabled */}
          {!isStepComplete(currentStep) && currentStep < 3 && (
            <div className="mt-3 text-center">
              <p className="text-sm text-amber-600">
                Please complete all required fields in Step {currentStep} to
                continue
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolProfileForm;
