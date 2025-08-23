import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for dashboard stats
export const JobPostingsStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

// Skeleton for filters and search
export const JobPostingsFiltersSkeleton = () => (
  <div className="space-y-4 mb-6">
    <div className="flex flex-col sm:flex-row gap-4">
      <Skeleton className="h-10 w-full sm:w-80" />
      <Skeleton className="h-10 w-full sm:w-40" />
      <Skeleton className="h-10 w-full sm:w-32" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  </div>
);

// Skeleton for individual job card
export const JobCardSkeleton = () => (
  <div className="border rounded-lg p-6 mb-4">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-6 w-16 rounded-full" />
      ))}
    </div>

    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-x-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  </div>
);

// Skeleton for job listings
export const JobListingsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <JobCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for pagination
export const PaginationSkeleton = () => (
  <div className="flex items-center justify-between mt-6 pt-6 border-t">
    <Skeleton className="h-4 w-48" />
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20 rounded" />
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

// Main JobPostings page skeleton
export const JobPostingsSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded" />
    </div>

    {/* Stats */}
    <JobPostingsStatsSkeleton />

    {/* Filters */}
    <JobPostingsFiltersSkeleton />

    {/* Job Listings */}
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>

      <JobListingsSkeleton />

      <PaginationSkeleton />
    </div>
  </div>
);

// Admin Job Management Table Skeleton
export const AdminJobManagementSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>

    {/* Filters */}
    <div className="border rounded-lg p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full md:w-80" />
        <Skeleton className="h-10 w-full md:w-48" />
        <Skeleton className="h-10 w-full md:w-48" />
      </div>
    </div>

    {/* Jobs Table */}
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 pb-2 border-b">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-8 gap-4 py-4 border-b last:border-b-0"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <div className="ml-auto">
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Skeleton className="h-4 w-48" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
);
