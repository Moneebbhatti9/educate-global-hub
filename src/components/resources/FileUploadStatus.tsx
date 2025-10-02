import { Check, X, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadStatusProps {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  onRetry?: () => void;
  onRemove?: () => void;
}

export const FileUploadStatus = ({
  fileName,
  progress,
  status,
  error,
  onRetry,
  onRemove,
}: FileUploadStatusProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
        status === 'success' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
        status === 'error' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        status === 'uploading' && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
        status === 'pending' && "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
      )}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {status === 'uploading' && (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        )}
        {status === 'success' && (
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        {status === 'error' && (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        {status === 'pending' && (
          <div className="w-5 h-5 rounded-full bg-gray-400" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
        {status === 'uploading' && (
          <Progress value={progress} className="h-1.5 mt-2" />
        )}
        {status === 'error' && error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
        {status === 'success' && (
          <p className="text-xs text-green-600 mt-1">Upload complete</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {status === 'uploading' && (
          <span className="text-xs font-medium text-blue-600">{progress}%</span>
        )}
        {status === 'error' && onRetry && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        {(status === 'success' || status === 'error') && onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
