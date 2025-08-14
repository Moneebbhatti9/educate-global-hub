import { Link } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  Eye,
  Share2,
  MessageCircle,
  ArrowRight,
  Calendar,
  Globe,
  Briefcase,
  Building2,
  MapPin,
  GraduationCap,
  Clock,
  Plus,
} from "lucide-react";

const JobPostSuccess = () => {
  // This would normally come from the submitted job data
  const jobData = {
    title: "Mathematics Teacher - Secondary",
    organization: "Dubai International School",
    location: "Dubai, UAE",
    educationLevel: "Secondary (Grades 9-12)",
    subjects: ["Mathematics", "Statistics"],
    postedDate: new Date().toLocaleDateString(),
    expiryDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  };

  const nextSteps = [
    {
      icon: Users,
      title: "Monitor Applications",
      description: "Track candidates as they apply to your position",
      action: "View Candidates",
      href: "/dashboard/school/candidates",
      color: "text-brand-primary",
    },
    {
      icon: Share2,
      title: "Share Your Job",
      description: "Spread the word through your networks and social media",
      action: "Share Job",
      href: "#",
      color: "text-brand-accent-green",
    },
    {
      icon: MessageCircle,
      title: "Engage with Community",
      description: "Connect with educators in our forum",
      action: "Visit Forum",
      href: "/forum",
      color: "text-brand-secondary",
    },
    {
      icon: Briefcase,
      title: "Manage Postings",
      description: "View and edit all your job postings",
      action: "Manage Jobs",
      href: "/dashboard/school/postings",
      color: "text-brand-accent-orange",
    },
  ];

  const tips = [
    {
      title: "Respond Quickly",
      description:
        "Top candidates often receive multiple offers. Quick responses improve your chances.",
    },
    {
      title: "Complete School Profile",
      description:
        "A detailed school profile attracts 3x more quality applications.",
    },
    {
      title: "Use Screening Questions",
      description:
        "Pre-screening helps you identify the most suitable candidates efficiently.",
    },
    {
      title: "Promote Your Culture",
      description:
        "Highlight your school's unique culture and values to attract aligned candidates.",
    },
  ];

  return (
    <DashboardLayout role="school">
      <div className="space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-brand-accent-green/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-brand-accent-green" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Job Posted Successfully! 🎉
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your job posting is now live and visible to qualified educators
              worldwide.
            </p>
          </div>
        </div>

        {/* Job Summary Card */}
        <Card className="border-brand-accent-green/20 bg-brand-accent-green/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-brand-accent-green" />
                  <span>Your Job is Now Live</span>
                </CardTitle>
                <CardDescription>
                  Here's a summary of your published job posting
                </CardDescription>
              </div>
              <Badge className="bg-brand-accent-green text-white">
                Published
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{jobData.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.organization}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{jobData.educationLevel}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {jobData.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Posted</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jobData.postedDate}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Expires</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jobData.expiryDate}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Job Posting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
            What's Next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-card-hover transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={step.href}>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-muted/50 transition-colors"
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips for Success */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Tips for Recruiting Success
            </CardTitle>
            <CardDescription>
              Maximize your chances of finding the perfect candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard/school/postings">
            <Button variant="outline" className="w-full sm:w-auto">
              <Briefcase className="w-4 h-4 mr-2" />
              View All Job Postings
            </Button>
          </Link>
          <Link to="/dashboard/school/post-job">
            <Button variant="hero" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Post Another Job
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostSuccess;
