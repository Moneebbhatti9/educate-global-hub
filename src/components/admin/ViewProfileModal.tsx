import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  Globe,
  Users,
  Award,
} from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields based on role
  phoneNumber?: string;
  country?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  address?: string;
  qualification?: string;
  subject?: string;
  pgce?: boolean;
  yearsOfTeachingExperience?: number;
  professionalBio?: string;
  schoolName?: string;
  schoolEmail?: string;
  schoolContactNumber?: string;
  curriculum?: string[];
  schoolSize?: string;
  schoolType?: string;
  genderType?: string;
  ageGroup?: string[];
  schoolWebsite?: string;
  aboutSchool?: string;
}

interface ViewProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
}

export const ViewProfileModal = ({
  open,
  onOpenChange,
  userData,
}: ViewProfileModalProps) => {
  if (!userData) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-brand-primary text-white";
      case "school":
        return "bg-brand-accent-green text-white";
      case "recruiter":
        return "bg-brand-secondary text-white";
      case "supplier":
        return "bg-brand-accent-orange text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-accent-green text-white";
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "suspended":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile Details</DialogTitle>
          <DialogDescription>
            Complete profile information for{" "}
            {`${userData.firstName} ${userData.lastName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>
                    {`${userData.firstName} ${userData.lastName}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{`${userData.firstName} ${userData.lastName}`}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge className={getRoleColor(userData.role)}>
                      {userData.role.charAt(0).toUpperCase() +
                        userData.role.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(userData.status)}>
                      {userData.status.charAt(0).toUpperCase() +
                        userData.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Location:</strong> {userData.location}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Joined:</strong> {userData.joinDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Last Active:</strong> {userData.lastActive}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Teacher-specific information */}
          {userData.role === "teacher" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.phoneNumber && (
                    <div>
                      <strong>Phone:</strong> {userData.phoneNumber}
                    </div>
                  )}
                  {userData.country && (
                    <div>
                      <strong>Country:</strong> {userData.country}
                    </div>
                  )}
                  {userData.city && (
                    <div>
                      <strong>City:</strong> {userData.city}
                    </div>
                  )}
                  {userData.province && (
                    <div>
                      <strong>Province:</strong> {userData.province}
                    </div>
                  )}
                  {userData.zipCode && (
                    <div>
                      <strong>Zip Code:</strong> {userData.zipCode}
                    </div>
                  )}
                  {userData.address && (
                    <div className="md:col-span-2">
                      <strong>Address:</strong> {userData.address}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Professional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.qualification && (
                    <div>
                      <strong>Qualification:</strong> {userData.qualification}
                    </div>
                  )}
                  {userData.subject && (
                    <div>
                      <strong>Subject:</strong> {userData.subject}
                    </div>
                  )}
                  {userData.yearsOfTeachingExperience !== undefined && (
                    <div>
                      <strong>Experience:</strong>{" "}
                      {userData.yearsOfTeachingExperience} years
                    </div>
                  )}
                  {userData.pgce !== undefined && (
                    <div>
                      <strong>PGCE:</strong> {userData.pgce ? "Yes" : "No"}
                    </div>
                  )}
                  {userData.professionalBio && (
                    <div className="md:col-span-2">
                      <strong>Professional Bio:</strong>{" "}
                      {userData.professionalBio}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* School-specific information */}
          {userData.role === "school" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>School Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.schoolName && (
                    <div>
                      <strong>School Name:</strong> {userData.schoolName}
                    </div>
                  )}
                  {userData.schoolEmail && (
                    <div>
                      <strong>School Email:</strong> {userData.schoolEmail}
                    </div>
                  )}
                  {userData.schoolContactNumber && (
                    <div>
                      <strong>Contact Number:</strong>{" "}
                      {userData.schoolContactNumber}
                    </div>
                  )}
                  {userData.schoolWebsite && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>
                        <strong>Website:</strong>{" "}
                        <a
                          href={userData.schoolWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {userData.schoolWebsite}
                        </a>
                      </span>
                    </div>
                  )}
                  {userData.country && (
                    <div>
                      <strong>Country:</strong> {userData.country}
                    </div>
                  )}
                  {userData.city && (
                    <div>
                      <strong>City:</strong> {userData.city}
                    </div>
                  )}
                  {userData.province && (
                    <div>
                      <strong>Province:</strong> {userData.province}
                    </div>
                  )}
                  {userData.zipCode && (
                    <div>
                      <strong>Zip Code:</strong> {userData.zipCode}
                    </div>
                  )}
                  {userData.address && (
                    <div className="md:col-span-2">
                      <strong>Address:</strong> {userData.address}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>School Characteristics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.schoolSize && (
                    <div>
                      <strong>School Size:</strong> {userData.schoolSize}
                    </div>
                  )}
                  {userData.schoolType && (
                    <div>
                      <strong>School Type:</strong> {userData.schoolType}
                    </div>
                  )}
                  {userData.genderType && (
                    <div>
                      <strong>Gender Type:</strong> {userData.genderType}
                    </div>
                  )}
                  {userData.curriculum && userData.curriculum.length > 0 && (
                    <div className="md:col-span-2">
                      <strong>Curriculum:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userData.curriculum.map((curr, index) => (
                          <Badge key={index} variant="secondary">
                            {curr}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {userData.ageGroup && userData.ageGroup.length > 0 && (
                    <div className="md:col-span-2">
                      <strong>Age Groups:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userData.ageGroup.map((age, index) => (
                          <Badge key={index} variant="secondary">
                            {age}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {userData.aboutSchool && (
                    <div className="md:col-span-2">
                      <strong>About School:</strong> {userData.aboutSchool}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
