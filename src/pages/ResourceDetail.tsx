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
import { resourceApi, Resource } from "@/apis/resources";
import { useToast } from "@/hooks/use-toast";

const ResourceDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  // Load resource from API
  useEffect(() => {
    const loadResource = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // For now, we'll use search API to get resource details
        // In a real app, there would be a specific get resource by ID endpoint
        const response = await resourceApi.searchResources({
          q: id,
          limit: 1,
        });

        if (response.success && response.data.length > 0) {
          // Convert search result to Resource format
          const searchResult = response.data[0];
          const resourceData: Resource = {
            _id: searchResult._id,
            title: searchResult.title,
            description: searchResult.description,
            shortDescription: searchResult.shortDescription,
            type: searchResult.type,
            isFree: searchResult.isFree,
            price: searchResult.price,
            currency: "USD",
            publishing: "public",
            status: "approved",
            ageRange: searchResult.ageRange,
            curriculum: searchResult.curriculum,
            curriculumType: "Foundation Stage",
            subject: searchResult.subject,
            createdBy: {
              userId: "unknown",
              role: "teacher",
            },
            coverPhoto: {
              _id: "cover",
              url: "/placeholder.svg",
              format: "jpg",
              size: 1024000,
            },
            previewImages: [
              {
                _id: "preview1",
                url: "/placeholder.svg",
                format: "jpg",
                size: 512000,
              },
            ],
            mainFile: {
              _id: "main",
              url: "/placeholder.svg",
              format: "pdf",
              size: 2048000,
            },
            createdAt: searchResult.createdAt,
            updatedAt: searchResult.createdAt,
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

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [id, toast]);

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    // TODO: Integrate with Stripe
    console.log("Processing purchase...");
    setShowPurchaseModal(false);
    // Redirect to download page
    window.location.href = `/download/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The resource you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
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
                src={resource.coverPhoto.url}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {resource.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {resource.createdBy.role.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by{" "}
                    <span className="text-primary font-medium cursor-pointer hover:underline">
                      {resource.createdBy.role}
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
                {resource.shortDescription || resource.description}
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
                      src={
                        resource.previewImages[currentPreviewIndex]?.url ||
                        "/placeholder.svg"
                      }
                      alt={`Preview ${currentPreviewIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="flex space-x-2 overflow-x-auto">
                    {resource.previewImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPreviewIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                          currentPreviewIndex === index
                            ? "border-primary"
                            : "border-muted"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
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
                  {resource.description.split("\n").map((line, index) => (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                  ))}
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
                    <span>
                      <strong>Subject:</strong> {resource.subject}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Age Range:</strong> {resource.ageRange}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Type:</strong> {resource.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Format:</strong>{" "}
                      {resource.mainFile.format.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Uploaded:</strong>{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <strong>Curriculum:</strong> {resource.curriculum}
                    </span>
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
                <div className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this resource!
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
                    {resource.isFree
                      ? "FREE"
                      : `${resource.currency}${resource.price}`}
                  </div>

                  <div className="space-y-2">
                    {resource.isFree ? (
                      <Button
                        onClick={() =>
                          (window.location.href = `/download/${resource._id}`)
                        }
                        className="w-full text-lg py-6"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePurchase}
                        className="w-full text-lg py-6"
                        size="lg"
                      >
                        Buy Now
                      </Button>
                    )}
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
                      {resource.createdBy.role.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{resource.createdBy.role}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">1</div>
                    <div className="text-muted-foreground text-xs">
                      Resources
                    </div>
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
                <div className="text-center text-muted-foreground py-4">
                  No related resources found.
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
                src={resource.coverPhoto.url}
                alt={resource.title}
                className="w-16 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{resource.title}</h4>
                <p className="text-xs text-muted-foreground">
                  by {resource.createdBy.role}
                </p>
              </div>
              <div className="text-lg font-bold text-primary">
                {resource.isFree
                  ? "FREE"
                  : `${resource.currency}${resource.price}`}
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              You will be redirected to our secure payment processor
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
