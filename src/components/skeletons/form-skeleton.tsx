import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for form section header
export const FormSectionHeaderSkeleton = () => (
  <div className="space-y-2 mb-6">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-64" />
  </div>
);

// Skeleton for form field with label
export const FormFieldSkeleton = ({ width = "w-full" }: { width?: string }) => (
  <div className="space-y-2">
    <Skeleton className={`h-4 ${width}`} />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Skeleton for form field with label and description
export const FormFieldWithDescriptionSkeleton = ({
  width = "w-full",
}: {
  width?: string;
}) => (
  <div className="space-y-2">
    <Skeleton className={`h-4 ${width}`} />
    <Skeleton className="h-3 w-64" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Skeleton for select field
export const SelectFieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Skeleton for textarea field
export const TextareaFieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-24 w-full" />
  </div>
);

// Skeleton for checkbox field
export const CheckboxFieldSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-4 w-4 rounded" />
    <Skeleton className="h-4 w-32" />
  </div>
);

// Skeleton for tags input field
export const TagsInputSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <div className="flex items-center space-x-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-20 rounded" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-6 w-16 rounded-full" />
      ))}
    </div>
  </div>
);

// Skeleton for form grid row
export const FormGridRowSkeleton = ({ cols = 2 }: { cols?: number }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6`}>
    {Array.from({ length: cols }).map((_, index) => (
      <FormFieldSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for form actions
export const FormActionsSkeleton = () => (
  <div className="flex justify-end space-x-4 pt-6 border-t">
    <Skeleton className="h-10 w-24 rounded" />
    <Skeleton className="h-10 w-32 rounded" />
  </div>
);

// Skeleton for job posting form
export const JobPostingFormSkeleton = () => (
  <div className="space-y-8">
    {/* Basic Information */}
    <div>
      <FormSectionHeaderSkeleton />
      <div className="space-y-6">
        <FormGridRowSkeleton cols={2} />
        <FormFieldSkeleton />
        <TextareaFieldSkeleton />
        <FormGridRowSkeleton cols={2} />
      </div>
    </div>

    {/* Requirements & Benefits */}
    <div>
      <FormSectionHeaderSkeleton />
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20 rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20 rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Job Details */}
    <div>
      <FormSectionHeaderSkeleton />
      <div className="space-y-6">
        <FormGridRowSkeleton cols={3} />
        <FormGridRowSkeleton cols={2} />
        <FormGridRowSkeleton cols={2} />
      </div>
    </div>

    {/* Job Features */}
    <div>
      <FormSectionHeaderSkeleton />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxFieldSkeleton />
          <CheckboxFieldSkeleton />
        </div>
        <TagsInputSkeleton />
      </div>
    </div>

    {/* Application Settings */}
    <div>
      <FormSectionHeaderSkeleton />
      <div className="space-y-6">
        <FormGridRowSkeleton cols={2} />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20 rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Form Actions */}
    <FormActionsSkeleton />
  </div>
);

// Skeleton for edit job form (similar to posting form but with loading state)
export const EditJobFormSkeleton = () => (
  <div className="space-y-8">
    {/* Header with loading state */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded" />
    </div>

    {/* Form content */}
    <JobPostingFormSkeleton />
  </div>
);
