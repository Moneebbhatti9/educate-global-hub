import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Calendar,
  Search,
  Filter,
  BookOpen,
  Star,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customToast } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { salesAPI } from "@/apis/sales";
import { downloadFile, getFilenameFromUrl } from "@/utils/downloadHelper";

const MyLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fetch user's purchased resources
  const { data: purchases, isLoading, refetch } = useQuery({
    queryKey: ["myPurchases"],
    queryFn: async () => {
      const response = await salesAPI.getMyPurchases();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch purchases");
      }
      return response.data;
    },
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
  });

  const handleDownload = async (downloadUrl: string, resourceTitle: string) => {
    if (!downloadUrl) {
      customToast.error(
        "Download unavailable",
        "Download link is not available for this resource"
      );
      return;
    }

    try {
      const filename = getFilenameFromUrl(downloadUrl, resourceTitle || "resource");

      await downloadFile(downloadUrl, filename, {
        onSuccess: () => {
          customToast.success(
            "Download started",
            `Downloading "${resourceTitle}"`
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

  // Filter purchases based on search and type
  const filteredPurchases = purchases?.purchases?.filter((purchase: any) => {
    const matchesSearch =
      !searchTerm ||
      purchase.resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.resource.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || purchase.resource.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Library</h1>
          <p className="text-muted-foreground">
            Access all your purchased resources anytime
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Purchases
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchases?.purchases?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Resources in your library
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchases?.purchases?.filter((p: any) => {
                  const purchaseDate = new Date(p.purchaseDate);
                  const now = new Date();
                  return (
                    purchaseDate.getMonth() === now.getMonth() &&
                    purchaseDate.getFullYear() === now.getFullYear()
                  );
                }).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                New resources added
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchases?.purchases?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready to download
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Worksheet">Worksheets</SelectItem>
                  <SelectItem value="Lesson Plan">Lesson Plans</SelectItem>
                  <SelectItem value="Assessment">Assessments</SelectItem>
                  <SelectItem value="Activity">Activities</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => refetch()}
                className="w-full md:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading your library...</p>
          </div>
        ) : filteredPurchases && filteredPurchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPurchases.map((purchase: any) => (
              <Card
                key={purchase._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={purchase.resource.thumbnail || "/placeholder.svg"}
                      alt={purchase.resource.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {purchase.resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="secondary">
                        {purchase.resource.type || "Resource"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">
                        {purchase.resource.subject || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Purchased:</span>
                      <span className="font-medium">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    {purchase.resource.rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {purchase.resource.rating}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() =>
                        handleDownload(
                          purchase.resource.downloadUrl || purchase.resource.file,
                          purchase.resource.title
                        )
                      }
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/resources/${purchase.resource._id}`)}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || filterType !== "all"
                    ? "No resources found"
                    : "Your library is empty"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start building your library by browsing our resources"}
                </p>
                <Button onClick={() => navigate("/resources")}>
                  Browse Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyLibrary;
