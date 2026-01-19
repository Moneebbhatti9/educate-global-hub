import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Download,
  Trash2,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink,
  History,
  Bell,
} from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import { useGDPR } from "@/apis/gdpr";

const DataPrivacyManager = () => {
  const { user, logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [showExportHistory, setShowExportHistory] = useState(false);

  // Use GDPR API hooks
  const {
    exportData,
    requestDeletion,
    exportHistory,
  } = useGDPR();

  // Export user data
  const handleExportData = async () => {
    try {
      const response = await exportData.mutateAsync();

      if (response.success) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `my-data-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        customToast.success("Your data has been exported successfully!");
      }
    } catch (error: any) {
      console.error("Export error:", error);
      customToast.error(
        "Export Failed",
        error.message || "Failed to export your data. Please try again."
      );
    }
  };

  // Request account deletion
  const handleDeleteRequest = async () => {
    if (confirmEmail !== user?.email) {
      customToast.error("Email Mismatch", "Please enter your email correctly to confirm deletion.");
      return;
    }

    try {
      const response = await requestDeletion.mutateAsync({
        confirmEmail,
        reason: deleteReason || "User requested deletion",
      });

      if (response.success) {
        customToast.success(
          "Deletion Request Submitted",
          "Your account will be deleted within 30 days as per GDPR requirements."
        );
        setDeleteDialogOpen(false);

        // Log out user after a short delay
        setTimeout(() => {
          logout();
        }, 3000);
      }
    } catch (error: any) {
      console.error("Deletion error:", error);
      customToast.error(
        "Request Failed",
        error.message || "Failed to submit deletion request. Please try again."
      );
    }
  };

  // Load export history
  const loadExportHistory = async () => {
    try {
      await exportHistory.refetch();
      setShowExportHistory(true);
    } catch (error) {
      console.error("Failed to load export history:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data Privacy & GDPR Rights
        </CardTitle>
        <CardDescription>
          Exercise your rights under the General Data Protection Regulation (GDPR).
          You have control over your personal data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Your Rights Overview */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rights">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Your GDPR Rights
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Right of Access (Article 15)</strong> - You can request a copy of all personal data we hold about you.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Right to Rectification (Article 16)</strong> - You can request correction of inaccurate personal data.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Right to Erasure (Article 17)</strong> - You can request deletion of your personal data.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Right to Data Portability (Article 20)</strong> - You can receive your data in a machine-readable format.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Right to Withdraw Consent</strong> - You can withdraw consent for data processing at any time.
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Data Export Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Your Data
              </h4>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data in JSON format.
                This includes your profile, applications, forum posts, and more.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleExportData}
              disabled={exportData.isPending}
              variant="outline"
            >
              {exportData.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Preparing Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={loadExportHistory}
              size="sm"
              disabled={exportHistory.isFetching}
            >
              {exportHistory.isFetching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <History className="h-4 w-4 mr-2" />
              )}
              Export History
            </Button>
          </div>

          {showExportHistory && exportHistory.data?.data && exportHistory.data.data.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h5 className="font-medium text-sm mb-2">Previous Exports</h5>
              <div className="space-y-2">
                {exportHistory.data.data.slice(0, 5).map((exportItem, index) => (
                  <div key={exportItem._id || index} className="text-xs text-muted-foreground flex justify-between">
                    <span>{new Date(exportItem.requestedAt).toLocaleString()}</span>
                    <span className="capitalize">{exportItem.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Data Retention Information */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Data Retention Policy
          </h4>
          <div className="text-sm text-muted-foreground space-y-2 bg-muted p-4 rounded-md">
            <p><strong>Account Data:</strong> Retained while your account is active, deleted within 30 days of deletion request.</p>
            <p><strong>Transaction Records:</strong> Retained for 7 years for legal compliance.</p>
            <p><strong>Communication Logs:</strong> Retained for 2 years.</p>
            <p><strong>Analytics Data:</strong> Anonymized after 26 months.</p>
          </div>
        </div>

        <Separator />

        {/* Contact DPO */}
        <div className="space-y-3">
          <h4 className="font-semibold">Contact Our Data Protection Officer</h4>
          <p className="text-sm text-muted-foreground">
            If you have any questions about how we handle your data or want to exercise your rights,
            you can contact our Data Protection Officer.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:dpo@educatelink.com">
                <ExternalLink className="h-4 w-4 mr-2" />
                Email DPO
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/gdpr" target="_blank">
                <FileText className="h-4 w-4 mr-2" />
                GDPR Policy
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/privacy" target="_blank">
                <FileText className="h-4 w-4 mr-2" />
                Privacy Policy
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Delete Account Section */}
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Danger Zone</AlertTitle>
            <AlertDescription>
              Deleting your account is permanent and cannot be undone. All your data will be
              permanently removed within 30 days.
            </AlertDescription>
          </Alert>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Request Account Deletion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Your Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Your account and all associated data will be
                  permanently deleted within 30 days as per GDPR requirements.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>What will be deleted:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile and account information</li>
                      <li>All job applications and saved jobs</li>
                      <li>Forum posts and replies</li>
                      <li>Uploaded resources</li>
                      <li>Reviews and ratings</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="confirm-email">
                    Type your email to confirm: <strong>{user?.email}</strong>
                  </Label>
                  <Input
                    id="confirm-email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delete-reason">
                    Reason for leaving (optional)
                  </Label>
                  <Textarea
                    id="delete-reason"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Help us improve by sharing why you're leaving..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setConfirmEmail("");
                    setDeleteReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteRequest}
                  disabled={requestDeletion.isPending || confirmEmail !== user?.email}
                >
                  {requestDeletion.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyManager;
