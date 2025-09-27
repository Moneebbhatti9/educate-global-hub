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
  Download,
  Star,
  Users,
  Clock,
  DollarSign,
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
} from "lucide-react";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Resource, GetAllResourcesQueryParams } from "@/types/resource";

const Resources = () => {
  const navigate = useNavigate();
  const { handleError, showError } = useErrorHandler();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  // Data state
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

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
        if (!Array.isArray(response.data.data)) {
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

        setResources(response.data.data);
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

  const handlePurchaseClick = (resourceId: string) => {
    // Safety check for resourceId
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
      console.error("Invalid resource ID:", resourceId);
      showError("Invalid resource", "Resource ID is invalid");
      return;
    }
    // For now, navigate to resource detail page
    // In a real app, this would handle the purchase flow
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

  const grades = [
    "Grade K-2",
    "Grade 3-5",
    "Grade 6-8",
    "Grade 9-10",
    "Grade 11-12",
    "Grade 12+",
  ];
  const types = [
    "Workbook",
    "Interactive",
    "Activity Pack",
    "Game Pack",
    "Problem Set",
    "Video Course",
  ];

  // Use the resources from API directly (filtering is handled by the API)
  const filteredResources = resources;

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

  return (
    <div className="min-h-screen bg-background">
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
                    Grade Level
                  </label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Resource Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="free">Free</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredResources.length} resources
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
                    ) : filteredResources.length === 0 ? (
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
                      filteredResources.map((resource) => {
                        // Safety checks for resource data
                        if (!resource || typeof resource !== 'object') {
                          console.warn("Invalid resource data:", resource);
                          return null;
                        }

                        if (!resource.id || typeof resource.id !== 'string') {
                          console.warn("Resource missing valid ID:", resource);
                          return null;
                        }

                        const TypeIcon = getTypeIcon(resource.resourceType || resource.type);
                        return (
                          <Card
                            key={resource.id}
                            className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 overflow-hidden cursor-pointer"
                            onClick={() => handleResourceClick(resource.id)}
                          >
                            <div className="relative">
                              <img
                                src={resource.bannerImage || "/api/placeholder/300/200"}
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
                                  {resource.resourceType || resource.type || "Resource"}
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
                                        {resource.createdBy?.name
                                          ? resource.createdBy.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                          : "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {resource.createdBy?.name || "Unknown Author"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                              <CardDescription className="line-clamp-2 text-sm">
                                {resource.description || "No description available"}
                              </CardDescription>

                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {resource.subject || "Unknown Subject"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {resource.ageRange || "Unknown Age Range"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {resource.curriculum || "Unknown Curriculum"}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    4.5
                                  </div>
                                  <div className="flex items-center">
                                    <Download className="w-4 h-4 mr-1" />
                                    0
                                  </div>
                                </div>
                                <div className="text-right">
                                  {resource.isFree ? (
                                    <div className="text-lg font-bold text-brand-accent-green">
                                      FREE
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-lg font-bold">
                                        ${typeof resource.price === 'number' ? resource.price.toFixed(2) : '0.00'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewClick(resource.id);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                                <Button
                                  variant="hero"
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePurchaseClick(resource.id);
                                  }}
                                >
                                  {resource.isFree ? (
                                    <>
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </>
                                  ) : (
                                    <>
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Purchase
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination */}
                  {totalResources > 12 && (
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
                </TabsContent>

                <TabsContent value="free" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Free Resources</h3>
                      <p className="text-sm">
                        Filter functionality coming soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="premium" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Premium Resources</h3>
                      <p className="text-sm">
                        Filter functionality coming soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="new" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">New Resources</h3>
                      <p className="text-sm">
                        Filter functionality coming soon.
                      </p>
                    </div>
                  </div>
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