import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Eye,
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForumDetail } from "@/hooks/useForum";
import { useSocket } from "@/contexts/SocketContext";
import socketService from "@/services/socketService";
import { useAuth } from "@/contexts/AuthContext";
import { CreateReplyData } from "@/types/forum";
import {
  getUserDisplayName,
  getUserInitials,
} from "@/utils/forumTransformers";
import { toast } from "@/hooks/use-toast";

const ForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { joinDiscussion, leaveDiscussion } = useSocket();
  const {
    discussion,
    replies,
    loading,
    error,
    submittingReply,
    loadDiscussion,
    postReply,
    toggleLikeDiscussion,
    toggleLikeReply,
  } = useForumDetail(id!);

  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [nestedReplyContent, setNestedReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyError, setReplyError] = useState<string>("");
  const [nestedReplyError, setNestedReplyError] = useState<string>("");

  // Load discussion and join room
  useEffect(() => {
    if (id) {
      loadDiscussion();
      joinDiscussion(id);
    }

    return () => {
      if (id) {
        leaveDiscussion(id);
      }
    };
  }, [id, loadDiscussion, joinDiscussion, leaveDiscussion]);

  // Set initial like state
  useEffect(() => {
    if (discussion && user) {
      setIsLiked(discussion?.likes?.includes(user.id || "") || false);
      setLikeCount(discussion?.likes?.length || 0);
    }
  }, [discussion, user]);

  // Listen for real-time comments (no need to reload, hook handles it)
  useEffect(() => {
    const handleNewComment = (comment: any) => {
      // The useForumDetail hook already handles new comments via Socket.IO
      // No need to reload the entire page
      console.log("New comment received via socket:", comment);
    };

    socketService.onNewComment(handleNewComment);

    return () => {
      socketService.off("comment:new", handleNewComment);
    };
  }, []);

  // Listen for real-time likes
  useEffect(() => {
    const handlePostUpdate = (data: { discussionId: string; likes: number }) => {
      if (data.discussionId === id) {
        setLikeCount(data.likes);
      }
    };

    socketService.onPostUpdated(handlePostUpdate);

    return () => {
      socketService.off("post:updated", handlePostUpdate);
    };
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikeDiscussion(id!);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handlePostReply = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }

    if (!replyContent.trim()) {
      setReplyError("Comment cannot be empty");
      return;
    }

    if (replyContent.length > 5000) {
      setReplyError("Comment must be less than 5000 characters");
      return;
    }

    const tempContent = replyContent.trim();

    // Clear error and input immediately (optimistic UI)
    setReplyError("");
    setReplyContent("");

    try {
      const replyData: CreateReplyData = {
        discussionId: id!,
        content: tempContent,
      };

      // Post reply - the hook will add it to the replies list
      await postReply(replyData);

      // No toast for success - LinkedIn doesn't show toast for comments
    } catch (error) {
      // Restore content on error
      setReplyContent(tempContent);

      // Show error inline
      const errorMsg = error instanceof Error ? error.message : "Failed to post comment";
      setReplyError(errorMsg);
    }
  };

  const handlePostNestedReply = async (parentReplyId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to reply.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }

    if (!nestedReplyContent.trim()) {
      setNestedReplyError("Reply cannot be empty");
      return;
    }

    if (nestedReplyContent.length > 5000) {
      setNestedReplyError("Reply must be less than 5000 characters");
      return;
    }

    const tempContent = nestedReplyContent.trim();

    // Clear error, input and close form immediately (optimistic UI)
    setNestedReplyError("");
    setNestedReplyContent("");
    setReplyingTo(null);

    // Expand the parent comment to show the new reply
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      newSet.add(parentReplyId);
      return newSet;
    });

    try {
      const replyData: CreateReplyData = {
        discussionId: id!,
        content: tempContent,
        parentReply: parentReplyId,
      };

      // Post reply - the hook will add it to the replies list
      await postReply(replyData);

      // No toast for success - LinkedIn doesn't show toast for replies
    } catch (error) {
      // Restore content and reopen form on error
      setNestedReplyContent(tempContent);
      setReplyingTo(parentReplyId);

      // Show error inline
      const errorMsg = error instanceof Error ? error.message : "Failed to post reply";
      setNestedReplyError(errorMsg);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like comments.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }

    try {
      await toggleLikeReply(replyId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}w ago`;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Teaching Tips & Strategies": "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
      "Curriculum & Resources": "bg-[#057642]/10 text-[#057642] border-[#057642]/20",
      "Career Advice": "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20",
      "Help & Support": "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
    };
    return colorMap[category] || "bg-gray-100 text-gray-600";
  };

  // Organize replies
  const organizedReplies = replies.filter(r => !r.parentReply);
  const getRepliesForParent = (parentId: string) => replies.filter(r => r.parentReply === parentId);

  const toggleRepliesExpansion = (replyId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  const handleTextareaClick = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/forum/${id}` } });
    }
  };

  const handleShare = async () => {
    if (!discussion) return;

    const shareUrl = `${window.location.origin}/forum/${discussion?._id}`;
    const shareText = `${discussion?.title} - ${getUserDisplayName(discussion?.createdBy)}`;

    // Try native Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: discussion?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Post link copied to clipboard",
        });
      } catch (error) {
        console.error('Failed to copy:', error);
        // Final fallback: Create temporary input
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        toast({
          title: "Link Copied!",
          description: "Post link copied to clipboard",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F2EF]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
          <span className="ml-3 text-gray-600">Loading post...</span>
        </div>
      </div>
    );
  }

  // Only show "Not Found" if discussion failed to load (not for validation errors)
  if (!discussion && !loading) {
    return (
      <div className="min-h-screen bg-[#F3F2EF]">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error && error.includes("not found") ? error : "The post you're looking for doesn't exist."}
          </p>
          <Link to="/forum">
            <Button className="bg-[#0A66C2] hover:bg-[#004182]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      <Navigation />

      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/forum"
            className="inline-flex items-center text-gray-600 hover:text-[#0A66C2] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {/* Post Card */}
        <Card className="bg-white mb-4">
          {/* Post Header */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-transparent">
                  <AvatarImage src={discussion?.createdBy.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white font-semibold">
                    {getUserInitials(discussion.createdBy)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[15px] text-gray-900">
                      {getUserDisplayName(discussion.createdBy)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{discussion?.createdBy.role}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <span>{getTimeAgo(discussion.createdAt)}</span>
                    <span>•</span>
                    <Eye className="w-3 h-3" />
                    <span>{discussion?.views}</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share post
                  </DropdownMenuItem>
                  <DropdownMenuItem>Report post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Category Badge */}
            <Badge variant="outline" className={`${getCategoryColor(discussion?.category)} text-xs mb-3`}>
              {discussion?.category}
            </Badge>

            {/* Post Title */}
            <h1 className="font-semibold text-[20px] text-gray-900 mb-3 leading-tight">
              {discussion?.title}
            </h1>

            {/* Post Content */}
            <div className="text-[15px] text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
              {discussion?.content}
            </div>

            {/* Post Images */}
            {discussion?.images && discussion?.images.length > 0 && (
              <div className="mb-4">
                {discussion?.images.length === 1 ? (
                  <img
                    src={discussion?.images[0].url}
                    alt="Post image"
                    className="w-full h-auto max-h-[600px] object-contain rounded-lg border border-gray-200"
                  />
                ) : discussion?.images.length === 2 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {discussion?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                ) : discussion?.images.length === 3 ? (
                  <div className="grid grid-cols-2 gap-3">
                    <img
                      src={discussion?.images[0].url}
                      alt="Post image 1"
                      className="col-span-2 w-full h-96 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    {discussion?.images.slice(1).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 2}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {discussion?.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-56 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {discussion?.tags && discussion?.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {discussion?.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Engagement Bar */}
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-4">
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                <span>{replies.length} {replies.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 border-t border-gray-200 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex-1 h-9 font-medium ${
                  isLiked
                    ? "text-[#0A66C2] bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10"
                    : "text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                Like
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-9 font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
                onClick={() => document.getElementById("comment-input")?.focus()}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex-1 h-9 font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {/* Add Comment */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    id="comment-input"
                    placeholder={!user ? "Log in to comment..." : "Add a comment..."}
                    value={replyContent}
                    onChange={(e) => {
                      setReplyContent(e.target.value);
                      if (replyError) setReplyError(""); // Clear error on type
                    }}
                    onClick={handleTextareaClick}
                    className={`min-h-[80px] mb-2 resize-none ${replyError ? "border-red-500 focus:border-red-500" : ""} ${!user ? "cursor-pointer" : ""}`}
                    disabled={!user}
                    readOnly={!user}
                  />
                  {replyError && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{replyError}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-end">
                    <Button
                      size="sm"
                      onClick={handlePostReply}
                      disabled={!replyContent.trim() || submittingReply || !user}
                      className="bg-[#0A66C2] hover:bg-[#004182]"
                    >
                      {submittingReply ? (
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
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-gray-200">
              {organizedReplies.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No comments yet</p>
                  <p className="text-sm text-gray-500 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                organizedReplies.map((reply) => (
                  <div key={reply._id} className="p-4 sm:p-6">
                    {/* Main Comment */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={reply.createdBy.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                          {getUserInitials(reply.createdBy)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {getUserDisplayName(reply.createdBy)}
                          </span>
                          <span className="text-xs text-gray-500">{getTimeAgo(reply.createdAt)}</span>
                        </div>
                        <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                          {reply.content}
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReplyLike(reply._id)}
                            className="h-7 px-2 text-gray-600 hover:text-[#0A66C2]"
                          >
                            <ThumbsUp className={`w-3 h-3 mr-1 ${reply.likes?.includes(user?.id || "") ? "fill-current text-[#0A66C2]" : ""}`} />
                            {reply.likes?.length || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === reply._id ? null : reply._id)}
                            className="h-7 px-2 text-gray-600 hover:text-[#0A66C2]"
                          >
                            Reply
                          </Button>
                          {getRepliesForParent(reply._id).length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRepliesExpansion(reply._id)}
                              className="h-7 px-2 text-[#0A66C2] hover:text-[#004182] font-medium"
                            >
                              {expandedReplies.has(reply._id) ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Hide {getRepliesForParent(reply._id).length} {getRepliesForParent(reply._id).length === 1 ? 'reply' : 'replies'}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  View {getRepliesForParent(reply._id).length} {getRepliesForParent(reply._id).length === 1 ? 'reply' : 'replies'}
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Nested Reply Form */}
                        {replyingTo === reply._id && (
                          <div className="mt-3 ml-0 sm:ml-8">
                            <div className="flex items-start space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white text-xs">
                                  {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder={`Reply to ${getUserDisplayName(reply.createdBy)}...`}
                                  value={nestedReplyContent}
                                  onChange={(e) => {
                                    setNestedReplyContent(e.target.value);
                                    if (nestedReplyError) setNestedReplyError(""); // Clear error on type
                                  }}
                                  className={`min-h-[60px] mb-2 resize-none text-sm ${nestedReplyError ? "border-red-500 focus:border-red-500" : ""}`}
                                />
                                {nestedReplyError && (
                                  <div className="flex items-center space-x-1 text-red-600 text-xs mb-2">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{nestedReplyError}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setNestedReplyContent("");
                                      setNestedReplyError(""); // Clear error
                                    }}
                                    className="h-7 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handlePostNestedReply(reply._id)}
                                    disabled={!nestedReplyContent.trim() || submittingReply}
                                    className="h-7 text-xs bg-[#0A66C2] hover:bg-[#004182]"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {getRepliesForParent(reply._id).length > 0 && expandedReplies.has(reply._id) && (
                          <div className="mt-4 ml-0 sm:ml-8 space-y-4">
                            {getRepliesForParent(reply._id).map((nestedReply) => (
                              <div key={nestedReply._id} className="flex items-start space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={nestedReply.createdBy.avatarUrl} />
                                  <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs">
                                    {getUserInitials(nestedReply.createdBy)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                      {getUserDisplayName(nestedReply.createdBy)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {getTimeAgo(nestedReply.createdAt)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                                    {nestedReply.content}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReplyLike(nestedReply._id)}
                                    className="h-7 px-2 text-gray-600 hover:text-[#0A66C2]"
                                  >
                                    <ThumbsUp className={`w-3 h-3 mr-1 ${nestedReply.likes?.includes(user?.id || "") ? "fill-current text-[#0A66C2]" : ""}`} />
                                    {nestedReply.likes?.length || 0}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ForumDetail;
