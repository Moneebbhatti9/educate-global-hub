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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Users,
  Upload,
  Edit,
  Plus,
  Trash2,
  Download,
  Star,
  BookOpen,
  Award,
  Shield,
  FileText,
  GraduationCap,
  Target,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { ProfileSummaryModal } from "@/components/Modals/profile-summary-modal";
import { AddProgramModal } from "@/components/Modals/add-program-modal";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";
import { useSchoolProfileQueries, Program, useUpdateSchoolProfile } from "@/apis/profiles";

// Schema for school information validation
const schoolInfoSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolEmail: z.string().email("Valid email is required"),
  schoolContactNumber: z.string().min(1, "Contact number is required"),
  alternateContact: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  schoolWebsite: z.string().optional(),
  establishedYear: z.string().min(1, "Established year is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
});



const SchoolProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);

  // School profile API hook
  const { 
    useCurrentSchoolProfile, 
    useCreateSchoolProgram, 
    useUpdateSchoolProgram, 
    useDeleteSchoolProgram 
  } = useSchoolProfileQueries();
  const { data: schoolProfileData, isLoading, error, refetch } = useCurrentSchoolProfile();
  
  // Program mutations
  const createProgramMutation = useCreateSchoolProgram();
  const updateProgramMutation = useUpdateSchoolProgram();
  const deleteProgramMutation = useDeleteSchoolProgram();
  
  // School profile update mutation
  const updateSchoolProfile = useUpdateSchoolProfile();
  
  // Error state for profile updates
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Log API states for debugging
  useEffect(() => {
    if (error) {
      console.error("School profile API error:", error);
    }
  }, [error]);

  // Modal states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | undefined>(undefined);

  // Initial empty profile state - will be populated by API
  const [profile, setProfile] = useState<{
    schoolInfo: {
      schoolName: string;
      schoolEmail: string;
      schoolContactNumber: string;
      alternateContact: string;
      country: string;
      city: string;
      state: string;
      zipCode: string;
      address: string;
      schoolWebsite: string;
      establishedYear: string;
      registrationNumber: string;
    };
    curriculum: string[];
    schoolSize: string;
    schoolType: string;
    genderType: string;
    ageGroup: string[];
    aboutSchool: string;
    professionalSummary: string;
    mission: string;
    vision: string;
    careerObjectives: string;
  }>({
    schoolInfo: {
      schoolName: "",
      schoolEmail: "",
      schoolContactNumber: "",
      alternateContact: "",
      country: "",
      city: "",
      state: "",
      zipCode: "",
      address: "",
      schoolWebsite: "",
      establishedYear: "",
      registrationNumber: "",
    },
    curriculum: [],
    schoolSize: "",
    schoolType: "",
    genderType: "",
    ageGroup: [],
    aboutSchool: "",
    professionalSummary: "",
    mission: "",
    vision: "",
    careerObjectives: "",
  });

  // Store original profile for cancellation
  const [originalProfile, setOriginalProfile] = useState(profile);

  // Form validation hooks
  const schoolInfoForm = useFormValidation({
    schema: schoolInfoSchema,
    defaultValues: profile.schoolInfo,
  });

  // Update form values when profile changes
  useEffect(() => {
    schoolInfoForm.reset(profile.schoolInfo);
  }, [profile.schoolInfo]);

  // Fetch school profile data on component mount
  useEffect(() => {
    console.log("Fetching school profile data...");
    refetch();
  }, [refetch]);

  // Update profile state when API data is received
  useEffect(() => {
    if (schoolProfileData?.success && schoolProfileData.data) {
      console.log("School profile data received:", schoolProfileData.data);
      const apiData = schoolProfileData.data;

      // Create new profile with all API data
      const newProfile = {
        schoolInfo: {
          schoolName: apiData.schoolName || "",
          schoolEmail: apiData.schoolEmail || "",
          schoolContactNumber: apiData.schoolContactNumber || "",
          alternateContact: apiData.alternateContact || "",
          country: apiData.country || "",
          city: apiData.city || "",
          state: apiData.province || "", // API uses 'province' but UI uses 'state'
          zipCode: apiData.zipCode || "",
          address: apiData.address || "",
          schoolWebsite: apiData.schoolWebsite || "",
          establishedYear: apiData.establishedYear || "",
          registrationNumber: apiData.registrationNumber || "",
        },
        curriculum: apiData.curriculum || [],
        schoolSize: apiData.schoolSize || "",
        schoolType: apiData.schoolType || "",
        genderType: apiData.genderType || "",
        ageGroup: apiData.ageGroup || [],
        aboutSchool: apiData.aboutSchool || "",
        professionalSummary: "",
        mission: "",
        vision: "",
        careerObjectives: "",
      };

      // Set both current and original profile
      setProfile(newProfile);
      setOriginalProfile(newProfile);

      // Update programs if they exist in API response
      if (apiData.programs && Array.isArray(apiData.programs)) {
        setPrograms(apiData.programs);
      }
    }
  }, [schoolProfileData]);

    // Save handlers for each section
  const handleSaveSchoolInfo = async () => {
    try {
      const isValid = await schoolInfoForm.trigger();
      if (!isValid) return;

      setUpdateError(null);
      const formData = schoolInfoForm.getValues();
      
      // Prepare the payload for the API
      const updatePayload = {
        schoolName: formData.schoolName,
        schoolEmail: formData.schoolEmail,
        schoolContactNumber: formData.schoolContactNumber,
        alternateContact: formData.alternateContact || "",
        country: formData.country,
        city: formData.city,
        province: formData.state, // API uses 'province' but UI uses 'state'
        zipCode: formData.zipCode,
        address: formData.address,
        schoolWebsite: formData.schoolWebsite || "",
        establishedYear: formData.establishedYear,
        registrationNumber: formData.registrationNumber,
      };

      // Call the API to update the profile
      const response = await updateSchoolProfile.mutateAsync(updatePayload);

      if (response.success) {
        const updatedProfile = {
          ...profile,
          schoolInfo: {
            ...formData,
            alternateContact: formData.alternateContact || "",
            schoolWebsite: formData.schoolWebsite || "",
          },
        };
        
        // Update both current and original profile
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        setIsEditing(false);
        
        console.log("School info updated successfully");
      } else {
        throw new Error(response.message || "Failed to update school info");
      }
    } catch (error) {
      console.error("Error saving school info:", error);
      setUpdateError(error instanceof Error ? error.message : "Failed to save school info");
    }
  };

  const handleSaveAcademics = async () => {
    try {
      // API call would go here
      console.log("Saving academics data:", programs);
      // Success notification would go here
    } catch (error) {
      console.error("Error saving academics data:", error);
    }
  };

  // Modal handlers
  const handleProfileSummaryUpdate = async (data: {
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
  }) => {
    try {
      setUpdateError(null);

      // Prepare the payload with only the about school
      const updatePayload = {
        aboutSchool: data.bio,
      };

      // Call the API to update the profile
      const response = await updateSchoolProfile.mutateAsync(updatePayload);

      if (response.success) {
        // Update local state
        setProfile((prev) => ({
          ...prev,
          aboutSchool: data.bio,
          professionalSummary: data.professionalSummary,
          careerObjectives: data.careerObjectives,
        }));
        
        // Close the modal
        setShowSummaryModal(false);
        console.log("School summary updated successfully");
      } else {
        throw new Error(response.message || "Failed to update school summary");
      }
    } catch (error) {
      console.error("Error updating school summary:", error);
      setUpdateError(error instanceof Error ? error.message : "Failed to update school summary");
    }
  };

  const handleSaveProgram = async (program: Program) => {
    try {
      if (editingProgram) {
        // Update existing program
        const programId = editingProgram._id || editingProgram.id;
        if (programId) {
                  await updateProgramMutation.mutateAsync({
          programId,
          data: {
            programName: program.programName,
            educationLevel: program.educationLevel,
            curriculum: program.curriculum,
            ageRange: program.ageRange,
            coreSubjects: program.coreSubjects,
            description: program.description,
            admissionRequirements: program.admissionRequirements,
            isActive: program.isActive,
          },
        });
        }
      } else {
        // Create new program
        await createProgramMutation.mutateAsync({
          programName: program.programName,
          educationLevel: program.educationLevel,
          curriculum: program.curriculum,
          ageRange: program.ageRange,
          coreSubjects: program.coreSubjects,
          description: program.description,
          admissionRequirements: program.admissionRequirements,
          isActive: program.isActive,
        });
      }
      
      setEditingProgram(undefined);
      setShowProgramModal(false);
      // Refresh profile data to get updated programs
      refetch();
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const removeProgram = async (id: string) => {
    try {
      if (id) {
        await deleteProgramMutation.mutateAsync(id);
        // Refresh profile data to get updated programs
        refetch();
      }
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  const editProgram = (program: Program) => {
    setEditingProgram(program);
    setShowProgramModal(true);
  };

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading school profile...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-destructive mb-4">Failed to load school profile</p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* School Header */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/api/placeholder/120/120" />
                      <AvatarFallback className="text-2xl">LIA</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-2">
                      {profile.schoolInfo.schoolName}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-3">
                      {profile.schoolType} • {profile.schoolSize} • Est.{" "}
                      {profile.schoolInfo.establishedYear}
                    </p>
                    <p className="text-foreground max-w-3xl mb-4">
                      {profile.aboutSchool}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.curriculum.map((curr, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-brand-primary/10 text-brand-primary"
                        >
                          {curr}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.schoolInfo.city}, {profile.schoolInfo.state}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {profile.genderType} • {profile.ageGroup.length} age groups
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {profile.schoolInfo.schoolWebsite}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">

                    <Button variant="hero">
                      <Download className="w-4 h-4 mr-2" />
                      School Brochure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 h-auto p-1">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="school-info" className="text-xs sm:text-sm">
                  School Info
                </TabsTrigger>
                <TabsTrigger value="academics" className="text-xs sm:text-sm">
                  Academics
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs sm:text-sm">
                  Media
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* School Summary Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        School Summary & Vision
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSummaryModal(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Summary
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">About Our School</h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.aboutSchool}
                      </p>
                    </div>

                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">
                        School Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Established</span>
                        <span className="font-semibold">
                          {profile.schoolInfo.establishedYear}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-semibold">{profile.schoolType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-semibold">{profile.schoolSize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Profile Complete
                        </span>
                        <span className="font-semibold text-brand-accent-green">
                          92%
                        </span>
                      </div>
                      <Progress value={92} className="mt-2" />
                    </CardContent>
                  </Card>

                  {/* Mission & Vision */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg flex items-center">
                        <Target className="w-5 h-5 mr-2 text-brand-accent-orange" />
                        Mission & Vision
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Mission</h4>
                        <p className="text-sm text-muted-foreground">
                          {profile.mission}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Vision</h4>
                        <p className="text-sm text-muted-foreground">
                          {profile.vision}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {profile.schoolInfo.schoolContactNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {profile.schoolInfo.schoolEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {profile.schoolInfo.address}, {profile.schoolInfo.city}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-brand-primary cursor-pointer hover:underline">
                          {profile.schoolInfo.schoolWebsite}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Curriculum Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Academic Programs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.curriculum.map((curr, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{curr}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ages 6-18
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Age Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Student Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {profile.ageGroup.map((age, index) => (
                        <div
                          key={index}
                          className="text-center p-4 border rounded-lg"
                        >
                          <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Users className="w-6 h-6 text-brand-secondary" />
                          </div>
                          <h3 className="font-semibold text-sm">{age}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            250+ students
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* School Information Tab */}
              <TabsContent value="school-info" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        School Details & Contact Information
                      </CardTitle>
                                             <div className="flex gap-2">
                         {!isEditing ? (
                           <Button
                             variant="outline"
                             onClick={() => setIsEditing(true)}
                           >
                             <Edit className="w-4 h-4 mr-2" />
                             Edit Information
                           </Button>
                         ) : (
                           <>
                             <Button
                               variant="outline"
                               onClick={handleSaveSchoolInfo}
                               disabled={updateSchoolProfile.isPending}
                             >
                               {updateSchoolProfile.isPending ? (
                                 <>
                                   <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                   Saving...
                                 </>
                               ) : (
                                 <>
                                   <Save className="w-4 h-4 mr-2" />
                                   Save Changes
                                 </>
                               )}
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 setIsEditing(false);
                                 // Restore original values on cancel
                                 setProfile(originalProfile);
                                 schoolInfoForm.reset(originalProfile.schoolInfo);
                               }}
                             >
                               Cancel
                             </Button>
                           </>
                         )}
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {updateError && (
                      <div className="mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-700">
                            {updateError}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="schoolName">School Name *</Label>
                          <Input
                            id="schoolName"
                            {...schoolInfoForm.register("schoolName")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("schoolName") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("schoolName") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("schoolName")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="schoolEmail">School Email *</Label>
                          <Input
                            id="schoolEmail"
                            type="email"
                            {...schoolInfoForm.register("schoolEmail")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("schoolEmail") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("schoolEmail") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("schoolEmail")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="schoolContactNumber">Contact Number *</Label>
                          <Input
                            id="schoolContactNumber"
                            {...schoolInfoForm.register("schoolContactNumber")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("schoolContactNumber") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("schoolContactNumber") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("schoolContactNumber")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="alternateContact">Alternate Contact</Label>
                          <Input
                            id="alternateContact"
                            {...schoolInfoForm.register("alternateContact")}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="schoolWebsite">School Website</Label>
                          <Input
                            id="schoolWebsite"
                            {...schoolInfoForm.register("schoolWebsite")}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="establishedYear">Established Year *</Label>
                          <Input
                            id="establishedYear"
                            {...schoolInfoForm.register("establishedYear")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("establishedYear") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("establishedYear") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("establishedYear")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="registrationNumber">Registration Number *</Label>
                          <Input
                            id="registrationNumber"
                            {...schoolInfoForm.register("registrationNumber")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("registrationNumber") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("registrationNumber") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("registrationNumber")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            {...schoolInfoForm.register("address")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("address") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("address") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("address")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            {...schoolInfoForm.register("city")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("city") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("city") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("city")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="state">State/Province *</Label>
                          <Input
                            id="state"
                            {...schoolInfoForm.register("state")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("state") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("state") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("state")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            {...schoolInfoForm.register("country")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("country") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("country") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("country")}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="zipCode">Zip Code *</Label>
                          <Input
                            id="zipCode"
                            {...schoolInfoForm.register("zipCode")}
                            disabled={!isEditing}
                            className={schoolInfoForm.isFieldInvalid("zipCode") ? "border-destructive" : ""}
                          />
                          {schoolInfoForm.isFieldInvalid("zipCode") && (
                            <p className="text-sm text-destructive mt-1">
                              {schoolInfoForm.getFieldError("zipCode")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academics Tab */}
              <TabsContent value="academics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Academic Programs
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProgram(undefined);
                          setShowProgramModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Program
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {programs.map((program) => (
                        <div key={program._id || program.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{program.programName}</h3>
                              <p className="text-brand-primary font-medium">
                                {program.curriculum} • {program.educationLevel}
                              </p>
                              <p className="text-sm text-muted-foreground mb-2">
                                Age Range: {program.ageRange} • Education Level: {program.educationLevel}
                              </p>
                              {program.isActive !== undefined && (
                                <div className="flex items-center mb-2">
                                  <Badge 
                                    variant={program.isActive ? "default" : "secondary"}
                                    className={program.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                  >
                                    {program.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              )}
                              <p className="text-sm mb-3">{program.description}</p>

                              {program.coreSubjects && program.coreSubjects.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="font-medium text-sm mb-2">Core Subjects:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {program.coreSubjects.map((subject, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {subject}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {program.admissionRequirements && program.admissionRequirements.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Admission Requirements:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {program.admissionRequirements.map((req, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editProgram(program)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="text-destructive"
                                  size="sm"
                                  onClick={() => removeProgram(program._id || program.id || "")}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </div>
                          
                        </div>
                      ))}
                      {programs.length === 0 && (
                        <div className="text-center py-12">
                          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-semibold mb-2">No academic programs</h3>
                          <p className="text-muted-foreground mb-4">
                            Add your school's academic programs and curricula.
                          </p>
                          {isEditing && (
                            <Button
                              onClick={() => {
                                setEditingProgram(undefined);
                                setShowProgramModal(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Your First Program
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      School Media & Gallery
                    </CardTitle>
                    <CardDescription>
                      Upload photos, videos, and other media showcasing your school.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">Upload School Media</h3>
                      <p className="text-muted-foreground mb-4">
                        Add photos of campus, classrooms, events, and facilities
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Modals */}
        <ProfileSummaryModal
          open={showSummaryModal}
          onOpenChange={setShowSummaryModal}
          onSave={handleProfileSummaryUpdate}
          initialData={{
            bio: profile.aboutSchool,
            professionalSummary: profile.professionalSummary,
            careerObjectives: profile.careerObjectives,
          }}
          isLoading={updateSchoolProfile.isPending}
          error={updateError}
        />

        <AddProgramModal
          open={showProgramModal}
          onOpenChange={setShowProgramModal}
          onSave={handleSaveProgram}
          editingProgram={editingProgram}
        />
      </div>
    </DashboardLayout>
  );
};

export default SchoolProfile;