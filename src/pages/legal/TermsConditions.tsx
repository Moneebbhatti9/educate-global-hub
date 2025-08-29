import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, Users, AlertTriangle } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-brand-primary" />
              <span className="font-heading font-bold text-xl">
                Educate Link
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-secondary" />
              </div>
              <h1 className="font-heading font-bold text-4xl text-foreground">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our
              platform.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: March 15, 2024
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span>Acceptance of Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  By accessing and using Educate Link, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>
                    You agree to provide accurate and complete information
                  </li>
                  <li>You are responsible for maintaining account security</li>
                  <li>
                    You agree to comply with all applicable laws and regulations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-accent-green/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-accent-green" />
                  </div>
                  <span>User Accounts & Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  When you create an account with us, you must provide accurate
                  and complete information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>
                    Update your information to keep it current and accurate
                  </li>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Respect other users and maintain professional conduct</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <span>Platform Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Our platform is designed to connect educators with educational
                  institutions. Users agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Use the platform for educational and professional purposes
                    only
                  </li>
                  <li>
                    Provide truthful information in profiles and applications
                  </li>
                  <li>Respect intellectual property rights</li>
                  <li>
                    Not engage in spam, harassment, or inappropriate behavior
                  </li>
                  <li>
                    Not circumvent security measures or access restrictions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-accent-orange/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-brand-accent-orange" />
                  </div>
                  <span>Prohibited Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  The following activities are strictly prohibited on our
                  platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Posting false, misleading, or fraudulent information</li>
                  <li>Harassment, discrimination, or inappropriate content</li>
                  <li>
                    Attempting to hack, breach, or compromise platform security
                  </li>
                  <li>Using automated tools to scrape or collect data</li>
                  <li>Impersonating other users or organizations</li>
                  <li>Violating applicable laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Educate Link provides the platform "as is" and makes no
                  warranties about:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    The accuracy or completeness of user-provided information
                  </li>
                  <li>The success of job applications or hiring processes</li>
                  <li>Uninterrupted or error-free platform operation</li>
                  <li>
                    Third-party content or services linked from our platform
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Our liability is limited to the maximum extent permitted by
                  law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Email notifications to registered users</li>
                  <li>Platform announcements and notices</li>
                  <li>Updates to this terms page with revision dates</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Continued use of the platform after changes constitutes
                  acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about these terms and conditions, please contact
                  us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong> legal@educatelink.com
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Education Street, Knowledge
                    City, KC 12345
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Links */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-brand-primary hover:underline"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-brand-primary hover:underline">
                Terms & Conditions
              </Link>
              <Link to="/gdpr" className="text-brand-primary hover:underline">
                GDPR Compliance
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
