import { customToast } from "@/components/ui/sonner";
import { errorHandler, AppError } from "../utils/errorHandler";
import { AxiosError } from "axios";

export const useErrorHandler = () => {

  const handleError = (
    error: unknown,
    title?: string,
    showToast: boolean = true
  ): AppError => {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof AxiosError) {
      appError = errorHandler.createError(error);
    } else if (error instanceof Error) {
      appError = new AppError(error.message);
    } else {
      appError = new AppError("An unexpected error occurred");
    }

    // Log error for debugging
    errorHandler.logError(error, title || "Error");

    // Show toast notification if requested
    if (showToast) {
      customToast.error(title || "Error", appError.message);
    }

    return appError;
  };

  const handleFormError = (
    error: unknown,
    fieldName?: string
  ): string | undefined => {
    const appError = handleError(error, "Form Error", false);

    if (fieldName && appError.details) {
      return errorHandler.getFieldError(fieldName, appError.details);
    }

    return appError.message;
  };

  const showSuccess = (title: string, description?: string) => {
    customToast.success(title, description);
  };

  const showError = (title: string, description?: string) => {
    customToast.error(title, description);
  };

  return {
    handleError,
    handleFormError,
    showSuccess,
    showError,
  };
};
