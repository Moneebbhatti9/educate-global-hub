import { useState } from "react";
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
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { ProfileSummaryModal } from "@/components/Modals/profile-summary-modal";

const SchoolProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Modal states
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Mock school profile data
  const [profile, setProfile] = useState({
    schoolInfo: {
      schoolName: "Lincoln International Academy",
      schoolEmail: "info@lincolnacademy.edu",
      schoolContactNumber: "+1 (555) 123-4567",
      alternateContact: "+1 (555) 987-6543",
      country: "United States",
      city: "Boston",
      state: "Massachusetts",
      zipCode: "02101",
      address: "456 Education Boulevard",
      schoolWebsite: "www.lincolnacademy.edu",
      establishedYear: "1995",
      registrationNumber: "MA-EDU-1995-456",
    },
    curriculum: [
      "International Baccalaureate",
      "American Curriculum",
      "Advanced Placement",
    ],
    schoolSize: "Large (1001+ students)",
    schoolType: "International",
    genderType: "Mixed",
    ageGroup: [
      "Primary (6-11 years)",
      "Secondary (12-16 years)",
      "Sixth Form/High School (17-18 years)",
    ],
    aboutSchool:
      "Lincoln International Academy is a premier educational institution committed to fostering global citizenship and academic excellence. Our diverse community of learners represents over 40 nationalities, creating a rich multicultural environment that prepares students for success in an interconnected world.",
    professionalSummary:
      "Lincoln International Academy stands as a beacon of educational excellence in the heart of Boston, serving a vibrant community of over 1,200 students from more than 40 countries. Our comprehensive international curriculum, combined with state-of-the-art facilities and world-class faculty, creates an environment where academic rigor meets global perspective. We are committed to developing not just academically successful students, but globally-minded citizens who will shape the future.",
    mission:
      "To provide an exceptional international education that develops inquiring, knowledgeable, and caring young people who help to create a better and more peaceful world through intercultural understanding and respect.",
    vision:
      "To be a leading international school that inspires students to achieve their full potential and become responsible global citizens.",
    careerObjectives:
      "Lincoln International Academy seeks to continue expanding our global reach and educational impact by attracting top-tier educators who share our commitment to international education. We aim to be the preferred destination for families seeking world-class education and for educators looking to make a meaningful difference in students' lives. Our goal is to maintain our position as a leader in international education while continuously innovating our teaching methodologies and student support systems.",
  });

  // Modal handlers
  const handleProfileSummaryUpdate = (data: {
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      aboutSchool: data.bio,
      professionalSummary: data.professionalSummary,
      careerObjectives: data.careerObjectives,
    }));
  };

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
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
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
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
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="school-info" className="text-xs sm:text-sm">
              School Info
            </TabsTrigger>
            <TabsTrigger value="academics" className="text-xs sm:text-sm">
              Academics
            </TabsTrigger>
            <TabsTrigger value="facilities" className="text-xs sm:text-sm">
              Facilities
            </TabsTrigger>
            <TabsTrigger value="staff" className="text-xs sm:text-sm">
              Staff
            </TabsTrigger>
            <TabsTrigger value="admissions" className="text-xs sm:text-sm">
              Admissions
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

                {profile.professionalSummary && (
                  <div>
                    <h4 className="font-semibold mb-2">Detailed Overview</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.professionalSummary}
                    </p>
                  </div>
                )}

                {profile.careerObjectives && (
                  <div>
                    <h4 className="font-semibold mb-2">Institutional Goals</h4>
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
                <CardTitle className="font-heading text-lg flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  School Details & Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        value={profile.schoolInfo.schoolName}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolEmail">School Email *</Label>
                      <Input
                        id="schoolEmail"
                        type="email"
                        value={profile.schoolInfo.schoolEmail}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolContactNumber">
                        Primary Contact *
                      </Label>
                      <Input
                        id="schoolContactNumber"
                        value={profile.schoolInfo.schoolContactNumber}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alternateContact">
                        Alternate Contact
                      </Label>
                      <Input
                        id="alternateContact"
                        value={profile.schoolInfo.alternateContact}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolWebsite">School Website</Label>
                      <Input
                        id="schoolWebsite"
                        value={profile.schoolInfo.schoolWebsite}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <DatePicker
                        id="establishedYear"
                        value={
                          profile.schoolInfo.establishedYear
                            ? new Date(profile.schoolInfo.establishedYear)
                            : undefined
                        }
                        onValueChange={(date) => {
                          if (date) {
                            setProfile((prev) => ({
                              ...prev,
                              schoolInfo: {
                                ...prev.schoolInfo,
                                establishedYear: date.getFullYear().toString(),
                              },
                            }));
                          }
                        }}
                        placeholder="Select year"
                        disabled={!isEditing}
                        max={new Date()}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={profile.schoolInfo.country}
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
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profile.schoolInfo.city}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={profile.schoolInfo.state}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={profile.schoolInfo.zipCode}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={profile.schoolInfo.address}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber">
                        Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={profile.schoolInfo.registrationNumber}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* School Classification */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    School Classification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="schoolType">School Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={profile.schoolType} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="international">
                            International
                          </SelectItem>
                          <SelectItem value="charter">Charter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="schoolSize">School Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={profile.schoolSize} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">
                            Small (1-500 students)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (501-1000 students)
                          </SelectItem>
                          <SelectItem value="large">
                            Large (1001+ students)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="genderType">Gender Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={profile.genderType} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="boys-only">Boys Only</SelectItem>
                          <SelectItem value="girls-only">Girls Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* About School */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    About the School
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aboutSchool">School Description</Label>
                      <Textarea
                        id="aboutSchool"
                        value={profile.aboutSchool}
                        rows={4}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mission">Mission Statement</Label>
                      <Textarea
                        id="mission"
                        value={profile.mission}
                        rows={3}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vision">Vision Statement</Label>
                      <Textarea
                        id="vision"
                        value={profile.vision}
                        rows={3}
                        readOnly={!isEditing}
                      />
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
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Academic Programs & Curriculum
                  </CardTitle>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Program
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Curriculum Offered</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {[
                        "International Baccalaureate",
                        "American Curriculum",
                        "British Curriculum",
                        "Advanced Placement",
                        "Cambridge IGCSE",
                        "National Curriculum",
                      ].map((curr, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            title={curr}
                            aria-label={curr}
                            type="checkbox"
                            id={`curr-${index}`}
                            checked={profile.curriculum.includes(curr)}
                            className="rounded border-border"
                          />
                          <Label htmlFor={`curr-${index}`} className="text-sm">
                            {curr}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Age Groups Served</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {[
                        "Early Years (2-5 years)",
                        "Primary (6-11 years)",
                        "Secondary (12-16 years)",
                        "Sixth Form/High School (17-18 years)",
                      ].map((age, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            title={age}
                            type="checkbox"
                            id={`age-${index}`}
                            checked={profile.ageGroup.includes(age)}
                            className="rounded border-border"
                          />
                          <Label htmlFor={`age-${index}`} className="text-sm">
                            {age}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs would follow similar pattern... */}
          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  School Facilities & Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  School facilities and infrastructure details...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Staff & Faculty Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Staff and faculty management section...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Admissions & Enrollment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Admissions process and requirements section...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  School Media & Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">School Photos</h4>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Upload school photos and campus images
                      </p>
                      <Button variant="outline">Choose Images</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">School Documents</h4>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Upload brochures, handbooks, and other documents
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
        />
      </div>
    </DashboardLayout>
  );
};

export default SchoolProfile;
