import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsAPI } from "../apis/jobs";
import { jobQueryKeys } from "../lib/queryKeys";
import type {
  CreateJobRequest,
  UpdateJobRequest,
  JobSearchParams,
  JobStatus,
  PaginationParams,
} from "../types/job";

// Query hooks
export const useJobs = (filters: JobSearchParams) => {
  return useQuery({
    queryKey: jobQueryKeys.list(filters),
    queryFn: () => jobsAPI.searchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: jobQueryKeys.detail(jobId),
    queryFn: () => jobsAPI.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSchoolJobs = (schoolId: string, params: PaginationParams) => {
  return useQuery({
    queryKey: jobQueryKeys.school(schoolId),
    queryFn: () => jobsAPI.getJobsBySchool(schoolId, params),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedJobs = () => {
  return useQuery({
    queryKey: jobQueryKeys.featured(),
    queryFn: () => jobsAPI.getFeaturedJobs(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUrgentJobs = () => {
  return useQuery({
    queryKey: jobQueryKeys.urgent(),
    queryFn: () => jobsAPI.getUrgentJobs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useJobRecommendations = () => {
  return useQuery({
    queryKey: jobQueryKeys.recommendations(),
    queryFn: () => jobsAPI.getJobRecommendations(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useJobAnalytics = (jobId: string) => {
  return useQuery({
    queryKey: jobQueryKeys.analytics(jobId),
    queryFn: () => jobsAPI.getJobAnalytics(jobId),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSchoolDashboardStats = (schoolId: string) => {
  return useQuery({
    queryKey: jobQueryKeys.dashboard(schoolId),
    queryFn: () => jobsAPI.getSchoolDashboardStats(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useJobStatistics = () => {
  return useQuery({
    queryKey: jobQueryKeys.stats(),
    queryFn: () => jobsAPI.getJobStatistics(),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) => jobsAPI.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: UpdateJobRequest }) =>
      jobsAPI.updateJob(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobsAPI.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      status,
      notes,
    }: {
      jobId: string;
      status: JobStatus;
      notes?: string;
    }) => jobsAPI.updateJobStatus(jobId, status, notes),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });
    },
  });
};

export const useBulkUpdateJobStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobIds,
      status,
      notes,
    }: {
      jobIds: string[];
      status: JobStatus;
      notes?: string;
    }) => jobsAPI.bulkUpdateJobStatuses(jobIds, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });
    },
  });
};

export const useExportJobs = () => {
  return useMutation({
    mutationFn: (jobId: string) => jobsAPI.exportJobs(jobId),
  });
};
