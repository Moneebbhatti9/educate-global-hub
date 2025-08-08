import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Building, 
  Users, 
  DollarSign, 
  Calendar,
  GraduationCap,
  Award,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();

  // Sample job data - in real app this would be fetched based on ID
  const job = {
    id: 1,
    title: "Mathematics Teacher",
    school: "International School of London",
    location: "London, United Kingdom",
    continent: "Europe",
    type: "Full-time",
    salary: "$45,000 - $55,000",
    experience: "2-3 years",
    posted: "2 days ago",
    deadline: "March 15, 2024",
    startDate: "September 2024",
    description: "We are seeking an enthusiastic and dedicated Mathematics teacher to join our dynamic team at the International School of London. The successful candidate will teach Key Stage 3 & 4 students and contribute to our innovative mathematics program.",
    subjects: ["Mathematics", "Statistics", "Pre-calculus"],
    benefits: ["Health Insurance", "Professional Development", "Housing Allowance", "Pension Scheme"],
    requirements: [
      "Bachelor's degree in Mathematics or related field",
      "Teaching qualification (PGCE, QTS, or equivalent)",
      "Minimum 2 years of teaching experience",
      "Experience with British curriculum preferred",
      "Strong classroom management skills",
      "Excellent communication skills in English"
    ],
    responsibilities: [
      "Plan and deliver engaging mathematics lessons",
      "Assess and track student progress",
      "Participate in department meetings and professional development",
      "Support students with varying abilities and learning needs",
      "Contribute to school events and activities",
      "Maintain accurate records and reports"
    ],
    schoolInfo: {
      name: "International School of London",
      established: "1972",
      students: "1,200+",
      curriculum: "British International",
      website: "www.isl-london.edu",
      about: "A leading international school in the heart of London, providing world-class education to students from over 50 countries."
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/jobs" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <CardTitle className="font-heading text-2xl sm:text-3xl text-foreground">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.school}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.continent}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-brand-accent-green" />
                    <div className="text-sm font-medium">Salary</div>
                    <div className="text-xs text-muted-foreground">{job.salary}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-brand-secondary" />
                    <div className="text-sm font-medium">Experience</div>
                    <div className="text-xs text-muted-foreground">{job.experience}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-brand-primary" />
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-xs text-muted-foreground">{job.startDate}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-brand-accent-orange" />
                    <div className="text-sm font-medium">Deadline</div>
                    <div className="text-xs text-muted-foreground">{job.deadline}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">About This Position</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Subjects & Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-brand-accent-green mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-brand-primary mr-3 mt-2.5 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Apply for this Position</CardTitle>
                <CardDescription>
                  Join our team and make a difference in students' lives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="hero" size="lg" className="w-full">
                  Apply Now
                </Button>
                <Button variant="hero-outline" size="lg" className="w-full">
                  Save for Later
                </Button>
                <Separator />
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Posted {job.posted}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Apply by {job.deadline}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-brand-accent-green mr-2" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* School Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">About the School</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{job.schoolInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">{job.schoolInfo.about}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Established:</span>
                    <div className="font-medium">{job.schoolInfo.established}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Students:</span>
                    <div className="font-medium">{job.schoolInfo.students}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Curriculum:</span>
                    <div className="font-medium">{job.schoolInfo.curriculum}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Visit School Website
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;