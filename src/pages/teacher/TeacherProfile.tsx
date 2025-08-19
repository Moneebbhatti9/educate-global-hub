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
  Edit,
  Plus,
  Trash2,
  Download,
  Star,
  BookOpen,
  Languages,
  Shield,
  FileText,
  Building,
  Plane,
  Trophy,
  Save,
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AddLanguageModal } from "@/components/Modals/add-language-modal";
import { AddExperienceModal } from "@/components/Modals/add-experience-modal";
import { AddQualificationModal } from "@/components/Modals/add-qualification-modal";
import { AddEducationModal } from "@/components/Modals/add-education-modal";
import { AddRefereeModal } from "@/components/Modals/add-referee-modal";
import { ProfileSummaryModal } from "@/components/Modals/profile-summary-modal";
import { AddCertificationModal } from "@/components/Modals/add-certification-modal";
import { AddDevelopmentModal } from "@/components/Modals/add-development-modal";
import { AddMembershipModal } from "@/components/Modals/add-membership-modal";
import { AddTravelPlanModal } from "@/components/Modals/add-travel-plan-modal";
import { AddActivityModal } from "@/components/Modals/add-activity-modal";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";

// Schemas for form validation
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportNo: z.string().min(1, "Passport number is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  linkedIn: z.string().optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
});

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
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  
  // Data states
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showRefereeModal, setShowRefereeModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showTravelPlanModal, setShowTravelPlanModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock profile data
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: "Sarah",
      lastName: "Johnson",
      title: "Mathematics Teacher & Curriculum Developer",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      alternatePhone: "+1 (555) 987-6543",
      dateOfBirth: "1988-03-15",
      placeOfBirth: "Boston, MA, USA",
      nationality: "American",
      passportNo: "123456789",
      gender: "Female",
      maritalStatus: "Married",
      linkedIn: "linkedin.com/in/sarahjohnson",
      address: {
        street: "123 Maple Street",
        city: "Boston",
        state: "Massachusetts",
        country: "United States",
        postalCode: "02101",
      },
    },
    bio: "Passionate mathematics educator with 8+ years of experience in middle and high school education. Specializes in making complex mathematical concepts accessible and engaging for all learners.",
    professionalSummary:
      "Dedicated and innovative mathematics teacher with over 8 years of experience in developing curriculum and fostering student achievement in diverse educational settings. Expert in utilizing technology-enhanced learning methodologies to make complex mathematical concepts accessible to students of varying abilities. Proven track record of improving student performance by 25% through personalized learning approaches and data-driven instruction.",
    careerObjectives:
      "Seeking a challenging role as a Senior Mathematics Teacher or Department Head where I can leverage my expertise in curriculum development and student mentoring to drive academic excellence. Looking to contribute to a progressive educational institution that values innovation, inclusivity, and continuous professional development.",
    subjects: ["Mathematics", "Algebra", "Geometry", "Statistics"],
    yearsOfExperience: 8,
    oldQualifications: [
      "Master of Education in Mathematics",
      "Bachelor of Science in Mathematics",
      "Teaching License (Mathematics 6-12)",
      "PGCE Certified",
    ],
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

  const handleSaveQualification = (qualification: Qualification) => {
    if (editingItem) {
      setQualifications(
        qualifications.map((q) => (q.id === qualification.id ? qualification : q))
      );
    } else {
      setQualifications([...qualifications, qualification]);
    }
    setEditingItem(null);
  };

  const handleSaveEducation = (education: Education) => {
    if (editingItem) {
      setEducations(
        educations.map((e) => (e.id === education.id ? education : e))
      );
    } else {
      setEducations([...educations, education]);
    }
    setEditingItem(null);
  };

  const handleSaveReferee = (referee: Referee) => {
    if (editingItem) {
      setReferees(
        referees.map((r) => (r.id === referee.id ? referee : r))
      );
    } else {
      setReferees([...referees, referee]);
    }
    setEditingItem(null);
  };

  const handleSaveCertification = (certification: Certification) => {
    if (editingItem) {
      setCertifications(
        certifications.map((c) => (c.id === certification.id ? certification : c))
      );
    } else {
      setCertifications([...certifications, certification]);
    }
    setEditingItem(null);
  };

  const handleSaveDevelopment = (development: Development) => {
    if (editingItem) {
      setDevelopments(
        developments.map((d) => (d.id === development.id ? development : d))
      );
    } else {
      setDevelopments([...developments, development]);
    }
    setEditingItem(null);
  };

  const handleSaveMembership = (membership: Membership) => {
    if (editingItem) {
      setMemberships(
        memberships.map((m) => (m.id === membership.id ? membership : m))
      );
    } else {
      setMemberships([...memberships, membership]);
    }
    setEditingItem(null);
  };

  const handleSaveTravelPlan = (travelPlan: TravelPlan) => {
    if (editingItem) {
      setTravelPlans(
        travelPlans.map((t) => (t.id === travelPlan.id ? travelPlan : t))
      );
    } else {
      setTravelPlans([...travelPlans, travelPlan]);
    }
    setEditingItem(null);
  };

  const handleSaveActivity = (activity: Activity) => {
    if (editingItem) {
      setActivities(
        activities.map((a) => (a.id === activity.id ? activity : a))
      );
    } else {
      setActivities([...activities, activity]);
    }
    setEditingItem(null);
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

  const removeItem = (id: string, setter: any, items: any[]) => {
    setter(items.filter((item: any) => item.id !== id));
  };

  const editItem = (item: any, modalSetter: any) => {
    setEditingItem(item);
    modalSetter(true);
  };

  return (
    <DashboardLayout role="teacher">
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
                  {profile.personalInfo.firstName}{" "}
                  {profile.personalInfo.lastName}
                </h1>
                <p className="text-xl text-muted-foreground mb-3">
                  {profile.personalInfo.title}
                </p>
                <p className="text-foreground max-w-2xl mb-4">{profile.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.subjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-brand-primary/10 text-brand-primary"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.personalInfo.address.city},{" "}
                    {profile.personalInfo.address.state}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {profile.yearsOfExperience} years experience
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {profile.personalInfo.email}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Exit Edit Mode" : "Edit Profile"}
                </Button>
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
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>

                {profile.professionalSummary && (
                  <div>
                    <h4 className="font-semibold mb-2">Detailed Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.professionalSummary}
                    </p>
                  </div>
                )}

                {profile.careerObjectives && (
                  <div>
                    <h4 className="font-semibold mb-2">Career Objectives</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.careerObjectives}
                    </p>
                  </div>
                )}
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
                      {profile.yearsOfExperience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subjects</span>
                    <span className="font-semibold">
                      {profile.subjects.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Qualifications
                    </span>
                    <span className="font-semibold">
                      {qualifications.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Profile Complete
                    </span>
                    <span className="font-semibold text-brand-accent-green">
                      85%
                    </span>
                  </div>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              {/* Recent Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-brand-accent-orange" />
                    Recent Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {qualifications.slice(0, 3).map((qual, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm">{qual.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {qual.institution}
                      </div>
                    </div>
                  ))}
                  {qualifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">No qualifications added yet</p>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Qualifications
                  </Button>
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
                      {profile.personalInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {profile.personalInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {profile.personalInfo.address.city},{" "}
                      {profile.personalInfo.address.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-brand-primary cursor-pointer hover:underline">
                      {profile.personalInfo.linkedIn}
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
                        {...personalInfoForm.register("firstName")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("firstName") ? "border-destructive" : ""}
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
                        {...personalInfoForm.register("lastName")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("lastName") ? "border-destructive" : ""}
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
                        {...personalInfoForm.register("title")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("title") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("title") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("title")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...personalInfoForm.register("email")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("email") ? "border-destructive" : ""}
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
                        id="phone"
                        {...personalInfoForm.register("phone")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("phone") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("phone") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("phone")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="alternatePhone">Alternate Phone</Label>
                      <Input
                        id="alternatePhone"
                        {...personalInfoForm.register("alternatePhone")}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...personalInfoForm.register("dateOfBirth")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("dateOfBirth") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("dateOfBirth") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("dateOfBirth")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                      <Input
                        id="placeOfBirth"
                        {...personalInfoForm.register("placeOfBirth")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("placeOfBirth") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("placeOfBirth") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("placeOfBirth")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Input
                        id="nationality"
                        {...personalInfoForm.register("nationality")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("nationality") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("nationality") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("nationality")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passportNo">Passport Number *</Label>
                      <Input
                        id="passportNo"
                        {...personalInfoForm.register("passportNo")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("passportNo") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("passportNo") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("passportNo")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select 
                        value={personalInfoForm.watch("gender")} 
                        onValueChange={(value) => personalInfoForm.setValue("gender", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={personalInfoForm.isFieldInvalid("gender") ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select gender" />
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
                      <Label htmlFor="maritalStatus">Marital Status *</Label>
                      <Select 
                        value={personalInfoForm.watch("maritalStatus")} 
                        onValueChange={(value) => personalInfoForm.setValue("maritalStatus", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={personalInfoForm.isFieldInvalid("maritalStatus") ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select marital status" />
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
                        {...personalInfoForm.register("address.street")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("address.street") ? "border-destructive" : ""}
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
                        {...personalInfoForm.register("address.city")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("address.city") ? "border-destructive" : ""}
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
                        {...personalInfoForm.register("address.state")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("address.state") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("address.state") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.state")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...personalInfoForm.register("address.country")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("address.country") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("address.country") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.country")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        {...personalInfoForm.register("address.postalCode")}
                        disabled={!isEditing}
                        className={personalInfoForm.isFieldInvalid("address.postalCode") ? "border-destructive" : ""}
                      />
                      {personalInfoForm.isFieldInvalid("address.postalCode") && (
                        <p className="text-sm text-destructive mt-1">
                          {personalInfoForm.getFieldError("address.postalCode")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Professional Links</h3>
                  <div>
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <Input
                      id="linkedIn"
                      {...personalInfoForm.register("linkedIn")}
                      disabled={!isEditing}
                      placeholder="linkedin.com/in/yourprofile"
                    />
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

                  <div className="grid gap-3">
                    {languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{lang.language}</div>
                          <div className="text-sm text-muted-foreground">
                            {lang.proficiency}
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(lang, setShowLanguageModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(lang.id, setLanguages, languages)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {languages.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No languages added yet.{" "}
                        {isEditing && "Click 'Add Language' to get started."}
                      </p>
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
              <CardContent>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{exp.title}</h3>
                          <p className="text-brand-primary font-medium">
                            {exp.employer}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {exp.location} • {exp.startDate} -{" "}
                            {exp.current ? "Present" : exp.endDate}
                          </p>
                          <p className="text-sm">{exp.responsibilities}</p>
                          {exp.contactPerson && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Contact: {exp.contactPerson}
                            </p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(exp, setShowExperienceModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(exp.id, setExperiences, experiences)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {experiences.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No employment history</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your work experience to showcase your professional background.
                      </p>
                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setShowExperienceModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Experience
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Educational Background
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null);
                            setShowEducationModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                        <Button
                          onClick={handleSaveEducation}
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
                  {educations.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{edu.degree}</h3>
                          <p className="text-brand-primary font-medium">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {edu.field} • {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm">GPA: {edu.gpa}</p>
                          )}
                          {edu.thesis && (
                            <p className="text-sm">Thesis: {edu.thesis}</p>
                          )}
                          {edu.honors && (
                            <p className="text-sm">Honors: {edu.honors}</p>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(edu, setShowEducationModal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(edu.id, setEducations, educations)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {educations.length === 0 && (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No education records</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your educational background to highlight your qualifications.
                      </p>
                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setShowEducationModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Education
                        </Button>
                      )}
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
                          onClick={handleSaveDevelopment}
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

        <AddCertificationModal
          open={showCertificationModal}
          onOpenChange={setShowCertificationModal}
          onSave={handleSaveCertification}
          editingCertification={editingItem}
        />

        <AddDevelopmentModal
          open={showDevelopmentModal}
          onOpenChange={setShowDevelopmentModal}
          onSave={handleSaveDevelopment}
          editingDevelopment={editingItem}
        />

        <AddMembershipModal
          open={showMembershipModal}
          onOpenChange={setShowMembershipModal}
          onSave={handleSaveMembership}
          editingMembership={editingItem}
        />

        <AddTravelPlanModal
          open={showTravelPlanModal}
          onOpenChange={setShowTravelPlanModal}
          onSave={handleSaveTravelPlan}
          editingTravelPlan={editingItem}
        />

        <AddActivityModal
          open={showActivityModal}
          onOpenChange={setShowActivityModal}
          onSave={handleSaveActivity}
          editingActivity={editingItem}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeacherProfile;