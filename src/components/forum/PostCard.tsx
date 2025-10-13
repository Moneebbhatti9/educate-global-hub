/**
 * LinkedIn-Style Post Card Component
 * Displays forum posts in a clean, professional card layout with engagement metrics
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Eye,
  Pin,
  Heart,
} from "lucide-react";
import { Discussion } from "@/types/forum";
import { formatDate, getUserDisplayName, getUserInitials } from "@/utils/forumTransformers";
import socketService from "@/services/socketService";

interface PostCardProps {
  discussion: Discussion;
  onLike: (discussionId: string) => void;
  currentUserId?: string;
  showEngagementAnimation?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  discussion,
  onLike,
  currentUserId,
  showEngagementAnimation = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(discussion.likes?.length || 0);
  const [likePulse, setLikePulse] = useState(false);

  // Check if current user has liked the post
  useEffect(() => {
    if (currentUserId && discussion.likes) {
      setIsLiked(discussion.likes.includes(currentUserId));
    }
  }, [currentUserId, discussion.likes]);

  // Listen for real-time like updates
  useEffect(() => {
    const handlePostUpdate = (data: { discussionId: string; likes: number }) => {
      if (data.discussionId === discussion._id) {
        setLikeCount(data.likes);
        if (showEngagementAnimation) {
          setLikePulse(true);
          setTimeout(() => setLikePulse(false), 600);
        }
      }
    };

    socketService.onPostUpdated(handlePostUpdate);

    return () => {
      socketService.off("post:updated", handlePostUpdate);
    };
  }, [discussion._id, showEngagementAnimation]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));

    // Trigger animation
    if (showEngagementAnimation && !isLiked) {
      setLikePulse(true);
      setTimeout(() => setLikePulse(false), 600);
    }

    onLike(discussion._id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/forum/${discussion._id}`;
    const shareText = `${discussion.title} - ${getUserDisplayName(discussion.createdBy)}`;

    // Try native Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: discussion.title,
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
        // Show toast notification
        const event = new CustomEvent('show-toast', {
          detail: {
            title: 'Link Copied!',
            description: 'Post link copied to clipboard',
          }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Failed to copy:', error);
        // Final fallback: Create temporary input
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        const event = new CustomEvent('show-toast', {
          detail: {
            title: 'Link Copied!',
            description: 'Post link copied to clipboard',
          }
        });
        window.dispatchEvent(event);
      }
    }
  };

  // Category color mapping (LinkedIn-style)
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Teaching Tips & Strategies": "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
      "Curriculum & Resources": "bg-[#057642]/10 text-[#057642] border-[#057642]/20",
      "Career Advice": "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20",
      "Help & Support": "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
    };
    return colorMap[category] || "bg-gray-100 text-gray-600";
  };

  // Generate excerpt from content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  // Time ago format (LinkedIn-style)
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-[#0A66C2]/30 bg-white">
      <CardHeader className="pb-3">
        {/* Author Info Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-[#0A66C2]/20 transition-all">
              <AvatarImage src={discussion.createdBy.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white font-semibold">
                {getUserInitials(discussion.createdBy)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-[15px] text-gray-900 hover:text-[#0A66C2] transition-colors cursor-pointer truncate">
                  {getUserDisplayName(discussion.createdBy)}
                </span>
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-gray-600 truncate">{discussion.createdBy.role}</div>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <span>{getTimeAgo(discussion.createdAt)}</span>
                <span>•</span>
                <Eye className="w-3 h-3" />
                <span>{discussion.views}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="w-4 h-4 mr-2" />
                Save for later
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Badge */}
        <Badge variant="outline" className={`${getCategoryColor(discussion.category)} text-xs w-fit`}>
          {discussion.category}
        </Badge>

        {/* Post Title */}
        <Link to={`/forum/${discussion._id}`} className="block mt-2">
          <h3 className="font-semibold text-[17px] text-gray-900 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
            {discussion.title}
          </h3>
        </Link>

        {/* Post Content Preview */}
        <Link to={`/forum/${discussion._id}`} className="block">
          <p className="text-[14px] text-gray-700 line-clamp-3 mt-2 leading-relaxed">
            {getExcerpt(discussion.content)}
          </p>
        </Link>

        {/* Post Images */}
        {discussion.images && discussion.images.length > 0 && (
          <Link to={`/forum/${discussion._id}`} className="block mt-3">
            {discussion.images.length === 1 ? (
              <img
                src={discussion.images[0].url}
                alt="Post image"
                className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200"
              />
            ) : discussion.images.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {discussion.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            ) : discussion.images.length === 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={discussion.images[0].url}
                  alt="Post image 1"
                  className="col-span-2 w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                {discussion.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`Post image ${idx + 2}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {discussion.images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </Link>
        )}

        {/* Tags */}
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {discussion.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
            {discussion.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{discussion.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Engagement Bar (LinkedIn-style) */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-9 px-3 font-medium transition-all ${
                isLiked
                  ? "text-[#0A66C2] bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10"
                  : "text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
              } ${likePulse ? "animate-pulse scale-110" : ""}`}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-1.5 transition-all ${
                  isLiked ? "fill-current" : ""
                } ${likePulse ? "animate-bounce" : ""}`}
              />
              <span className="font-semibold">{likeCount}</span>
            </Button>

            <Link to={`/forum/${discussion._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                <span className="font-semibold">{discussion.commentsCount || 0}</span>
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-9 px-3 text-gray-600 hover:text-[#0A66C2] hover:bg-gray-100"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            <span className="font-medium">Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
