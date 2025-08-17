import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Building
} from "lucide-react";

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
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Beginner';
}

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

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
        postalCode: "02101"
      }
    },
    bio: "Passionate mathematics educator with 8+ years of experience in middle and high school education. Specializes in making complex mathematical concepts accessible and engaging for all learners.",
    subjects: ["Mathematics", "Algebra", "Geometry", "Statistics"],
    yearsOfExperience: 8,
    qualifications: [
      "Master of Education in Mathematics",
      "Bachelor of Science in Mathematics", 
      "Teaching License (Mathematics 6-12)",
      "PGCE Certified"
    ]
  });

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: "",
      employer: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: "",
      contactPerson: ""
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
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
                    {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-3">{profile.personalInfo.title}</p>
                  <p className="text-foreground max-w-2xl mb-4">{profile.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="bg-brand-primary/10 text-brand-primary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.personalInfo.address.city}, {profile.personalInfo.address.state}
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
                    {isEditing ? "Save Changes" : "Edit Profile"}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
              <TabsTrigger value="employment" className="text-xs sm:text-sm">Employment</TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm">Education</TabsTrigger>
              <TabsTrigger value="qualifications" className="text-xs sm:text-sm">Qualifications</TabsTrigger>
              <TabsTrigger value="development" className="text-xs sm:text-sm">Development</TabsTrigger>
              <TabsTrigger value="referees" className="text-xs sm:text-sm">Referees</TabsTrigger>
              <TabsTrigger value="additional" className="text-xs sm:text-sm">Additional</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Quick Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-semibold">{profile.yearsOfExperience} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subjects</span>
                      <span className="font-semibold">{profile.subjects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Qualifications</span>
                      <span className="font-semibold">{profile.qualifications.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Profile Complete</span>
                      <span className="font-semibold text-brand-accent-green">85%</span>
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
                    {profile.qualifications.slice(0, 3).map((qual, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium text-sm">{qual}</div>
                        <div className="text-xs text-muted-foreground mt-1">2023</div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Qualifications
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{profile.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{profile.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {profile.personalInfo.address.city}, {profile.personalInfo.address.country}
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
                  <CardTitle className="font-heading text-lg flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Details & Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          value={profile.personalInfo.firstName}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          value={profile.personalInfo.lastName}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title" 
                          value={profile.personalInfo.title}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          type="date"
                          value={profile.personalInfo.dateOfBirth}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <Input 
                          id="placeOfBirth" 
                          value={profile.personalInfo.placeOfBirth}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={profile.personalInfo.nationality} />
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="alternatePhone">Alternate Phone</Label>
                        <Input 
                          id="alternatePhone" 
                          value={profile.personalInfo.alternatePhone}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profile.personalInfo.email}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportNo">Passport Number</Label>
                        <Input 
                          id="passportNo" 
                          value={profile.personalInfo.passportNo}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={profile.personalInfo.gender} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={profile.personalInfo.maritalStatus} />
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
                    <h3 className="font-semibold text-lg mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input 
                          id="street" 
                          value={profile.personalInfo.address.street}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          value={profile.personalInfo.address.city}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input 
                          id="state" 
                          value={profile.personalInfo.address.state}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={profile.personalInfo.address.country} />
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input 
                          id="linkedin" 
                          value={profile.personalInfo.linkedIn}
                          readOnly={!isEditing}
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
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {["English (Native)", "Spanish (Fluent)", "French (Intermediate)"].map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{lang}</span>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
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
                    <Button variant="outline" onClick={addExperience}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Position
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sample Employment Entry */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Mathematics Teacher</h3>
                        <p className="text-muted-foreground">Lincoln High School</p>
                        <p className="text-sm text-muted-foreground">Boston, MA • Sep 2019 - Present</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
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
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label>Contact Person</Label>
                        <Input 
                          value="Dr. Maria Rodriguez, Principal - mrodriguez@lincolnhs.edu"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add more employment entries as needed */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Mathematics Tutor</h3>
                        <p className="text-muted-foreground">Academic Success Center</p>
                        <p className="text-sm text-muted-foreground">Boston, MA • Jun 2018 - Aug 2019</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
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
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label>Contact Person</Label>
                        <Input 
                          value="James Wilson, Center Director - jwilson@academicsuccess.com"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional tabs would follow similar pattern... */}
            {/* For brevity, I'll add placeholder content for the remaining tabs */}
            
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Educational Background
                    </CardTitle>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Educational background section with university and school education details...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Teacher Qualifications & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Qualifications, certifications, and licenses section...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Professional Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Professional development, courses, and memberships section...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referees" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Professional Referees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Professional references section...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Travel Plans & Dependents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Travel plans and dependent information...</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Extracurricular Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Extracurricular activities and achievements...</p>
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
                      <p className="text-muted-foreground mb-4">Upload your CV (PDF or DOC format)</p>
                      <Button variant="outline">
                        Choose File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherProfile;