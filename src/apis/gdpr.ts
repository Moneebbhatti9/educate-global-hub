import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelpers } from "./client";
import { ApiResponse } from "../types/auth";

// API endpoints
const GDPR_ENDPOINTS = {
  EXPORT_DATA: "/gdpr/export-data",
  REQUEST_DELETION: "/gdpr/request-deletion",
  CONSENT: "/gdpr/consent",
  CONSENT_HISTORY: "/gdpr/consent-history",
  EXPORT_HISTORY: "/gdpr/export-history",
  BREACH_NOTIFICATIONS: "/gdpr/breach-notifications",
  RECTIFICATION_REQUEST: "/gdpr/rectification-request",
  RIGHTS: "/gdpr/rights",
} as const;

// Types for GDPR operations
export interface ExportedData {
  exportedAt: string;
  dataController: string;
  dataSubject: {
    id: string;
    email: string;
  };
  personalData: Record<string, unknown>;
}

export interface DeletionRequestData {
  confirmEmail: string;
  reason?: string;
}

export interface DeletionRequestResponse {
  message: string;
  estimatedCompletionDate: string;
}

export interface ConsentData {
  consentType: string;
  granted: boolean;
  preferences?: Record<string, boolean>;
}

export interface ConsentRecord {
  _id: string;
  userId: string | null;
  consentType: string;
  action: "granted" | "withdrawn" | "updated" | "requested";
  preferences: Record<string, unknown>;
  timestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
  source: string;
  isActive: boolean;
}

export interface ExportRequest {
  _id: string;
  userId: string;
  requestedAt: string;
  completedAt: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  format: string;
}

export interface BreachNotification {
  _id: string;
  breachId: string;
  title: string;
  description: string;
  breachDate: string;
  discoveredAt: string;
  notifiedAt: string;
  severity: "low" | "medium" | "high" | "critical";
  dataTypesAffected: string[];
  recommendedUserActions: string[];
  contactEmail: string;
  status: string;
}

export interface RectificationRequestData {
  dataField: string;
  currentValue?: string;
  correctedValue: string;
  reason?: string;
}

export interface GDPRRights {
  dataController: {
    name: string;
    email: string;
    dpo: string;
    address: string;
  };
  yourRights: Array<{
    name: string;
    description: string;
    endpoint: string;
  }>;
  dataRetention: Record<string, string>;
  dataProcessingPurposes: string[];
  thirdPartyProcessors: Array<{
    name: string;
    purpose: string;
    location: string;
  }>;
  contactForComplaints: {
    supervisoryAuthority: string;
    website: string;
  };
}

// GDPR API functions
export const gdprAPI = {
  // Export all user data (Article 20 - Right to Data Portability)
  exportData: async (): Promise<ApiResponse<ExportedData>> => {
    return apiHelpers.get<ApiResponse<ExportedData>>(GDPR_ENDPOINTS.EXPORT_DATA);
  },

  // Request account deletion (Article 17 - Right to Erasure)
  requestDeletion: async (
    data: DeletionRequestData
  ): Promise<ApiResponse<DeletionRequestResponse>> => {
    return apiHelpers.post<ApiResponse<DeletionRequestResponse>>(
      GDPR_ENDPOINTS.REQUEST_DELETION,
      data
    );
  },

  // Record user consent
  recordConsent: async (
    data: ConsentData
  ): Promise<ApiResponse<ConsentRecord>> => {
    return apiHelpers.post<ApiResponse<ConsentRecord>>(
      GDPR_ENDPOINTS.CONSENT,
      data
    );
  },

  // Get consent history
  getConsentHistory: async (): Promise<ApiResponse<ConsentRecord[]>> => {
    return apiHelpers.get<ApiResponse<ConsentRecord[]>>(
      GDPR_ENDPOINTS.CONSENT_HISTORY
    );
  },

  // Get export history
  getExportHistory: async (): Promise<ApiResponse<ExportRequest[]>> => {
    return apiHelpers.get<ApiResponse<ExportRequest[]>>(
      GDPR_ENDPOINTS.EXPORT_HISTORY
    );
  },

  // Get breach notifications
  getBreachNotifications: async (): Promise<ApiResponse<BreachNotification[]>> => {
    return apiHelpers.get<ApiResponse<BreachNotification[]>>(
      GDPR_ENDPOINTS.BREACH_NOTIFICATIONS
    );
  },

  // Request data rectification (Article 16)
  requestRectification: async (
    data: RectificationRequestData
  ): Promise<ApiResponse<{ requestId: number }>> => {
    return apiHelpers.post<ApiResponse<{ requestId: number }>>(
      GDPR_ENDPOINTS.RECTIFICATION_REQUEST,
      data
    );
  },

  // Get GDPR rights information
  getRights: async (): Promise<ApiResponse<GDPRRights>> => {
    return apiHelpers.get<ApiResponse<GDPRRights>>(GDPR_ENDPOINTS.RIGHTS);
  },
};

// React Query hooks for GDPR operations
export const useGDPR = () => {
  const queryClient = useQueryClient();

  // Export user data
  const exportData = useMutation({
    mutationFn: gdprAPI.exportData,
    onSuccess: () => {
      // Invalidate export history to show new export
      queryClient.invalidateQueries({ queryKey: ["gdpr-export-history"] });
    },
  });

  // Request deletion
  const requestDeletion = useMutation({
    mutationFn: gdprAPI.requestDeletion,
    onSuccess: () => {
      // Clear all queries after deletion request
      queryClient.clear();
    },
  });

  // Record consent
  const recordConsent = useMutation({
    mutationFn: gdprAPI.recordConsent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gdpr-consent-history"] });
    },
  });

  // Get consent history
  const consentHistory = useQuery({
    queryKey: ["gdpr-consent-history"],
    queryFn: gdprAPI.getConsentHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly called
  });

  // Get export history
  const exportHistory = useQuery({
    queryKey: ["gdpr-export-history"],
    queryFn: gdprAPI.getExportHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly called
  });

  // Get breach notifications
  const breachNotifications = useQuery({
    queryKey: ["gdpr-breach-notifications"],
    queryFn: gdprAPI.getBreachNotifications,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: false, // Only fetch when explicitly called
  });

  // Request rectification
  const requestRectification = useMutation({
    mutationFn: gdprAPI.requestRectification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gdpr-consent-history"] });
    },
  });

  // Get GDPR rights information
  const gdprRights = useQuery({
    queryKey: ["gdpr-rights"],
    queryFn: gdprAPI.getRights,
    staleTime: 60 * 60 * 1000, // 1 hour (rarely changes)
    enabled: false, // Only fetch when explicitly called
  });

  return {
    exportData,
    requestDeletion,
    recordConsent,
    consentHistory,
    exportHistory,
    breachNotifications,
    requestRectification,
    gdprRights,
  };
};

// Separate hook for consent recording (can be used without authentication)
export const useConsentRecording = () => {
  const recordConsent = useMutation({
    mutationFn: gdprAPI.recordConsent,
  });

  return { recordConsent };
};

export default gdprAPI;
