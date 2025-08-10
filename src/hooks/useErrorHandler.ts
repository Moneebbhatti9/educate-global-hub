import { useToast } from "./use-toast";
import { errorHandler, AppError } from "../utils/errorHandler";
import { AxiosError } from "axios";

export const useErrorHandler = () => {
  const { toast } = useToast();

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
      toast({
        title: title || "Error",
        description: appError.message,
        variant: "destructive",
      });
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
    toast({
      title,
      description,
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  return {
    handleError,
    handleFormError,
    showSuccess,
    showError,
  };
};
