import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for forum stats cards
export const ForumStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-1 w-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for filters section
export const ForumFiltersSkeleton = () => (
  <div className="border rounded-lg p-4">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-[150px]" />
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-10 w-[150px]" />
    </div>
  </div>
);

// Skeleton for discussion table row
export const DiscussionTableRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-start space-x-4 flex-1">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
    <Skeleton className="h-8 w-8 rounded" />
  </div>
);

// Skeleton for discussions list
export const DiscussionsListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <DiscussionTableRowSkeleton key={index} />
    ))}
  </div>
);

// Main AdminForumManagement skeleton
export const AdminForumManagementSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>

    {/* Stats Cards */}
    <ForumStatsSkeleton />

    {/* Filters */}
    <ForumFiltersSkeleton />

    {/* Discussions List */}
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="p-6">
        <DiscussionsListSkeleton />
      </div>
    </div>
  </div>
);
