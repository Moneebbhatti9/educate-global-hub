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
  Users,
  MessageSquare,
  Sparkles,
  Hash,
  Flame,
} from "lucide-react";
import { useForum } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { CreateDiscussionData } from "@/types/forum";
import { parseTags } from "@/utils/forumTransformers";
import { toast } from "@/hooks/use-toast";
import PostCard from "@/components/forum/PostCard";
import NotificationBell from "@/components/NotificationBell";
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

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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
    const validFiles = files.slice(0, 4 - selectedImages.length);

    const imageFiles = validFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
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
      navigate("/login", { state: { from: "/forum" } });
      return;
    }
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
        images: base64Images,
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
    const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
      "Teaching Tips & Strategies": { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" },
      "Curriculum & Resources": { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-600" },
      "Career Advice": { bg: "bg-violet-50", text: "text-violet-700", icon: "text-violet-600" },
      "Help & Support": { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600" },
    };
    return colorMap[categoryName] || { bg: "bg-gray-50", text: "text-gray-700", icon: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <Navigation />

      {/* Modern Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0A66C2] via-[#0077B5] to-[#004182] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE2MSAwIDYuMTMzLS44MTQgOC43MTYtMi4yNDRsLjQyNyA0LjI1NkM0Mi40MjMgNTguNjg3IDM5LjMgNjAgMzYgNjBjLTEyLjE1IDAtMjItOS44NS0yMi0yMnM5Ljg1LTIyIDIyLTIyYzMuMyAwIDYuNDIzIDEuMzEzIDguNzE2IDMuOTg4bC0uNDI3IDQuMjU2QzQyLjEzMyAxOC44MTQgMzkuMTYxIDE4IDM2IDE4eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Educator Forum
                </h1>
              </div>
              <p className="text-blue-100 text-sm md:text-base max-w-md">
                Connect, share insights, and grow with fellow educators worldwide
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Button
                onClick={handleNewPostClick}
                className="bg-white text-[#0A66C2] hover:bg-blue-50 font-semibold shadow-lg shadow-black/10 transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0A66C2]" />
              Create a Post
            </DialogTitle>
            <DialogDescription>
              Share your knowledge with the educator community
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">Title *</Label>
              <Input
                id="title"
                placeholder="What's your topic about?"
                value={newDiscussion.title}
                onChange={(e) =>
                  setNewDiscussion({ ...newDiscussion, title: e.target.value })
                }
                className="h-11 border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium">Category *</Label>
              <Select
                value={newDiscussion.category}
                onValueChange={(value) =>
                  setNewDiscussion({ ...newDiscussion, category: value })
                }
              >
                <SelectTrigger className="h-11 border-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teaching Tips & Strategies">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      Teaching Tips & Strategies
                    </div>
                  </SelectItem>
                  <SelectItem value="Curriculum & Resources">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Curriculum & Resources
                    </div>
                  </SelectItem>
                  <SelectItem value="Career Advice">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-violet-600" />
                      Career Advice
                    </div>
                  </SelectItem>
                  <SelectItem value="Help & Support">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      Help & Support
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium">Content *</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or insights..."
                value={newDiscussion.content}
                onChange={(e) =>
                  setNewDiscussion({ ...newDiscussion, content: e.target.value })
                }
                rows={6}
                className="resize-none border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="font-medium">Tags</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="tags"
                  placeholder="math, classroom-management, assessment"
                  value={newDiscussion.tags}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                  }
                  className="pl-9 h-11 border-gray-200"
                />
              </div>
              <p className="text-xs text-gray-500">Separate tags with commas</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="font-medium">Images</Label>
              <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${selectedImages.length >= 4 ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-[#0A66C2] hover:bg-blue-50/30'}`}>
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
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <ImagePlus className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedImages.length >= 4 ? 'Maximum 4 images reached' : 'Click to upload images'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each
                  </span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        title="Remove"
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isSubmitting || !newDiscussion.title || !newDiscussion.category || !newDiscussion.content}
                onClick={handleCreateDiscussion}
                className="bg-[#0A66C2] hover:bg-[#004182] px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Categories */}
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0A66C2]" />
                  Categories
                </h3>
              </CardHeader>
              <CardContent className="p-2">
                {categoryStats.map((category) => {
                  const IconComponent = getCategoryIcon(category.category);
                  const colors = getCategoryColor(category.category);
                  return (
                    <button
                      key={category.category}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${colors.text} truncate`}>{category.category}</div>
                        <div className="text-xs text-gray-500">{category.posts} discussions</div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-[#0A66C2] to-[#004182] border-0 shadow-lg overflow-hidden text-white">
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl font-bold">
                    {communityOverview?.activeMembers.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-blue-100 font-medium">Active Educators</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-xl font-bold">
                      {communityOverview?.totalDiscussions.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-100">Posts</div>
                  </div>
                  <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-xl font-bold">
                      {communityOverview?.totalReplies.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-100">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-4">
            {/* Search Bar */}
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-3">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-11 border-0 bg-gray-100/80 focus:bg-white focus:ring-2 focus:ring-[#0A66C2]/20 rounded-xl transition-all"
                  />
                </form>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-white h-12 p-1 rounded-xl shadow-sm border-0">
                <TabsTrigger
                  value="recent"
                  className="flex-1 rounded-lg data-[state=active]:bg-[#0A66C2] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="flex-1 rounded-lg data-[state=active]:bg-[#0A66C2] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Trending
                </TabsTrigger>
              </TabsList>

              {/* Error State */}
              {error && (
                <Card className="bg-red-50 border border-red-200 mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {loading && (
                <Card className="bg-white border-0 shadow-sm p-12 text-center mt-4">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#0A66C2]" />
                  <p className="mt-4 text-gray-600 font-medium">Loading discussions...</p>
                </Card>
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
                <Card className="bg-white border-0 shadow-sm p-12 text-center mt-4">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? "Try adjusting your search terms" : "Be the first to start a conversation!"}
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={handleNewPostClick}
                        className="bg-[#0A66C2] hover:bg-[#004182]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Post
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Trending Topics */}
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Trending Now</h3>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                {trendingTopics.slice(0, 5).map((topic, index) => (
                  <div
                    key={topic._id}
                    onClick={() => navigate(`/forum/${topic._id}`)}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-gray-300 group-hover:text-[#0A66C2] transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#0A66C2] transition-colors">
                          {topic.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                            {topic.category}
                          </Badge>
                          <span className="text-[11px] text-gray-500">{topic.replyCount} replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Hashtags */}
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#0A66C2]" />
                  <h3 className="font-semibold text-gray-900">Popular Tags</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {["teaching", "classroom", "assessment", "engagement", "curriculum", "edtech", "pedagogy", "students"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-[#0A66C2] hover:text-white transition-colors px-3 py-1 text-xs font-medium"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Stats - Show on mobile */}
            <Card className="lg:hidden bg-gradient-to-br from-[#0A66C2] to-[#004182] border-0 shadow-lg text-white">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold">
                      {communityOverview?.activeMembers.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-100">Members</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {communityOverview?.totalDiscussions.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-100">Posts</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {communityOverview?.totalReplies.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-blue-100">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Forum;
