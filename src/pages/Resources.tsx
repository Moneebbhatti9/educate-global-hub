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
import {
  resourceApi,
  AllResourcesData,
  AllResourcesResponse,
} from "@/apis/resources";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [resources, setResources] = useState<AllResourcesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  // Load resources from API
  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await resourceApi.getAllResources({
        q: searchTerm || undefined,
        subject: selectedSubject !== "all" ? selectedSubject : undefined,
        page: currentPage,
        limit: 12,
      });

      if (response.success) {
        setResources(response.data.resources);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || "Failed to load resources");
      }
    } catch (error: unknown) {
      console.error("Error loading resources:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load resources. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load resources on component mount and when filters change
  useEffect(() => {
    loadResources();
  }, [searchTerm, selectedSubject, selectedGrade, selectedType, currentPage]);

  const handleResourceClick = (resourceId: string) => {
    navigate(`/resources/${resourceId}`);
  };

  const handlePreviewClick = (resourceId: string) => {
    navigate(`/resources/${resourceId}`);
  };

  const handlePurchaseClick = (resourceId: string) => {
    // For now, navigate to resource detail page
    // In a real app, this would handle the purchase flow
    navigate(`/resources/${resourceId}`);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Workbook":
      case "Problem Set":
        return FileText;
      case "Interactive":
      case "Game Pack":
        return Video;
      case "Activity Pack":
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
                Educational Resources
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Discover high-quality teaching materials, interactive content,
                and educational tools created by educators worldwide.
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button variant="hero-outline" asChild>
                <Link to="/dashboard/teacher/upload-resource">
                  Upload Resource
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Subject Categories */}
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-xl mb-4">
            Browse by Subject
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card
                  key={subject.name}
                  className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="font-medium text-sm">{subject.name}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
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
                      {loading
                        ? "Loading..."
                        : `Showing ${resources.length} of ${pagination.total} resources`}
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

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <div className="h-48 bg-muted rounded-t-lg"></div>
                          <CardHeader>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded"></div>
                              <div className="h-3 bg-muted rounded w-5/6"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {resources.map((resource) => {
                        const isFree = resource.price === "Free";
                        return (
                          <Card
                            key={resource.id}
                            className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 overflow-hidden cursor-pointer"
                            onClick={() => handleResourceClick(resource.id)}
                          >
                            <div className="relative">
                              <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-background/90"
                                >
                                  PDF
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
                                    {resource.title}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-xs">
                                        {resource.author
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {resource.author}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {resource.status}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(
                                      resource.uploadDate
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {isFree ? (
                                    <div className="text-lg font-bold text-brand-accent-green">
                                      FREE
                                    </div>
                                  ) : (
                                    <div className="text-lg font-bold text-foreground">
                                      {resource.price}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2 pt-2">
                                {isFree ? (
                                  <Button
                                    variant="teachers"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResourceClick(resource.id);
                                    }}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="hero-outline"
                                      className="flex-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewClick(resource.id);
                                      }}
                                    >
                                      Preview
                                    </Button>
                                    <Button
                                      variant="teachers"
                                      className="flex-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePurchaseClick(resource.id);
                                      }}
                                    >
                                      Buy Now
                                    </Button>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Page {currentPage} of {pagination.pages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(pagination.pages, prev + 1)
                          )
                        }
                        disabled={currentPage === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="free" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Free resources will be displayed here.
                  </p>
                </TabsContent>

                <TabsContent value="premium" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Premium resources will be displayed here.
                  </p>
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Recently uploaded resources will be displayed here.
                  </p>
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
