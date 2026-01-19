import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Download,
  Eye,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  FileText,
  ExternalLink,
  Lock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { resourcesAPI } from "@/apis/resources";
import { salesAPI } from "@/apis/sales";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useAuth } from "@/contexts/AuthContext";
import { customToast } from "@/components/ui/sonner";
import type { Resource } from "@/types/resource";
import { downloadFile, getFilenameFromUrl } from "@/utils/downloadHelper";

// Mock data - replace with actual API calls
const mockResource = {
  id: "1",
  title: "Complete Mathematics Worksheet Bundle - Fractions & Decimals",
  shortDescription: "Comprehensive collection of 25+ worksheets covering fractions, decimals, and percentage conversions for Key Stage 2 students.",
  fullDescription: `This comprehensive mathematics bundle includes:

• 25 professionally designed worksheets
• Step-by-step instruction guides
• Answer keys for all exercises
• Progress tracking sheets
• Assessment rubrics

Perfect for both classroom teaching and home learning. Each worksheet is carefully crafted to build understanding progressively, starting with basic concepts and advancing to more complex problem-solving scenarios.

**What's Included:**
- Introduction to fractions (5 worksheets)
- Decimal operations (8 worksheets) 
- Fraction to decimal conversion (6 worksheets)
- Mixed practice exercises (4 worksheets)
- Assessment tests (2 worksheets)

**Learning Outcomes:**
Students will be able to confidently work with fractions and decimals, understand their relationship, and apply these skills in real-world contexts.`,
  price: 4.99,
  currency: "£",
  author: {
    id: "teacher1",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg",
    totalUploads: 47,
    totalSales: 1250,
    rating: 4.8
  },
  bannerImage: "/placeholder.svg",
  previewImages: [
    "/placeholder.svg",
    "/placeholder.svg", 
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ],
  metadata: {
    subject: "Mathematics",
    grades: ["Year 4", "Year 5", "Year 6"],
    type: "Worksheet Bundle",
    fileFormat: "PDF + DOCX",
    uploadDate: "2024-01-15",
    pages: 32,
    downloads: 1250
  },
  rating: 4.7,
  reviewCount: 89,
  reviews: [
    {
      id: "1",
      rating: 5,
      comment: "Excellent resource! My students love these worksheets and I've seen real improvement in their understanding.",
      reviewer: "Anonymous Teacher",
      date: "2024-01-20"
    },
    {
      id: "2", 
      rating: 4,
      comment: "Good quality worksheets with clear instructions. The answer keys are very helpful.",
      reviewer: "Anonymous Teacher",
      date: "2024-01-18"
    }
  ],
  relatedResources: [
    {
      id: "2",
      title: "Geometry Basics Workbook",
      price: 3.99,
      currency: "£",
      author: "Sarah Mitchell",
      thumbnail: "/placeholder.svg",
      rating: 4.6
    },
    {
      id: "3",
      title: "Times Tables Practice Pack",
      price: 2.99,
      currency: "£", 
      author: "John Stevens",
      thumbnail: "/placeholder.svg",
      rating: 4.9
    }
  ]
};

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleError, showError } = useErrorHandler();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseDownloadUrl, setPurchaseDownloadUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);


  const checkPurchaseStatus = useCallback(async () => {
    // Only check if user is authenticated
    if (!isAuthenticated || !user || !id) {
      setIsPurchased(false);
      setPurchaseDownloadUrl(null);
      return;
    }

    try {
      const response = await salesAPI.getMyPurchases();

      if (response.success && response.data?.purchases) {
        // Check if current resource is in user's purchases
        const purchase = response.data.purchases.find(
          (p: any) => p.resource?._id === id || p.resourceId === id
        );

        if (purchase) {
          setIsPurchased(true);
          setPurchaseDownloadUrl(
            purchase.resource?.downloadUrl ||
            purchase.resource?.file ||
            purchase.downloadUrl ||
            null
          );
        } else {
          setIsPurchased(false);
          setPurchaseDownloadUrl(null);
        }
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
      // Don't show error to user, just assume not purchased
      setIsPurchased(false);
      setPurchaseDownloadUrl(null);
    }
  }, [isAuthenticated, user, id]);

  // Load resource data when component mounts
  useEffect(() => {
    if (id && typeof id === 'string' && id.trim().length > 0) {
      loadResourceData();
      checkPurchaseStatus();
    } else if (id) {
      console.error("Invalid resource ID:", id);
      showError("Invalid resource", "Resource ID is invalid");
    }
  }, [id, isAuthenticated, checkPurchaseStatus]);

  // Refetch purchase status when page becomes visible (user returns from payment)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && id) {
        checkPurchaseStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, isAuthenticated, checkPurchaseStatus]);

  const loadResourceData = async () => {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      console.error("Invalid resource ID:", id);
      showError("Invalid resource", "Resource ID is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await resourcesAPI.getResourceById(id.trim());
      
      // Safety checks for response
      if (!response) {
        showError("Failed to load resource", "No response received from server");
        return;
      }

      if (response.success && response.data) {
        // Safety checks for resource data
        if (!response.data || typeof response.data !== 'object') {
          console.warn("Invalid resource data structure:", response.data);
          showError("Invalid resource data", "Resource data is malformed");
          return;
        }

        if (!response.data.id || typeof response.data.id !== 'string') {
          console.warn("Resource missing valid ID:", response.data);
          showError("Invalid resource", "Resource ID is missing");
          return;
        }

        // Map the API response to Resource interface
        const apiData = response.data as {
          id: string;
          title?: string;
          description?: string;
          type?: string;
          subject?: string;
          ageRange?: string;
          curriculum?: string;
          curriculumType?: string;
          price?: string;
          status?: string;
          thumbnail?: string;
          previews?: string[];
          file?: string;
          author?: string;
          authorId?: string;
          createdAt?: string;
        };
        const mappedResource: Resource = {
          id: apiData.id,
          title: apiData.title || "Untitled Resource",
          shortDescription: apiData.description || "",
          fullDescription: apiData.description || "",
          resourceType: apiData.type || "Resource",
          subjects: apiData.subject ? [apiData.subject] : [],
          ageGroups: apiData.ageRange ? [apiData.ageRange] : [],
          curriculum: apiData.curriculum || "",
          curriculumType: apiData.curriculumType || "",
          language: "English",
          pages: 0,
          lessonTime: 0,
          isFree: apiData.price?.toLowerCase().includes('free') || !apiData.price,
          price: apiData.price ? parseFloat(apiData.price.replace(/[^0-9.]/g, '')) || 0 : 0,
          currency: apiData.price ? apiData.price.split(' ')[0] : "USD",
          licenseType: "Single Teacher License",
          tags: "",
          categories: [],
          accessibility: "Standard",
          visibility: apiData.status === "approved" ? "public" : "private",
          versionNotes: "",
          bannerImage: apiData.thumbnail || "",
          previewImages: apiData.previews || [],
          resourceFiles: apiData.file ? [apiData.file] : [],
          status: apiData.status === "approved" ? "published" : "draft",
          uploadDate: apiData.createdAt || new Date().toISOString(),
          lastModified: apiData.createdAt || new Date().toISOString(),
          salesCount: 0,
          downloadCount: 0,
          rating: 4.5,
          reviewCount: 0,
          authorId: apiData.authorId || "",
          authorName: apiData.author || "Unknown Author",
        };

        setResource(mappedResource);

        // Check if current user is the owner
        if (isAuthenticated && user && apiData.authorId && user.userId === apiData.authorId) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } else {
        const errorMessage = response?.message || "Unable to fetch resource details";
        showError("Failed to load resource", errorMessage);
        setResource(null);
      }
    } catch (error) {
      console.error("Error loading resource:", error);
      handleError(error, "Failed to load resource");
      setResource(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      customToast.error(
        "Authentication required",
        "Please log in to purchase this resource"
      );
      navigate("/login", { state: { from: `/resources/${id}` } });
      return;
    }

    if (!resource || !resource.id) {
      console.error("Cannot purchase: resource or resource ID is missing");
      showError("Purchase error", "Resource information is missing");
      return;
    }

    // For free resources, download directly
    if (resource.isFree) {
      handleConfirmPurchase();
      return;
    }

    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!resource || !resource.id) {
      console.error("Cannot confirm purchase: resource or resource ID is missing");
      showError("Purchase error", "Resource information is missing");
      return;
    }

    setIsPurchasing(true);

    try {
      // For free resources, create a free purchase record
      if (resource.isFree) {
        const response = await salesAPI.purchaseResource({
          resourceId: resource.id,
          paymentMethodId: "free", // Special identifier for free resources
          buyerCountry: "GB", // Default country
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to process free download");
        }

        customToast.success(
          "Success!",
          "Your free resource is ready to download"
        );

        // Redirect to payment success page
        navigate(
          `/payment-success?resourceId=${resource.id}&resourceTitle=${encodeURIComponent(
            resource.title
          )}&saleId=${response.data?.sale || "free"}&downloadUrl=${
            response.data?.downloadUrl || resource.resourceFiles[0] || ""
          }`
        );
        return;
      }

      // For paid resources, create Stripe Checkout Session and redirect
      const response = await salesAPI.purchaseResource({
        resourceId: resource.id,
        paymentMethodId: "stripe_checkout", // Identifier for Stripe Checkout
        buyerCountry: "GB",
      });

      if (!response.success || !response.data?.checkoutUrl) {
        throw new Error(response.message || "Failed to create checkout session");
      }

      // Show success toast
      customToast.info(
        "Redirecting to payment",
        "You will be redirected to Stripe's secure checkout page..."
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Purchase error:", error);
      customToast.error(
        "Purchase failed",
        error instanceof Error ? error.message : "Failed to process purchase"
      );
    } finally {
      setIsPurchasing(false);
      setShowPurchaseModal(false);
    }
  };

  const handleDirectDownload = async () => {
    if (!purchaseDownloadUrl && !resource?.resourceFiles?.[0]) {
      customToast.error(
        "Download unavailable",
        "Download link is not available for this resource"
      );
      return;
    }

    try {
      const downloadUrl = purchaseDownloadUrl || resource?.resourceFiles[0] || "";
      const filename = getFilenameFromUrl(downloadUrl, resource?.title || "resource");

      await downloadFile(downloadUrl, filename, {
        onSuccess: () => {
          customToast.success(
            "Download started",
            `Downloading "${resource?.title}"`
          );
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/5] rounded-lg bg-gray-200 animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if no resource found
  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Resource not found</h3>
              <p className="text-sm">
                The resource you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Image */}
            <div className="aspect-[16/5] rounded-lg overflow-hidden">
              <img 
                src={resource.bannerImage || "/placeholder.svg"} 
                alt={resource.title || "Resource"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {resource.title || "Untitled Resource"}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {resource.authorName ? resource.authorName.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by <span className="text-primary font-medium cursor-pointer hover:underline">
                      {resource.authorName || "Unknown Author"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.5</span>
                  <span className="text-sm text-muted-foreground">
                    (0 reviews)
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
                {resource.fullDescription || "No description available"}
              </p>
            </div>

            {/* Preview Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Resource Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main Preview */}
                  <div className="aspect-[3/2] rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={resource.previewImages?.[currentPreviewIndex] || resource.bannerImage || "/placeholder.svg"} 
                      alt={`Preview ${currentPreviewIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Thumbnail Navigation */}
                  {resource.previewImages && Array.isArray(resource.previewImages) && resource.previewImages.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {resource.previewImages.map((image, index) => {
                        if (!image || typeof image !== 'string') {
                          console.warn("Invalid preview image:", image);
                          return null;
                        }
                        return (
                          <button
                            key={index}
                            onClick={() => setCurrentPreviewIndex(index)}
                            className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                              currentPreviewIndex === index 
                                ? 'border-primary' 
                                : 'border-muted'
                            }`}
                          >
                            <img 
                              src={image} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback for broken images
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Full Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="mb-2">{resource.fullDescription || "No description available"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Resource Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Subject:</strong> {resource.subjects?.[0] || "Unknown Subject"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Age Range:</strong> {resource.ageGroups?.[0] || "Unknown Age Range"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Type:</strong> {resource.resourceType || "Unknown Type"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Curriculum:</strong> {resource.curriculum || "Unknown Curriculum"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Created:</strong> {
                      resource.uploadDate 
                        ? new Date(resource.uploadDate).toLocaleDateString() 
                        : "Unknown Date"
                    }</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Status:</strong> {resource.status || "Unknown Status"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reviews yet</p>
                    <p className="text-xs text-muted-foreground">Be the first to review this resource!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {isOwner ? (
                    // Resource Owner - Show Owner Options
                    <>
                      <div className="space-y-2">
                        <Badge variant="default" className="bg-blue-600">
                          👤 Your Resource
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          You created this resource
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleDirectDownload}
                          className="w-full text-lg py-6"
                          size="lg"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Your Resource
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/dashboard/teacher/resource-management")}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Manage Resource
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        ✓ You have full access to your resources
                      </div>
                    </>
                  ) : isPurchased ? (
                    // Already Purchased - Show Download Option
                    <>
                      <div className="space-y-2">
                        <Badge variant="default" className="bg-green-600">
                          ✓ Purchased
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          You own this resource
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleDirectDownload}
                          className="w-full text-lg py-6"
                          size="lg"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Now
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/my-library")}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Go to My Library
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        ✓ Download anytime from My Library
                      </div>
                    </>
                  ) : (
                    // Not Purchased - Show Purchase Option
                    <>
                      <div className="text-3xl font-bold text-primary">
                        {resource.isFree ? "FREE" : `$${typeof resource.price === 'number' ? resource.price.toFixed(2) : '0.00'}`}
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handlePurchase}
                          className="w-full text-lg py-6"
                          size="lg"
                        >
                          {resource.isFree ? "Download Free" : "Buy Now"}
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Wishlist
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {resource.isFree
                          ? "Instant download"
                          : "Instant download after purchase"}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>About the Author</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {resource.authorName ? resource.authorName.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{resource.authorName || "Unknown Author"}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">0</div>
                    <div className="text-muted-foreground text-xs">Resources</div>
                  </div>
                  <div>
                    <div className="font-medium">0</div>
                    <div className="text-muted-foreground text-xs">Sales</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-3">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Related Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4">
                  <div className="text-muted-foreground">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No related resources</p>
                    <p className="text-xs text-muted-foreground">Check back later for more!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Purchase Resource</span>
            </DialogTitle>
            <DialogDescription>
              {resource.isFree
                ? "Download this free resource instantly"
                : "Complete your purchase to access this resource"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Resource Preview */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <img
                src={resource.bannerImage || "/placeholder.svg"}
                alt={resource.title || "Resource"}
                className="w-16 h-12 rounded object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {resource.title || "Untitled Resource"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  by {resource.authorName || "Unknown Author"}
                </p>
              </div>
              <div className="text-lg font-bold text-primary">
                {resource.isFree
                  ? "FREE"
                  : `$${
                      typeof resource.price === "number"
                        ? resource.price.toFixed(2)
                        : "0.00"
                    }`}
              </div>
            </div>

            {/* Info Alert */}
            {!resource.isFree && (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to Stripe's secure payment page to
                  complete your purchase. Your payment information is never
                  stored on our servers.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground text-center">
              {resource.isFree
                ? "✓ Instant access after download"
                : "✓ Secure payment via Stripe · ✓ Instant download"}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPurchaseModal(false)}
              disabled={isPurchasing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="w-full sm:w-auto"
              disabled={isPurchasing}
            >
              {isPurchasing
                ? "Processing..."
                : resource.isFree
                ? "Download Now"
                : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResourceDetail;
