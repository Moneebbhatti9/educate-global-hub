import * as React from "react";
import { cn } from "@/lib/utils";

interface DualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
  disabled?: boolean;
}

const DualRangeSlider = React.forwardRef<HTMLDivElement, DualRangeSliderProps>(
  ({ min = 0, max = 1000, step = 1, value, onChange, className, disabled }, ref) => {
    const [isDragging, setIsDragging] = React.useState<'min' | 'max' | null>(null);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent, thumb: 'min' | 'max') => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(thumb);
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newValue = Math.round((min + percentage * (max - min)) / step) * step;
      const clampedValue = Math.max(min, Math.min(max, newValue));

      if (isDragging === 'min') {
        const newMin = Math.min(clampedValue, value[1] - step);
        onChange([newMin, value[1]]);
      } else {
        const newMax = Math.max(clampedValue, value[0] + step);
        onChange([value[0], newMax]);
      }
    }, [isDragging, min, max, step, value, onChange]);

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(null);
    }, []);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const minPercentage = ((value[0] - min) / (max - min)) * 100;
    const maxPercentage = ((value[1] - min) / (max - min)) * 100;

    return (
      <div
        ref={ref}
        className={cn("relative h-6 w-full", className)}
      >
        <div
          ref={sliderRef}
          className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700"
        />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-500"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
        <div
          className={cn(
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full border-2 border-blue-500 bg-white shadow-md transition-transform hover:scale-110",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{ left: `calc(${minPercentage}% - 10px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />
        <div
          className={cn(
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full border-2 border-blue-500 bg-white shadow-md transition-transform hover:scale-110",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{ left: `calc(${maxPercentage}% - 10px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
      </div>
    );
  }
);

DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
