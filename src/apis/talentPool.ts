import { apiHelpers } from "./client";

// TypeScript interfaces
export interface ConsentStatus {
  optedIn: boolean;
  availabilityStatus: string;
  consentExpiresAt: string | null;
  lastAction: string | null;
}

export interface TalentPoolTeacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: number;
  location: string;
  bio: string;
  certifications: string[];
  availabilityStatus: string;
}

export interface SearchParams {
  subject?: string;
  country?: string;
  city?: string;
  qualification?: string;
  minExperience?: number;
  availabilityStatus?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  teachers: TalentPoolTeacher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SavedTeacher extends TalentPoolTeacher {
  notes: string;
  savedAt: string;
  savedId: string;
}

// Talent Pool API endpoints
const TALENT_POOL_BASE = "/talent-pool";

export const talentPoolAPI = {
  // Get current consent status for the logged-in teacher
  getConsentStatus: async (): Promise<{ success: boolean; data: ConsentStatus }> => {
    return apiHelpers.get(`${TALENT_POOL_BASE}/consent-status`);
  },

  // Opt in to the talent pool with consent text
  optIn: async (consentText: string): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.post(`${TALENT_POOL_BASE}/opt-in`, { consentText });
  },

  // Opt out of the talent pool
  optOut: async (): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.post(`${TALENT_POOL_BASE}/opt-out`);
  },

  // Update availability status
  updateAvailability: async (
    status: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.patch(`${TALENT_POOL_BASE}/availability`, {
      availabilityStatus: status,
    });
  },

  // Search talent pool (school-facing)
  search: async (params: SearchParams): Promise<SearchResponse> => {
    return apiHelpers.get(`${TALENT_POOL_BASE}/search`, { params });
  },

  // Invite a teacher to apply (school-facing)
  inviteToApply: async (
    teacherProfileId: string,
    jobId?: string,
    message?: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.post(`${TALENT_POOL_BASE}/invite`, {
      teacherProfileId,
      ...(jobId && { jobId }),
      ...(message && { message }),
    });
  },

  // Save a teacher to shortlist (school-facing)
  saveTeacher: async (
    teacherProfileId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.post(`${TALENT_POOL_BASE}/shortlist`, {
      teacherProfileId,
      ...(notes && { notes }),
    });
  },

  // Remove a teacher from shortlist (school-facing)
  unsaveTeacher: async (
    teacherProfileId: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiHelpers.delete(`${TALENT_POOL_BASE}/shortlist/${teacherProfileId}`);
  },

  // Get saved/shortlisted teachers (school-facing)
  getSavedTeachers: async (): Promise<{
    success: boolean;
    savedTeachers: SavedTeacher[];
  }> => {
    return apiHelpers.get(`${TALENT_POOL_BASE}/shortlist`);
  },
};
