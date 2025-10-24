import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Plus,
  Send,
  Loader2,
  AlertCircle,
  Briefcase,
  ImagePlus,
  X,
} from "lucide-react";
import { useForum } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { CreateDiscussionData } from "@/types/forum";
import { parseTags } from "@/utils/forumTransformers";
import { toast } from "@/hooks/use-toast";
import PostCard from "@/components/forum/PostCard";
import NotificationBell from "@/components/forum/NotificationBell";
import socketService from "@/services/socketService";

const Forum = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    discussions,
    trendingTopics,
    categoryStats,
    communityOverview,
    loading,
    error,
    loadInitialData,
    loadDiscussions,
    createDiscussion,
    toggleLikeDiscussion,
    searchDiscussions,
  } = useForum();

  const [searchTerm, setSearchTerm] = useState("");
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load discussions when tab or search changes
  useEffect(() => {
    if (searchTerm.trim()) {
      searchDiscussions(searchTerm);
    } else {
      loadDiscussions({
        tab: activeTab as "recent" | "trending" | "unanswered" | "following",
        page: 1,
        limit: 20,
      });
    }
  }, [activeTab, searchTerm, loadDiscussions, searchDiscussions]);

  // Listen for real-time post updates
  useEffect(() => {
    const handleNewPost = () => {
      loadDiscussions({
        tab: activeTab as "recent" | "trending" | "unanswered" | "following",
        page: 1,
        limit: 20,
      });
    };

    socketService.onNewPost(handleNewPost);

    return () => {
      socketService.off("post:new", handleNewPost);
    };
  }, [activeTab, loadDiscussions]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 4 images
    const validFiles = files.slice(0, 4 - selectedImages.length);

    // Validate file types and sizes
    const imageFiles = validFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...imageFiles]);

    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewPostClick = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      // Redirect to login with return URL
      navigate("/login", { state: { from: "/forum" } });
      return;
    }
    // User is authenticated, open the dialog
    setIsDialogOpen(true);
  };

  const handleCreateDiscussion = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert images to base64
      const imagePromises = selectedImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const discussionData: CreateDiscussionData = {
        title: newDiscussion.title.trim(),
        content: newDiscussion.content.trim(),
        category: newDiscussion.category,
        tags: parseTags(newDiscussion.tags),
        images: base64Images, // Send base64 images to backend
      };

      await createDiscussion(discussionData);

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      setIsDialogOpen(false);
      setNewDiscussion({ title: "", content: "", category: "", tags: "" });
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLikeDiscussion(discussionId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchDiscussions(searchTerm);
    } else {
      loadDiscussions({
        tab: activeTab as "recent" | "trending" | "unanswered" | "following",
        page: 1,
        limit: 20,
      });
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      "Teaching Tips & Strategies": Lightbulb,
      "Curriculum & Resources": BookOpen,
      "Career Advice": Briefcase,
      "Help & Support": HelpCircle,
    };
    return iconMap[categoryName] || HelpCircle;
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      "Teaching Tips & Strategies": "bg-[#0A66C2]/10 text-[#0A66C2]",
      "Curriculum & Resources": "bg-[#057642]/10 text-[#057642]",
      "Career Advice": "bg-[#7C3AED]/10 text-[#7C3AED]",
      "Help & Support": "bg-[#F97316]/10 text-[#F97316]",
    };
    return colorMap[categoryName] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col">
      <Navigation />

      {/* LinkedIn-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="font-heading font-semibold text-xl text-gray-900">
              Educator Forum
            </h1>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <Button
                onClick={handleNewPostClick}
                className="bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create a post</DialogTitle>
                    <DialogDescription>
                      Share your knowledge with the educator community
                    </DialogDescription>
                  </DialogHeader>

                  <form className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="What do you want to talk about?"
                        value={newDiscussion.title}
                        onChange={(e) =>
                          setNewDiscussion({ ...newDiscussion, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newDiscussion.category}
                        onValueChange={(value) =>
                          setNewDiscussion({ ...newDiscussion, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Teaching Tips & Strategies">
                            Teaching Tips & Strategies
                          </SelectItem>
                          <SelectItem value="Curriculum & Resources">
                            Curriculum & Resources
                          </SelectItem>
                          <SelectItem value="Career Advice">Career Advice</SelectItem>
                          <SelectItem value="Help & Support">Help & Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">What's on your mind? *</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your thoughts, questions, or insights..."
                        value={newDiscussion.content}
                        onChange={(e) =>
                          setNewDiscussion({ ...newDiscussion, content: e.target.value })
                        }
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (optional)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., math, classroom-management, assessment"
                        value={newDiscussion.tags}
                        onChange={(e) =>
                          setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                        }
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>Add Images (optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#0A66C2] transition-colors">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="hidden"
                          disabled={selectedImages.length >= 4}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`flex flex-col items-center justify-center cursor-pointer ${selectedImages.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium">
                            {selectedImages.length >= 4 ? 'Maximum 4 images' : 'Click to add images'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB (max 4 images)
                          </span>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                title="cross"
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCreateDiscussion}
                        className="bg-[#0A66C2] hover:bg-[#004182]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Post
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 overflow-hidden">
        {/* LinkedIn-style 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Sidebar - Fixed height with scroll */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto h-full max-h-[calc(100vh-180px)]">
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-base">Categories</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoryStats.map((category) => {
                  const IconComponent = getCategoryIcon(category.category);
                  return (
                    <button
                      key={category.category}
                      className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`w-10 h-10 rounded-lg ${getCategoryColor(category.category)} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{category.category}</div>
                        <div className="text-xs text-gray-500">{category.posts} posts</div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-base">Community</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-gradient-to-br from-[#0A66C2]/10 to-[#0A66C2]/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#0A66C2]">
                    {communityOverview?.activeMembers.toLocaleString() || "0"}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Active Educators</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {communityOverview?.totalDiscussions.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {communityOverview?.totalReplies.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-gray-600">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed - Scrollable area */}
          <div className="lg:col-span-6 space-y-4 overflow-y-auto h-full max-h-[calc(100vh-180px)] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 bg-gray-100"
                />
              </form>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-white h-12 p-1 rounded-lg shadow-sm">
                <TabsTrigger value="recent" className="flex-1">Latest</TabsTrigger>
                <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
                <TabsTrigger value="unanswered" className="flex-1">Unanswered</TabsTrigger>
                <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              </TabsList>

              {/* Error */}
              {error && (
                <div className="bg-white rounded-lg p-4 border border-red-200 mt-4">
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="bg-white rounded-lg p-8 text-center mt-4">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0A66C2]" />
                  <p className="mt-2 text-gray-600">Loading posts...</p>
                </div>
              )}

              {/* Posts Feed */}
              {!loading && discussions.length > 0 && (
                <div className="space-y-4 mt-4">
                  {discussions.map((discussion) => (
                    <PostCard
                      key={discussion._id}
                      discussion={discussion}
                      onLike={handleLikeDiscussion}
                      currentUserId={user?.id}
                      showEngagementAnimation={true}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && discussions.length === 0 && (
                <Card className="bg-white p-12 text-center mt-4">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "Try adjusting your search" : "Be the first to post!"}
                    </p>
                  </div>
                </Card>
              )}
            </Tabs>
          </div>

          {/* Right Sidebar - Fixed height with scroll */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto h-full max-h-[calc(100vh-180px)]">
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#0A66C2]" />
                  <h3 className="font-semibold text-base">Trending</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.slice(0, 5).map((topic) => (
                  <div
                    key={topic._id}
                    className="py-2 hover:bg-gray-50 -mx-3 px-3 rounded cursor-pointer"
                  >
                    <p className="text-sm font-medium line-clamp-2">{topic.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                      <span className="text-xs text-gray-500">{topic.replyCount} comments</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-base">Popular Hashtags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["teaching", "classroom", "assessment", "engagement"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-[#0A66C2]/10"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forum;
