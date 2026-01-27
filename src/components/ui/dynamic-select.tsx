/**
 * DynamicSelect Component
 * A reusable select component that fetches options from the dropdown API
 */

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getDropdownOptions, getChildDropdownOptions } from "@/apis/dropdowns";
import type { DropdownOption } from "@/types/dropdown";

interface DynamicSelectProps {
  /** The dropdown category to fetch options for */
  category: string;
  /** Current value */
  value?: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Parent category for dependent dropdowns */
  parentCategory?: string;
  /** Parent value for dependent dropdowns (triggers refetch when changed) */
  parentValue?: string;
  /** Whether to include inactive options */
  includeInactive?: boolean;
  /** Custom render for option label */
  renderOption?: (option: DropdownOption) => React.ReactNode;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Label for the select */
  label?: string;
  /** Description text */
  description?: string;
  /** Allow clearing the selection */
  allowClear?: boolean;
  /** Called when options are loaded */
  onOptionsLoaded?: (options: DropdownOption[]) => void;
}

export const DynamicSelect = ({
  category,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  parentCategory,
  parentValue,
  includeInactive = false,
  renderOption,
  error,
  required,
  label,
  description,
  allowClear = false,
  onOptionsLoaded,
}: DynamicSelectProps) => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      let data: DropdownOption[];

      // If this is a dependent dropdown, fetch children based on parent value
      if (parentCategory && parentValue) {
        data = await getChildDropdownOptions(parentCategory, parentValue, includeInactive);
      } else {
        data = await getDropdownOptions(category, includeInactive);
      }

      setOptions(data);
      onOptionsLoaded?.(data);
    } catch (err) {
      console.error(`Failed to fetch options for ${category}:`, err);
      setFetchError("Failed to load options");
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, parentCategory, parentValue, includeInactive, onOptionsLoaded]);

  // Fetch options on mount and when dependencies change
  useEffect(() => {
    // For dependent dropdowns, don't fetch if no parent value
    if (parentCategory && !parentValue) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    fetchOptions();
  }, [fetchOptions, parentCategory, parentValue]);

  // Clear value if it's not in the new options list
  useEffect(() => {
    if (value && options.length > 0) {
      const valueExists = options.some((opt) => opt.value === value);
      if (!valueExists) {
        onValueChange("");
      }
    }
  }, [options, value, onValueChange]);

  if (isLoading) {
    return (
      <div className={className}>
        {label && (
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-1.5 block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || (parentCategory && !parentValue)}
      >
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={parentCategory && !parentValue ? `Select ${parentCategory} first` : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowClear && value && (
            <SelectItem value="">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          {fetchError ? (
            <div className="p-2 text-sm text-destructive">{fetchError}</div>
          ) : options.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No options available</div>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option._id}
                value={option.value}
                disabled={!option.isActive}
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.label}</span>
                    {!option.isActive && (
                      <span className="text-xs text-muted-foreground">(Inactive)</span>
                    )}
                  </div>
                )}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {description && !error && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

/**
 * Hook for fetching dropdown options
 */
export const useDropdownOptions = (
  category: string,
  options?: {
    parentCategory?: string;
    parentValue?: string;
    includeInactive?: boolean;
    enabled?: boolean;
  }
) => {
  const [data, setData] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { parentCategory, parentValue, includeInactive = false, enabled = true } = options || {};

  const fetchOptions = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // For dependent dropdowns, don't fetch if no parent value
    if (parentCategory && !parentValue) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let result: DropdownOption[];

      if (parentCategory && parentValue) {
        result = await getChildDropdownOptions(parentCategory, parentValue, includeInactive);
      } else {
        result = await getDropdownOptions(category, includeInactive);
      }

      setData(result);
    } catch (err) {
      console.error(`Failed to fetch options for ${category}:`, err);
      setError("Failed to load options");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, parentCategory, parentValue, includeInactive, enabled]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const refetch = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  return { data, isLoading, error, refetch };
};

/**
 * Hook for fetching multiple dropdown categories at once
 */
export const useMultipleDropdowns = (categories: string[], includeInactive = false) => {
  const [data, setData] = useState<Record<string, DropdownOption[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await Promise.all(
        categories.map(async (category) => {
          const options = await getDropdownOptions(category, includeInactive);
          return { category, options };
        })
      );

      const grouped: Record<string, DropdownOption[]> = {};
      results.forEach(({ category, options }) => {
        grouped[category] = options;
      });

      setData(grouped);
    } catch (err) {
      console.error("Failed to fetch dropdown options:", err);
      setError("Failed to load options");
    } finally {
      setIsLoading(false);
    }
  }, [categories, includeInactive]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchAll();
    }
  }, [fetchAll, categories.length]);

  return { data, isLoading, error, refetch: fetchAll };
};

export default DynamicSelect;
