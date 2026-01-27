/**
 * Dropdown Option Types
 */

export interface DropdownOption {
  _id: string;
  category: string;
  value: string;
  label: string;
  description?: string | null;
  parentId?: string | null;
  parentCategory?: string | null;
  parentValue?: string | null;
  sortOrder: number;
  isActive: boolean;
  icon?: string | null;
  color?: string | null;
  metadata?: Record<string, unknown>;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DropdownCategory {
  category: string;
  totalCount: number;
  activeCount: number;
}

export interface CreateDropdownOptionRequest {
  category: string;
  value: string;
  label: string;
  description?: string;
  parentId?: string;
  parentCategory?: string;
  parentValue?: string;
  sortOrder?: number;
  isActive?: boolean;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateDropdownOptionRequest {
  value?: string;
  label?: string;
  description?: string;
  parentId?: string;
  parentCategory?: string;
  parentValue?: string;
  sortOrder?: number;
  isActive?: boolean;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface BulkCreateDropdownRequest {
  category: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    parentCategory?: string;
    parentValue?: string;
    sortOrder?: number;
    isActive?: boolean;
    icon?: string;
    color?: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface SortOrderUpdate {
  id: string;
  sortOrder: number;
}

export interface DropdownOptionsResponse {
  success: boolean;
  message: string;
  data: DropdownOption[];
}

export interface DropdownCategoriesResponse {
  success: boolean;
  message: string;
  data: DropdownCategory[];
}

export interface DropdownMultipleCategoriesResponse {
  success: boolean;
  message: string;
  data: Record<string, DropdownOption[]>;
}

export interface AdminDropdownOptionsResponse {
  success: boolean;
  message: string;
  data: {
    options: DropdownOption[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Category display names for the admin UI
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  educationLevel: "Education Level",
  jobType: "Job Type",
  positionCategory: "Position Category",
  positionSubcategory: "Position Subcategory",
  benefits: "Job Benefits",
  resourceType: "Resource Type",
  subject: "Subject",
  ageRange: "Age Range",
  curriculum: "Curriculum",
  curriculumType: "Curriculum Type",
  resourceVisibility: "Resource Visibility",
  educationType: "Education Type",
  userRole: "User Role",
  resourceCurrency: "Resource Currency",
  experienceLevel: "Experience Level",
  schoolType: "School Type",
  genderType: "Gender Type",
  languageProficiency: "Language Proficiency",
  qualificationLevel: "Qualification Level",
  applicationStatus: "Application Status",
  jobStatus: "Job Status",
  resourceStatus: "Resource Status",
};

// Categories that have parent-child relationships
export const CATEGORIES_WITH_PARENTS: Record<string, string> = {
  positionSubcategory: "positionCategory",
};
