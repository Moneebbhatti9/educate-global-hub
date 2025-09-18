import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  School,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  BookOpen,
  MessageSquare,
  Phone,
  ExternalLink,
} from "lucide-react";
import EducateLink2 from "@/assets/Educate-Link-2.png";
import { useAuth } from "@/contexts/AuthContext";
import { customToast } from "@/components/ui/sonner";

interface LocationState {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  message?: string;
}

const SchoolApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, checkUserStatus } = useAuth();
  const state = location.state as LocationState;
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Show success message on component mount
  useEffect(() => {
    if (state && state.message) {
      customToast.success("Profile Completed!", state.message);
    }
  }, [state]);

  // Don't render if no state data
  if (!state || !state.email) {
    return null;
  }

  const handleCheckStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const statusResult = await checkUserStatus();

      if (statusResult.redirectTo === "dashboard") {
        // User is approved, redirect to dashboard
        customToast.success(
          "Account Approved!",
          "Your school account has been approved. Welcome to your dashboard!"
        );
        navigate(`/dashboard/${state.role}`);
      } else if (statusResult.redirectTo === "pending-approval") {
        // Still pending approval
        customToast.info(
          "Still Pending",
          "Your account is still under review. Please check back later."
        );
      }
    } catch (error) {
      customToast.error(
        "Status Check Failed",
        "Unable to check your account status. Please try again later."
      );
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  const handleContactSupport = () => {
    // Open email client with pre-filled subject
    const subject = encodeURIComponent("School Account Approval Inquiry");
    const body = encodeURIComponent(
      `Hello Educate Global Hub Team,\n\nI am writing to inquire about the status of my school account approval.\n\nAccount Details:\n- Name: ${state.firstName} ${state.lastName}\n- Email: ${state.email}\n- Role: School\n\nPlease let me know if you need any additional information.\n\nThank you for your time.\n\nBest regards,\n${state.firstName} ${state.lastName}`
    );
    window.open(
      `mailto:admin@educateglobalhub.com?subject=${subject}&body=${body}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-64 flex items-center justify-center">
                <img
                  src={EducateLink2}
                  alt="Educate Link"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
              Welcome to{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Educate Global Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your school profile has been completed successfully! We're now
              reviewing your account to ensure the best experience for our
              education community.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-card border-l-4 border-l-brand-accent-green">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-brand-accent-green/10 rounded-full flex items-center justify-center">
                      <School className="w-6 h-6 text-brand-accent-green" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-2xl">
                        School Account Review
                      </CardTitle>
                      <CardDescription className="text-base">
                        Your account is being reviewed by our team
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Under Review
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Typically takes 1-2 business days
                    </span>
                  </div>

                  {/* Review Process */}
                  <div className="bg-gradient-to-r from-brand-accent-green/5 to-brand-primary/5 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-brand-accent-green mr-2" />
                      What We're Reviewing
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-brand-accent-green rounded-full mt-2 flex-shrink-0" />
                        <span>School information and credentials</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-brand-accent-green rounded-full mt-2 flex-shrink-0" />
                        <span>Contact details and verification</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-brand-accent-green rounded-full mt-2 flex-shrink-0" />
                        <span>Educational program alignment</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-brand-accent-green rounded-full mt-2 flex-shrink-0" />
                        <span>Community standards compliance</span>
                      </li>
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4 text-blue-900">
                      What Happens Next?
                    </h3>
                    <div className="space-y-3 text-blue-800">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-800">
                            1
                          </span>
                        </div>
                        <span>
                          Our team reviews your school profile and credentials
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-800">
                            2
                          </span>
                        </div>
                        <span>
                          You'll receive an email notification once approved
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-800">
                            3
                          </span>
                        </div>
                        <span>
                          Access your school dashboard and start recruiting
                          teachers
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleCheckStatus}
                      disabled={isCheckingStatus}
                      className="flex-1 bg-brand-accent-green hover:bg-brand-accent-green/90"
                    >
                      {isCheckingStatus ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Checking Status...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Check Approval Status
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleContactSupport}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{state.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {state.firstName} {state.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <School className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">School Account</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-card bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Need Help?
                  </CardTitle>
                  <CardDescription>
                    Contact our support team for assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-brand-primary" />
                      <div>
                        <p className="text-sm font-medium">Email Support</p>
                        <a
                          href="mailto:admin@educateglobalhub.com"
                          className="text-sm text-brand-primary hover:underline"
                        >
                          admin@educateglobalhub.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-brand-primary" />
                      <div>
                        <p className="text-sm font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactSupport}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              {/* Platform Benefits */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-4 h-4 text-brand-accent-green mt-1" />
                      <div>
                        <p className="text-sm font-medium">Post Job Openings</p>
                        <p className="text-xs text-muted-foreground">
                          Recruit qualified teachers worldwide
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="w-4 h-4 text-brand-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium">
                          Access Teacher Profiles
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Browse verified educator profiles
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-4 h-4 text-brand-secondary mt-1" />
                      <div>
                        <p className="text-sm font-medium">Join Community</p>
                        <p className="text-xs text-muted-foreground">
                          Connect with education professionals
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/about")}
                className="text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SchoolApproval;
