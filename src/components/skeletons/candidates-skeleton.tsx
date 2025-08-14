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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for candidate list
export const CandidateListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <CandidateCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for filters
export const CandidateFiltersSkeleton = () => (
  <div className="space-y-4 mb-6">
    <div className="flex flex-col sm:flex-row gap-4">
      <Skeleton className="h-10 w-full sm:w-80" />
      <Skeleton className="h-10 w-full sm:w-40" />
      <Skeleton className="h-10 w-full sm:w-32" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  </div>
);

// Skeleton for tabs
export const CandidateTabsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex space-x-1 border-b">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-24 rounded-t" />
      ))}
    </div>

    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Skeleton for candidate details modal
export const CandidateDetailsSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-start space-x-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>

    {/* Contact Information */}
    <div className="space-y-3">
      <Skeleton className="h-5 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>

    {/* Skills & Experience */}
    <div className="space-y-3">
      <Skeleton className="h-5 w-28" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </div>

    {/* Cover Letter */}
    <div className="space-y-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-24 w-full" />
    </div>

    {/* Actions */}
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <Skeleton className="h-9 w-24 rounded" />
      <Skeleton className="h-9 w-32 rounded" />
      <Skeleton className="h-9 w-28 rounded" />
    </div>
  </div>
);

// Main candidates page skeleton
export const CandidatesSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded" />
    </div>

    {/* Filters */}
    <CandidateFiltersSkeleton />

    {/* Tabs and Content */}
    <div className="border rounded-lg p-6">
      <CandidateTabsSkeleton />
    </div>
  </div>
);
