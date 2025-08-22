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
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AddLanguageModal } from "@/components/Modals/add-language-modal";
import { AddExperienceModal } from "@/components/Modals/add-experience-modal";
import { AddQualificationModal } from "@/components/Modals/add-qualification-modal";
import { AddEducationModal } from "@/components/Modals/add-education-modal";
import { AddRefereeModal } from "@/components/Modals/add-referee-modal";
import { useAuth } from "@/contexts/AuthContext";
import { teacherProfileAPI } from "@/apis/profiles";
import { TeacherProfile as TeacherProfileType } from "@/types/profiles";
import { TeacherProfileSkeleton } from "@/components/skeletons";

interface Experience {
  id: string;
  title: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  contactPerson?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  thesis?: string;
  honors?: string;
}

interface Language {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Beginner";
}

interface Qualification {
  id: string;
  title: string;
  institution: string;
  subject: string;
  certificationId: string;
  issueDate: string;
  expiryDate: string;
  ageRanges: string[];
  description?: string;
}

interface Referee {
  id: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description?: string;
}

interface Development {
  id: string;
  title: string;
  provider: string;
  type: "Course" | "Workshop" | "Conference" | "Seminar" | "Online Training" | "Other";
  duration: string;
  completionDate: string;
  skills: string[];
  impact: string;
  certificateUrl?: string;
}

interface Membership {
  id: string;
  organizationName: string;
  membershipType: "Full Member" | "Associate Member" | "Student Member" | "Honorary Member" | "Other";
  membershipId: string;
  joinDate: string;
  expiryDate: string;
  status: "Active" | "Inactive" | "Pending" | "Expired";
  benefits: string[];
  description?: string;
}

interface TravelPlan {
  id: string;
  dependentName: string;
  relationship: "Spouse" | "Child" | "Parent" | "Sibling" | "Other";
  age?: number;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  visaRequired: boolean;
  visaStatus?: "Not Applied" | "Applied" | "Approved" | "Denied";
  accommodationNeeds: string;
  medicalNeeds?: string;
  educationNeeds?: string;
  notes?: string;
}

interface Activity {
  id: string;
  name: string;
  type: "Club" | "Sport" | "Community Service" | "Leadership" | "Hobby" | "Volunteer Work" | "Other";
  role: string;
  organization?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skillsDeveloped: string[];
  timeCommitment: string;
}

const TeacherProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch teacher profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        return;
      }
      
      console.log('Fetching profile for user ID:', user.id);
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await teacherProfileAPI.getById(user.id);
        console.log('Profile API response:', response);
        
        if (response.success && response.data) {
          // Update the profile state with fetched data
          const fetchedProfile = response.data;
          console.log('Fetched profile data:', fetchedProfile);
          
          // Map API response to profile schema
          setProfile(prevProfile => ({
            ...prevProfile,
            personalInfo: {
              ...prevProfile.personalInfo,
              firstName: fetchedProfile.user?.firstName || fetchedProfile.fullName?.split(' ')[0] || "",
              lastName: fetchedProfile.user?.lastName || fetchedProfile.fullName?.split(' ').slice(1).join(' ') || "",
              email: fetchedProfile.user?.email || "",
              phone: fetchedProfile.phoneNumber || "",
              address: {
                ...prevProfile.personalInfo.address,
                city: fetchedProfile.city || "",
                state: fetchedProfile.province || "",
                country: fetchedProfile.country || "",
                postalCode: fetchedProfile.zipCode || "",
              }
            },
            bio: fetchedProfile.professionalBio || "",
            subjects: fetchedProfile.subject ? [fetchedProfile.subject] : [],
            yearsOfExperience: fetchedProfile.yearsOfTeachingExperience || 0,
            qualifications: fetchedProfile.additionalQualifications || [],
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
        } else {
          console.log('API response not successful:', response);
        }
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
        setError('Failed to load profile data');
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
    qualifications: string[];
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
    qualifications: [],
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

  // Form validation hooks
  const personalInfoForm = useFormValidation({
    schema: personalInfoSchema,
    defaultValues: profile.personalInfo,
  });

  // Save handlers for each section
  const handleSavePersonalInfo = async () => {
    try {
      const isValid = await personalInfoForm.trigger();
      if (!isValid) return;

      const formData = personalInfoForm.getValues();
      // API call would go here
      console.log("Saving personal info:", formData);
      
      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...formData,
          alternatePhone: formData.alternatePhone || "",
          linkedIn: formData.linkedIn || "",
        },
      }));
      
      // Success notification would go here
    } catch (error) {
      console.error("Error saving personal info:", error);
    }
  };

  const handleSaveEmployment = async () => {
    try {
      // API call would go here
      console.log("Saving employment data:", experiences);
      // Success notification would go here
    } catch (error) {
      console.error("Error saving employment data:", error);
    }
  };

  const handleSaveEducationData = async () => {
    try {
      // API call would go here
      console.log("Saving education data:", educations);
      // Success notification would go here
    } catch (error) {
      console.error("Error saving education data:", error);
    }
  };

  const handleSaveQualifications = async () => {
    try {
      // API call would go here
      console.log("Saving qualifications data:", qualifications);
      // Success notification would go here
    } catch (error) {
      console.error("Error saving qualifications data:", error);
    }
  };

  const handleSaveDevelopmentData = async () => {
    try {
      // API call would go here
      console.log("Saving development data:", { certifications, developments, memberships });
      // Success notification would go here
    } catch (error) {
      console.error("Error saving development data:", error);
    }
  };

  const handleSaveReferees = async () => {
    try {
      // API call would go here
      console.log("Saving referees data:", referees);
      // Success notification would go here
    } catch (error) {
      console.error("Error saving referees data:", error);
    }
  };

  const handleSaveAdditional = async () => {
    try {
      // API call would go here
      console.log("Saving additional data:", { languages, travelPlans, activities });
      // Success notification would go here
    } catch (error) {
      console.error("Error saving additional data:", error);
    }
  };

  // Modal handlers
  const handleSaveLanguage = (language: Language) => {
    if (editingItem) {
      setLanguages(languages.map((l) => (l.id === language.id ? language : l)));
    } else {
      setLanguages([...languages, language]);
    }
    setEditingItem(null);
  };

  const handleSaveExperience = (experience: Experience) => {
    if (editingItem) {
      setExperiences(
        experiences.map((e) => (e.id === experience.id ? experience : e))
      );
    } else {
      setExperiences([...experiences, experience]);
    }
    setEditingItem(null);
  };

  // Helper function to handle undefined/null values
  const getDisplayValue = (value: any, fallback: string = "Not Provided") => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return value;
  };

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
                   {getDisplayValue(profile.personalInfo.firstName, "First Name")}{" "}
                   {getDisplayValue(profile.personalInfo.lastName, "Last Name")}
                 </h1>
                 <p className="text-xl text-muted-foreground mb-3">
                   {getDisplayValue(profile.personalInfo.title, "Professional Title")}
                 </p>
                 <p className="text-foreground max-w-2xl mb-4">{getDisplayValue(profile.bio, "No bio available")}</p>

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
                     <Badge variant="secondary" className="bg-muted text-muted-foreground">
                       No subjects specified
                     </Badge>
                   )}
                 </div>

                                 <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                   <div className="flex items-center">
                     <MapPin className="w-4 h-4 mr-1" />
                     {getDisplayValue(profile.personalInfo.address.city, "City")},{" "}
                     {getDisplayValue(profile.personalInfo.address.state, "State")}
                   </div>
                   <div className="flex items-center">
                     <Briefcase className="w-4 h-4 mr-1" />
                     {profile.yearsOfExperience > 0 ? `${profile.yearsOfExperience} years experience` : "No experience specified"}
                   </div>
                   <div className="flex items-center">
                     <Mail className="w-4 h-4 mr-1" />
                     {getDisplayValue(profile.personalInfo.email, "Email not provided")}
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
            <TabsTrigger value="qualifications" className="text-xs sm:text-sm">
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
                <CardTitle className="font-heading text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                 <div>
                   <h4 className="font-semibold mb-2">Professional Bio</h4>
                   <p className="text-sm text-muted-foreground">{getDisplayValue(profile.bio, "No bio available")}</p>
                 </div>

                 <div>
                   <h4 className="font-semibold mb-2">Detailed Summary</h4>
                   <p className="text-sm text-muted-foreground">
                     {getDisplayValue(profile.professionalSummary, "No detailed summary available")}
                   </p>
                 </div>

                 <div>
                   <h4 className="font-semibold mb-2">Career Objectives</h4>
                   <p className="text-sm text-muted-foreground">
                     {getDisplayValue(profile.careerObjectives, "No career objectives specified")}
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
                       {profile.yearsOfExperience > 0 ? `${profile.yearsOfExperience} years` : "Not specified"}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Subjects</span>
                     <span className="font-semibold">
                       {profile.subjects.length > 0 ? profile.subjects.length : "None"}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">
                       Qualifications
                     </span>
                     <span className="font-semibold">
                       {profile.qualifications.length > 0 ? profile.qualifications.length : "None"}
                     </span>
                   </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PGCE</span>
                    <span className="font-semibold">
                      {profile.pgce ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Key Achievements</span>
                    <span className="font-semibold">
                      {profile.keyAchievements.length > 0 ? profile.keyAchievements.length : "None"}
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
                  <Progress value={profile.profileCompletion} className="mt-2" />
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
                      {profile.keyAchievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm">{achievement}</div>
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
                      <div className="text-sm text-muted-foreground">No achievements added yet</div>
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
                       {getDisplayValue(profile.personalInfo.phone, "Phone not provided")}
                     </span>
                   </div>
                   <div className="flex items-center space-x-3">
                     <Mail className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm">
                       {getDisplayValue(profile.personalInfo.email, "Email not provided")}
                     </span>
                   </div>
                   <div className="flex items-center space-x-3">
                     <MapPin className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm">
                       {getDisplayValue(profile.personalInfo.address.city, "City")},{" "}
                       {getDisplayValue(profile.personalInfo.address.country, "Country")}
                     </span>
                   </div>
                   <div className="flex items-center space-x-3">
                     <Globe className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-brand-primary cursor-pointer hover:underline">
                       {getDisplayValue(profile.personalInfo.linkedIn, "LinkedIn not provided")}
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
                  {isEditing && (
                    <Button
                      onClick={handleSavePersonalInfo}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={profile.personalInfo.firstName}
                        placeholder="Enter first name"
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("firstName") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("firstName")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={profile.personalInfo.lastName}
                        placeholder="Enter last name"
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("lastName") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("lastName")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        value={profile.personalInfo.title}
                        placeholder="Enter professional title"
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("title") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("title")}
                        </p>
                      )}
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
                        disabled={true}
                        max={new Date()}
                      />
                      {personalInfoForm.isFieldInvalid("email") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("email")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="placeOfBirth"
                        value={profile.personalInfo.placeOfBirth}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select disabled={true}>
                        <SelectTrigger>
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
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="phone"
                        value={profile.personalInfo.phone}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                      <Input
                        id="alternatePhone"
                        value={profile.personalInfo.alternatePhone}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.personalInfo.email}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="passportNo">Passport Number *</Label>
                      <Input
                        id="passportNo"
                        value={profile.personalInfo.passportNo}
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("passportNo") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("passportNo")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select disabled={true}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={profile.personalInfo.gender}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {personalInfoForm.isFieldInvalid("gender") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("gender")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select disabled={true}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={profile.personalInfo.maritalStatus}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {personalInfoForm.isFieldInvalid("maritalStatus") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("maritalStatus")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={profile.personalInfo.address.street}
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("address.street") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.street")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profile.personalInfo.address.city}
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("address.city") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.city")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        value={profile.personalInfo.address.state}
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("address.state") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.state")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select disabled={true}>
                        <SelectTrigger>
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
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={profile.personalInfo.address.postalCode}
                        readOnly={true}
                      />
                      {personalInfoForm.isFieldInvalid("address.postalCode") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.postalCode")}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={profile.personalInfo.linkedIn}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Languages className="w-5 h-5 mr-2" />
                      Languages
                    </h3>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(null);
                          setShowLanguageModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                    )}
                  </div>

                                     <div className="space-y-3">
                     {languages.length > 0 ? (
                       languages.map((lang, index) => (
                         <div
                           key={index}
                           className="flex items-center justify-between p-3 border rounded-lg"
                         >
                           <span>{lang.language} ({lang.proficiency})</span>
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
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowExperienceModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                        <Button
                          onClick={handleSaveEmployment}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Employment Entry */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Mathematics Teacher
                      </h3>
                      <p className="text-muted-foreground">
                        Lincoln High School
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Boston, MA • Sep 2019 - Present
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Key Responsibilities</Label>
                      <Textarea
                        value="• Teach Algebra I and II to 9th and 10th grade students\n• Develop engaging curriculum aligned with state standards\n• Implement differentiated instruction strategies\n• Mentor new teachers in mathematics department"
                        rows={4}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label>Contact Person</Label>
                      <Input
                        value="Dr. Maria Rodriguez, Principal - mrodriguez@lincolnhs.edu"
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Add more employment entries as needed */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Mathematics Tutor
                      </h3>
                      <p className="text-muted-foreground">
                        Academic Success Center
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Boston, MA • Jun 2018 - Aug 2019
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Key Responsibilities</Label>
                      <Textarea
                        value="• Provided one-on-one tutoring in algebra and geometry\n• Assisted students in developing study skills and confidence\n• Tracked student progress and communicated with parents"
                        rows={3}
                        readOnly={true}
                      />
                    </div>

                    <div>
                      <Label>Contact Person</Label>
                      <Input
                        value="James Wilson, Center Director - jwilson@academicsuccess.com"
                        readOnly={true}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Qualifications Tab */}
          <TabsContent value="qualifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Teaching Qualifications & Licenses
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowQualificationModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Qualification
                        </Button>
                        <Button
                          onClick={handleSaveQualifications}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qualifications.map((qual) => (
                    <div key={qual.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{qual.title}</h3>
                          <p className="text-brand-primary font-medium">
                            {qual.institution}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {qual.subject}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p>Certification ID: {qual.certificationId}</p>
                            <p>Issue Date: {qual.issueDate}</p>
                            <p>Expiry Date: {qual.expiryDate}</p>
                            {qual.ageRanges.length > 0 && (
                              <p>Age Ranges: {qual.ageRanges.join(", ")}</p>
                            )}
                          </div>
                          {qual.description && (
                            <p className="text-sm mt-2">{qual.description}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(qual, setShowQualificationModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(qual.id, setQualifications, qualifications)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {qualifications.length === 0 && (
                    <div className="text-center py-12">
                      <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No qualifications added</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your teaching certifications and licenses to showcase your credentials.
                      </p>
                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setShowQualificationModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Qualification
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Development Tab */}
          <TabsContent value="development" className="space-y-6">
            {/* Professional Certifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Professional Certifications
                  </CardTitle>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(null);
                        setShowCertificationModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-brand-primary text-sm">{cert.issuer}</p>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <p>Issue Date: {cert.issueDate}</p>
                            <p>Expiry Date: {cert.expiryDate}</p>
                            <p>Credential ID: {cert.credentialId}</p>
                            {cert.credentialUrl && (
                              <p>
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                                  View Credential
                                </a>
                              </p>
                            )}
                          </div>
                          {cert.description && (
                            <p className="text-sm mt-2">{cert.description}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(cert, setShowCertificationModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(cert.id, setCertifications, certifications)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {certifications.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No certifications added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Development */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Professional Development
                  </CardTitle>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(null);
                        setShowDevelopmentModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Development
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {developments.map((dev) => (
                    <div key={dev.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{dev.title}</h3>
                          <p className="text-brand-primary text-sm">{dev.provider}</p>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <p>Type: {dev.type}</p>
                            <p>Duration: {dev.duration}</p>
                            <p>Completed: {dev.completionDate}</p>
                            {dev.skills.length > 0 && (
                              <p>Skills: {dev.skills.join(", ")}</p>
                            )}
                          </div>
                          <p className="text-sm mt-2">{dev.impact}</p>
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(dev, setShowDevelopmentModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(dev.id, setDevelopments, developments)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {developments.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No professional development activities added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Memberships */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Professional Memberships
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowMembershipModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Membership
                        </Button>
                        <Button
                          onClick={handleSaveDevelopmentData}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberships.map((membership) => (
                    <div key={membership.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{membership.organizationName}</h3>
                          <p className="text-brand-primary text-sm">{membership.membershipType}</p>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <p>Member ID: {membership.membershipId}</p>
                            <p>Status: <Badge variant={membership.status === 'Active' ? 'default' : 'secondary'}>{membership.status}</Badge></p>
                            <p>Joined: {membership.joinDate}</p>
                            <p>Expires: {membership.expiryDate}</p>
                            {membership.benefits.length > 0 && (
                              <p>Benefits: {membership.benefits.join(", ")}</p>
                            )}
                          </div>
                          {membership.description && (
                            <p className="text-sm mt-2">{membership.description}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(membership, setShowMembershipModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(membership.id, setMemberships, memberships)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {memberships.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No memberships added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referees Tab */}
          <TabsContent value="referees" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Professional References
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowRefereeModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Referee
                        </Button>
                        <Button
                          onClick={handleSaveReferees}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {referees.map((referee) => (
                    <div key={referee.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{referee.name}</h3>
                          <p className="text-brand-primary font-medium">
                            {referee.position}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {referee.organization}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p>Email: {referee.email}</p>
                            <p>Phone: {referee.phone}</p>
                            <p>Relationship: {referee.relationship}</p>
                            <p>Years Known: {referee.yearsKnown}</p>
                          </div>
                          {referee.notes && (
                            <p className="text-sm mt-2">{referee.notes}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(referee, setShowRefereeModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(referee.id, setReferees, referees)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {referees.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No referees added</h3>
                      <p className="text-muted-foreground mb-4">
                        Add at least 2 professional references who can vouch for your work.
                      </p>
                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setShowRefereeModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Referee
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-6">
            {/* Travel Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Plane className="w-5 h-5 mr-2" />
                    Travel Plans & Dependents
                  </CardTitle>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(null);
                        setShowTravelPlanModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Family Member
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {travelPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{plan.dependentName}</h3>
                          <p className="text-brand-primary text-sm">{plan.relationship}</p>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            {plan.age && <p>Age: {plan.age}</p>}
                            <p>Nationality: {plan.nationality}</p>
                            <p>Passport: {plan.passportNumber} (expires {plan.passportExpiry})</p>
                            <p>Visa Required: {plan.visaRequired ? 'Yes' : 'No'}</p>
                            {plan.visaRequired && plan.visaStatus && (
                              <p>Visa Status: <Badge variant="secondary">{plan.visaStatus}</Badge></p>
                            )}
                          </div>
                          <p className="text-sm mt-2">
                            <strong>Accommodation:</strong> {plan.accommodationNeeds}
                          </p>
                          {plan.medicalNeeds && (
                            <p className="text-sm">
                              <strong>Medical:</strong> {plan.medicalNeeds}
                            </p>
                          )}
                          {plan.educationNeeds && (
                            <p className="text-sm">
                              <strong>Education:</strong> {plan.educationNeeds}
                            </p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(plan, setShowTravelPlanModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(plan.id, setTravelPlans, travelPlans)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {travelPlans.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No family members or dependents added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Extracurricular Activities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Extracurricular Activities
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowActivityModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                        <Button
                          onClick={handleSaveAdditional}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{activity.name}</h3>
                          <p className="text-brand-primary text-sm">{activity.role} • {activity.type}</p>
                          {activity.organization && (
                            <p className="text-sm text-muted-foreground">{activity.organization}</p>
                          )}
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <p>Duration: {activity.startDate} - {activity.current ? 'Present' : activity.endDate}</p>
                            <p>Time Commitment: {activity.timeCommitment}</p>
                          </div>
                          <p className="text-sm mt-2">{activity.description}</p>
                          {activity.achievements.length > 0 && (
                            <div className="mt-2">
                              <strong className="text-sm">Achievements:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {activity.achievements.map((achievement, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {activity.skillsDeveloped.length > 0 && (
                            <div className="mt-2">
                              <strong className="text-sm">Skills Developed:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {activity.skillsDeveloped.map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(activity, setShowActivityModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(activity.id, setActivities, activities)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No activities added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* All Modals */}
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
          onSave={handleSaveReferee}
          editingReferee={editingItem}
        />
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherProfile;