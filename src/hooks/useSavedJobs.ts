import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savedJobsAPI } from "../apis/savedJobs";
import { savedJobQueryKeys } from "../lib/queryKeys";
import type {
  SaveJobRequest,
  UpdateSavedJobRequest,
  SavedJobSearchParams,
  // Priority,
  ReminderRequest,
  TagRequest,
  PriorityRequest,
  NotesRequest,
} from "../types/savedJob";

// Query hooks
export const useSavedJobs = (params: SavedJobSearchParams) => {
  return useQuery({
    queryKey: savedJobQueryKeys.list(params),
    queryFn: () => savedJobsAPI.getSavedJobs(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSavedJob = (savedJobId: string) => {
  return useQuery({
    queryKey: savedJobQueryKeys.detail(savedJobId),
    queryFn: () => savedJobsAPI.getSavedJobById(savedJobId),
    enabled: !!savedJobId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeacherSavedJobs = (
  teacherId: string,
  params: SavedJobSearchParams
) => {
  return useQuery({
    queryKey: savedJobQueryKeys.byTeacher(teacherId),
    queryFn: () => savedJobsAPI.getSavedJobs(params),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSavedJobStats = () => {
  return useQuery({
    queryKey: savedJobQueryKeys.stats(),
    queryFn: () => savedJobsAPI.getSavedJobStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSavedJobAnalytics = () => {
  return useQuery({
    queryKey: savedJobQueryKeys.analytics(),
    queryFn: () => savedJobsAPI.getSavedJobAnalytics(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTeacherTags = () => {
  return useQuery({
    queryKey: savedJobQueryKeys.tags(),
    queryFn: () => savedJobsAPI.getTeacherTags(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useJobsToApply = () => {
  return useQuery({
    queryKey: savedJobQueryKeys.toApply(),
    queryFn: () => savedJobsAPI.getJobsToApply(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOverdueReminders = () => {
  return useQuery({
    queryKey: savedJobQueryKeys.overdueReminders(),
    queryFn: () => savedJobsAPI.getOverdueReminders(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useIsJobSaved = (jobId: string) => {
  return useQuery({
    queryKey: ["savedJob", "isSaved", jobId],
    queryFn: () => savedJobsAPI.isJobSaved(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: SaveJobRequest }) =>
      savedJobsAPI.saveJob(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({
        queryKey: ["savedJob", "isSaved", jobId],
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
    },
  });
};

export const useUpdateSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: UpdateSavedJobRequest;
    }) => savedJobsAPI.updateSavedJob(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
    },
  });
};

export const useRemoveSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedJobId: string) => savedJobsAPI.removeSavedJob(savedJobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
    },
  });
};

export const useSetReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: ReminderRequest;
    }) => savedJobsAPI.setReminder(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.overdueReminders(),
      });
    },
  });
};

export const useUpdatePriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: PriorityRequest;
    }) => savedJobsAPI.updatePriority(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
    },
  });
};

export const useAddNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: NotesRequest;
    }) => savedJobsAPI.addNotes(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
    },
  });
};

export const useAddTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: TagRequest;
    }) => savedJobsAPI.addTags(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.tags() });
    },
  });
};

export const useRemoveTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedJobId,
      data,
    }: {
      savedJobId: string;
      data: TagRequest;
    }) => savedJobsAPI.removeTags(savedJobId, data),
    onSuccess: (_, { savedJobId }) => {
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.detail(savedJobId),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.tags() });
    },
  });
};

export const useBulkSaveJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobIds: string[]) => savedJobsAPI.bulkSaveJobs(jobIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
    },
  });
};

export const useBulkRemoveSavedJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedJobIds: string[]) =>
      savedJobsAPI.bulkRemoveSavedJobs(savedJobIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
    },
  });
};

export const useMarkAsApplied = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedJobId: string) => savedJobsAPI.markAsApplied(savedJobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.stats() });
      queryClient.invalidateQueries({
        queryKey: savedJobQueryKeys.analytics(),
      });
      queryClient.invalidateQueries({ queryKey: savedJobQueryKeys.toApply() });
    },
  });
};

export const useExportSavedJobs = () => {
  return useMutation({
    mutationFn: () => savedJobsAPI.exportSavedJobs(),
  });
};
