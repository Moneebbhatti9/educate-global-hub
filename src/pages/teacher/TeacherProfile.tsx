import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Upload,
  Plus,
  Trash2,
  Download,
  Star,
  BookOpen,
  Languages,
  Shield,
  FileText,
  Building,
  AlertCircle,
  Edit,
  CloudCog,
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AddLanguageModal } from "@/components/Modals/add-language-modal";
import { AddExperienceModal } from "@/components/Modals/add-experience-modal";
import { AddQualificationModal } from "@/components/Modals/add-qualification-modal";
import { AddEducationModal } from "@/components/Modals/add-education-modal";
import { AddRefereeModal } from "@/components/Modals/add-referee-modal";
import { useAuth } from "@/contexts/AuthContext";
import { teacherProfileAPI, useCreateTeacherExperience, useUpdateTeacherExperience, useDeleteTeacherExperience, useCreateTeacherEducation, useUpdateTeacherEducation, useDeleteTeacherEducation, useCreateTeacherQualification, useUpdateTeacherQualification, useDeleteTeacherQualification, Experience, Qualification } from "@/apis/profiles";
import { TeacherProfile as TeacherProfileType } from "@/types/profiles";
import { TeacherProfileSkeleton } from "@/components/skeletons";
import { ProfileSummaryModal } from "@/components/Modals/profile-summary-modal";



interface Education {
  id?: string;
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  thesis?: string;
  honors?: string;
  type?: "University" | "School" | "Professional";
}

interface Language {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Beginner";
}

