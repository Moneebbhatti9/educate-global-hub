export const jobQueryKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobQueryKeys.all, "list"] as const,
  list: (filters: any) => [...jobQueryKeys.lists(), filters] as const,
  details: () => [...jobQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...jobQueryKeys.details(), id] as const,
  school: (schoolId: string) =>
    [...jobQueryKeys.all, "school", schoolId] as const,
  search: (params: any) => [...jobQueryKeys.all, "search", params] as const,
  featured: () => [...jobQueryKeys.all, "featured"] as const,
  urgent: () => [...jobQueryKeys.all, "urgent"] as const,
  category: (category: string) =>
    [...jobQueryKeys.all, "category", category] as const,
  location: (country: string, city: string) =>
    [...jobQueryKeys.all, "location", country, city] as const,
  recommendations: () => [...jobQueryKeys.all, "recommendations"] as const,
  analytics: (jobId: string) =>
    [...jobQueryKeys.all, "analytics", jobId] as const,
  dashboard: (schoolId: string) =>
    [...jobQueryKeys.all, "dashboard", schoolId] as const,
  stats: () => [...jobQueryKeys.all, "stats"] as const,
};

export const applicationQueryKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationQueryKeys.all, "list"] as const,
  list: (filters: any) => [...applicationQueryKeys.lists(), filters] as const,
  details: () => [...applicationQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...applicationQueryKeys.details(), id] as const,
  byJob: (jobId: string) =>
    [...applicationQueryKeys.all, "job", jobId] as const,
  byTeacher: (teacherId: string) =>
    [...applicationQueryKeys.all, "teacher", teacherId] as const,
  stats: () => [...applicationQueryKeys.all, "stats"] as const,
  recent: () => [...applicationQueryKeys.all, "recent"] as const,
  overdue: () => [...applicationQueryKeys.all, "overdue"] as const,
};

export const savedJobQueryKeys = {
  all: ["savedJobs"] as const,
  lists: () => [...savedJobQueryKeys.all, "list"] as const,
  list: (filters: any) => [...savedJobQueryKeys.lists(), filters] as const,
  details: () => [...savedJobQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...savedJobQueryKeys.details(), id] as const,
  byTeacher: (teacherId: string) =>
    [...savedJobQueryKeys.all, "teacher", teacherId] as const,
  stats: () => [...savedJobQueryKeys.all, "stats"] as const,
  analytics: () => [...savedJobQueryKeys.all, "analytics"] as const,
  tags: () => [...savedJobQueryKeys.all, "tags"] as const,
  toApply: () => [...savedJobQueryKeys.all, "toApply"] as const,
  overdueReminders: () =>
    [...savedJobQueryKeys.all, "overdueReminders"] as const,
};

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.all, "list"] as const,
  list: (filters: any) => [...notificationQueryKeys.lists(), filters] as const,
  details: () => [...notificationQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...notificationQueryKeys.details(), id] as const,
  unread: () => [...notificationQueryKeys.all, "unread"] as const,
  stats: () => [...notificationQueryKeys.all, "stats"] as const,
  byJob: (jobId: string) =>
    [...notificationQueryKeys.all, "job", jobId] as const,
};
