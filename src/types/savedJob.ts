import type { BaseEntity, Priority } from "./job";

export interface SavedJob extends BaseEntity {
  teacherId: string;
  jobId: {
    _id: string;
    title: string;
    description: string;
    country: string;
    city: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    jobType: string;
    applicationDeadline: string;
    status: string;
    publishedAt: string;
  };
  priority: Priority;
  isApplied: boolean;
  tags: string[];
  savedAt: string;
  daysSinceSaved: number;
  isOverdue: boolean;
}

// API Response structure for saved jobs
export interface SavedJobsResponse {
  savedJobs: SavedJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SaveJobRequest {
  notes?: string;
  priority?: Priority;
  reminderDate?: string;
  tags?: string[];
}

export interface UpdateSavedJobRequest extends Partial<SaveJobRequest> {
  isApplied?: boolean;
}

export interface SavedJobFilters {
  priority?: Priority;
  isApplied?: boolean;
  tags?: string[];
}

export interface SavedJobSearchParams {
  page?: number;
  limit?: number;
  priority?: Priority;
  isApplied?: boolean;
  tags?: string[];
  sortBy?: "date" | "priority" | "reminder";
  sortOrder?: "asc" | "desc";
}

export interface SavedJobStats {
  total: number;
  applied: number;
  pending: number;
  priorityBreakdown: Record<Priority, number>;
  tagBreakdown: Record<string, number>;
  overdueReminders: number;
}

export interface SavedJobAnalytics {
  stats: SavedJobStats;
  jobsToApply: number;
  overdueReminders: number;
  totalTags: number;
  topTags: string[];
}

export interface SavedJobWithDetails extends SavedJob {
  job: {
    _id: string;
    title: string;
    school: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
    jobType: string;
    applicationDeadline: string;
    status: string;
  };
}

export interface ReminderRequest {
  reminderDate: string;
  notes?: string;
}

export interface TagRequest {
  tags: string[];
}

export interface PriorityRequest {
  priority: Priority;
}

export interface NotesRequest {
  notes: string;
}
