import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Resource } from "@/types/resource";

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
  const { handleError, showError } = useErrorHandler();
  
  // State management
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Load resource from API
  useEffect(() => {
    const loadResource = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // For now, we'll use search API to get resource details
        // In a real app, there would be a specific get resource by ID endpoint
        const response = await resourcesAPI.getAllResources({
          q: id,
          limit: 1,
        });

        if (response.success && response.data && response.data.resources.length > 0) {
          // Convert search result to Resource format
          const searchResult = response.data.resources[0];
          const resourceData: Resource = {
            id: searchResult.id,
            title: searchResult.title,
            shortDescription: searchResult.title,
            fullDescription: searchResult.title,
            resourceType: "Resource",
            subjects: ["Unknown"],
            ageGroups: ["Unknown"],
            curriculum: "Unknown",
            curriculumType: "Foundation Stage",
            language: "English",
            pages: 0,
            lessonTime: 0,
            isFree: searchResult.price === "FREE" || searchResult.price === "0",
            price: searchResult.price === "FREE" || searchResult.price === "0" ? 0 : parseFloat(searchResult.price.replace(/[^\d.]/g, '')),
            currency: "USD",
            licenseType: "Single Teacher License",
            tags: "",
            categories: [],
            accessibility: "Standard",
            visibility: "public",
            versionNotes: "",
            bannerImage: searchResult.thumbnail,
            previewImages: [searchResult.thumbnail],
            resourceFiles: [],
            status: "published",
            uploadDate: searchResult.uploadDate,
            lastModified: searchResult.uploadDate,
            salesCount: 0,
            downloadCount: 0,
            rating: 4.5,
            reviewCount: 0,
            authorId: "unknown",
            authorName: searchResult.author,
          };
          setResource(resourceData);
        } else {
          throw new Error("Resource not found");
        }
      } catch (error: unknown) {
        console.error("Error loading resource:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load resource. Please try again.";

        showError("Failed to load resource", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [id]);

  // Load resource data when component mounts
  useEffect(() => {
    if (id && typeof id === 'string' && id.trim().length > 0) {
      loadResourceData();
    } else if (id) {
      console.error("Invalid resource ID:", id);
      showError("Invalid resource", "Resource ID is invalid");
    }
  }, [id]);

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

        setResource(response.data);
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
    if (!resource || !resource.id) {
      console.error("Cannot purchase: resource or resource ID is missing");
      showError("Purchase error", "Resource information is missing");
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (!resource || !resource.id) {
      console.error("Cannot confirm purchase: resource or resource ID is missing");
      showError("Purchase error", "Resource information is missing");
      return;
    }
    // TODO: Integrate with Stripe
    console.log("Processing purchase...");
    setShowPurchaseModal(false);
    // Redirect to download page
    window.location.href = `/download/${resource.id}`;
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
            <DialogTitle>Purchase Resource</DialogTitle>
            <DialogDescription>
              Complete your purchase to access this resource
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <img 
                src={resource.bannerImage || "/placeholder.svg"} 
                alt={resource.title || "Resource"}
                className="w-16 h-12 rounded object-cover"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{resource.title || "Untitled Resource"}</h4>
                <p className="text-xs text-muted-foreground">by {resource.authorName || "Unknown Author"}</p>
              </div>
              <div className="text-lg font-bold text-primary">
                {resource.isFree ? "FREE" : `$${typeof resource.price === 'number' ? resource.price.toFixed(2) : '0.00'}`}
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {resource.isFree ? "You can download this resource for free" : "You will be redirected to our secure payment processor"}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPurchaseModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="w-full sm:w-auto"
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResourceDetail;
