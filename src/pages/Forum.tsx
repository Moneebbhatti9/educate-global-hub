import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MessageCircle,
  Users,
  ThumbsUp,
  Clock,
  Pin,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Plus,
  Tag,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useForum } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { CreateDiscussionData } from "@/types/forum";
import {
  formatDate,
  getUserDisplayName,
  getUserInitials,
  hasUserLiked,
  getLikeCount,
  parseTags,
  generateExcerpt,
} from "@/utils/forumTransformers";
import { toast } from "@/hooks/use-toast";

const Forum = () => {
  const { user } = useAuth();
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
    clearError,
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
        limit: 10,
      });
    }
  }, [activeTab, searchTerm, loadDiscussions, searchDiscussions]);

  const handleCreateDiscussion = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a discussion.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const discussionData: CreateDiscussionData = {
        title: newDiscussion.title.trim(),
        content: newDiscussion.content.trim(),
        category: newDiscussion.category,
        tags: parseTags(newDiscussion.tags),
      };

      await createDiscussion(discussionData);

      toast({
        title: "Success",
        description: "Discussion created successfully!",
      });

      setIsDialogOpen(false);
      setNewDiscussion({ title: "", content: "", category: "", tags: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create discussion",
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
        description: "Please sign in to like discussions.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLikeDiscussion(discussionId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like discussion",
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
        limit: 10,
      });
    }
  };

  // Category mapping for icons and colors
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      "Teaching Tips & Strategies": Lightbulb,
      "Curriculum & Resources": BookOpen,
      "Career Advice": TrendingUp,
      "Help & Support": HelpCircle,
    };
    return iconMap[categoryName] || MessageCircle;
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      "Teaching Tips & Strategies":
        "bg-brand-accent-orange/10 text-brand-accent-orange",
      "Curriculum & Resources":
        "bg-brand-accent-green/10 text-brand-accent-green",
      "Career Advice": "bg-brand-secondary/10 text-brand-secondary",
      "Help & Support": "bg-brand-primary/10 text-brand-primary",
    };
    return colorMap[categoryName] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4">
                Education Forum
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl">
                Connect with educators worldwide. Share knowledge, ask
                questions, and grow together as a global education community.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="hero"
                  className="ml-0 sm:ml-4 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="sm:inline">New Discussion</span>
                  <span className="sm:hidden">New Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto sm:w-full sm:max-w-2xl">
                <DialogHeader className="pb-4">
                  <DialogTitle className="font-heading text-lg sm:text-xl">
                    Start a New Discussion
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Share your thoughts, ask questions, or start a conversation
                    with the community.
                  </DialogDescription>
                </DialogHeader>

                <form
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Discussion Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, descriptive title for your discussion"
                      value={newDiscussion.title}
                      onChange={(e) =>
                        setNewDiscussion({
                          ...newDiscussion,
                          title: e.target.value,
                        })
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <Select
                      value={newDiscussion.category}
                      onValueChange={(value) =>
                        setNewDiscussion({ ...newDiscussion, category: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teaching Tips & Strategies">
                          Teaching Tips & Strategies
                        </SelectItem>
                        <SelectItem value="Curriculum & Resources">
                          Curriculum & Resources
                        </SelectItem>
                        <SelectItem value="Career Advice">
                          Career Advice
                        </SelectItem>
                        <SelectItem value="Help & Support">
                          Help & Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Content *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, ask your question, or describe your topic in detail..."
                      value={newDiscussion.content}
                      onChange={(e) =>
                        setNewDiscussion({
                          ...newDiscussion,
                          content: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full resize-none sm:resize-y min-h-[100px] sm:min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tags"
                        placeholder="e.g., mathematics, classroom-management, new-teacher (separate with commas)"
                        value={newDiscussion.tags}
                        onChange={(e) =>
                          setNewDiscussion({
                            ...newDiscussion,
                            tags: e.target.value,
                          })
                        }
                        className="pl-10 w-full"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Add relevant tags to help others find your discussion
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="hero"
                      disabled={isSubmitting}
                      onClick={handleCreateDiscussion}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Start Discussion
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Tabs */}
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions, topics, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="text-destructive">{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="ml-auto"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading discussions...</span>
                  </div>
                )}

                <TabsContent value="recent" className="space-y-4 mt-6">
                  {!loading &&
                    discussions.map((discussion) => (
                      <Card
                        key={discussion._id}
                        className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {discussion.isPinned && (
                                  <Pin className="w-4 h-4 text-brand-accent-orange" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                              </div>
                              <CardTitle className="font-heading text-lg">
                                <Link
                                  to={`/forum/${discussion._id}`}
                                  className="hover:text-brand-primary transition-colors cursor-pointer block hover:underline"
                                >
                                  {discussion.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2 line-clamp-2">
                                {generateExcerpt(discussion.content)}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={discussion.createdBy.avatarUrl}
                                />
                                <AvatarFallback>
                                  {getUserInitials(discussion.createdBy)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {getUserDisplayName(discussion.createdBy)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {discussion.createdBy.role}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {discussion.replyCount || 0}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLikeDiscussion(discussion._id)
                                }
                                className={`h-8 px-2 ${
                                  user &&
                                  hasUserLiked(discussion.likes, user.id || "")
                                    ? "text-brand-primary"
                                    : ""
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {getLikeCount(discussion.likes)}
                              </Button>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(discussion.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {/* Empty State */}
                  {!loading && discussions.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No discussions found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Be the first to start a discussion!"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trending" className="space-y-4 mt-6">
                  {!loading &&
                    discussions.map((discussion) => (
                      <Card
                        key={discussion._id}
                        className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {discussion.isPinned && (
                                  <Pin className="w-4 h-4 text-brand-accent-orange" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                              </div>
                              <CardTitle className="font-heading text-lg">
                                <Link
                                  to={`/forum/${discussion._id}`}
                                  className="hover:text-brand-primary transition-colors cursor-pointer block hover:underline"
                                >
                                  {discussion.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2 line-clamp-2">
                                {generateExcerpt(discussion.content)}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={discussion.createdBy.avatarUrl}
                                />
                                <AvatarFallback>
                                  {getUserInitials(discussion.createdBy)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {getUserDisplayName(discussion.createdBy)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {discussion.createdBy.role}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {discussion.replyCount || 0}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLikeDiscussion(discussion._id)
                                }
                                className={`h-8 px-2 ${
                                  user &&
                                  hasUserLiked(discussion.likes, user.id || "")
                                    ? "text-brand-primary"
                                    : ""
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {getLikeCount(discussion.likes)}
                              </Button>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(discussion.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {!loading && discussions.length === 0 && (
                    <div className="text-center py-12">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No trending discussions
                      </h3>
                      <p className="text-muted-foreground">
                        Check back later for trending topics!
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="unanswered" className="space-y-4 mt-6">
                  {!loading &&
                    discussions.map((discussion) => (
                      <Card
                        key={discussion._id}
                        className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {discussion.isPinned && (
                                  <Pin className="w-4 h-4 text-brand-accent-orange" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                              </div>
                              <CardTitle className="font-heading text-lg">
                                <Link
                                  to={`/forum/${discussion._id}`}
                                  className="hover:text-brand-primary transition-colors cursor-pointer block hover:underline"
                                >
                                  {discussion.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2 line-clamp-2">
                                {generateExcerpt(discussion.content)}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={discussion.createdBy.avatarUrl}
                                />
                                <AvatarFallback>
                                  {getUserInitials(discussion.createdBy)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {getUserDisplayName(discussion.createdBy)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {discussion.createdBy.role}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {discussion.replyCount || 0}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLikeDiscussion(discussion._id)
                                }
                                className={`h-8 px-2 ${
                                  user &&
                                  hasUserLiked(discussion.likes, user.id || "")
                                    ? "text-brand-primary"
                                    : ""
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {getLikeCount(discussion.likes)}
                              </Button>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(discussion.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {!loading && discussions.length === 0 && (
                    <div className="text-center py-12">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No unanswered discussions
                      </h3>
                      <p className="text-muted-foreground">
                        All discussions have replies! Great community
                        engagement.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following" className="space-y-4 mt-6">
                  {!loading &&
                    discussions.map((discussion) => (
                      <Card
                        key={discussion._id}
                        className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {discussion.isPinned && (
                                  <Pin className="w-4 h-4 text-brand-accent-orange" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                              </div>
                              <CardTitle className="font-heading text-lg">
                                <Link
                                  to={`/forum/${discussion._id}`}
                                  className="hover:text-brand-primary transition-colors cursor-pointer block hover:underline"
                                >
                                  {discussion.title}
                                </Link>
                              </CardTitle>
                              <CardDescription className="mt-2 line-clamp-2">
                                {generateExcerpt(discussion.content)}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={discussion.createdBy.avatarUrl}
                                />
                                <AvatarFallback>
                                  {getUserInitials(discussion.createdBy)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {getUserDisplayName(discussion.createdBy)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {discussion.createdBy.role}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {discussion.replyCount || 0}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLikeDiscussion(discussion._id)
                                }
                                className={`h-8 px-2 ${
                                  user &&
                                  hasUserLiked(discussion.likes, user.id || "")
                                    ? "text-brand-primary"
                                    : ""
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {getLikeCount(discussion.likes)}
                              </Button>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(discussion.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {!loading && discussions.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No followed discussions
                      </h3>
                      <p className="text-muted-foreground">
                        Follow topics and users to see their discussions here.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryStats.map((category) => {
                  const IconComponent = getCategoryIcon(category.category);
                  return (
                    <div
                      key={category.category}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${getCategoryColor(
                          category.category
                        )} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm group-hover:text-brand-primary transition-colors">
                          {category.category}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {category.posts} posts · {category.members} members
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic._id}
                      className="flex justify-between items-center py-2 hover:bg-muted/30 -mx-2 px-2 rounded cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        #{topic.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {topic.replyCount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">
                    {communityOverview?.activeMembers.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Members
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {communityOverview?.totalDiscussions.toLocaleString() ||
                        "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Discussions
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {communityOverview?.totalReplies.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Replies</div>
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