const TeacherProfile = () => {
  const { user } = useAuth();
  const createExperience = useCreateTeacherExperience();
  const updateExperience = useUpdateTeacherExperience();
  const deleteExperience = useDeleteTeacherExperience();
  const createEducation = useCreateTeacherEducation();
  const updateEducation = useUpdateTeacherEducation();
  const deleteEducation = useDeleteTeacherEducation();
  const createQualification = useCreateTeacherQualification();
  const updateQualification = useUpdateTeacherQualification();
  const deleteQualification = useDeleteTeacherQualification();
  const [activeTab, setActiveTab] = useState("overview");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);

  // Fetch teacher profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        console.log("No user ID available");
        return;
      }

      console.log("Fetching profile for user ID:", user.id);
      setIsLoading(true);
      setError(null);

      try {
        const response = await teacherProfileAPI.getById(user.id);
        console.log("Profile API response:", response);

        if (response.success && response.data) {
          // Update the profile state with fetched data
          const fetchedProfile = response.data;
          console.log("Fetched profile data:", fetchedProfile);

          // Map API response to profile schema
          setProfile((prevProfile) => ({
            ...prevProfile,
            personalInfo: {
              ...prevProfile.personalInfo,
              firstName:
                fetchedProfile.user?.firstName ||
                fetchedProfile.fullName?.split(" ")[0] ||
                "",
              lastName:
                fetchedProfile.user?.lastName ||
                fetchedProfile.fullName?.split(" ").slice(1).join(" ") ||
                "",
              email: fetchedProfile.user?.email || "",
              phone: fetchedProfile.phoneNumber || "",
              address: {
                ...prevProfile.personalInfo.address,
                city: fetchedProfile.city || "",
                state: fetchedProfile.province || "",
                country: fetchedProfile.country || "",
                postalCode: fetchedProfile.zipCode || "",
              },
            },
            bio: fetchedProfile.professionalBio || "",
            subjects: fetchedProfile.subject ? [fetchedProfile.subject] : [],
            yearsOfExperience: fetchedProfile.yearsOfTeachingExperience || 0,
            qualifications: fetchedProfile.qualifications || [],
            profileCompletion: fetchedProfile.profileCompletion || 0,
            isProfileComplete: fetchedProfile.isProfileComplete || false,
            pgce: fetchedProfile.pgce || false,
            keyAchievements: fetchedProfile.keyAchievements || [],
            certifications: fetchedProfile.certifications || [],
            employment: fetchedProfile.employment || [],
            education: fetchedProfile.education || [],
            referees: fetchedProfile.referees || [],
            development: fetchedProfile.development || [],
            memberships: fetchedProfile.memberships || [],
          }));
          
          // Update local state with fetched data
          setEducations(fetchedProfile.education || []);
          setExperiences(fetchedProfile.employment || []);
          // Initialize qualifications as empty array for now - will be populated via API calls
          setQualifications([]);
        } else {
          console.log("API response not successful:", response);
        }
      } catch (err) {
        console.error("Error fetching teacher profile:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showRefereeModal, setShowRefereeModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Reset editingItem when qualification modal is closed
  useEffect(() => {
    if (!showQualificationModal) {
      setEditingItem(null);
    }
  }, [showQualificationModal]);

  // Define profile type based on API response
  type ProfileData = {
    personalInfo: {
      firstName: string;
      lastName: string;
      title: string;
      email: string;
      phone: string;
      alternatePhone: string;
      dateOfBirth: string;
      placeOfBirth: string;
      nationality: string;
      passportNo: string;
      gender: string;
      maritalStatus: string;
      linkedIn: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
      };
    };
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
    subjects: string[];
    yearsOfExperience: number;
    qualifications: Qualification[];
    profileCompletion: number;
    isProfileComplete: boolean;
    pgce: boolean;
    keyAchievements: string[];
    certifications: string[];
    employment: any[];
    education: any[];
    referees: any[];
    development: any[];
    memberships: any[];
  };

  // Empty profile data structure
  const [profile, setProfile] = useState<ProfileData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      nationality: "",
      passportNo: "",
      gender: "",
      maritalStatus: "",
      linkedIn: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
    bio: "",
    professionalSummary: "",
    careerObjectives: "",
    subjects: [],
    yearsOfExperience: 0,
    qualifications: [] as Qualification[],
    profileCompletion: 0,
    isProfileComplete: false,
    pgce: false,
    keyAchievements: [],
    certifications: [],
    employment: [],
    education: [],
    referees: [],
    development: [],
    memberships: [],
  });





  const handleSaveLanguage = (language: Language) => {
    if (editingItem) {
      setLanguages(languages.map((l) => (l.id === language.id ? language : l)));
    } else {
      setLanguages([...languages, language]);
    }
    setEditingItem(null);
  };

  const handleSaveExperience = async (experience: Experience) => {
    try {
      // Update local state with the new experience
      if (editingItem) {
        setExperiences(
          experiences.map((e) => (e.id === experience.id ? experience : e))
        );
      } else {
        setExperiences([...experiences, experience]);
      }
      setEditingItem(null);

      // You can add a success toast here
      console.log("Experience saved successfully:", experience);
    } catch (error) {
      console.error("Failed to save experience:", error);
      // You can add an error toast here
    }
  };

  const handleDeleteEmployment = async (employmentId: string) => {
    try {
      const response = await deleteExperience.mutateAsync(employmentId);

      if (response.success) {
        // You can add a success toast here
        console.log("Employment deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to delete employment:", error);
      // You can add an error toast here
    }
  };

  const handleSaveEducation = async (education: Education) => {
    try {
      let response;
      
      if (editingItem && (education._id || education.id)) {
        // Update existing education
        const educationId = education._id || education.id;
        if (educationId) {
          response = await updateEducation.mutateAsync({
            educationId,
            data: education
          });
        }
      } else {
        // Create new education
        response = await createEducation.mutateAsync(education);
      }

      if (response.success && response.data) {
        // Update local state with the new education
        if (editingItem) {
          setEducations(
            educations.map((e) => (e.id === education.id || e._id === education._id ? education : e))
          );
        } else {
          setEducations([...educations, education]);
        }
        setEditingItem(null);

        // You can add a success toast here
        console.log("Education saved successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to save education:", error);
      // You can add an error toast here
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      const response = await deleteEducation.mutateAsync(educationId);

      if (response.success) {
        // You can add a success toast here
        console.log("Education deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to delete education:", error);
      // You can add an error toast here
    }
  };

  const handleSaveQualification = async (qualification: Qualification) => {
    try {
      // Update local state with the new qualification
      if (editingItem) {
        setQualifications(
          qualifications.map((q) => (q.id === qualification.id || q._id === qualification._id ? qualification : q))
        );
      } else {
        setQualifications([...qualifications, qualification]);
      }
      setEditingItem(null);

      // You can add a success toast here
      console.log("Qualification saved successfully:", qualification);
    } catch (error) {
      console.error("Failed to save qualification:", error);
      // You can add an error toast here
    }
  };

  const handleDeleteQualification = async (qualificationId: string) => {
    try {
      const response = await deleteQualification.mutateAsync(qualificationId);

      if (response.success) {
        // Remove from local state
        setQualifications(qualifications.filter(q => q._id !== qualificationId && q.id !== qualificationId));
        // You can add a success toast here
        console.log("Qualification deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to delete qualification:", error);
      // You can add an error toast here
    }
  };

  // Helper function to handle undefined/null values
  const getDisplayValue = (value: any, fallback: string = "Not Provided") => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return value;
  };

  const handleProfileSummaryUpdate = (data: {
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      bio: data.bio,
      professionalSummary: data.professionalSummary,
      careerObjectives: data.careerObjectives,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
 

      // Clear the original profile since changes are saved
      setOriginalProfile(null);
      setIsEditing(false);
      // You can add a success toast here
    } catch (error) {
      console.error('Error saving profile:', error);
      // You can add an error toast here
    } finally {
      setIsLoading(false);
    }
  };


  console.log("profile", profile);
  return (
    <DashboardLayout role="teacher">
      {/* Loading State */}
      {isLoading && <TeacherProfileSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/api/placeholder/120/120" />
                    <AvatarFallback className="text-2xl">SJ</AvatarFallback>
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
                    {getDisplayValue(
                      profile.personalInfo.firstName,
                      "First Name"
                    )}{" "}
                    {getDisplayValue(
                      profile.personalInfo.lastName,
                      "Last Name"
                    )}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-3">
                    {getDisplayValue(
                      profile.personalInfo.title,
                      "Professional Title"
                    )}
                  </p>
                  <p className="text-foreground max-w-2xl mb-4">
                    {getDisplayValue(profile.bio, "No bio available")}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.subjects.length > 0 ? (
                      profile.subjects.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-brand-primary/10 text-brand-primary"
                        >
                          {subject}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground"
                      >
                        No subjects specified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {getDisplayValue(
                        profile.personalInfo.address.city,
                        "City"
                      )}
                      ,{" "}
                      {getDisplayValue(
                        profile.personalInfo.address.state,
                        "State"
                      )}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {profile.yearsOfExperience > 0
                        ? `${profile.yearsOfExperience} years experience`
                        : "No experience specified"}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {getDisplayValue(
                        profile.personalInfo.email,
                        "Email not provided"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="hero">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs sm:text-sm">
                Personal
              </TabsTrigger>
              <TabsTrigger value="employment" className="text-xs sm:text-sm">
                Employment
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm">
                Education
              </TabsTrigger>
              <TabsTrigger
                value="qualifications"
                className="text-xs sm:text-sm"
              >
                Qualifications
              </TabsTrigger>
              <TabsTrigger value="development" className="text-xs sm:text-sm">
                Development
              </TabsTrigger>
              <TabsTrigger value="referees" className="text-xs sm:text-sm">
                Referees
              </TabsTrigger>
              <TabsTrigger value="additional" className="text-xs sm:text-sm">
                Additional
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Profile Summary Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Professional Summary
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
                    <h4 className="font-semibold mb-2">Professional Bio</h4>
                    <p className="text-sm text-muted-foreground">
                      {getDisplayValue(profile.bio, "No bio available")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">
                      Quick Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-semibold">
                        {profile.yearsOfExperience > 0
                          ? `${profile.yearsOfExperience} years`
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subjects</span>
                      <span className="font-semibold">
                        {profile.subjects.length > 0
                          ? profile.subjects.length
                          : "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Qualifications
                      </span>
                      <span className="font-semibold">
                        {qualifications.length > 0
                          ? qualifications.length
                          : "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">PGCE</span>
                      <span className="font-semibold">
                        {profile.pgce ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Key Achievements
                      </span>
                      <span className="font-semibold">
                        {profile.keyAchievements.length > 0
                          ? profile.keyAchievements.length
                          : "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Profile Complete
                      </span>
                      <span className="font-semibold text-brand-accent-green">
                        {profile.profileCompletion}%
                      </span>
                    </div>
                    <Progress
                      value={profile.profileCompletion}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                {/* Key Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <Award className="w-5 h-5 mr-2 text-brand-accent-orange" />
                      Key Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.keyAchievements.length > 0 ? (
                      <>
                        {profile.keyAchievements
                          .slice(0, 3)
                          .map((achievement, index) => (
                            <div
                              key={index}
                              className="p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="font-medium text-sm">
                                {achievement}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Achievement
                              </div>
                            </div>
                          ))}
                        <Button variant="outline" size="sm" className="w-full">
                          View All Achievements
                        </Button>
                      </>
                    ) : (
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">
                          No achievements added yet
                        </div>
                      </div>
                    )}
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
                        {getDisplayValue(
                          profile.personalInfo.phone,
                          "Phone not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {getDisplayValue(
                          profile.personalInfo.email,
                          "Email not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {getDisplayValue(
                          profile.personalInfo.address.city,
                          "City"
                        )}
                        ,{" "}
                        {getDisplayValue(
                          profile.personalInfo.address.country,
                          "Country"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-brand-primary cursor-pointer hover:underline">
                        {getDisplayValue(
                          profile.personalInfo.linkedIn,
                          "LinkedIn not provided"
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Details & Contact Information
                    </CardTitle>
                    <div className="flex space-x-2">
                      {isEditing && (
                        <>
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={handleSaveProfile}
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!isEditing) {
                            setOriginalProfile(JSON.parse(JSON.stringify(profile)));
                            setIsEditing(true);
                          } else {
                            if (originalProfile) {
                              setProfile(originalProfile);
                            }
                            setIsEditing(false);
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit profile'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditing && (
                      <div className="col-span-full mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700">
                            <Edit className="w-4 h-4 inline mr-2" />
                            You are now editing your personal information. Click "Save Changes" to save or "Cancel" to discard changes.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={profile.personalInfo.firstName}
                          placeholder="Enter first name"
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                firstName: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profile.personalInfo.lastName}
                          placeholder="Enter last name"
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                lastName: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={profile.personalInfo.title}
                          placeholder="Enter professional title"
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                title: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <DatePicker
                          id="dateOfBirth"
                          value={
                            profile.personalInfo.dateOfBirth
                              ? new Date(profile.personalInfo.dateOfBirth)
                              : undefined
                          }
                          onValueChange={(date) => {
                            if (date) {
                              setProfile((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  dateOfBirth: date.toISOString().split("T")[0],
                                },
                              }));
                            }
                          }}
                          placeholder="Select date of birth"
                          disabled={!isEditing}
                          max={new Date()}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <Input
                          id="placeOfBirth"
                          value={profile.personalInfo.placeOfBirth}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                placeOfBirth: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select
                          disabled={!isEditing}
                          value={profile.personalInfo.nationality}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                nationality: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
                            <SelectValue
                              placeholder={profile.personalInfo.nationality}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="american">American</SelectItem>
                            <SelectItem value="british">British</SelectItem>
                            <SelectItem value="canadian">Canadian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Primary Phone *</Label>
                        <Input
                          id="phone"
                          value={profile.personalInfo.phone}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                phone: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="alternatePhone">Alternate Phone</Label>
                        <Input
                          id="alternatePhone"
                          value={profile.personalInfo.alternatePhone}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                alternatePhone: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.personalInfo.email}
                          readOnly={true}
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportNo">Passport Number</Label>
                        <Input
                          id="passportNo"
                          value={profile.personalInfo.passportNo}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                passportNo: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          disabled={!isEditing}
                          value={profile.personalInfo.gender}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                gender: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
                            <SelectValue
                              placeholder={profile.personalInfo.gender}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select
                          disabled={!isEditing}
                          value={profile.personalInfo.maritalStatus}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                maritalStatus: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
                            <SelectValue
                              placeholder={profile.personalInfo.maritalStatus}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Address Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={profile.personalInfo.address.street}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                address: {
                                  ...prev.personalInfo.address,
                                  street: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.personalInfo.address.city}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                address: {
                                  ...prev.personalInfo.address,
                                  city: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={profile.personalInfo.address.state}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                address: {
                                  ...prev.personalInfo.address,
                                  state: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          disabled={!isEditing}
                          value={profile.personalInfo.address.country}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                address: {
                                  ...prev.personalInfo.address,
                                  country: value,
                                },
                              },
                            }))
                          }
                        >
                          <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
                            <SelectValue
                              placeholder={profile.personalInfo.address.country}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={profile.personalInfo.address.postalCode}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                address: {
                                  ...prev.personalInfo.address,
                                  postalCode: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={profile.personalInfo.linkedIn}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                linkedIn: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Languages */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Languages className="w-5 h-5 mr-2" />
                        Languages Spoken
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLanguageModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {languages.length > 0 ? (
                        languages.map((lang, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span>
                              {lang.language} ({lang.proficiency})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 border rounded-lg text-center text-muted-foreground">
                          No languages added yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment History Tab */}
            <TabsContent value="employment" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Employment History
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setShowExperienceModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Position
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.employment?.map((job: any, index: number) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {job.title || job.position}
                          </h3>
                          <p className="text-muted-foreground">
                            {job.employer || job.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {job.startDate?.split('T')[0]} - {job.endDate?.split('T')[0] || "Present"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteEmployment(job._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Job Description</Label>
                          <Textarea
                            value={job.responsibilities || job.description}
                            rows={4}
                            readOnly={true}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Educational Background
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setShowEducationModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {educations.length === 0 ? (
                    <p className="text-muted-foreground">
                      No education details added yet. Click "Add Education" to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {educations.map((education: Education, index: number) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {education.degree}
                              </h3>
                              <p className="text-muted-foreground">
                                {education.institution}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {education.field && `${education.field} • `}
                                {education.startDate} - {education.endDate}
                                {education.gpa && ` • GPA: ${education.gpa}`}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(education);
                                  setShowEducationModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteEducation(education._id || education.id || "")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {(education.thesis || education.honors) && (
                            <div className="space-y-3">
                              {education.thesis && (
                                <div>
                                  <Label className="text-sm font-medium">Thesis/Project</Label>
                                  <p className="text-sm text-muted-foreground">{education.thesis}</p>
                                </div>
                              )}
                              {education.honors && (
                                <div>
                                  <Label className="text-sm font-medium">Honors & Awards</Label>
                                  <p className="text-sm text-muted-foreground">{education.honors}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications" className="space-y-6">
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Teacher Qualifications & Certifications
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setShowQualificationModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Qualification
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.qualifications.length === 0 ? (
                    <p className="text-muted-foreground">
                      No qualifications added yet. Click "Add Qualification" to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {profile.qualifications.map((qualification) => {
                        console.log(qualification);
                        return(
                        <div
                          key={qualification._id || qualification.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{qualification.title}</h4>
                                {qualification.certificationId && (
                                  <Badge variant="secondary" className="text-xs">
                                    ID: {qualification.certificationId}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {qualification.institution}
                              </p>
                              {qualification.subject && (
                                <p className="text-sm text-muted-foreground">
                                  Subject: {qualification.subject}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {qualification.issueDate && (
                                  <span>Issued: {qualification.issueDate}</span>
                                )}
                                {qualification.expiryDate && (
                                  <span>Expires: {qualification.expiryDate}</span>
                                )}
                              </div>
                              {qualification.ageRanges && qualification.ageRanges.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {qualification.ageRanges.map((range, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {range}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {qualification.description && (
                                <p className="text-sm text-muted-foreground">
                                  {qualification.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(qualification);
                                  setShowQualificationModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteQualification(qualification._id || qualification.id || "")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Professional Summary
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
                <CardContent>
                  <p className="text-muted-foreground">
                    Professional development, courses, and memberships
                    section...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referees" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Professional Referees
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setShowRefereeModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Referee
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Professional references section...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">
                      Travel Plans & Dependents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Travel plans and dependent information...
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">
                      Extracurricular Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Extracurricular activities and achievements...
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      CV Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Upload your CV (PDF or DOC format)
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Modals */}
          <AddLanguageModal
            open={showLanguageModal}
            onOpenChange={setShowLanguageModal}
            onSave={handleSaveLanguage}
            editingLanguage={editingItem}
          />

          <AddExperienceModal
            open={showExperienceModal}
            onOpenChange={setShowExperienceModal}
            onSave={handleSaveExperience}
            editingExperience={editingItem}
          />

          <AddQualificationModal
            open={showQualificationModal}
            onOpenChange={setShowQualificationModal}
            onSave={handleSaveQualification}
            editingQualification={editingItem}
          />

          <AddEducationModal
            open={showEducationModal}
            onOpenChange={setShowEducationModal}
            onSave={handleSaveEducation}
            editingEducation={editingItem}
          />

          <AddRefereeModal
            open={showRefereeModal}
            onOpenChange={setShowRefereeModal}
            onSave={() => { }}
            editingReferee={editingItem}
          />

          <ProfileSummaryModal
            open={showSummaryModal}
            onOpenChange={setShowSummaryModal}
            onSave={handleProfileSummaryUpdate}
            initialData={{
              bio: profile.bio,
              professionalSummary: profile.professionalSummary,
              careerObjectives: profile.careerObjectives,
            }}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherProfile;
