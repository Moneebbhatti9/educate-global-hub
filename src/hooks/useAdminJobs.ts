import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsAPI } from "../apis/jobs";
import type { Job, JobStatus } from "../types/job";

// Query keys for admin jobs
export const adminJobQueryKeys = {
  all: ["admin", "jobs"] as const,
  lists: () => [...adminJobQueryKeys.all, "list"] as const,
  list: (filters: any) => [...adminJobQueryKeys.lists(), filters] as const,
  details: () => [...adminJobQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...adminJobQueryKeys.details(), id] as const,
  statistics: () => [...adminJobQueryKeys.all, "statistics"] as const,
  analytics: () => [...adminJobQueryKeys.all, "analytics"] as const,
  applications: (jobId: string) =>
    [...adminJobQueryKeys.all, "applications", jobId] as const,
};

// Admin Jobs Query Hooks
export const useAdminJobs = (filters: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobType?: string;
  country?: string;
  city?: string;
  educationLevel?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: adminJobQueryKeys.list(filters),
    queryFn: () => jobsAPI.adminGetAllJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminJob = (jobId: string) => {
  return useQuery({
    queryKey: adminJobQueryKeys.detail(jobId),
    queryFn: () => jobsAPI.adminGetJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminJobStatistics = () => {
  return useQuery({
    queryKey: adminJobQueryKeys.statistics(),
    queryFn: () => jobsAPI.adminGetJobStatistics(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminJobAnalytics = (period: string = "30d") => {
  return useQuery({
    queryKey: adminJobQueryKeys.analytics(),
    queryFn: () => jobsAPI.adminGetJobAnalytics({ period }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminJobApplications = (
  jobId: string,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  return useQuery({
    queryKey: adminJobQueryKeys.applications(jobId),
    queryFn: () => jobsAPI.adminGetJobApplications(jobId, params),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

// Admin Jobs Mutation Hooks
export const useAdminUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      status,
      reason,
    }: {
      jobId: string;
      status: string;
      reason?: string;
    }) => jobsAPI.adminUpdateJobStatus(jobId, status, reason),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({
        queryKey: adminJobQueryKeys.detail(jobId),
      });
      queryClient.invalidateQueries({ queryKey: adminJobQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminJobQueryKeys.statistics(),
      });
    },
  });
};

export const useAdminDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, reason }: { jobId: string; reason?: string }) =>
      jobsAPI.adminDeleteJob(jobId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminJobQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminJobQueryKeys.statistics(),
      });
    },
  });
};

export const useAdminBulkUpdateJobStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobIds,
      status,
      reason,
    }: {
      jobIds: string[];
      status: string;
      reason?: string;
    }) => jobsAPI.adminBulkUpdateJobStatuses(jobIds, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminJobQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminJobQueryKeys.statistics(),
      });
    },
  });
};

export const useAdminExportJobs = () => {
  return useMutation({
    mutationFn: (params: {
      format?: string;
      status?: string;
      jobType?: string;
      country?: string;
      city?: string;
      educationLevel?: string;
    }) => jobsAPI.adminExportJobs(params),
  });
};
