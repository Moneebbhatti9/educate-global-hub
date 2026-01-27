import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  FileText,
  Video,
  Image,
  BookOpen,
  Calculator,
  Globe,
  Beaker,
  Music,
  Palette,
  Trophy,
  Heart,
  Eye,
  Lock,
  Sparkles,
  ShoppingCart,
  Download,
} from "lucide-react";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicResource, GetAllResourcesQueryParams } from "@/types/resource";
import { useDropdownOptions } from "@/components/ui/dynamic-select";

// Resource Card Component for reusability across tabs
interface ResourceCardProps {
  resource: PublicResource;
  onResourceClick: (id: string) => void;
  onPreviewClick: (id: string) => void;
  getTypeIcon: (type: string) => any;
}

const ResourceCard = ({ resource, onResourceClick, onPreviewClick, getTypeIcon }: ResourceCardProps) => {
  // Safety checks for resource data
  if (!resource || typeof resource !== 'object') {
    return null;
  }

  if (!resource.id || typeof resource.id !== 'string') {
    return null;
  }

  const isFree = resource.price === "FREE" || resource.price === "0" || resource.price?.toLowerCase().includes("free");

  return (
    <Card
      key={resource.id}
      className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 overflow-hidden cursor-pointer"
      onClick={() => onResourceClick(resource.id)}
    >
      <div className="relative">
        <img
          src={resource.thumbnail || "/api/placeholder/300/200"}
          alt={resource.title || "Resource"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/api/placeholder/300/200";
          }}
        />
        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={isFree ? "default" : "secondary"}
            className={isFree ? "bg-green-600 hover:bg-green-700" : "bg-background/90"}
          >
            {isFree ? "FREE" : resource.price || "Price N/A"}
          </Badge>
        </div>
        {/* Preview Badge */}
        <div className="absolute top-3 right-3 flex space-x-1">
          <Badge
            variant="outline"
            className="bg-background/90 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Badge>
        </div>
        {/* Wishlist Button */}
        <div className="absolute bottom-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/90 hover:bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
              {resource.title || "Untitled Resource"}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {resource.author
                    ? resource.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {resource.author || "Unknown Author"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-2 text-sm">
          {resource.title || "No description available"}
        </CardDescription>

        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {resource.status || "Unknown Status"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {new Date(resource.uploadDate).toLocaleDateString()}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              4.5
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(resource.uploadDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant={isFree ? "default" : "outline"}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewClick(resource.id);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isFree ? "View & Download" : "View Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Guest user overlay component - shown when user is not logged in
const GuestOverlay = ({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-auto" />
    <div className="relative z-50 max-w-md mx-4 pointer-events-auto">
      <Card className="border-2 border-primary/20 shadow-2xl bg-background/98 backdrop-blur-sm">
        <CardContent className="pt-8 pb-6 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Unlock Full Access
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of educators sharing and discovering quality teaching resources.
            Sign up free to browse our complete catalog of educational materials.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-xs text-muted-foreground">Resources</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">2K+</div>
              <div className="text-xs text-muted-foreground">Teachers</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-xs text-muted-foreground">Subjects</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onSignup}
              className="w-full text-lg py-6"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Sign Up Free
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full"
            >
              Already have an account? Log In
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Free forever for teachers. No credit card required.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const Resources = () => {
  const navigate = useNavigate();
  const { handleError, showError } = useErrorHandler();
  const { isAuthenticated } = useAuth();

  // Fetch dynamic dropdown options
  const { data: resourceTypeOptions, isLoading: loadingResourceTypes } = useDropdownOptions("resourceType");
  const { data: ageRangeOptions, isLoading: loadingAgeRanges } = useDropdownOptions("ageRange");
  const { data: subjectOptions, isLoading: loadingSubjects } = useDropdownOptions("subject");

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Data state
  const [resources, setResources] = useState<PublicResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

  // Guest user limit: show only 3 resources for non-authenticated users
  const GUEST_RESOURCE_LIMIT = 3;

  // Load resources when component mounts or filters change
  useEffect(() => {
    loadResources();
  }, [searchTerm, selectedSubject, currentPage]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      // Safety checks for parameters
      const params: GetAllResourcesQueryParams = {
        q: searchTerm && searchTerm.trim().length > 0 ? searchTerm.trim() : undefined,
        subject: selectedSubject === "all" ? undefined : selectedSubject,
        page: currentPage && currentPage > 0 ? currentPage : 1,
        limit: 12, // Show 12 resources per page
      };

      const response = await resourcesAPI.getAllResources(params);
      
      // Safety checks for response
      if (!response) {
        showError("Failed to load resources", "No response received from server");
        return;
      }

      if (response.success && response.data) {
        // Safety checks for data structure
        if (!Array.isArray(response.data.resources)) {
          console.warn("Invalid data structure received:", response.data);
          setResources([]);
          setTotalResources(0);
          return;
        }

        // Safety checks for pagination
        const totalCount = response.data.pagination?.total;
        if (typeof totalCount !== 'number' || totalCount < 0) {
          console.warn("Invalid pagination data:", response.data.pagination);
          setTotalResources(0);
        } else {
          setTotalResources(totalCount);
        }

        setResources(response.data.resources);
      } else {
        const errorMessage = response?.message || "Unable to fetch resources";
        showError("Failed to load resources", errorMessage);
        setResources([]);
        setTotalResources(0);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      handleError(error, "Failed to load resources");
      setResources([]);
      setTotalResources(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceClick = (resourceId: string) => {
    // Safety check for resourceId
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
      console.error("Invalid resource ID:", resourceId);
      showError("Invalid resource", "Resource ID is invalid");
      return;
    }
    navigate(`/resources/${resourceId.trim()}`);
  };

  const handlePreviewClick = (resourceId: string) => {
    // Safety check for resourceId
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
      console.error("Invalid resource ID:", resourceId);
      showError("Invalid resource", "Resource ID is invalid");
      return;
    }
    navigate(`/resources/${resourceId.trim()}`);
  };


  const subjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      color: "bg-blue-100 text-blue-600",
    },
    { name: "Science", icon: Beaker, color: "bg-green-100 text-green-600" },
    { name: "English", icon: BookOpen, color: "bg-purple-100 text-purple-600" },
    { name: "History", icon: Globe, color: "bg-orange-100 text-orange-600" },
    { name: "Art", icon: Palette, color: "bg-pink-100 text-pink-600" },
    { name: "Music", icon: Music, color: "bg-indigo-100 text-indigo-600" },
    {
      name: "Physical Education",
      icon: Trophy,
      color: "bg-red-100 text-red-600",
    },
  ];


  // Filter resources based on active tab and apply guest restrictions
  const getFilteredResources = () => {
    let filtered = resources;

    // Apply tab filtering
    switch (activeTab) {
      case "free":
        filtered = resources.filter((r) => r.price === "FREE" || r.price === "0" || r.price?.toLowerCase().includes("free"));
        break;
      case "premium":
        filtered = resources.filter((r) => r.price !== "FREE" && r.price !== "0" && !r.price?.toLowerCase().includes("free"));
        break;
      case "new":
        // Show resources from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = resources.filter((r) => new Date(r.uploadDate) >= thirtyDaysAgo);
        break;
      default:
        filtered = resources;
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();

  // Apply guest restriction: only show limited resources for non-authenticated users
  const displayedResources = isAuthenticated
    ? filteredResources
    : filteredResources.slice(0, GUEST_RESOURCE_LIMIT);

  // Check if there are more resources hidden for guests
  const hasHiddenResources = !isAuthenticated && filteredResources.length > GUEST_RESOURCE_LIMIT;

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "workbook":
      case "problem set":
        return FileText;
      case "interactive":
      case "game pack":
        return Video;
      case "activity pack":
        return Image;
      default:
        return FileText;
    }
  };

  // Navigation handlers for guest overlay
  const handleLogin = () => navigate("/login", { state: { from: "/resources" } });
  const handleSignup = () => navigate("/register", { state: { from: "/resources" } });

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Educational Resources
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Discover thousands of high-quality educational resources created by
            teachers, for teachers. From interactive lessons to comprehensive
            workbooks.
          </p>

          {/* Show CTA for guests */}
          {!isAuthenticated && (
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleSignup} size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up to Browse All
              </Button>
              <Button variant="outline" onClick={handleLogin} size="lg">
                Log In
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                {totalResources.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Resources
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                2,500+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Teachers
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                50+
              </div>
              <div className="text-sm text-muted-foreground">
                Subjects Covered
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                4.8★
              </div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Browse by Subject
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card
                  key={subject.name}
                  className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 cursor-pointer"
                  onClick={() => setSelectedSubject(subject.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${subject.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium">{subject.name}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.name} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Age Range
                  </label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                    disabled={loadingAgeRanges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingAgeRanges ? "Loading..." : "All Ages"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      {ageRangeOptions.map((option) => (
                        <SelectItem key={option._id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Resource Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType} disabled={loadingResourceTypes}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingResourceTypes ? "Loading..." : "All Types"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {resourceTypeOptions.map((option) => (
                        <SelectItem key={option._id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="hero-outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedSubject("all");
                    setSelectedGrade("all");
                    setSelectedType("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Tabs */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="free">
                    <Download className="w-4 h-4 mr-1" />
                    Free
                  </TabsTrigger>
                  <TabsTrigger value="premium">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Premium
                  </TabsTrigger>
                  <TabsTrigger value="new">
                    <Sparkles className="w-4 h-4 mr-1" />
                    New
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {isLoading
                          ? "Loading..."
                          : isAuthenticated
                            ? `Showing ${displayedResources.length} of ${totalResources} resources`
                            : `Showing ${displayedResources.length} resources (Sign up to see all ${totalResources})`}
                      </p>
                    <Select defaultValue="popular">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                      // Loading skeleton
                      Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="w-full h-48 bg-gray-200 animate-pulse" />
                          <CardHeader className="pb-2">
                            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="flex space-x-2">
                              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : displayedResources.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <div className="text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No resources found</h3>
                          <p className="text-sm">
                            Try adjusting your search criteria or browse all resources.
                          </p>
                        </div>
                      </div>
                    ) : (
                      displayedResources.map((resource) => {
                        // Safety checks for resource data
                        if (!resource || typeof resource !== 'object') {
                          console.warn("Invalid resource data:", resource);
                          return null;
                        }

                        if (!resource.id || typeof resource.id !== 'string') {
                          console.warn("Resource missing valid ID:", resource);
                          return null;
                        }

                        const TypeIcon = getTypeIcon("Resource"); // Default type since API doesn't provide type
                        return (
                          <Card
                            key={resource.id}
                            className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 overflow-hidden cursor-pointer"
                            onClick={() => handleResourceClick(resource.id)}
                          >
                            <div className="relative">
                              <img
                                src={resource.thumbnail || "/api/placeholder/300/200"}
                                alt={resource.title || "Resource"}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback for broken images
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/api/placeholder/300/200";
                                }}
                              />
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-background/90"
                                >
                                  Resource
                                </Badge>
                              </div>
                              <div className="absolute top-3 right-3 flex space-x-1">
                                <Badge
                                  variant="outline"
                                  className="bg-background/90 text-xs"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Badge>
                              </div>
                              <div className="absolute bottom-3 right-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="bg-background/90 hover:bg-background"
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="font-heading text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                    {resource.title || "Untitled Resource"}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-xs">
                                        {resource.author
                                          ? resource.author
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                          : "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {resource.author || "Unknown Author"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                              <CardDescription className="line-clamp-2 text-sm">
                                {resource.title || "No description available"}
                              </CardDescription>

                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {resource.status || "Unknown Status"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(resource.uploadDate).toLocaleDateString()}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    4.5
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(resource.uploadDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {resource.price === "FREE" || resource.price === "0" ? (
                                    <div className="text-lg font-bold text-brand-accent-green">
                                      FREE
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-lg font-bold">
                                        {resource.price || "N/A"}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewClick(resource.id);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination - only show for authenticated users */}
                  {isAuthenticated && totalResources > 12 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {Math.ceil(totalResources / 12)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= Math.ceil(totalResources / 12)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}

                  {/* Guest Overlay - show when there are more resources hidden */}
                  {hasHiddenResources && <GuestOverlay onLogin={handleLogin} onSignup={handleSignup} />}
                </TabsContent>

                {/* Free Resources Tab */}
                <TabsContent value="free" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {displayedResources.length} free resources available
                    </p>
                  </div>

                  {displayedResources.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Free Resources Found</h3>
                        <p className="text-sm">
                          Check back later for new free resources.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayedResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onResourceClick={handleResourceClick}
                          onPreviewClick={handlePreviewClick}
                          getTypeIcon={getTypeIcon}
                        />
                      ))}
                    </div>
                  )}

                  {hasHiddenResources && <GuestOverlay onLogin={handleLogin} onSignup={handleSignup} />}
                </TabsContent>

                {/* Premium Resources Tab */}
                <TabsContent value="premium" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {displayedResources.length} premium resources available
                    </p>
                  </div>

                  {displayedResources.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Premium Resources Found</h3>
                        <p className="text-sm">
                          Browse all resources to find premium content.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayedResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onResourceClick={handleResourceClick}
                          onPreviewClick={handlePreviewClick}
                          getTypeIcon={getTypeIcon}
                        />
                      ))}
                    </div>
                  )}

                  {hasHiddenResources && <GuestOverlay onLogin={handleLogin} onSignup={handleSignup} />}
                </TabsContent>

                {/* New Resources Tab */}
                <TabsContent value="new" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {displayedResources.length} new resources from the last 30 days
                    </p>
                  </div>

                  {displayedResources.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No New Resources</h3>
                        <p className="text-sm">
                          Check back soon for the latest resources.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayedResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onResourceClick={handleResourceClick}
                          onPreviewClick={handlePreviewClick}
                          getTypeIcon={getTypeIcon}
                        />
                      ))}
                    </div>
                  )}

                  {hasHiddenResources && <GuestOverlay onLogin={handleLogin} onSignup={handleSignup} />}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;