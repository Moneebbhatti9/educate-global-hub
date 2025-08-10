import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const GDPRCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-brand-primary" />
              <h1 className="text-2xl font-bold">GDPR Compliance</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">GDPR Commitment</h3>
            <p className="text-blue-800">
              Educate Link is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Rights Under GDPR</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Right to Access</h3>
                <p className="text-gray-700 text-sm">Request copies of your personal data</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Right to Rectification</h3>
                <p className="text-gray-700 text-sm">Request correction of inaccurate data</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Right to Erasure</h3>
                <p className="text-gray-700 text-sm">Request deletion of your data</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Right to Portability</h3>
                <p className="text-gray-700 text-sm">Request transfer of your data</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Data Processing</h2>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-700 mb-4">
                We process your personal data only when we have a lawful basis to do so, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Your consent</li>
                <li>Contract performance</li>
                <li>Legal obligations</li>
                <li>Legitimate interests</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Our DPO</h2>
            <div className="bg-brand-primary/5 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                For GDPR-related inquiries, contact our Data Protection Officer:
              </p>
              <p className="text-gray-700"><strong>Email:</strong> dpo@educatelink.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPRCompliance;