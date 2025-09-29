// Forum Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: string;
  reputation?: number;
  badges?: string[];
}

// Extended user interface that includes auth user properties
export interface ForumUser extends User {
  id?: string; // For compatibility with auth user
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  category:
    | "Teaching Tips & Strategies"
    | "Curriculum & Resources"
    | "Career Advice"
    | "Help & Support";
  tags: string[];
  createdBy: User;
  views: number;
  likes: string[]; // Array of user IDs
  isPinned: boolean;
  isLocked: boolean;
  isActive: boolean;
  reports: string[]; // Array of report IDs
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
  lastReplyAt?: string;
  trendingScore?: number;
}

export interface Reply {
  _id: string;
  discussion: string;
  content: string;
  createdBy: User;
  parentReply?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  isOP?: boolean; // Original Poster
}

export interface DiscussionFeedResponse {
  page: number;
  limit: number;
  total: number;
  data: Discussion[];
}

export interface DiscussionDetailResponse {
  discussion: Discussion;
  replies: Reply[];
  pagination: {
    page: number;
    limit: number;
    totalReplies: number;
    totalPages: number;
  };
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CreateReplyData {
  discussionId: string;
  content: string;
  parentReply?: string;
}

export interface LikeResponse {
  likeCount: number;
  liked: boolean;
}

export interface TrendingTopic {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  views: number;
  replyCount: number;
  trendingScore: number;
  createdAt: string;
}

export interface CategoryStats {
  category: string;
  posts: number;
  members: number;
}

export interface CommunityOverview {
  activeMembers: number;
  totalDiscussions: number;
  totalReplies: number;
}

export interface DiscussionFeedParams {
  tab?: "recent" | "trending" | "unanswered" | "following";
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface ReplyListResponse {
  replies: Reply[];
  pagination: {
    page: number;
    limit: number;
    totalReplies: number;
    totalPages: number;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Reaction types
export interface Reaction {
  emoji: string;
  count: number;
  label: string;
}

// Forum categories with icons and colors
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  posts: number;
  members: number;
}
