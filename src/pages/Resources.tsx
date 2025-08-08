import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye
} from "lucide-react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const subjects = [
    { name: "Mathematics", icon: Calculator, color: "bg-blue-100 text-blue-600" },
    { name: "Science", icon: Beaker, color: "bg-green-100 text-green-600" },
    { name: "English", icon: BookOpen, color: "bg-purple-100 text-purple-600" },
    { name: "History", icon: Globe, color: "bg-orange-100 text-orange-600" },
    { name: "Art", icon: Palette, color: "bg-pink-100 text-pink-600" },
    { name: "Music", icon: Music, color: "bg-indigo-100 text-indigo-600" },
    { name: "Physical Education", icon: Trophy, color: "bg-red-100 text-red-600" }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete Algebra Workbook with Solutions",
      description: "Comprehensive algebra workbook covering linear equations, quadratic functions, and polynomial operations with step-by-step solutions.",
      author: {
        name: "Dr. Maria Santos",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      subject: "Mathematics",
      grade: "Grade 9-10",
      type: "Workbook",
      format: "PDF",
      price: 12.99,
      originalPrice: 19.99,
      rating: 4.8,
      reviews: 234,
      downloads: 1420,
      uploadDate: "2 weeks ago",
      preview: true,
      tags: ["algebra", "equations", "functions", "polynomials"],
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Interactive Chemistry Lab Simulations",
      description: "Virtual chemistry lab experiments with 3D animations and interactive elements. Perfect for remote learning.",
      author: {
        name: "Prof. James Wilson",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      subject: "Science",
      grade: "Grade 11-12",
      type: "Interactive",
      format: "Web App",
      price: 0,
      originalPrice: null,
      rating: 4.9,
      reviews: 156,
      downloads: 892,
      uploadDate: "1 week ago",
      preview: true,
      tags: ["chemistry", "experiments", "virtual-lab", "3d"],
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Creative Writing Prompts Collection",
      description: "300+ creative writing prompts designed to inspire students and develop their storytelling skills across various genres.",
      author: {
        name: "Sarah Mitchell",
        avatar: "/api/placeholder/40/40",
        verified: false
      },
      subject: "English",
      grade: "Grade 6-8",
      type: "Activity Pack",
      format: "PDF",
      price: 8.50,
      originalPrice: null,
      rating: 4.6,
      reviews: 89,
      downloads: 567,
      uploadDate: "3 days ago",
      preview: false,
      tags: ["creative-writing", "prompts", "storytelling", "genres"],
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "World History Timeline Interactive Map",
      description: "Interactive timeline and map showing major historical events from ancient civilizations to modern times.",
      author: {
        name: "Dr. Ahmed Hassan",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      subject: "History",
      grade: "Grade 7-12",
      type: "Interactive",
      format: "Web App",
      price: 15.00,
      originalPrice: null,
      rating: 4.7,
      reviews: 203,
      downloads: 1156,
      uploadDate: "5 days ago",
      preview: true,
      tags: ["history", "timeline", "interactive", "civilizations"],
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Phonics Learning Games Bundle",
      description: "Fun and engaging phonics games to help young learners master letter sounds and reading fundamentals.",
      author: {
        name: "Emma Thompson",
        avatar: "/api/placeholder/40/40",
        verified: false
      },
      subject: "English",
      grade: "Grade K-2",
      type: "Game Pack",
      format: "PDF + Audio",
      price: 0,
      originalPrice: null,
      rating: 4.5,
      reviews: 312,
      downloads: 2345,
      uploadDate: "1 month ago",
      preview: true,
      tags: ["phonics", "reading", "games", "kindergarten"],
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Advanced Calculus Problem Sets",
      description: "Challenging calculus problems with detailed solutions covering derivatives, integrals, and applications.",
      author: {
        name: "Prof. Lisa Chen",
        avatar: "/api/placeholder/40/40",
        verified: true
      },
      subject: "Mathematics",
      grade: "Grade 12+",
      type: "Problem Set",
      format: "PDF",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.9,
      reviews: 145,
      downloads: 678,
      uploadDate: "1 week ago",
      preview: true,
      tags: ["calculus", "derivatives", "integrals", "advanced"],
      thumbnail: "/api/placeholder/300/200"
    }
  ];

  const grades = ["Grade K-2", "Grade 3-5", "Grade 6-8", "Grade 9-10", "Grade 11-12", "Grade 12+"];
  const types = ["Workbook", "Interactive", "Activity Pack", "Game Pack", "Problem Set", "Video Course"];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
    const matchesGrade = !selectedGrade || resource.grade === selectedGrade;
    const matchesType = !selectedType || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesType;
  });

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
                Discover high-quality teaching materials, interactive content, and educational tools 
                created by educators worldwide.
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button variant="hero-outline">
                Upload Resource
              </Button>
              <Button variant="hero">
                Become a Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Subject Categories */}
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-xl mb-4">Browse by Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card key={subject.name} className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
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
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject.name} value={subject.name}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Grade Level</label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Grades</SelectItem>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Resource Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="hero-outline" className="w-full" onClick={() => {
                  setSelectedSubject("");
                  setSelectedGrade("");
                  setSelectedType("");
                }}>
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
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <Card key={resource.id} className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20 overflow-hidden">
                          <div className="relative">
                            <img
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="bg-background/90">
                                {resource.format}
                              </Badge>
                            </div>
                            <div className="absolute top-3 right-3 flex space-x-1">
                              {resource.preview && (
                                <Badge variant="outline" className="bg-background/90 text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Badge>
                              )}
                            </div>
                            <div className="absolute bottom-3 right-3">
                              <Button variant="ghost" size="icon" className="bg-background/90 hover:bg-background">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="font-heading text-lg leading-tight group-hover:text-brand-primary transition-colors cursor-pointer line-clamp-2">
                                  {resource.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={resource.author.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {resource.author.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">{resource.author.name}</span>
                                  {resource.author.verified && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-3">
                            <CardDescription className="line-clamp-2 text-sm">
                              {resource.description}
                            </CardDescription>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">{resource.subject}</Badge>
                              <Badge variant="outline" className="text-xs">{resource.grade}</Badge>
                              <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  {resource.rating}
                                </div>
                                <div className="flex items-center">
                                  <Download className="w-4 h-4 mr-1" />
                                  {resource.downloads}
                                </div>
                              </div>
                              <div className="text-right">
                                {resource.price === 0 ? (
                                  <div className="text-lg font-bold text-brand-accent-green">FREE</div>
                                ) : (
                                  <div>
                                    <div className="text-lg font-bold text-foreground">
                                      ${resource.price}
                                    </div>
                                    {resource.originalPrice && (
                                      <div className="text-xs text-muted-foreground line-through">
                                        ${resource.originalPrice}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2 pt-2">
                              {resource.price === 0 ? (
                                <Button variant="teachers" className="flex-1">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              ) : (
                                <>
                                  <Button variant="hero-outline" className="flex-1">
                                    Preview
                                  </Button>
                                  <Button variant="teachers" className="flex-1">
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