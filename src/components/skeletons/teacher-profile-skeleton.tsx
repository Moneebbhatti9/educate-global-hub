import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for profile header section
export const ProfileHeaderSkeleton = () => (
  <div className="border rounded-lg p-6 mb-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
      {/* Avatar skeleton */}
      <div className="relative">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full" />
      </div>

      {/* Profile info skeleton */}
      <div className="flex-1 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-80" />
        <Skeleton className="h-4 w-96" />
        
        {/* Subject badges skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Contact info skeleton */}
        <div className="flex items-center space-x-4 text-sm">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="w-4 h-4 mr-1 rounded" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    </div>
  </div>
);

// Skeleton for profile tabs
export const ProfileTabsSkeleton = () => (
  <div className="space-y-6">
    {/* Tabs list skeleton */}
    <div className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1 border rounded-lg">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded" />
      ))}
    </div>

    {/* Tab content skeleton */}
    <div className="space-y-6">
      {/* Profile Summary Section */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Overview Card */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-2 w-full mt-2" />
          </div>
        </div>

        {/* Recent Qualifications Card */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for personal information form
export const PersonalInfoFormSkeleton = () => (
  <div className="border rounded-lg p-6">
    <Skeleton className="h-6 w-64 mb-6" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Address section */}
    <div className="mt-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Languages section */}
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-28 rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton for employment history
export const EmploymentHistorySkeleton = () => (
  <div className="border rounded-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-32 rounded" />
    </div>
    
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-20 w-full rounded" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main TeacherProfile skeleton component
export const TeacherProfileSkeleton = () => (
  <div className="space-y-6">
    <ProfileHeaderSkeleton />
    <ProfileTabsSkeleton />
  </div>
);
