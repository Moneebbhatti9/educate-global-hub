import { apiHelpers } from "./client";

// Resource Types
export interface ResourceFile {
  _id: string;
  url: string;
  format: string;
  size: number;
}

export interface ResourceAuthor {
  userId: string;
  role: string;
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  type: string;
  isFree: boolean;
  price: number;
  currency?: string;
  publishing: string;
  status: "draft" | "pending" | "approved" | "rejected";
  ageRange: string;
  curriculum: string;
  curriculumType: string;
  subject: string;
  createdBy: ResourceAuthor;
  coverPhoto: ResourceFile;
  previewImages: ResourceFile[];
  mainFile: ResourceFile;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceStats {
  totalResources: number;
  totalSales: number;
  currentBalance: number;
}

export interface MyResourcesResponse {
  stats: ResourceStats;
  resources: Resource[];
}

export interface SearchResourceResponse {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  type: string;
  isFree: boolean;
  price: number;
  ageRange: string;
  curriculum: string;
  subject: string;
  createdAt: string;
}

export interface AllResourcesResponse {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  price: string;
  status: string;
  flags: number;
  uploadDate: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

export interface AllResourcesData {
  resources: AllResourcesResponse[];
  pagination: PaginationInfo;
}

// API Functions
export const resourceApi = {
  // Create Resource
  createResource: async (formData: FormData) => {
    return await apiHelpers.upload("/resources/create-resource", formData);
  },

  // Update Resource
  updateResource: async (id: string, formData: FormData) => {
    return await apiHelpers.upload(
      `/resources/update-resource/${id}`,
      formData
    );
  },

  // Update Resource Status
  updateResourceStatus: async (resourceId: string, status: string) => {
    return await apiHelpers.patch(`/resources/update-status/${resourceId}`, {
      status,
    });
  },

  // Get My Resources
  getMyResources: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return await apiHelpers.get("/resources/my-resource-page", {
      params,
    });
  },

  // Delete Resource
  deleteResource: async (resourceId: string) => {
    return await apiHelpers.delete(`/resources/delete-resource/${resourceId}`);
  },

  // Search Resources (Public)
  searchResources: async (params: {
    q: string;
    limit?: number;
    page?: number;
  }) => {
    return await apiHelpers.get("/resources/search-resource", {
      params,
    });
  },

  // Get All Resources (Main Page)
  getAllResources: async (params?: {
    q?: string;
    status?: string;
    subject?: string;
    page?: number;
    limit?: number;
  }) => {
    return await apiHelpers.get("/resources/get-all-resources", {
      params,
    });
  },
};

// Resource Type Enums
export const RESOURCE_TYPES = [
  "Assembly",
  "Assessment and revision",
  "Game/puzzle/quiz",
  "Audio, music & video",
  "Lesson (complete)",
  "Other",
  "Unit of work",
  "Visual aid/Display",
  "Worksheet/Activity",
];

export const AGE_RANGES = [
  "3-5",
  "5-7",
  "7-11",
  "11-14",
  "14-16",
  "16+",
  "Age not applicable",
];

export const CURRICULUMS = [
  "No curriculum",
  "American",
  "Australian",
  "Canadian",
  "English",
  "International",
  "Irish",
  "New Zealand",
  "Northern Irish",
  "Scottish",
  "Welsh",
  "Zambian",
];

export const CURRICULUM_TYPES = [
  "No curriculum type",
  "Cambridge",
  "Foundation Stage",
  "IB PYP",
  "IPC",
  "IPC/IEYC",
  "Montessori",
  "Northern Ireland Curriculum",
  "School's own",
  "Waldorf/Steiner",
];

export const SUBJECTS = [
  "Aboriginal and Islander languages",
  "Aboriginal studies",
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Anthropology",
  "Arabic",
  "Art and design",
  "Belarussian",
  "Bengali",
  "Biology",
  "Bosnian",
  "Bulgarian",
  "Business and finance",
  "Cantonese",
  "Catalan",
  "Chemistry",
  "Citizenship",
  "Classics",
  "Computing",
  "Core IB",
  "Croatian",
  "Cross-curricular topics",
  "Czech",
  "Danish",
  "Design, engineering and technology",
  "Drama",
  "Dutch",
  "Economics",
  "English",
  "English language learning",
  "Estonian",
  "Expressive arts and design",
  "Finnish",
  "French",
  "Geography",
  "German",
  "Government and politics",
  "Greek",
  "Gujarati",
  "Hebrew",
  "Hindi",
  "History",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Irish Gaelic",
  "Italian",
  "Japanese",
  "Korean",
  "Latvian",
  "Law and legal studies",
  "Literacy for early years",
  "Lithuanian",
  "Macedonian",
  "Malay",
  "Mandarin",
  "Mathematics",
  "Maths for early years",
  "Media studies",
  "Music",
  "Nepali",
  "New teachers",
  "Norwegian",
  "Pedagogy and professional development",
  "Persian",
  "Personal, social and health education",
  "Philosophy and ethics",
  "Physical development",
  "Physical education",
  "Physics",
  "Pilipino",
  "Polish",
  "Portuguese",
  "Primary science",
  "Psychology",
  "Punjabi",
  "Religious education",
  "Romanian",
  "Russian",
  "Scottish Gaelic",
  "Serbian",
  "Sesotho",
  "Sinhalese",
  "Siswati",
  "Slovak",
  "Sociology",
  "Spanish",
  "Special educational needs",
  "Student careers advice",
  "Swahili",
  "Swedish",
  "Tamil",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Understanding the world",
  "Urdu",
  "Vietnamese",
  "Vocational studies",
  "Welsh",
  "Whole school",
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export const LICENSE_TYPES = [
  "Single Teacher License",
  "School License",
  "Multiple Use License",
  "Commercial License",
];
