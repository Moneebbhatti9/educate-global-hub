import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  UseFormProps,
  PathValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";

interface UseFormValidationOptions<T extends FieldValues>
  extends Omit<UseFormProps<T>, "resolver"> {
  schema: z.ZodSchema<T>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
}

export const useFormValidation = <T extends FieldValues>({
  schema,
  mode = "onTouched",
  ...formOptions
}: UseFormValidationOptions<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode,
    ...formOptions,
  });

  const {
    formState: { errors, touchedFields, dirtyFields },
    setValue,
    trigger,
    clearErrors,
  } = form;

  // Check if a field is invalid (has error and is touched/dirty)
  const isFieldInvalid = useCallback(
    (fieldName: Path<T>): boolean => {
      const hasError = !!errors?.[fieldName as string];
      const isTouched = !!touchedFields?.[fieldName as string];
      const isDirty = !!dirtyFields?.[fieldName as string];

      return hasError && (isTouched || isDirty);
    },
    [errors, touchedFields, dirtyFields]
  );

  // Get field error message
  const getFieldError = useCallback(
    (fieldName: Path<T>): string | undefined => {
      const error = errors[fieldName];
      if (!error) return undefined;
      if (typeof error.message === "string") {
        return error.message;
      }
      return undefined;
    },
    [errors]
  );

  // Check if a field has any error (regardless of touch/dirty state)
  const hasFieldError = useCallback(
    (fieldName: Path<T>): boolean => {
      return !!errors[fieldName];
    },
    [errors]
  );

  // Validate a single field
  const validateField = useCallback(
    async (fieldName: Path<T>): Promise<boolean> => {
      return await trigger(fieldName);
    },
    [trigger]
  );

  // Set field value and validate
  const setFieldValue = useCallback(
    async (fieldName: Path<T>, value: PathValue<T, Path<T>>): Promise<void> => {
      setValue(fieldName, value);
      await trigger(fieldName);
    },
    [setValue, trigger]
  );

  // Clear field error
  const clearFieldError = useCallback(
    (fieldName: Path<T>): void => {
      clearErrors(fieldName);
    },
    [clearErrors]
  );

  // Check if form is valid
  const isFormValid = useCallback((): boolean => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Get all field errors
  const getAllErrors = useCallback((): Record<string, string> => {
    const errorMessages: Record<string, string> = {};
    Object.keys(errors).forEach((key) => {
      const error = errors[key as Path<T>];
      if (typeof error?.message === "string") {
        errorMessages[key] = error.message;
      }
    });
    return errorMessages;
  }, [errors]);

  // Reset form with new values
  const resetForm = useCallback(
    (values?: Partial<T>): void => {
      if (values) {
        form.reset({ ...(form.getValues() as T), ...values });
      } else {
        form.reset();
      }
    },
    [form]
  );

  return {
    ...form,
    isFieldInvalid,
    getFieldError,
    hasFieldError,
    validateField,
    setFieldValue,
    clearFieldError,
    isFormValid,
    getAllErrors,
    resetForm,
  };
};

// Helper hook for real-time validation
export const useRealTimeValidation = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
) => {
  const {
    formState: { errors, touchedFields, dirtyFields },
    watch,
  } = form;

  const fieldValue = watch(fieldName);
  const hasError = !!errors?.[fieldName as keyof typeof errors];
  const isTouched = !!touchedFields?.[fieldName as keyof typeof touchedFields];
  const isDirty = !!dirtyFields?.[fieldName as keyof typeof dirtyFields];
  const isInvalid = hasError && (isTouched || isDirty);
  const errorMessage = (
    errors?.[fieldName as keyof typeof errors] as
      | { message?: string }
      | undefined
  )?.message;

  return {
    fieldValue,
    hasError,
    isTouched,
    isDirty,
    isInvalid,
    errorMessage,
  };
};

// Helper hook for form submission with validation
export const useFormSubmission = <T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (data: T) => Promise<void> | void
) => {
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const submitHandler = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      throw error;
    }
  });

  return {
    submitHandler,
    isSubmitting,
    isValid,
  };
};
