import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PreviewCarouselProps {
  images: string[];
  titles?: string[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  showThumbnails?: boolean;
  showCounter?: boolean;
  allowZoom?: boolean;
  maxHeight?: string;
  className?: string;
}

export const PreviewCarousel = ({
  images,
  titles,
  currentIndex = 0,
  onIndexChange,
  showThumbnails = true,
  showCounter = true,
  allowZoom = true,
  maxHeight = "400px",
  className = ""
}: PreviewCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const handleIndexChange = (index: number) => {
    setActiveIndex(index);
    onIndexChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    handleIndexChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    handleIndexChange(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setShowZoomModal(false);
  };

  if (images.length === 0) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`} style={{ height: maxHeight }}>
        <div className="text-center text-muted-foreground">
          <Eye className="w-8 h-8 mx-auto mb-2" />
          <p>No preview available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Preview */}
      <div className="relative group">
        <div 
          className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center"
          style={{ height: maxHeight }}
        >
          <img 
            src={images[activeIndex]} 
            alt={titles?.[activeIndex] || `Preview ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Counter */}
          {showCounter && images.length > 1 && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-black/50 text-white"
            >
              {activeIndex + 1} / {images.length}
            </Badge>
          )}

          {/* Zoom Button */}
          {allowZoom && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0"
              onClick={() => setShowZoomModal(true)}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleIndexChange(index)}
              className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                activeIndex === index 
                  ? 'border-primary shadow-md scale-105' 
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <img 
                src={image} 
                alt={titles?.[index] || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      {titles?.[activeIndex] && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {titles[activeIndex]}
          </p>
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {titles?.[activeIndex] || `Preview ${activeIndex + 1}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <img 
              src={images[activeIndex]} 
              alt={titles?.[activeIndex] || `Preview ${activeIndex + 1}`}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto"
            />
            
            {/* Navigation in Modal */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};