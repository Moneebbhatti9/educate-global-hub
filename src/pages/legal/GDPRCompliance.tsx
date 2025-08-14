import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Users, FileText, Download, Eye, Trash2 } from "lucide-react";

const GDPRCompliance = () => {
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
              <span className="font-heading font-bold text-xl">Educate Link</span>
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
              <div className="w-12 h-12 bg-brand-accent-green/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-accent-green" />
              </div>
              <h1 className="font-heading font-bold text-4xl text-foreground">
                GDPR Compliance
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).
            </p>
            <p className="text-sm text-muted-foreground">
              Effective from: May 25, 2018 | Last updated: March 15, 2024
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
                  <span>What is GDPR?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It gives individuals more control over their personal data and requires organizations to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Obtain clear consent for data processing</li>
                  <li>Provide transparent information about data use</li>
                  <li>Implement appropriate security measures</li>
                  <li>Respect individual rights regarding personal data</li>
                  <li>Report data breaches within 72 hours</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <span>Your Rights Under GDPR</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  As a data subject, you have the following rights under GDPR:
                </p>
                
                <div className="grid gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="w-5 h-5 text-brand-primary" />
                      <h4 className="font-semibold">Right to Access</h4>
                      <Badge variant="outline">Article 15</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can request a copy of the personal data we hold about you.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-brand-accent-green" />
                      <h4 className="font-semibold">Right to Rectification</h4>
                      <Badge variant="outline">Article 16</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can request correction of inaccurate or incomplete personal data.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold">Right to Erasure</h4>
                      <Badge variant="outline">Article 17</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can request deletion of your personal data under certain circumstances.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Download className="w-5 h-5 text-brand-secondary" />
                      <h4 className="font-semibold">Right to Data Portability</h4>
                      <Badge variant="outline">Article 20</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can request your data in a structured, machine-readable format.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Ensure GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  We have implemented comprehensive measures to ensure GDPR compliance:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-brand-primary/5 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-brand-primary">Legal Basis for Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      We process personal data based on legitimate interests, consent, contract fulfillment, and legal obligations.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-accent-green/5 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-brand-accent-green">Data Protection by Design</h4>
                    <p className="text-sm text-muted-foreground">
                      Privacy considerations are built into our systems and processes from the ground up.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-secondary/5 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-brand-secondary">Regular Audits & Assessments</h4>
                    <p className="text-sm text-muted-foreground">
                      We conduct regular data protection impact assessments and security audits.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-accent-orange/5 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-brand-accent-orange">Staff Training</h4>
                    <p className="text-sm text-muted-foreground">
                      All staff receive regular training on GDPR requirements and data protection best practices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Processing Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We process personal data for the following purposes:
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Account Management</h4>
                      <p className="text-sm text-muted-foreground">Creating and managing user accounts</p>
                    </div>
                    <Badge variant="outline">Consent</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Job Matching</h4>
                      <p className="text-sm text-muted-foreground">Connecting educators with institutions</p>
                    </div>
                    <Badge variant="outline">Legitimate Interest</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Communication</h4>
                      <p className="text-sm text-muted-foreground">Sending notifications and updates</p>
                    </div>
                    <Badge variant="outline">Contract</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Analytics</h4>
                      <p className="text-sm text-muted-foreground">Platform improvement and optimization</p>
                    </div>
                    <Badge variant="outline">Legitimate Interest</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercising Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To exercise your GDPR rights, please contact us using the following methods:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Online Request Form</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use our secure online form to submit data protection requests.
                    </p>
                    <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90">
                      Submit Request
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-sm text-muted-foreground">gdpr@educatelink.com</p>
                    </div>
                    <div className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium mb-1">Response Time</h4>
                      <p className="text-sm text-muted-foreground">Within 30 days</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700">
                    We may need to verify your identity before processing certain requests. This helps protect your personal data from unauthorized access.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Our Data Protection Officer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our Data Protection Officer is available to answer questions about GDPR compliance and data protection:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> dpo@educatelink.com</p>
                  <p><strong>Address:</strong> Data Protection Officer, 123 Education Street, Knowledge City, KC 12345</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567 ext. 101</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Links */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/legal/privacy" className="text-brand-primary hover:underline">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="text-brand-primary hover:underline">
                Terms & Conditions
              </Link>
              <Link to="/legal/cookies" className="text-brand-primary hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GDPRCompliance;