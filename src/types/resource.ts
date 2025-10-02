import { ApiResponse } from "./auth";

// Paginated Response Type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  resourceType: string;
  subjects: string[];
  ageGroups: string[];
  curriculum?: string;
  curriculumType?: string;
  language: string;
  pages?: number;
  lessonTime?: number;
  isFree: boolean;
  price?: number;
  currency?: string;
  licenseType: string;
  tags: string;
  categories?: string[];
  accessibility?: string;
  visibility: string;
  versionNotes?: string;
  bannerImage?: string;
  previewImages: string[];
  resourceFiles: string[];
  status: ResourceStatus;
  uploadDate: string;
  lastModified: string;
  salesCount: number;
  downloadCount: number;
  rating?: number;
  reviewCount: number;
  authorId: string;
  authorName: string;
}

export type ResourceStatus = "draft" | "published" | "flagged" | "archived";

// Request Types
export interface CreateResourceRequest {
  title: string;
  description: string;
  type: string;
  publishing?: string;
  isFree: boolean;
  price?: number;
  currency?: string;
  saveAsDraft: boolean;
  ageRange: string;
  curriculum: string;
  curriculumType: string;
  subject: string;
  banner: File;
  previews: File[];
  files: File[];
}

export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  type?: string;
  publishing?: string;
  isFree?: boolean;
  price?: number;
  currency?: string;
  ageRange?: string;
  curriculum?: string;
  curriculumType?: string;
  subject?: string;
  status?: string;
  coverPhoto?: File;
  previewImages?: File[];
  mainFile?: File;
}

// Cloudinary URL-based request types
export interface CreateResourceWithUrlsRequest {
  title: string;
  description: string;
  resourceType: string; // Changed from 'type' to 'resourceType'
  publishing?: string;
  isFree: boolean;
  price?: number;
  currency?: string;
  saveAsDraft: boolean;
  ageRange: string;
  curriculum: string;
  curriculumType: string;
  subject: string;
  coverPhotoUrl: string; // Changed from 'bannerUrl' to 'coverPhotoUrl'
  previewUrls: string[];
  resourceUrls: string[];
}

export interface UpdateResourceWithUrlsRequest {
  title?: string;
  description?: string;
  resourceType?: string; // Changed from 'type' to 'resourceType'
  publishing?: string;
  isFree?: boolean;
  price?: number;
  currency?: string;
  ageRange?: string;
  curriculum?: string;
  curriculumType?: string;
  subject?: string;
  status?: string;
  coverPhotoUrl?: string; // Changed from 'bannerUrl' to 'coverPhotoUrl'
  previewUrls?: string[];
  resourceUrls?: string[];
}

export interface UpdateResourceStatusRequest {
  status: "draft" | "pending" | "approved" | "rejected";
}

export interface GetAllResourcesQueryParams {
  q?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

export interface MyResourcesQueryParams {
  search?: string;
  status?: "all" | "draft" | "pending" | "approved" | "rejected";
  page?: number;
  limit?: number;
}

// Teacher Resource Types based on API response
export interface TeacherResource {
  _id: string;
  title: string;
  description: string;
  type: string;
  ageRange: string;
  curriculum: string;
  curriculumType: string;
  subject: string;
  isFree: boolean;
  currency: string | null;
  price: number;
  publishing: string;
  createdBy: {
    userId: string;
    role: string;
  };
  coverPhoto: {
    _id: string;
    resourceId: string;
    fileType: string;
    url: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  previewImages: Array<{
    _id: string;
    resourceId: string;
    fileType: string;
    url: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  mainFile: {
    _id: string;
    resourceId: string;
    fileType: string;
    url: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  status: "draft" | "pending" | "approved" | "rejected";
  approvedBy: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeacherResourcesStats {
  totalResources: number;
  totalSales: number;
  currentBalance: number;
}

export interface MyResourcesResponse {
  stats: TeacherResourcesStats;
  resources: TeacherResource[];
}

export interface AdminResourcesQueryParams {
  search?: string;
  status?: "all" | "draft" | "pending" | "approved" | "rejected";
  subject?: string;
  authorId?: string;
  page?: number;
  limit?: number;
}

// Admin Resource Types based on API response
export interface AdminResource {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  price: string;
  status: "pending" | "approved" | "rejected" | "draft";
  flags: number;
  uploadDate: string;
}

export interface AdminResourcesResponse {
  resources: AdminResource[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

// Public Resources API Response Types (for get-all-resources)
export interface PublicResource {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  price: string;
  status: "approved" | "pending" | "rejected" | "draft";
  flags: number;
  uploadDate: string;
}

export interface PublicResourcesResponse {
  resources: PublicResource[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

