import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for dashboard stats cards
export const DashboardStatsSkeleton = () => (
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

// Skeleton for job postings section
export const JobPostingsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-32" />
          <div className="space-x-2">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for recent candidates sidebar
export const RecentCandidatesSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-3 border rounded-lg">
        <div className="flex items-start space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <div className="flex items-center space-x-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    ))}
    <Skeleton className="h-8 w-full rounded" />
  </div>
);

// Skeleton for quick actions
export const QuickActionsSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-8 w-full rounded" />
    ))}
  </div>
);

// Skeleton for hiring analytics
export const HiringAnalyticsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={index}>
        <div className="flex justify-between text-sm mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded" />
      </div>
    ))}
    <div className="pt-2 space-y-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex justify-between text-sm">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Main dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Welcome Section Skeleton */}
    <div>
      <Skeleton className="h-9 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats Cards Skeleton */}
    <DashboardStatsSkeleton />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job Postings Skeleton */}
      <div className="lg:col-span-2">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32 rounded" />
          </div>
          <Skeleton className="h-4 w-80 mb-6" />
          <JobPostingsSkeleton />
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <div className="space-y-6">
        {/* Recent Candidates Skeleton */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <RecentCandidatesSkeleton />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-5 w-24 mb-4" />
          <QuickActionsSkeleton />
        </div>

        {/* Hiring Analytics Skeleton */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-5 w-28 mb-4" />
          <HiringAnalyticsSkeleton />
        </div>
      </div>
    </div>
  </div>
);
