import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for user table row
export const UserTableRowSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border-b">
    <div className="flex items-center space-x-3 flex-1">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
    <Skeleton className="h-6 w-16 rounded-full" />
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-3 w-32" />
    <div className="flex justify-end">
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  </div>
);

// Skeleton for user table
export const UserTableSkeleton = () => (
  <div className="space-y-0">
    {/* Table Header */}
    <div className="flex items-center space-x-4 p-4 border-b bg-muted/50">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <div className="flex justify-end">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>

    {/* Table Rows */}
    {Array.from({ length: 5 }).map((_, index) => (
      <UserTableRowSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for filters section
export const UserFiltersSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <Skeleton className="h-10 w-full md:w-48 rounded-md" />
      <Skeleton className="h-10 w-full md:w-48 rounded-md" />
    </div>
  </div>
);

// Skeleton for pagination
export const UserPaginationSkeleton = () => (
  <div className="flex items-center justify-between px-6 py-4 border-t">
    <Skeleton className="h-4 w-48" />
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-20 rounded" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16 rounded" />
    </div>
  </div>
);

// Skeleton for header section
export const UserManagementHeaderSkeleton = () => (
  <div className="flex items-center justify-between">
    <div>
      <Skeleton className="h-9 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <Skeleton className="h-10 w-32 rounded" />
  </div>
);

// Main UserManagement skeleton
export const UserManagementSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <UserManagementHeaderSkeleton />

    {/* Filters Card */}
    <div className="border rounded-lg p-6">
      <Skeleton className="h-5 w-32 mb-4" />
      <UserFiltersSkeleton />
    </div>

    {/* Users Table Card */}
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      <div className="p-0">
        <UserTableSkeleton />
        <UserPaginationSkeleton />
      </div>
    </div>
  </div>
);

// Skeleton for user card (alternative view)
export const UserCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>

    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  </div>
);

// Skeleton for user grid view
export const UserGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <UserCardSkeleton key={index} />
    ))}
  </div>
);
