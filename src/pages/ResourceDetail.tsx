import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Heart, Download, Eye, Calendar, User, BookOpen, GraduationCap, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

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
                src={mockResource.bannerImage} 
                alt={mockResource.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {mockResource.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockResource.author.avatar} />
                    <AvatarFallback>{mockResource.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by <span className="text-primary font-medium cursor-pointer hover:underline">
                      {mockResource.author.name}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{mockResource.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({mockResource.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
                {mockResource.shortDescription}
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
                      src={mockResource.previewImages[currentPreviewIndex]} 
                      alt={`Preview ${currentPreviewIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  <div className="flex space-x-2 overflow-x-auto">
                    {mockResource.previewImages.map((image, index) => (
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
                  {mockResource.fullDescription.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
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
                    <span><strong>Subject:</strong> {mockResource.metadata.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Grades:</strong> {mockResource.metadata.grades.join(", ")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Type:</strong> {mockResource.metadata.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Format:</strong> {mockResource.metadata.fileFormat}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Uploaded:</strong> {mockResource.metadata.uploadDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Pages:</strong> {mockResource.metadata.pages}</span>
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
                {mockResource.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        by {review.reviewer} • {review.date}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
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
                    {mockResource.currency}{mockResource.price}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handlePurchase}
                      className="w-full text-lg py-6"
                      size="lg"
                    >
                      Buy Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Wishlist
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Instant download after purchase
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
                    <AvatarImage src={mockResource.author.avatar} />
                    <AvatarFallback>{mockResource.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{mockResource.author.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{mockResource.author.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">{mockResource.author.totalUploads}</div>
                    <div className="text-muted-foreground text-xs">Resources</div>
                  </div>
                  <div>
                    <div className="font-medium">{mockResource.author.totalSales.toLocaleString()}</div>
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
                {mockResource.relatedResources.map((resource) => (
                  <div key={resource.id} className="flex space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title}
                      className="w-16 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm truncate">{resource.title}</h5>
                      <p className="text-xs text-muted-foreground">by {resource.author}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{resource.rating}</span>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {resource.currency}{resource.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                src={mockResource.bannerImage} 
                alt={mockResource.title}
                className="w-16 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{mockResource.title}</h4>
                <p className="text-xs text-muted-foreground">by {mockResource.author.name}</p>
              </div>
              <div className="text-lg font-bold text-primary">
                {mockResource.currency}{mockResource.price}
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              You will be redirected to our secure payment processor
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} className="w-full sm:w-auto">
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