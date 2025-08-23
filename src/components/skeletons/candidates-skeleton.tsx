import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for candidate card
export const CandidateCardSkeleton = () => (
  <div className="border rounded-lg p-6 mb-4">
    <div className="flex items-start space-x-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-16 rounded-full" />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for stats cards
export const CandidatesStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="border rounded-lg p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="text-2xl font-bold">
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
    ))}
  </div>
);

// Skeleton for filters
export const CandidateFiltersSkeleton = () => (
  <div className="border rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-48" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

// Skeleton for tabs
export const CandidateTabsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex space-x-1 border-b">
      <Skeleton className="h-10 w-32 rounded-t" />
      <Skeleton className="h-10 w-32 rounded-t" />
    </div>

    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  </div>
 );

// Skeleton for applications loading only (when page is loaded but applications are fetching)
export const ApplicationsLoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Job group header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>

    {/* Candidate cards skeleton */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Main candidates page skeleton
export const CandidatesSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-3" />
      <div className="p-3 bg-muted rounded-lg">
        <Skeleton className="h-4 w-80" />
      </div>
    </div>

    {/* Stats Cards */}
    <CandidatesStatsSkeleton />

    {/* Filters */}
    <CandidateFiltersSkeleton />

    {/* Tabs and Content */}
    <div className="border rounded-lg p-6">
      <CandidateTabsSkeleton />
    </div>
  </div>
);
