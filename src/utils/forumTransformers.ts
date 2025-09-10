import {
  Discussion,
  Reply,
  User,
  TrendingTopic,
  CategoryStats,
  CommunityOverview,
} from "../types/forum";

// Transform API discussion data to our Discussion interface
export const transformDiscussion = (
  apiDiscussion: Record<string, unknown>
): Discussion => ({
  _id: apiDiscussion._id,
  title: apiDiscussion.title,
  content: apiDiscussion.content,
  category: apiDiscussion.category,
  tags: apiDiscussion.tags || [],
  createdBy: transformUser(apiDiscussion.createdBy),
  views: apiDiscussion.views || 0,
  likes: apiDiscussion.likes || [],
  isPinned: apiDiscussion.isPinned || false,
  isLocked: apiDiscussion.isLocked || false,
  isActive: apiDiscussion.isActive !== false,
  createdAt: apiDiscussion.createdAt,
  updatedAt: apiDiscussion.updatedAt,
  replyCount: apiDiscussion.replyCount,
  lastReplyAt: apiDiscussion.lastReplyAt,
  trendingScore: apiDiscussion.trendingScore,
});

// Transform API reply data to our Reply interface
export const transformReply = (apiReply: Record<string, unknown>): Reply => ({
  _id: apiReply._id,
  discussion: apiReply.discussion,
  content: apiReply.content,
  createdBy: transformUser(apiReply.createdBy),
  parentReply: apiReply.parentReply,
  likes: apiReply.likes || [],
  createdAt: apiReply.createdAt,
  updatedAt: apiReply.updatedAt,
  isOP: apiReply.isOP || false,
});

// Transform API user data to our User interface
export const transformUser = (apiUser: Record<string, unknown>): User => ({
  _id: apiUser._id,
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  avatarUrl: apiUser.avatarUrl || apiUser.avatar,
  role: apiUser.role || "Teacher",
  reputation: apiUser.reputation || 0,
  badges: apiUser.badges || [],
});

// Transform trending topic data
export const transformTrendingTopic = (
  apiTopic: Record<string, unknown>
): TrendingTopic => ({
  _id: apiTopic._id,
  title: apiTopic.title,
  category: apiTopic.category,
  tags: apiTopic.tags || [],
  views: apiTopic.views || 0,
  replyCount: apiTopic.replyCount || 0,
  trendingScore: apiTopic.trendingScore || 0,
  createdAt: apiTopic.createdAt,
});

// Transform category stats
export const transformCategoryStats = (
  apiStats: Record<string, unknown>
): CategoryStats => ({
  category: apiStats.category,
  posts: apiStats.posts || 0,
  members: apiStats.members || 0,
});

// Transform community overview
export const transformCommunityOverview = (
  apiOverview: Record<string, unknown>
): CommunityOverview => ({
  activeMembers: apiOverview.activeMembers || 0,
  totalDiscussions: apiOverview.totalDiscussions || 0,
  totalReplies: apiOverview.totalReplies || 0,
});

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Format date for detailed view
export const formatDetailedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get user display name
export const getUserDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

// Get user initials for avatar fallback
export const getUserInitials = (user: User): string => {
  if (!user?.firstName || !user?.lastName) {
    return "";
  }

  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

// Check if user liked a discussion/reply
export const hasUserLiked = (likes: string[], userId: string): boolean => {
  return likes.includes(userId);
};

// Get like count
export const getLikeCount = (likes: string[]): number => {
  return likes.length;
};

// Format large numbers (e.g., 1000 -> 1K)
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Parse tags from string
export const parseTags = (tagsString: string): string[] => {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

// Format tags for display
export const formatTags = (tags: string[]): string => {
  return tags.join(", ");
};

// Get category color and icon
export const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { color: string; icon: string }> = {
    "Teaching Tips & Strategies": {
      color: "bg-brand-accent-orange/10 text-brand-accent-orange",
      icon: "Lightbulb",
    },
    "Curriculum & Resources": {
      color: "bg-brand-accent-green/10 text-brand-accent-green",
      icon: "BookOpen",
    },
    "Career Advice": {
      color: "bg-brand-secondary/10 text-brand-secondary",
      icon: "TrendingUp",
    },
    "Help & Support": {
      color: "bg-brand-primary/10 text-brand-primary",
      icon: "HelpCircle",
    },
  };

  return (
    categoryMap[category] || {
      color: "bg-gray-100 text-gray-600",
      icon: "MessageCircle",
    }
  );
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Generate discussion excerpt
export const generateExcerpt = (
  content: string,
  maxLength: number = 150
): string => {
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/`(.*?)`/g, "$1") // Code
    .replace(/#{1,6}\s/g, "") // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/\n+/g, " ") // Newlines to spaces
    .trim();

  return truncateText(plainText, maxLength);
};

// Validate discussion data
export const validateDiscussionData = (data: {
  title: string;
  content: string;
  category: string;
  tags: string[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters long");
  }

  if (!data.content || data.content.trim().length < 10) {
    errors.push("Content must be at least 10 characters long");
  }

  if (!data.category) {
    errors.push("Please select a category");
  }

  if (data.tags.length > 10) {
    errors.push("Maximum 10 tags allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate reply data
export const validateReplyData = (
  content: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content || content.trim().length < 5) {
    errors.push("Reply must be at least 5 characters long");
  }

  if (content.length > 5000) {
    errors.push("Reply must be less than 5000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
