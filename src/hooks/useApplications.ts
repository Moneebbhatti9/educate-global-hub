import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsAPI } from "../apis/applications";
import { applicationQueryKeys } from "../lib/queryKeys";
import type {
  CreateApplicationRequest,
  UpdateApplicationStatusRequest,
  ApplicationSearchParams,
  // ApplicationStatus,
  InterviewScheduleRequest,
  ApplicationRejectionRequest,
  ApplicationAcceptanceRequest,
  ApplicationShortlistRequest,
  ApplicationReviewRequest,
} from "../types/application";
import { ApplicationStatus } from "@/types/job";

// Query hooks
export const useApplications = (filters: ApplicationSearchParams) => {
  return useQuery({
    queryKey: applicationQueryKeys.list(filters),
    queryFn: () =>
      applicationsAPI.getApplicationsByJob(filters.jobId!, filters),
    enabled: !!filters.jobId,
    staleTime: 5 * 60 * 1000,
  });
};

// New hook for teachers to get their own applications
export const useTeacherApplications = (
  params: Omit<ApplicationSearchParams, "jobId">
) => {
  return useQuery({
    queryKey: ["teacherApplications", params],
    queryFn: () => applicationsAPI.getRecentApplications(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplication = (applicationId: string) => {
  return useQuery({
    queryKey: applicationQueryKeys.detail(applicationId),
    queryFn: () => applicationsAPI.getApplicationById(applicationId),
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplicationsByTeacher = (
  teacherId: string,
  params: ApplicationSearchParams
) => {
  return useQuery({
    queryKey: applicationQueryKeys.byTeacher(teacherId),
    queryFn: () => applicationsAPI.getApplicationsByTeacher(teacherId, params),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: applicationQueryKeys.stats(),
    queryFn: () => applicationsAPI.getApplicationStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentApplications = () => {
  return useQuery({
    queryKey: applicationQueryKeys.recent(),
    queryFn: () => applicationsAPI.getRecentApplications(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOverdueApplications = () => {
  return useQuery({
    queryKey: applicationQueryKeys.overdue(),
    queryFn: () => applicationsAPI.getOverdueApplications(),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      data,
    }: {
      jobId: string;
      data: CreateApplicationRequest;
    }) => applicationsAPI.submitApplication(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.byJob(jobId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: UpdateApplicationStatusRequest;
    }) => applicationsAPI.updateApplicationStatus(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason?: string;
    }) => applicationsAPI.withdrawApplication(applicationId, reason),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useBulkUpdateApplicationStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationIds,
      status,
      notes,
    }: {
      applicationIds: string[];
      status: ApplicationStatus;
      notes?: string;
    }) =>
      applicationsAPI.bulkUpdateApplicationStatuses(
        applicationIds,
        status,
        notes
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: InterviewScheduleRequest;
    }) => applicationsAPI.scheduleInterview(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: ApplicationAcceptanceRequest;
    }) => applicationsAPI.acceptApplication(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: ApplicationRejectionRequest;
    }) => applicationsAPI.rejectApplication(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useShortlistApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: ApplicationShortlistRequest;
    }) => applicationsAPI.shortlistApplication(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useMoveToReviewing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: ApplicationReviewRequest;
    }) => applicationsAPI.moveToReviewing(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.stats() });
    },
  });
};

export const useExportApplications = () => {
  return useMutation({
    mutationFn: (jobId: string) => applicationsAPI.exportApplications(jobId),
  });
};
