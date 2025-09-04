import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for teacher dashboard stats cards
export const TeacherDashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </div>
);

// Skeleton for tab navigation
export const TabNavigationSkeleton = () => (
  <div className="flex space-x-1 bg-muted p-1 rounded-lg">
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} className="h-9 flex-1 rounded-md" />
    ))}
  </div>
);

// Skeleton for recommended jobs section
export const RecommendedJobsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-4 border border-border rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" />
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for recent applications sidebar
export const RecentApplicationsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-3 border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24 mb-1" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    ))}
    <Skeleton className="h-8 w-full rounded" />
  </div>
);

// Skeleton for applications tab content
export const ApplicationsTabSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-4 border border-border rounded-lg">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <div className="mb-3">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-16 w-full rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-32" />
          <div className="space-x-2">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-28 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for saved jobs tab content
export const SavedJobsTabSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-4 border border-border rounded-lg">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Main teacher dashboard skeleton
export const TeacherDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Welcome Section Skeleton */}
    <div>
      <Skeleton className="h-9 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats Cards Skeleton */}
    <TeacherDashboardStatsSkeleton />

    {/* Tab Navigation Skeleton */}
    <TabNavigationSkeleton />

    {/* Tab Content Skeleton - Overview Tab */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recommended Jobs Skeleton */}
      <div className="lg:col-span-2">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32 rounded" />
          </div>
          <Skeleton className="h-4 w-80 mb-6" />
          <RecommendedJobsSkeleton />
        </div>
      </div>

      {/* Recent Applications Skeleton */}
      <div>
        <div className="border rounded-lg p-6">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <RecentApplicationsSkeleton />
        </div>
      </div>
    </div>
  </div>
);
