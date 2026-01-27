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
  Clock,
  Bookmark,
  Flag,
  Copy,
  Heart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

  useEffect(() => {
    if (discussion && user) {
      setIsLiked(discussion?.likes?.includes(user.id || "") || false);
      setLikeCount(discussion?.likes?.length || 0);
    }
  }, [discussion, user]);

  useEffect(() => {
    const handleNewComment = () => {};
    socketService.onNewComment(handleNewComment);
    return () => {
      socketService.off("comment:new", handleNewComment);
    };
  }, []);

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

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikeDiscussion(id!);
    } catch (error) {
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
    setReplyError("");
    setReplyContent("");

    try {
      const replyData: CreateReplyData = {
        discussionId: id!,
        content: tempContent,
      };

      await postReply(replyData);
    } catch (error) {
      setReplyContent(tempContent);
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
    setNestedReplyError("");
    setNestedReplyContent("");
    setReplyingTo(null);

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

      await postReply(replyData);
    } catch (error) {
      setNestedReplyContent(tempContent);
      setReplyingTo(parentReplyId);
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
      "Teaching Tips & Strategies": "bg-blue-100 text-blue-700 border-blue-200",
      "Curriculum & Resources": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Career Advice": "bg-violet-100 text-violet-700 border-violet-200",
      "Help & Support": "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colorMap[category] || "bg-gray-100 text-gray-600 border-gray-200";
  };

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

    if (navigator.share) {
      try {
        await navigator.share({
          title: discussion?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Post link copied to clipboard",
        });
      } catch (error) {
        console.error('Failed to copy:', error);
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-[#0A66C2]" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-[#0A66C2]/20"></div>
          </div>
          <span className="mt-4 text-gray-600 font-medium">Loading discussion...</span>
        </div>
      </div>
    );
  }

  if (!discussion && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Discussion Not Found</h2>
            <p className="text-gray-600 mb-8">
              {error && error.includes("not found") ? error : "The discussion you're looking for doesn't exist or has been removed."}
            </p>
            <Link to="/forum">
              <Button className="bg-[#0A66C2] hover:bg-[#004182] px-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Back Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to="/forum"
            className="inline-flex items-center text-gray-600 hover:text-[#0A66C2] transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Forum
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {/* Main Post Card */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden mb-6">
          {/* Author Header */}
          <div className="p-5 sm:p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 ring-4 ring-white shadow-md">
                  <AvatarImage src={discussion?.createdBy.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white text-lg font-semibold">
                    {getUserInitials(discussion.createdBy)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {getUserDisplayName(discussion.createdBy)}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">{discussion?.createdBy.role}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(discussion.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {discussion?.views} views
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-5 sm:p-6 pt-4">
            {/* Category Badge */}
            <Badge className={`${getCategoryColor(discussion?.category)} text-xs font-medium px-3 py-1 mb-4 border`}>
              {discussion?.category}
            </Badge>

            {/* Title */}
            <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 mb-4 leading-snug">
              {discussion?.title}
            </h1>

            {/* Content */}
            <div className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap mb-5">
              {discussion?.content}
            </div>

            {/* Images */}
            {discussion?.images && discussion?.images.length > 0 && (
              <div className="mb-5 -mx-5 sm:-mx-6">
                {discussion?.images.length === 1 ? (
                  <img
                    src={discussion?.images[0].url}
                    alt="Post image"
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                ) : discussion?.images.length === 2 ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    {discussion?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      />
                    ))}
                  </div>
                ) : discussion?.images.length === 3 ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    <img
                      src={discussion?.images[0].url}
                      alt="Post image 1"
                      className="col-span-2 w-full h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    />
                    {discussion?.images.slice(1).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 2}`}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-0.5">
                    {discussion?.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-52 object-cover cursor-pointer hover:opacity-95 transition-opacity"
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
                    className="bg-gray-100 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] text-gray-600 text-xs px-3 py-1 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-gray-100" />

          {/* Engagement Stats */}
          <div className="px-5 sm:px-6 py-3 bg-gray-50/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#0A66C2] transition-colors group">
                  <div className="p-1 rounded-full bg-[#0A66C2]/10 group-hover:bg-[#0A66C2]/20 transition-colors">
                    <Heart className="w-3.5 h-3.5 text-[#0A66C2]" />
                  </div>
                  <span className="font-medium">{likeCount}</span>
                </button>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  {replies.length} {replies.length === 1 ? 'comment' : 'comments'}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* Action Buttons */}
          <div className="px-3 sm:px-4 py-2">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`flex-1 h-11 rounded-xl font-medium transition-all ${
                  isLiked
                    ? "text-[#0A66C2] bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10"
                    : "text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
                }`}
              >
                <ThumbsUp className={`w-5 h-5 mr-2 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
                Like
              </Button>

              <Button
                variant="ghost"
                className="flex-1 h-11 rounded-xl font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
                onClick={() => document.getElementById("comment-input")?.focus()}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comment
              </Button>

              <Button
                variant="ghost"
                onClick={handleShare}
                className="flex-1 h-11 rounded-xl font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Comment Input */}
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <div className="flex items-start gap-3">
                <Avatar className="w-11 h-11 ring-2 ring-white shadow-sm">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white font-medium">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    id="comment-input"
                    placeholder={!user ? "Log in to join the conversation..." : "Share your thoughts..."}
                    value={replyContent}
                    onChange={(e) => {
                      setReplyContent(e.target.value);
                      if (replyError) setReplyError("");
                    }}
                    onClick={handleTextareaClick}
                    className={`min-h-[100px] mb-3 resize-none rounded-xl border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20 ${replyError ? "border-red-400 focus:border-red-400" : ""} ${!user ? "cursor-pointer bg-gray-50" : ""}`}
                    disabled={!user}
                    readOnly={!user}
                  />
                  {replyError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>{replyError}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {replyContent.length}/5000 characters
                    </span>
                    <Button
                      onClick={handlePostReply}
                      disabled={!replyContent.trim() || submittingReply || !user}
                      className="bg-[#0A66C2] hover:bg-[#004182] px-6 rounded-xl"
                    >
                      {submittingReply ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div>
              {organizedReplies.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {organizedReplies.map((reply) => (
                    <div key={reply._id} className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
                      {/* Comment */}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={reply.createdBy.avatarUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-sm">
                            {getUserInitials(reply.createdBy)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-100/70 rounded-2xl rounded-tl-none px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">
                                {getUserDisplayName(reply.createdBy)}
                              </span>
                              <span className="text-xs text-gray-400">{getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                              {reply.content}
                            </div>
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-1 mt-2 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReplyLike(reply._id)}
                              className={`h-8 px-3 text-xs rounded-full ${reply.likes?.includes(user?.id || "") ? "text-[#0A66C2] bg-[#0A66C2]/5" : "text-gray-500 hover:text-[#0A66C2]"}`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 mr-1.5 ${reply.likes?.includes(user?.id || "") ? "fill-current" : ""}`} />
                              {reply.likes?.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(replyingTo === reply._id ? null : reply._id)}
                              className="h-8 px-3 text-xs text-gray-500 hover:text-[#0A66C2] rounded-full"
                            >
                              Reply
                            </Button>
                            {getRepliesForParent(reply._id).length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRepliesExpansion(reply._id)}
                                className="h-8 px-3 text-xs text-[#0A66C2] hover:bg-[#0A66C2]/5 font-medium rounded-full"
                              >
                                {expandedReplies.has(reply._id) ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5 mr-1" />
                                    Hide replies
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5 mr-1" />
                                    {getRepliesForParent(reply._id).length} {getRepliesForParent(reply._id).length === 1 ? 'reply' : 'replies'}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>

                          {/* Nested Reply Form */}
                          {replyingTo === reply._id && (
                            <div className="mt-4 ml-0 sm:ml-4 pl-4 border-l-2 border-[#0A66C2]/20">
                              <div className="flex items-start gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={user?.avatarUrl} />
                                  <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white text-xs">
                                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder={`Reply to ${getUserDisplayName(reply.createdBy)}...`}
                                    value={nestedReplyContent}
                                    onChange={(e) => {
                                      setNestedReplyContent(e.target.value);
                                      if (nestedReplyError) setNestedReplyError("");
                                    }}
                                    className={`min-h-[70px] mb-2 resize-none text-sm rounded-xl border-gray-200 ${nestedReplyError ? "border-red-400" : ""}`}
                                  />
                                  {nestedReplyError && (
                                    <div className="flex items-center gap-1.5 text-red-600 text-xs mb-2">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      <span>{nestedReplyError}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setNestedReplyContent("");
                                        setNestedReplyError("");
                                      }}
                                      className="h-8 text-xs rounded-lg"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handlePostNestedReply(reply._id)}
                                      disabled={!nestedReplyContent.trim() || submittingReply}
                                      className="h-8 text-xs bg-[#0A66C2] hover:bg-[#004182] rounded-lg"
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
                            <div className="mt-4 ml-0 sm:ml-4 pl-4 border-l-2 border-gray-200 space-y-4">
                              {getRepliesForParent(reply._id).map((nestedReply) => (
                                <div key={nestedReply._id} className="flex items-start gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={nestedReply.createdBy.avatarUrl} />
                                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs">
                                      {getUserInitials(nestedReply.createdBy)}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <div className="bg-gray-100/50 rounded-2xl rounded-tl-none px-3 py-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-gray-900">
                                          {getUserDisplayName(nestedReply.createdBy)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {getTimeAgo(nestedReply.createdAt)}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {nestedReply.content}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReplyLike(nestedReply._id)}
                                      className={`h-7 px-2 mt-1 ml-2 text-xs rounded-full ${nestedReply.likes?.includes(user?.id || "") ? "text-[#0A66C2]" : "text-gray-500"}`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 mr-1 ${nestedReply.likes?.includes(user?.id || "") ? "fill-current" : ""}`} />
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
                  ))}
                </div>
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
