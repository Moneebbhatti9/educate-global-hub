import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalDashboardLayout from "@/layout/GlobalDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  Send,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Star,
  FileText,
  User,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coverLetter: "",
    expectedSalary: "",
    availableFrom: "",
    reasonForApplying: "",
    additionalComments: "",
    agreeToTerms: false,
  });

  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});

  // Mock job data - in real app this would be fetched based on jobId
  const job = {
    id: parseInt(jobId || "1"),
    title: "Mathematics Teacher - Secondary",
    school: "Dubai International School",
    location: "Dubai, UAE",
    educationLevel: "Secondary (Grades 9-12)",
    subjects: ["Mathematics", "Statistics"],
    salaryRange: "$4,000 - $6,000",
    currency: "USD",
    type: "Full-time",
    description: "We are seeking an experienced Mathematics teacher to join our Secondary department. The ideal candidate will have strong classroom management skills and experience with international curricula.",
    requirements: [
      "Bachelor's degree in Mathematics or related field",
      "3+ years teaching experience", 
      "International curriculum experience preferred",
      "PGCE or equivalent teaching qualification",
      "Strong communication skills in English"
    ],
    benefits: ["Health Insurance", "Housing Allowance", "Annual Flight", "Professional Development"],
    rating: 4.8,
    reviews: 156,
    quickApply: true,
    visaSponsorship: true,
    screeningQuestions: [
      "Do you have experience teaching the IB Mathematics curriculum?",
      "Are you comfortable using educational technology in your teaching?",
      "How would you handle a classroom with diverse learning abilities?",
      "What is your preferred teaching methodology for mathematics?"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", { formData, screeningAnswers, jobId });
    navigate("/dashboard/teacher/apply/success");
  };

  const handleScreeningAnswer = (question: string, answer: string) => {
    setScreeningAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  return (
    <GlobalDashboardLayout
      role="teacher"
      userName="Sarah Johnson"
      userEmail="sarah.johnson@email.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/teacher/jobs")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Search
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Apply for Position
            </h1>
            <p className="text-muted-foreground">
              Complete your application for this teaching position
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Position Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{job.school}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{job.salaryRange} {job.currency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{job.rating} ({job.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <div className="space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {job.visaSponsorship && (
                  <div className="p-3 bg-brand-accent-green/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-brand-accent-green" />
                      <span className="text-sm font-medium text-brand-accent-green">
                        Visa Sponsorship Available
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your profile information will be automatically included
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value="Sarah Johnson" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value="sarah.johnson@email.com" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value="+44 20 1234 5678" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Location</Label>
                      <Input value="London, UK" disabled />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      To update your personal information, visit your{" "}
                      <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate("/profile")}>
                        profile settings
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Cover Letter</span>
                  </CardTitle>
                  <CardDescription>
                    Tell the school why you're the perfect fit for this role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Your Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Dear Hiring Manager,

I am writing to express my interest in the Mathematics Teacher position at Dubai International School. With over 8 years of experience teaching secondary mathematics and a proven track record of improving student outcomes, I am excited about the opportunity to contribute to your academic team.

Throughout my career, I have..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                      rows={8}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum 200 characters recommended
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedSalary">Expected Salary (USD)</Label>
                      <Input
                        id="expectedSalary"
                        placeholder="e.g., 4500"
                        value={formData.expectedSalary}
                        onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Available From</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonForApplying">Why are you interested in this position?</Label>
                    <Textarea
                      id="reasonForApplying"
                      placeholder="Explain what attracts you to this role and school..."
                      value={formData.reasonForApplying}
                      onChange={(e) => setFormData({...formData, reasonForApplying: e.target.value})}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Screening Questions */}
              {job.screeningQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Questions</CardTitle>
                    <CardDescription>
                      Please answer these questions to help us understand your background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {job.screeningQuestions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`question-${index}`}>
                          {index + 1}. {question}
                        </Label>
                        <Textarea
                          id={`question-${index}`}
                          placeholder="Your answer..."
                          value={screeningAnswers[question] || ""}
                          onChange={(e) => handleScreeningAnswer(question, e.target.value)}
                          rows={3}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Your resume and other documents from your profile will be included
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-brand-primary" />
                        <div>
                          <p className="font-medium">Resume.pdf</p>
                          <p className="text-sm text-muted-foreground">Updated March 2024</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-brand-primary" />
                        <div>
                          <p className="font-medium">Certificates.pdf</p>
                          <p className="text-sm text-muted-foreground">PGCE & Teaching License</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Want to update your documents? Visit your{" "}
                      <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate("/profile")}>
                        profile settings
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="additionalComments">Anything else you'd like to add? (Optional)</Label>
                    <Textarea
                      id="additionalComments"
                      placeholder="Any additional information you'd like to share..."
                      value={formData.additionalComments}
                      onChange={(e) => setFormData({...formData, additionalComments: e.target.value})}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: !!checked})}
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                        I agree to the terms and conditions and privacy policy. I confirm that the information provided is accurate and complete.
                      </Label>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard/teacher/jobs")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        disabled={!formData.agreeToTerms}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </GlobalDashboardLayout>
  );
};

export default JobApplication;