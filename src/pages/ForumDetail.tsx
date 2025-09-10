import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  Reply,
  Edit3,
  Bold,
  Italic,
  Link as LinkIcon,
  Code,
  Quote,
  Flag,
  Award,
  Calendar,
  Eye,
  Pin,
  Heart,
  Laugh,
  Angry,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForumDetail } from "@/hooks/useForum";
import { useForumNotifications } from "@/hooks/useForumNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { CreateReplyData } from "@/types/forum";
import {
  formatDetailedDate,
  getUserDisplayName,
  getUserInitials,
  hasUserLiked,
  getLikeCount,
} from "@/utils/forumTransformers";
import { toast } from "@/hooks/use-toast";

const ForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const {
    discussion,
    replies,
    loading,
    error,
    submittingReply,
    loadDiscussion,
    postReply,
    toggleLikeReply,
    clearError,
  } = useForumDetail(id!);
  const { joinDiscussionRoom, leaveDiscussionRoom } = useForumNotifications();

  const [sortBy, setSortBy] = useState("newest");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [userReaction, setUserReaction] = useState<string | null>(null);

  // Load discussion on component mount
  useEffect(() => {
    if (id) {
      loadDiscussion();
      // Join the discussion room for real-time updates
      joinDiscussionRoom(id);
    }

    // Cleanup: leave the discussion room when component unmounts
    return () => {
      if (id) {
        leaveDiscussionRoom(id);
      }
    };
  }, [id, loadDiscussion, joinDiscussionRoom, leaveDiscussionRoom]);

  const reactions = [
    {
      emoji: "👍",
      count: discussion ? getLikeCount(discussion.likes) : 0,
      label: "Helpful",
    },
    { emoji: "❤️", count: 12, label: "Love" },
    { emoji: "😊", count: 8, label: "Happy" },
    { emoji: "🤔", count: 3, label: "Thinking" },
  ];

  const handleReaction = (emoji: string) => {
    setUserReaction(userReaction === emoji ? null : emoji);
  };

  const handleReplyLike = async (replyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like replies.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLikeReply(replyId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like reply",
        variant: "destructive",
      });
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim() || !id) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post replies.",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData: CreateReplyData = {
        discussionId: id,
        content: replyContent.trim(),
      };

      await postReply(replyData);
      setReplyContent("");

      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/forum"
            className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <span>Loading discussion...</span>
          </div>
        )}

        {!loading && discussion && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Topic Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge
                          variant="outline"
                          className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                        >
                          {discussion.category}
                        </Badge>
                        {discussion.isPinned && (
                          <Pin className="w-4 h-4 text-brand-accent-orange" />
                        )}
                      </div>
                      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-4">
                        {discussion.title}
                      </h1>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save Topic
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={discussion.createdBy.avatarUrl} />
                      <AvatarFallback>
                        {getUserInitials(discussion.createdBy)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {getUserDisplayName(discussion.createdBy)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          OP
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {discussion.createdBy.role}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Award className="w-3 h-3 text-brand-accent-orange" />
                        <span className="text-xs text-muted-foreground">
                          {discussion.createdBy.reputation || 0} reputation
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDetailedDate(discussion.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs hover:bg-brand-primary/10 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Topic Content */}
                  <div className="prose prose-slate max-w-none mb-6">
                    <div className="whitespace-pre-wrap text-foreground">
                      {discussion.content}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Reactions & Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Reactions */}
                      <div className="flex items-center space-x-2">
                        {reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant={
                              userReaction === reaction.emoji
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleReaction(reaction.emoji)}
                            className="h-8 px-3"
                          >
                            <span className="mr-1">{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {discussion.views} views
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {discussion.replyCount || 0} replies
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg">
                      {replies.length} Replies
                    </CardTitle>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="most-liked">Most Liked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Add Reply Form */}
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>
                          {user
                            ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add your reply to help the community..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[100px] mb-3"
                          disabled={!user}
                        />

                        {/* Rich Text Toolbar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Bold className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Italic className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Code className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Quote className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="default"
                            className="bg-brand-primary hover:bg-brand-primary/90"
                            disabled={
                              !replyContent.trim() || submittingReply || !user
                            }
                            onClick={handlePostReply}
                          >
                            {submittingReply ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                              </>
                            ) : (
                              "Post Reply"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  {replies.map((reply) => (
                    <div key={reply._id} className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={reply.createdBy.avatarUrl} />
                          <AvatarFallback>
                            {getUserInitials(reply.createdBy)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">
                              {getUserDisplayName(reply.createdBy)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {reply.createdBy.role}
                            </Badge>
                            {reply.isOP && (
                              <Badge variant="secondary" className="text-xs">
                                OP
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {formatDetailedDate(reply.createdAt)}
                            </span>
                          </div>

                          <div className="prose prose-slate max-w-none mb-3">
                            <div className="whitespace-pre-wrap text-foreground">
                              {reply.content}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReplyLike(reply._id)}
                              className={`h-8 ${
                                user && hasUserLiked(reply.likes, user.id || "")
                                  ? "text-brand-primary"
                                  : ""
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {getLikeCount(reply.likes)}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Reply className="w-4 h-4 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />
                    </div>
                  ))}

                  {/* Empty State */}
                  {replies.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No replies yet
                      </h3>
                      <p className="text-muted-foreground">
                        Be the first to share your thoughts on this discussion!
                      </p>
                    </div>
                  )}

                  {/* Load More Comments */}
                  <div className="text-center">
                    <Button variant="outline">Load More Comments</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    About the Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={discussion.createdBy.avatarUrl} />
                      <AvatarFallback>
                        {getUserInitials(discussion.createdBy)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {getUserDisplayName(discussion.createdBy)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {discussion.createdBy.role}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reputation</span>
                      <span className="font-semibold">
                        {discussion.createdBy.reputation || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Posts</span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span className="font-semibold">Mar 2023</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {discussion.createdBy.badges?.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="mr-2 mb-2"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Related Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Building math confidence in elementary students",
                    "Visual math teaching strategies",
                    "Overcoming math anxiety in middle school",
                    "Real-world math applications for engagement",
                  ].map((title, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="font-medium text-sm text-brand-primary hover:text-brand-secondary transition-colors">
                        {title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        12 replies · 3 hours ago
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Popular Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "mathematics",
                      "engagement",
                      "classroom-management",
                      "teaching-tips",
                      "student-motivation",
                      "algebra",
                      "middle-school",
                    ].map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-brand-primary/10"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Discussion Not Found */}
        {!loading && !discussion && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Discussion Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The discussion you're looking for doesn't exist or has been
              removed.
            </p>
            <Link to="/forum">
              <Button variant="default">Back to Forum</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ForumDetail;
