import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (consentText: string) => void;
  isLoading?: boolean;
}

const CONSENT_TEXT =
  "I consent to share my professional profile information (name, subject, qualifications, teaching experience, location, professional bio, and certifications) with schools on the Educate Link platform for recruitment purposes. I understand that my personal contact details (email, phone, address, passport number, date of birth) will NOT be shared. This consent is valid for 1 year and I can withdraw at any time.";

const ConsentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ConsentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Join Talent Pool
              </DialogTitle>
              <DialogDescription>
                By opting in, you consent to share your professional profile with
                schools looking for teachers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">What data is shared:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Name</li>
              <li>Subject and qualifications</li>
              <li>Teaching experience</li>
              <li>Location (city, country)</li>
              <li>Professional bio</li>
              <li>Certifications</li>
            </ul>

            <p className="font-medium mt-3 mb-2">What is NOT shared:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Email address</li>
              <li>Phone number</li>
              <li>Street address</li>
              <li>Passport number</li>
              <li>Date of birth</li>
            </ul>

            <p className="mt-3 text-xs text-muted-foreground">
              Consent valid for 1 year. You can withdraw at any time from your
              profile page.
            </p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(CONSENT_TEXT)}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "I Consent"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
