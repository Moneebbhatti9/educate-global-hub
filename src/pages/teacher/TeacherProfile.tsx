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
  Save,
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AddLanguageModal } from "@/components/Modals/add-language-modal";
import { AddExperienceModal } from "@/components/Modals/add-experience-modal";
import { AddQualificationModal } from "@/components/Modals/add-qualification-modal";
import { AddEducationModal } from "@/components/Modals/add-education-modal";
import { AddRefereeModal } from "@/components/Modals/add-referee-modal";
import { useAuth } from "@/contexts/AuthContext";
import {
  teacherProfileAPI,
  useCreateTeacherExperience,
  useUpdateTeacherExperience,
  useDeleteTeacherExperience,
  useCreateTeacherEducation,
  useUpdateTeacherEducation,
  useDeleteTeacherEducation,
  useCreateTeacherQualification,
  useUpdateTeacherQualification,
  useDeleteTeacherQualification,
  useCreateTeacherReferee,
  useUpdateTeacherReferee,
  useDeleteTeacherReferee,
  useCreateTeacherCertification,
  useUpdateTeacherCertification,
  useDeleteTeacherCertification,
  useCreateTeacherDevelopment,
  useUpdateTeacherDevelopment,
  useDeleteTeacherDevelopment,
  useCreateTeacherMembership,
  useUpdateTeacherMembership,
  useDeleteTeacherMembership,
  useCreateDependent,
  useUpdateDependent,
  useDeleteDependent,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  useUpdateTeacherProfile,
  Experience,
  Qualification,
  Referee,
  Certification,
  Development,
  Membership,
  Dependent,
  Activity,
} from "@/apis/profiles";
import { TeacherProfile as TeacherProfileType } from "@/types/profiles";
import { TeacherProfileSkeleton } from "@/components/skeletons";
import { ProfileSummaryModal } from "@/components/Modals/profile-summary-modal";
import { AddCertificationModal } from "@/components/Modals/add-certification-modal";
import { AddDevelopmentModal } from "@/components/Modals/add-development-modal";
import { AddMembershipModal } from "@/components/Modals/add-membership-modal";
import { AddActivityModal } from "@/components/Modals/add-activity-modal";
import { AddTravelPlanModal } from "@/components/Modals/add-travel-plan-modal";

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

  const deleteExperience = useDeleteTeacherExperience();
  const createEducation = useCreateTeacherEducation();
  const updateEducation = useUpdateTeacherEducation();
  const deleteEducation = useDeleteTeacherEducation();
  const deleteQualification = useDeleteTeacherQualification();
  const createReferee = useCreateTeacherReferee();
  const updateReferee = useUpdateTeacherReferee();
  const deleteReferee = useDeleteTeacherReferee();
  const createCertification = useCreateTeacherCertification();
  const updateCertification = useUpdateTeacherCertification();
  const deleteCertification = useDeleteTeacherCertification();
  const createDevelopment = useCreateTeacherDevelopment();
  const updateDevelopment = useUpdateTeacherDevelopment();
  const deleteDevelopment = useDeleteTeacherDevelopment();
  const createMembership = useCreateTeacherMembership();
  const updateMembership = useUpdateTeacherMembership();
  const deleteMembership = useDeleteTeacherMembership();
  const createDependent = useCreateDependent();
  const updateDependent = useUpdateDependent();
  const deleteDependent = useDeleteDependent();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const updateTeacherProfile = useUpdateTeacherProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(
    null
  );

  // Fetch teacher profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await teacherProfileAPI.getById(user.id);

        if (response.success && response.data) {
          // Update the profile state with fetched data
          const fetchedProfile = response.data;

          // Map API response to profile schema
          setProfile((prevProfile) => ({
            ...prevProfile,
            personalInfo: {
              ...prevProfile.personalInfo,
              firstName: fetchedProfile.user?.firstName || "",
              lastName: fetchedProfile.user?.lastName || "",
              email: fetchedProfile.user?.email || "",
              phone: fetchedProfile.phoneNumber || "",
              avatar: fetchedProfile.user?.avatarUrl || "",
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
            certifications: fetchedProfile.certifications
              ? fetchedProfile.certifications.map((cert: any) => ({
                  _id: cert._id || cert.id || Date.now().toString(),
                  id: cert.id || cert._id || Date.now().toString(),
                  certificationName:
                    cert.certificationName || cert.name || cert.title || "",
                  issuingOrganization:
                    cert.issuingOrganization ||
                    cert.issuer ||
                    cert.institution ||
                    "",
                  issueDate: cert.issueDate || "",
                  expiryDate: cert.expiryDate || "",
                  credentialId: cert.credentialId || cert.certificationId || "",
                  credentialUrl: cert.credentialUrl || "",
                  description: cert.description || "",
                }))
              : [],
            employment: fetchedProfile.employment || [],
            education: fetchedProfile.education || [],
            referees: fetchedProfile.referees || [],
            development: fetchedProfile.development
              ? fetchedProfile.development.map((dev: any) => ({
                  _id: dev._id || dev.id || Date.now().toString(),
                  id: dev.id || dev._id || Date.now().toString(),
                  title: dev.title || "",
                  provider: dev.provider || "",
                  type: dev.type || "Course",
                  duration: dev.duration || "",
                  completionDate: dev.completionDate || "",
                  skills: dev.skills || [],
                  impact: dev.impact || "",
                  certificateUrl: dev.certificateUrl || "",
                }))
              : [],
            memberships: fetchedProfile.memberships || [],
          }));

          // Update local state with fetched data
          setEducations(fetchedProfile.education || []);
          setExperiences(fetchedProfile.employment || []);
          setReferees(fetchedProfile.referees || []);
          setQualifications(fetchedProfile.qualifications || []);
          setCertifications(
            fetchedProfile.certifications
              ? fetchedProfile.certifications.map((cert: any) => ({
                  _id: cert._id || cert.id || Date.now().toString(),
                  id: cert.id || cert._id || Date.now().toString(),
                  certificationName:
                    cert.certificationName || cert.name || cert.title || "",
                  issuingOrganization:
                    cert.issuingOrganization ||
                    cert.issuer ||
                    cert.institution ||
                    "",
                  issueDate: cert.issueDate || "",
                  expiryDate: cert.expiryDate || "",
                  credentialId: cert.credentialId || cert.certificationId || "",
                  credentialUrl: cert.credentialUrl || "",
                  description: cert.description || "",
                }))
              : []
          );
          setDevelopments(
            fetchedProfile.development
              ? fetchedProfile.development.map((dev: any) => ({
                  _id: dev._id || dev.id || Date.now().toString(),
                  id: dev.id || dev._id || Date.now().toString(),
                  title: dev.title || "",
                  provider: dev.provider || "",
                  type: dev.type || "Course",
                  duration: dev.duration || "",
                  completionDate: dev.completionDate || "",
                  skills: dev.skills || [],
                  impact: dev.impact || "",
                  certificateUrl: dev.certificateUrl || "",
                }))
              : []
          );
          setMemberships(
            fetchedProfile.memberships
              ? fetchedProfile.memberships.map((mem: any) => ({
                  _id: mem._id || mem.id || Date.now().toString(),
                  id: mem.id || mem._id || Date.now().toString(),
                  organizationName: mem.organizationName || "",
                  membershipType: mem.membershipType || "Full Member",
                  membershipId: mem.membershipId || "",
                  joinDate: mem.joinDate || "",
                  expiryDate: mem.expiryDate || "",
                  status: mem.status || "Active",
                  benefits: mem.benefits || [],
                  description: mem.description || "",
                }))
              : []
          );
          setTravelPlans(
            fetchedProfile.dependents
              ? fetchedProfile.dependents.map((dep: any) => ({
                  _id: dep._id || dep.id || Date.now().toString(),
                  id: dep.id || dep._id || Date.now().toString(),
                  dependentName: dep.dependentName || "",
                  relationship: dep.relationship || "Spouse",
                  age: dep.age || undefined,
                  nationality: dep.nationality || "",
                  passportNumber: dep.passportNumber || "",
                  passportExpiry: dep.passportExpiry || "",
                  visaRequired: dep.visaRequired || false,
                  visaStatus: dep.visaStatus || "Not Applied",
                  accommodationNeeds: dep.accommodationNeeds || "",
                  medicalNeeds: dep.medicalNeeds || "",
                  educationNeeds: dep.educationNeeds || "",
                  notes: dep.notes || "",
                }))
              : []
          );
          setActivities(
            fetchedProfile.activities
              ? fetchedProfile.activities.map((act: any) => ({
                  _id: act._id || act.id || Date.now().toString(),
                  id: act.id || act._id || Date.now().toString(),
                  name: act.name || "",
                  type: act.type || "Club",
                  role: act.role || "",
                  organization: act.organization || "",
                  startDate: act.startDate || "",
                  endDate: act.endDate || "",
                  current: act.current || false,
                  description: act.description || "",
                  achievements: act.achievements || [],
                  skillsDeveloped: act.skillsDeveloped || [],
                  timeCommitment: act.timeCommitment || "",
                }))
              : []
          );
        } else {
        }
      } catch (err) {
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
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showTravelPlanModal, setShowTravelPlanModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // State for development data
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [travelPlans, setTravelPlans] = useState<Dependent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Reset editingItem when qualification modal is closed
  useEffect(() => {
    if (!showQualificationModal) {
      setEditingItem(null);
    }
  }, [showQualificationModal]);

  // Reset editingItem when referee modal is closed
  useEffect(() => {
    if (!showRefereeModal) {
      setEditingItem(null);
    }
  }, [showRefereeModal]);

  // Reset editingItem when membership modal is closed
  useEffect(() => {
    if (!showMembershipModal) {
      setEditingItem(null);
    }
  }, [showMembershipModal]);

  // Reset editingItem when dependent modal is closed
  useEffect(() => {
    if (!showTravelPlanModal) {
      setEditingItem(null);
    }
  }, [showTravelPlanModal]);

  // Reset editingItem when activity modal is closed
  useEffect(() => {
    if (!showActivityModal) {
      setEditingItem(null);
    }
  }, [showActivityModal]);

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
      avatar?: string;
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
    certifications: Certification[];
    employment: any[];
    education: any[];
    referees: any[];
    development: Development[];
    memberships: Membership[];
    dependents: Dependent[];
    activities: Activity[];
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
      avatar: "",
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
    certifications: [] as Certification[],
    employment: [],
    education: [],
    referees: [],
    development: [] as Development[],
    memberships: [],
    dependents: [],
    activities: [],
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
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleDeleteEmployment = async (employmentId: string) => {
    try {
      const response = await deleteExperience.mutateAsync(employmentId);

      if (response.success) {
        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleSaveEducation = async (education: Education) => {
    try {
      let response;

      if (editingItem && education._id) {
        // Update existing education
        const educationId = education._id;
        if (educationId) {
          response = await updateEducation.mutateAsync({
            educationId,
            data: education,
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
            educations.map((e) =>
              e.id === education.id || e._id === education._id ? education : e
            )
          );
        } else {
          setEducations([...educations, education]);
        }
        setEditingItem(null);

        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      const response = await deleteEducation.mutateAsync(educationId);

      if (response.success) {
        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleSaveQualification = async (qualification: Qualification) => {
    try {
      // Update local state with the new qualification
      if (editingItem) {
        setQualifications(
          qualifications.map((q) =>
            q.id === qualification.id || q._id === qualification._id
              ? qualification
              : q
          )
        );
      } else {
        setQualifications([...qualifications, qualification]);
      }
      setEditingItem(null);

      // You can add a success toast here
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleDeleteQualification = async (qualificationId: string) => {
    try {
      const response = await deleteQualification.mutateAsync(qualificationId);

      if (response.success) {
        // Remove from local state
        setQualifications(
          qualifications.filter(
            (q) => q._id !== qualificationId && q.id !== qualificationId
          )
        );
        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleSaveReferee = async (referee: Referee) => {
    try {
      let response;

      if (editingItem && referee._id) {
        // Update existing referee
        const refereeId = referee._id;
        if (refereeId) {
          response = await updateReferee.mutateAsync({
            refereeId,
            data: referee,
          });
        }
      } else {
        // Create new referee
        response = await createReferee.mutateAsync(referee);
      }

      if (response.success && response.data) {
        // Update local state with the new referee
        if (editingItem) {
          setReferees(
            referees.map((r) =>
              r.id === referee.id || r._id === referee._id ? referee : r
            )
          );
        } else {
          setReferees([...referees, referee]);
        }
        setEditingItem(null);

        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleDeleteReferee = async (refereeId: string) => {
    try {
      const response = await deleteReferee.mutateAsync(refereeId);

      if (response.success) {
        // Remove from local state
        setReferees(
          referees.filter((r) => r._id !== refereeId && r.id !== refereeId)
        );
        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
      // You can add an error toast here
    }
  };

  // Handler functions for development data
  const handleSaveCertification = async (certification: Certification) => {
    try {
      let response;

      if (editingItem && certification._id) {
        // Update existing certification
        const certificationId = certification._id;
        if (certificationId) {
          response = await updateCertification.mutateAsync({
            certificationId,
            data: certification,
          });
        }
      } else {
        // Create new certification
        response = await createCertification.mutateAsync(certification);
      }

      if (response.success && response.data) {
        // Update local state with the new certification
        if (editingItem) {
          setCertifications(
            certifications.map((c) =>
              c.id === certification.id || c._id === certification._id
                ? certification
                : c
            )
          );
        } else {
          setCertifications([...certifications, certification]);
        }
        setEditingItem(null);

        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    try {
      const response = await deleteCertification.mutateAsync(certificationId);

      if (response.success) {
        // Remove from local state
        setCertifications(
          certifications.filter(
            (c) => c._id !== certificationId && c.id !== certificationId
          )
        );
        // You can add a success toast here
      }
    } catch (error) {
      // You can add an error toast here
    }
  };

  const handleSaveTravelPlan = async (dependent: Dependent) => {
    try {
      let response;
      if (editingItem && dependent._id) {
        const dependentId = dependent._id;
        if (dependentId) {
          response = await updateDependent.mutateAsync({
            dependentId,
            data: dependent,
          });
        }
      } else {
        response = await createDependent.mutateAsync(dependent);
      }
      if (response.success && response.data) {
        if (editingItem) {
          setTravelPlans(
            travelPlans.map((d) =>
              d.id === dependent.id || d._id === dependent._id ? dependent : d
            )
          );
        } else {
          setTravelPlans([...travelPlans, dependent]);
        }
        setEditingItem(null);
      }
    } catch (error) {}
  };

  const handleSaveActivity = async (activity: Activity) => {
    try {
      let response;
      if (editingItem && activity._id) {
        const activityId = activity._id;
        if (activityId) {
          response = await updateActivity.mutateAsync({
            activityId,
            data: activity,
          });
        }
      } else {
        response = await createActivity.mutateAsync(activity);
      }
      if (response.success && response.data) {
        if (editingItem) {
          setActivities(
            activities.map((a) =>
              a.id === activity.id || a._id === activity._id ? activity : a
            )
          );
        } else {
          setActivities([...activities, activity]);
        }
        setEditingItem(null);
      }
    } catch (error) {}
  };

  const handleSaveDevelopment = async (development: Development) => {
    try {
      let response;
      if (editingItem && development._id) {
        // Update existing development
        const developmentId = development._id;
        if (developmentId) {
          response = await updateDevelopment.mutateAsync({
            developmentId,
            data: development,
          });
        }
      } else {
        // Create new development
        response = await createDevelopment.mutateAsync(development);
      }
      if (response.success && response.data) {
        // Update local state with the new development
        if (editingItem) {
          setDevelopments(
            developments.map((d) =>
              d.id === development.id || d._id === development._id
                ? development
                : d
            )
          );
        } else {
          setDevelopments([...developments, development]);
        }
        setEditingItem(null);
      }
    } catch (error) {}
  };

  const handleDeleteDevelopment = async (developmentId: string) => {
    try {
      const response = await deleteDevelopment.mutateAsync(developmentId);
      if (response.success) {
        setDevelopments(
          developments.filter(
            (d) => d._id !== developmentId && d.id !== developmentId
          )
        );
      }
    } catch (error) {}
  };

  const handleDeleteMembership = async (membershipId: string) => {
    try {
      const response = await deleteMembership.mutateAsync(membershipId);
      if (response.success) {
        setMemberships(
          memberships.filter(
            (m) => m._id !== membershipId && m.id !== membershipId
          )
        );
      }
    } catch (error) {}
  };

  const handleDeleteDependent = async (dependentId: string) => {
    try {
      const response = await deleteDependent.mutateAsync(dependentId);
      if (response.success) {
        setTravelPlans(
          travelPlans.filter(
            (d) => d._id !== dependentId && d.id !== dependentId
          )
        );
      }
    } catch (error) {}
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const response = await deleteActivity.mutateAsync(activityId);
      if (response.success) {
        setActivities(
          activities.filter((a) => a._id !== activityId && a.id !== activityId)
        );
      }
    } catch (error) {}
  };

  const handleSaveMembership = async (membership: Membership) => {
    try {
      let response;
      if (editingItem && membership._id) {
        const membershipId = membership._id;
        if (membershipId) {
          response = await updateMembership.mutateAsync({
            membershipId,
            data: membership,
          });
        }
      } else {
        response = await createMembership.mutateAsync(membership);
      }
      if (response.success && response.data) {
        if (editingItem) {
          setMemberships(
            memberships.map((m) =>
              m.id === membership.id || m._id === membership._id
                ? membership
                : m
            )
          );
        } else {
          setMemberships([...memberships, membership]);
        }
        setEditingItem(null);
      }
    } catch (error) {}
  };

  // Helper functions for editing and removing items
  const editItem = (item: any, setModal: (open: boolean) => void) => {
    setEditingItem(item);
    setModal(true);
  };

  const removeItem = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    array: any[]
  ) => {
    setter(array.filter((item) => item.id !== id));
  };

  // Helper function to handle undefined/null values
  const getDisplayValue = (value: any, fallback: string = "Not Provided") => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return value;
  };

  const handleProfileSummaryUpdate = async (data: {
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare the payload with only the professional bio
      const updatePayload = {
        professionalBio: data.bio,
      };

      // Call the API to update the profile
      const response = await updateTeacherProfile.mutateAsync(updatePayload);

      if (response.success) {
        // Update local state
        setProfile((prev) => ({
          ...prev,
          bio: data.bio,
          professionalSummary: data.professionalSummary,
          careerObjectives: data.careerObjectives,
        }));

        // Close the modal
        setShowSummaryModal(false);
      } else {
        throw new Error(response.message || "Failed to update profile summary");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile summary"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare the payload with only the personal information that can be edited
      const updatePayload = {
        personalInfo: {
          firstName: profile.personalInfo.firstName,
          lastName: profile.personalInfo.lastName,
          title: profile.personalInfo.title,
          phone: profile.personalInfo.phone,
          alternatePhone: profile.personalInfo.alternatePhone,
          dateOfBirth: profile.personalInfo.dateOfBirth,
          placeOfBirth: profile.personalInfo.placeOfBirth,
          nationality: profile.personalInfo.nationality,
          passportNo: profile.personalInfo.passportNo,
          gender: profile.personalInfo.gender,
          maritalStatus: profile.personalInfo.maritalStatus,
          linkedIn: profile.personalInfo.linkedIn,
          address: {
            street: profile.personalInfo.address.street,
            city: profile.personalInfo.address.city,
            state: profile.personalInfo.address.state,
            country: profile.personalInfo.address.country,
            postalCode: profile.personalInfo.address.postalCode,
          },
        },
        bio: profile.bio,
        professionalSummary: profile.professionalSummary,
        careerObjectives: profile.careerObjectives,
      };

      // Call the API to update the profile
      const response = await updateTeacherProfile.mutateAsync(updatePayload);

      if (response.success) {
        // Clear the original profile since changes are saved
        setOriginalProfile(null);
        setIsEditing(false);
        // You can add a success toast here
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save profile"
      );
      // You can add an error toast here
    } finally {
      setIsLoading(false);
    }
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
                    <AvatarImage
                      src={
                        profile.personalInfo?.avatar ||
                        user?.avatarUrl ||
                        "/api/placeholder/120/120"
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.personalInfo.firstName?.charAt(0) || ""}
                      {profile.personalInfo.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
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
                            disabled={
                              isLoading || updateTeacherProfile.isPending
                            }
                          >
                            {isLoading || updateTeacherProfile.isPending ? (
                              <>
                                <CloudCog className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!isEditing) {
                            setOriginalProfile(
                              JSON.parse(JSON.stringify(profile))
                            );
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
                        {isEditing ? "Cancel" : "Edit profile"}
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
                            You are now editing your personal information. Click
                            "Save Changes" to save or "Cancel" to discard
                            changes.
                          </p>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="col-span-full mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            {error}
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          <SelectTrigger
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          >
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          <SelectTrigger
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          >
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
                          <SelectTrigger
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          >
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          <SelectTrigger
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          >
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                          className={
                            !isEditing ? "bg-muted cursor-not-allowed" : ""
                          }
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
                              <Trash2 className="w-4 h-4 text-destructive" />
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
                            {job.startDate?.split("T")[0]} -{" "}
                            {job.endDate?.split("T")[0] || "Present"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteEmployment(job._id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
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
                      No education details added yet. Click "Add Education" to
                      get started.
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
                                onClick={() =>
                                  handleDeleteEducation(
                                    education._id || education.id || ""
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          {(education.thesis || education.honors) && (
                            <div className="space-y-3">
                              {education.thesis && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Thesis/Project
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {education.thesis}
                                  </p>
                                </div>
                              )}
                              {education.honors && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Honors & Awards
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {education.honors}
                                  </p>
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
                      No qualifications added yet. Click "Add Qualification" to
                      get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {profile.qualifications.map((qualification) => {
                        return (
                          <div
                            key={qualification._id || qualification.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {qualification.title}
                                  </h4>
                                  {qualification.certificationId && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
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
                                    <span>
                                      Issued: {qualification.issueDate}
                                    </span>
                                  )}
                                  {qualification.expiryDate && (
                                    <span>
                                      Expires: {qualification.expiryDate}
                                    </span>
                                  )}
                                </div>
                                {qualification.ageRanges &&
                                  qualification.ageRanges.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {qualification.ageRanges.map(
                                        (range, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {range}
                                          </Badge>
                                        )
                                      )}
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
                                  onClick={() =>
                                    handleDeleteQualification(
                                      qualification._id ||
                                        qualification.id ||
                                        ""
                                    )
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {cert.certificationName}
                            </h3>
                            <p className="text-brand-primary text-sm">
                              {cert.issuingOrganization}
                            </p>
                            <div className="text-sm text-muted-foreground mt-1 space-y-1">
                              <p>Issue Date: {cert.issueDate}</p>
                              <p>Expiry Date: {cert.expiryDate}</p>
                              <p>Credential ID: {cert.credentialId}</p>
                              {cert.credentialUrl && (
                                <p>
                                  <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-primary hover:underline"
                                  >
                                    View Credential
                                  </a>
                                </p>
                              )}
                            </div>
                            {cert.description && (
                              <p className="text-sm mt-2">{cert.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingItem(cert);
                                setShowCertificationModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCertification(
                                  cert._id || cert.id || ""
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {developments.map((dev) => (
                      <div key={dev.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{dev.title}</h3>
                            <p className="text-brand-primary text-sm">
                              {dev.provider}
                            </p>
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
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                editItem(dev, setShowDevelopmentModal)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteDevelopment(dev._id || dev.id || "")
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {membership.organizationName}
                            </h3>
                            <p className="text-brand-primary text-sm">
                              {membership.membershipType}
                            </p>
                            <div className="text-sm text-muted-foreground mt-1 space-y-1">
                              <p>Member ID: {membership.membershipId}</p>
                              <p>
                                Status:{" "}
                                <Badge
                                  variant={
                                    membership.status === "Active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {membership.status}
                                </Badge>
                              </p>
                              <p>Joined: {membership.joinDate}</p>
                              <p>Expires: {membership.expiryDate}</p>
                              {membership.benefits.length > 0 && (
                                <p>
                                  Benefits: {membership.benefits.join(", ")}
                                </p>
                              )}
                            </div>
                            {membership.description && (
                              <p className="text-sm mt-2">
                                {membership.description}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                editItem(membership, setShowMembershipModal)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteMembership(
                                  membership._id || membership.id || ""
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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
                  {referees.length === 0 ? (
                    <p className="text-muted-foreground">
                      No referees added yet. Click "Add Referee" to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {referees.map((referee: Referee, index: number) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {referee.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {referee.position} at {referee.organization}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {referee.relationship} • Known for{" "}
                                {referee.yearsKnown} years
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(referee);
                                  setShowRefereeModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() =>
                                  handleDeleteReferee(
                                    referee._id || referee.id || ""
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Email
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {referee.email}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Phone
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {referee.phone}
                                </p>
                              </div>
                            </div>
                            {referee.notes && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Notes
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {referee.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Travel Plans & Dependents
                      </CardTitle>
                      <div className="flex gap-2">
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(null);
                              setShowTravelPlanModal(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Travel Plan
                          </Button>
                        </>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {travelPlans.map((dependent) => (
                        <div
                          key={dependent.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {dependent.dependentName}
                              </h3>
                              <p className="text-brand-primary text-sm">
                                {dependent.relationship}
                              </p>
                              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                <p>Age: {dependent.age || "Not specified"}</p>
                                <p>Nationality: {dependent.nationality}</p>
                                <p>Passport: {dependent.passportNumber}</p>
                                <p>Expires: {dependent.passportExpiry}</p>
                                <p>
                                  Visa Required:{" "}
                                  {dependent.visaRequired ? "Yes" : "No"}
                                </p>
                                {dependent.visaRequired && (
                                  <p>
                                    Visa Status:{" "}
                                    <Badge
                                      variant={
                                        dependent.visaStatus === "Approved"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {dependent.visaStatus}
                                    </Badge>
                                  </p>
                                )}
                              </div>
                              {dependent.accommodationNeeds && (
                                <p className="text-sm mt-2">
                                  Accommodation: {dependent.accommodationNeeds}
                                </p>
                              )}
                              {dependent.medicalNeeds && (
                                <p className="text-sm mt-2">
                                  Medical Needs: {dependent.medicalNeeds}
                                </p>
                              )}
                              {dependent.educationNeeds && (
                                <p className="text-sm mt-2">
                                  Education Needs: {dependent.educationNeeds}
                                </p>
                              )}
                              {dependent.notes && (
                                <p className="text-sm mt-2">
                                  {dependent.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  editItem(dependent, setShowTravelPlanModal)
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteDependent(
                                    dependent._id || dependent.id || ""
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {travelPlans.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No dependents added yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg">
                        Extracurricular Activities
                      </CardTitle>
                      <div className="flex gap-2">
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{activity.name}</h3>
                              <p className="text-brand-primary text-sm">
                                {activity.type}
                              </p>
                              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                <p>Role: {activity.role}</p>
                                {activity.organization && (
                                  <p>Organization: {activity.organization}</p>
                                )}
                                <p>
                                  Duration: {activity.startDate} -{" "}
                                  {activity.current
                                    ? "Present"
                                    : activity.endDate}
                                </p>
                                <p>
                                  Time Commitment: {activity.timeCommitment}
                                </p>
                              </div>
                              {activity.description && (
                                <p className="text-sm mt-2">
                                  {activity.description}
                                </p>
                              )}
                              {activity.achievements.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">
                                    Achievements:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {activity.achievements.map(
                                      (achievement, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {achievement}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                              {activity.skillsDeveloped.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">
                                    Skills Developed:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {activity.skillsDeveloped.map(
                                      (skill, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {skill}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  editItem(activity, setShowActivityModal)
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteActivity(
                                    activity._id || activity.id || ""
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
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
            isLoading={isLoading || updateTeacherProfile.isPending}
            error={error}
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
      )}
    </DashboardLayout>
  );
};

export default TeacherProfile;
