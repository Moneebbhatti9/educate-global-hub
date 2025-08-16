// Core Types
export type JobStatus =
  | "draft"
  | "published"
  | "active"
  | "expired"
  | "closed"
  | "archived";
export type JobType = "full_time" | "part_time" | "contract" | "substitute";
export type EducationLevel =
  | "early_years"
  | "primary"
  | "secondary"
  | "high_school"
  | "foundation"
  | "higher_education";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "accepted"
  | "rejected"
  | "withdrawn";
export type NotificationType =
  | "job_posted"
  | "job_updated"
  | "job_closed"
  | "job_expired"
  | "application_submitted"
  | "application_reviewed"
  | "application_shortlisted"
  | "application_interviewed"
  | "application_accepted"
  | "application_rejected"
  | "application_withdrawn"
  | "reminder_apply"
  | "deadline_approaching"
  | "new_candidate"
  | "profile_viewed"
  | "job_recommendation"
  | "system_alert";
export type NotificationCategory =
  | "job"
  | "application"
  | "reminder"
  | "system"
  | "recommendation";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";
export type ViewSource =
  | "search"
  | "direct"
  | "referral"
  | "email"
  | "social"
  | "other";

// Base Interfaces
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Job Related Types
export interface Job extends BaseEntity {
  schoolId: string;
  title: string;
  description: string;
  organization: string;
  requirements: string[];
  benefits: string[];
  subjects: string[];
  educationLevel: EducationLevel;
  positionCategory: string;
  positionSubcategory: string;
  country: string;
  city: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryDisclose: boolean;
  minExperience?: number;
  qualification: string;
  jobType: JobType;
  visaSponsorship: boolean;
  quickApply: boolean;
  externalLink?: string;
  applicationDeadline: string;
  applicantEmail: string;
  screeningQuestions: string[];
  status: JobStatus;
  viewsCount?: number;
  applicantsCount?: number;
  publishedAt?: string;
  expiresAt?: string;
  tags: string[];
  isUrgent: boolean;
  isFeatured: boolean;
  school?: {
    name: string;
    country: string;
    city: string;
    description: string;
  };
  salaryRange?: string;
  daysPosted?: number;
  isExpired?: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  organization: string;
  requirements: string[];
  benefits?: string[];
  subjects: string[];
  educationLevel: EducationLevel;
  positionCategory: string;
  positionSubcategory: string;
  country: string;
  city: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryDisclose?: boolean;
  minExperience?: number;
  qualification: string;
  jobType: JobType;
  visaSponsorship?: boolean;
  quickApply?: boolean;
  externalLink?: string;
  applicationDeadline: string;
  applicantEmail: string;
  screeningQuestions?: string[];
  tags?: string[];
  isUrgent?: boolean;
  isFeatured?: boolean;
  action: "save_draft" | "publish";
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: JobStatus;
}

export interface JobFilters {
  q?: string;
  location?: string;
  subject?: string;
  educationLevel?: EducationLevel;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  country?: string;
  city?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  postedWithin?: number;
  deadlineWithin?: number;
}

export interface JobSearchParams extends PaginationParams, JobFilters {
  sortBy?: "date" | "salary" | "deadline" | "views" | "relevance";
  sortOrder?: "asc" | "desc";
}

export interface JobView extends BaseEntity {
  jobId: string;
  viewerId?: string;
  viewerType: "teacher" | "school" | "anonymous";
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  deviceType: DeviceType;
  browser?: string;
  operatingSystem?: string;
  country?: string;
  city?: string;
  timeSpent: number;
  isUnique: boolean;
  viewSource: ViewSource;
}

export interface JobAnalytics {
  totalViews: number;
  uniqueViews: number;
  applications: number;
  viewTrends: Array<{
    date: string;
    views: number;
    uniqueViews: number;
  }>;
  viewerDemographics: Array<{
    type: string;
    count: number;
    uniqueCount: number;
  }>;
  deviceStats: Array<{
    deviceType: string;
    count: number;
    uniqueCount: number;
  }>;
  geographicStats: Array<{
    country: string;
    count: number;
    cities: string[];
  }>;
}

// Dashboard and Statistics
export interface JobDashboardStats {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  expiredJobs: number;
  totalViews: number;
  totalApplications: number;
  recentApplications: number;
  urgentJobs: number;
  featuredJobs: number;
}

export interface JobStatistics {
  jobsByStatus: Record<JobStatus, number>;
  jobsByType: Record<JobType, number>;
  jobsByEducationLevel: Record<EducationLevel, number>;
  topViewedJobs: Array<{
    jobId: string;
    title: string;
    views: number;
  }>;
  topAppliedJobs: Array<{
    jobId: string;
    title: string;
    applications: number;
  }>;
}
