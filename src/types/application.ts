import type {
  BaseEntity,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  ApplicationStatus,
  Job,
} from "./job";

export interface JobApplication extends BaseEntity {
  job: Job;
  jobId: string;
  teacherId: string;
  coverLetter: string;
  expectedSalary?: number;
  availableFrom: string;
  reasonForApplying: string;
  additionalComments?: string;
  screeningAnswers: Record<string, string>;
  status: ApplicationStatus;
  resumeUrl?: string;
  documents: string[];
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  interviewDate?: string;
  interviewNotes?: string;
  isWithdrawn: boolean;
  withdrawnAt?: string;
  withdrawnReason?: string;

  // Candidate properties for dashboard display
  name?: string;
  position?: string;
  rating?: number;
  experience?: string;
  appliedDate?: string;
}

export interface CreateApplicationRequest {
  coverLetter: string;
  expectedSalary?: number;
  availableFrom: string;
  reasonForApplying: string;
  additionalComments?: string;
  screeningAnswers?: Record<string, string>;
  resumeUrl?: string;
  documents?: string[];
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  notes?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  jobId?: string;
  teacherId?: string;
}

export interface ApplicationSearchParams
  extends PaginationParams,
    ApplicationFilters {
  search?: string;
  sortBy?: "date" | "status" | "name";
  sortOrder?: "asc" | "desc";
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  recentApplications: number;
  overdueApplications: number;
}

export interface ApplicationTimeline {
  status: ApplicationStatus;
  timestamp: string;
  notes?: string;
  updatedBy?: string;
}

export interface InterviewScheduleRequest {
  interviewDate: string;
  notes?: string;
  location?: string;
  type?: "in-person" | "video" | "phone";
}

export interface ApplicationRejectionRequest {
  reason: string;
  notes?: string;
  feedback?: string;
}

export interface ApplicationAcceptanceRequest {
  notes?: string;
  startDate?: string;
  contractDetails?: string;
}

export interface ApplicationShortlistRequest {
  notes?: string;
  priority?: "low" | "medium" | "high";
}

export interface ApplicationReviewRequest {
  notes?: string;
  nextSteps?: string;
  timeline?: string;
}

export interface SchoolDashboardCardsResponse {
  success: boolean;
  data: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiringRatio: string;
  };
  message: string;
}

export interface TeacherDashboardCardsResponse {
  success: boolean;
  message: string;
  data: {
    cards: {
      applicationsSent: number;
      resourcesUploaded: number;
      resourcesDownloaded: number;
      earnings: number;
    };
    recentApplications: any[]; // Use a more specific type if you know the structure
  };
}
