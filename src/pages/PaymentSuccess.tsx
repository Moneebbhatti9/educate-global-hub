import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Star,
  FileText,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { customToast } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { salesAPI } from "@/apis/sales";
import { reviewsAPI } from "@/apis/reviews";
import { downloadFile, getFilenameFromUrl } from "@/utils/downloadHelper";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Loading purchase details...");

  // Get session ID from URL params (from Stripe redirect)
  const sessionId = searchParams.get("session_id");

  // Legacy: Also support direct params (for free resources or direct redirects)
  const directResourceId = searchParams.get("resourceId");
  const directResourceTitle = searchParams.get("resourceTitle");
  const directSaleId = searchParams.get("saleId");
  const directDownloadUrl = searchParams.get("downloadUrl");

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      customToast.error(
        "Authentication required",
        "Please log in to access your purchase"
      );
      navigate("/login", { state: { from: "/payment-success" } });
      return;
    }

    // Fetch purchase details with retry logic
    const fetchPurchaseDetails = async (attempt = 0) => {
      const MAX_RETRIES = 10;
      const BASE_DELAY = 1000; // 1 second

      setIsLoadingPurchase(true);
      setRetryCount(attempt);

      // Update loading message based on attempt
      if (attempt === 0) {
        setLoadingMessage("Loading purchase details...");
      } else if (attempt < 3) {
        setLoadingMessage("Processing your payment...");
      } else if (attempt < 6) {
        setLoadingMessage("Confirming your purchase...");
      } else {
        setLoadingMessage("Almost there, finalizing your order...");
      }

      try {
        // If we have a session ID from Stripe, fetch purchase details
        if (sessionId) {
          const response = await salesAPI.getPurchaseBySession(sessionId);

          if (response.success && response.data?.purchase) {
            setPurchaseDetails({
              resourceId: response.data.purchase.resource._id,
              resourceTitle: response.data.purchase.resource.title,
              saleId: response.data.purchase.saleId,
              downloadUrl: response.data.purchase.resource.downloadUrl,
              thumbnail: response.data.purchase.resource.thumbnail,
              price: response.data.purchase.pricePaid || response.data.purchase.resource.price,
              currency: response.data.purchase.resource.currency,
            });
            setIsLoadingPurchase(false);
            return; // Success - exit
          } else {
            // Purchase not found yet - might be webhook processing delay
            if (attempt < MAX_RETRIES) {
              // Retry with exponential backoff
              const delay = BASE_DELAY * Math.pow(1.5, attempt);
              console.log(`Purchase not ready, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);

              setTimeout(() => {
                fetchPurchaseDetails(attempt + 1);
              }, delay);
              return;
            } else {
              throw new Error("Purchase details not available yet. Please check My Library in a few moments.");
            }
          }
        }
        // Otherwise use direct params (for free resources)
        else if (directResourceId && directResourceTitle) {
          setPurchaseDetails({
            resourceId: directResourceId,
            resourceTitle: directResourceTitle,
            saleId: directSaleId,
            downloadUrl: directDownloadUrl,
          });
          setIsLoadingPurchase(false);
        } else {
          customToast.warning(
            "Payment information incomplete",
            "Some purchase details are missing. You can access your purchase from My Library."
          );
          setIsLoadingPurchase(false);
        }
      } catch (error) {
        console.error("Error fetching purchase details:", error);

        // Only show error if we've exhausted retries
        if (attempt >= MAX_RETRIES) {
          customToast.error(
            "Error loading purchase",
            "Your payment was successful but details are still processing. Check My Library in a few moments."
          );
          setIsLoadingPurchase(false);
        } else {
          // Retry
          const delay = BASE_DELAY * Math.pow(1.5, attempt);
          setTimeout(() => {
            fetchPurchaseDetails(attempt + 1);
          }, delay);
        }
      }
    };

    fetchPurchaseDetails();
  }, [
    user,
    sessionId,
    directResourceId,
    directResourceTitle,
    directSaleId,
    directDownloadUrl,
    navigate,
  ]);

  const handleDownload = async () => {
    if (!purchaseDetails?.downloadUrl) {
      customToast.error(
        "Download unavailable",
        "Download link is not available yet"
      );
      return;
    }

    try {
      // Track download
      setHasDownloaded(true);

      const url = purchaseDetails.downloadUrl;
      const filename = getFilenameFromUrl(url, purchaseDetails.resourceTitle || "resource");

      await downloadFile(url, filename, {
        onSuccess: () => {
          customToast.success(
            "Download started",
            "Your resource is being downloaded"
          );

          // Show review modal after a short delay
          setTimeout(() => {
            setShowReviewModal(true);
          }, 2000);
        },
        onError: (error) => {
          customToast.error(
            "Download failed",
            error.message || "Failed to start download. Please try again."
          );
        },
      });
    } catch (error) {
      console.error("Download error:", error);
      customToast.error(
        "Download failed",
        "Failed to start download. Please try again."
      );
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      customToast.error(
        "Rating required",
        "Please select a rating before submitting"
      );
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await reviewsAPI.createReview({
        resourceId: purchaseDetails?.resourceId,
        saleId: purchaseDetails?.saleId,
        rating,
        comment: reviewComment,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to submit review");
      }

      customToast.success(
        "Review submitted",
        "Thank you for your feedback! You can download this resource anytime from My Library."
      );

      setShowReviewModal(false);

      // Don't auto-redirect - let user stay on success page
    } catch (error) {
      customToast.error(
        "Review failed",
        error instanceof Error ? error.message : "Failed to submit review. You can review later from your purchases."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSkipReview = () => {
    setShowReviewModal(false);
    // Don't auto-redirect - user can manually navigate using buttons
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your resource is ready to download.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingPurchase ? (
            <Card className="mb-6">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium mb-2">{loadingMessage}</p>
                  {retryCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      This is taking longer than expected. Your payment is being processed...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : purchaseDetails ? (
            /* Purchase Details Card */
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Purchase Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource:</span>
                    <span className="font-medium">{purchaseDetails.resourceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-sm">
                      {purchaseDetails.saleId?.slice(0, 16) || "N/A"}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Completed</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    size="lg"
                    disabled={!purchaseDetails.downloadUrl}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resource
                  </Button>
                  {hasDownloaded && (
                    <p className="text-sm text-green-600 text-center">
                      ✓ Downloaded successfully
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    💡 You can re-download this resource anytime from My Library
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Error State */
            <Card className="mb-6">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Unable to load purchase details
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your purchase was successful, but we couldn't load the details.
                  </p>
                  <Button onClick={() => navigate("/my-library")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Go to My Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Download your resource</p>
                  <p className="text-sm text-muted-foreground">
                    Click the download button above to save the resource to your device
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Share your feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Help other educators by leaving a review
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Explore more resources</p>
                  <p className="text-sm text-muted-foreground">
                    Discover other high-quality teaching materials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              onClick={() => navigate("/my-library")}
            >
              <FileText className="w-4 h-4 mr-2" />
              My Library
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/resources")}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Browse More
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How would you rate "{purchaseDetails?.resourceTitle || "this resource"}"? Your
              feedback helps other educators.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {rating > 0 ? `${rating} / 5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
              <Label htmlFor="review">Your Review (Optional)</Label>
              <Textarea
                id="review"
                placeholder="Share your thoughts about this resource..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Help other educators by sharing what you liked or didn't like
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleSkipReview}
              disabled={isSubmittingReview}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || rating === 0}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
