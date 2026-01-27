import { useParams } from "react-router-dom";
import { CheckCircle, Download, FileText, Calendar, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Mock data - replace with actual API calls
const mockPurchase = {
  id: "purchase_123",
  resource: {
    id: "1",
    title: "Complete Mathematics Worksheet Bundle - Fractions & Decimals",
    author: "Sarah Mitchell",
    thumbnail: "/placeholder.svg",
    downloadUrl: "/api/download/secure/resource-1.zip",
    fileSize: "15.2 MB",
    format: "PDF + DOCX"
  },
  purchase: {
    date: "2024-01-22",
    time: "14:30",
    price: 4.99,
    currency: "£",
    transactionId: "txn_1234567890",
    paymentMethod: "•••• 1234"
  },
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
    },
    {
      id: "4",
      title: "Algebra Foundations Workbook",
      price: 5.99,
      currency: "£",
      author: "Sarah Mitchell",
      thumbnail: "/placeholder.svg",
      rating: 4.8
    }
  ]
};

const DownloadPage = () => {
  const { id } = useParams();

  const handleDownload = () => {
    // TODO: Implement secure download
    
    // In real implementation, this would trigger a secure download
    const link = document.createElement('a');
    link.href = mockPurchase.resource.downloadUrl;
    link.download = `${mockPurchase.resource.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Banner */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Purchase Successful! 🎉
            </h1>
            <p className="text-muted-foreground text-lg">
              Your resource is ready for download
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resource Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Your Resource</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={mockPurchase.resource.thumbnail} 
                      alt={mockPurchase.resource.title}
                      className="w-24 h-18 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {mockPurchase.resource.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        by {mockPurchase.resource.author}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <span>Format: {mockPurchase.resource.format}</span>
                        <span>Size: {mockPurchase.resource.fileSize}</span>
                      </div>

                      <Button 
                        onClick={handleDownload}
                        className="w-full sm:w-auto"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Receipt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Purchase Receipt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-sm">{mockPurchase.purchase.transactionId}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span>{mockPurchase.purchase.date} at {mockPurchase.purchase.time}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span>{mockPurchase.purchase.paymentMethod}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Paid:</span>
                      <span className="text-primary">
                        {mockPurchase.purchase.currency}{mockPurchase.purchase.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>This resource is licensed for single teacher use. Please review our terms of use before sharing.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>You can re-download this resource anytime from your account dashboard.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Having issues? Contact our support team for assistance.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Consider leaving a review to help other teachers find quality resources.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Re-download Resource
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Dashboard
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Leave a Review
                  </Button>
                </CardContent>
              </Card>

              {/* Related Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>You Might Also Like</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPurchase.relatedResources.map((resource) => (
                    <div key={resource.id} className="flex space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <img 
                        src={resource.thumbnail} 
                        alt={resource.title}
                        className="w-16 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm leading-tight mb-1">
                          {resource.title}
                        </h5>
                        <p className="text-xs text-muted-foreground mb-2">
                          by {resource.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            ★ {resource.rating}
                          </Badge>
                          <span className="text-sm font-medium text-primary">
                            {resource.currency}{resource.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    Browse More Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DownloadPage;