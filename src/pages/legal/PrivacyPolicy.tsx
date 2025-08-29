import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Cookie, Lock } from "lucide-react";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-brand-primary" />
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
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-brand-primary" />
              </div>
              <h1 className="font-heading font-bold text-4xl text-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
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
                    <Shield className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as
                  when you create an account, update your profile, or contact
                  us.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Personal information (name, email address, phone number)
                  </li>
                  <li>
                    Professional information (education, experience,
                    certifications)
                  </li>
                  <li>Account preferences and settings</li>
                  <li>Communication records and correspondence</li>
                  <li>Usage data and analytics information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to provide, maintain, and
                  improve our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Create and manage your account</li>
                  <li>Connect educators with schools and institutions</li>
                  <li>Send important updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-accent-green/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-brand-accent-green" />
                  </div>
                  <span>Data Protection & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures
                  to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection practices</li>
                  <li>Compliance with international privacy standards</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong> privacy@educatelink.com
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

export default PrivacyPolicy;
