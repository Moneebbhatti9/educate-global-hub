import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Calendar,
  Search,
  BookOpen,
  Star,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ExternalLink,
  TrendingUp,
  ChevronRight,
  Filter,
  LayoutGrid,
  LayoutList,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { customToast } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { salesAPI } from "@/apis/sales";
import { useAuth } from "@/contexts/AuthContext";
import { downloadViaBackend } from "@/utils/downloadHelper";
import DashboardLayout from "@/layout/DashboardLayout";

const MyLibrary = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");

  // Fetch user's purchased resources
  const { data: purchases, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["myPurchases"],
    queryFn: async () => {
      const response = await salesAPI.getMyPurchases();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch purchases");
      }
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isAuthenticated,
  });

  // Get unique subjects for filter
  const uniqueSubjects = Array.from(
    new Set(
      purchases?.purchases?.map((p: any) => p.resource?.subject).filter(Boolean) || []
    )
  ) as string[];

  const handleDownload = async (resourceId: string, resourceTitle: string, purchaseId: string) => {
    if (!resourceId) {
      customToast.error(
        "Download unavailable",
        "Resource not available for download"
      );
      return;
    }

    setDownloadingIds((prev) => new Set(prev).add(purchaseId));

    try {
      const filename = `${resourceTitle || "resource"}.pdf`;

      await downloadViaBackend(resourceId, filename, {
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
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(purchaseId);
        return next;
      });
    }
  };

  // Calculate stats
  const stats = {
    total: purchases?.purchases?.length || 0,
    thisMonth: purchases?.purchases?.filter((p: any) => {
      const purchaseDate = new Date(p.purchaseDate);
      const now = new Date();
      return (
        purchaseDate.getMonth() === now.getMonth() &&
        purchaseDate.getFullYear() === now.getFullYear()
      );
    }).length || 0,
    totalSpent: purchases?.purchases?.reduce((acc: number, p: any) => {
      return acc + (p.pricePaid || 0);
    }, 0) || 0,
  };

  // Filter purchases based on search, type, subject, and tab
  const filteredPurchases = purchases?.purchases?.filter((purchase: any) => {
    const matchesSearch =
      !searchTerm ||
      purchase.resource?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.resource?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.resource?.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || purchase.resource?.type === filterType;

    const matchesSubject =
      filterSubject === "all" || purchase.resource?.subject === filterSubject;

    // Tab filtering
    let matchesTab = true;
    if (activeTab === "recent") {
      const purchaseDate = new Date(purchase.purchaseDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesTab = purchaseDate >= thirtyDaysAgo;
    } else if (activeTab === "free") {
      matchesTab = purchase.pricePaid === 0;
    }

    return matchesSearch && matchesType && matchesSubject && matchesTab;
  }) || [];

  // Get unique resource types for filter
  const uniqueTypes = Array.from(
    new Set(
      purchases?.purchases?.map((p: any) => p.resource?.type).filter(Boolean) || []
    )
  ) as string[];

  return (
     <DashboardLayout role="teacher">
      <div className="space-y-6">


          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-primary" />
                My Library
              </h1>
              <p className="text-muted-foreground">
                Access all your purchased resources anytime. Download as many times as you need.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/resources")}>
                <Sparkles className="w-4 h-4 mr-2" />
                Browse More
              </Button>
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Resources
                </CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  In your library
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.thisMonth}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  New additions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(stats.totalSpent / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Investment in learning
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available
                </CardTitle>
                <Download className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready to download
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs and Filters */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="w-4 h-4 mr-1" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="free">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Free
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters Row */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources, subjects, or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {uniqueSubjects.length > 0 && (
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {uniqueSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {(filterType !== "all" || filterSubject !== "all" || searchTerm) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFilterType("all");
                        setFilterSubject("all");
                        setSearchTerm("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tab Contents */}
            <TabsContent value="all" className="mt-0">
              {renderPurchasesContent()}
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              {renderPurchasesContent()}
            </TabsContent>

            <TabsContent value="free" className="mt-0">
              {renderPurchasesContent()}
            </TabsContent>
          </Tabs>
      </div>
    </DashboardLayout>
  );

  // Helper function to render purchases content (grid or list view)
  function renderPurchasesContent() {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      );
    }

    if (!filteredPurchases || filteredPurchases.length === 0) {
      return (
        <Card className="border-dashed">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || filterType !== "all" || filterSubject !== "all"
                  ? "No resources match your filters"
                  : "Your library is empty"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || filterType !== "all" || filterSubject !== "all"
                  ? "Try adjusting your search criteria or clearing filters"
                  : "Start building your collection by browsing our educational resources"}
              </p>
              <div className="flex justify-center gap-4">
                {(searchTerm || filterType !== "all" || filterSubject !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterType("all");
                      setFilterSubject("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                <Button onClick={() => navigate("/resources")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (viewMode === "list") {
      return (
        <div className="space-y-4">
          {filteredPurchases.map((purchase: any) => {
            const isDownloading = downloadingIds.has(purchase._id);
            return (
              <Card
                key={purchase._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={purchase.resource?.thumbnail || "/placeholder.svg"}
                        alt={purchase.resource?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {purchase.resource?.title || "Untitled Resource"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {purchase.resource?.type || "Resource"}
                        </Badge>
                        {purchase.resource?.subject && (
                          <span>{purchase.resource.subject}</span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Price Paid */}
                    <div className="text-right hidden md:block">
                      <div className="font-semibold">
                        {purchase.pricePaid === 0
                          ? "Free"
                          : `$${(purchase.pricePaid / 100).toFixed(2)}`}
                      </div>
                      <div className="text-xs text-muted-foreground">Paid</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleDownload(
                            purchase.resource?._id,
                            purchase.resource?.title,
                            purchase._id
                          )
                        }
                        disabled={isDownloading}
                        size="sm"
                      >
                        {isDownloading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/resources/${purchase.resource?._id}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    // Grid View
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPurchases.map((purchase: any) => {
          const isDownloading = downloadingIds.has(purchase._id);
          return (
            <Card
              key={purchase._id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={purchase.resource?.thumbnail || "/placeholder.svg"}
                    alt={purchase.resource?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="default"
                    className="bg-green-600/90 text-white text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Owned
                  </Badge>
                </div>
                {/* Price Badge */}
                {purchase.pricePaid === 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      Free
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {purchase.resource?.title || "Untitled Resource"}
                </CardTitle>
                <CardDescription className="text-xs">
                  by {purchase.resource?.author || "Unknown Author"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {purchase.resource?.type && (
                    <Badge variant="outline" className="text-xs">
                      {purchase.resource.type}
                    </Badge>
                  )}
                  {purchase.resource?.subject && (
                    <Badge variant="outline" className="text-xs">
                      {purchase.resource.subject}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.5</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleDownload(
                        purchase.resource?._id,
                        purchase.resource?.title,
                        purchase._id
                      )
                    }
                    disabled={isDownloading}
                    className="flex-1"
                    size="sm"
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/resources/${purchase.resource?._id}`)}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
};

export default MyLibrary;
