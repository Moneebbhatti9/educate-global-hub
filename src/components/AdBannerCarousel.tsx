import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adApi } from "@/apis/ads";
import type { AdRequest } from "@/apis/ads";
import { cn } from "@/lib/utils";

interface AdBannerCarouselProps {
  compact?: boolean;
}

const AdBannerCarousel = ({ compact = false }: AdBannerCarouselProps) => {
  const [banners, setBanners] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayRef.current,
  ]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await adApi.getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  // Don't render anything while loading or if no banners
  if (loading || banners.length === 0) return null;

  // Single banner - static display, no carousel controls
  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <div className={compact ? "mb-4" : "mb-8"}>
        <Link
          to={`/jobs/${banner.jobId._id}`}
          className="block relative rounded-xl overflow-hidden group"
        >
          <img
            src={banner.bannerImageUrl}
            alt={banner.headline || banner.jobId.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            style={{ aspectRatio: compact ? "5/1" : "3/1" }}
          />
          <BannerOverlay banner={banner} compact={compact} />
        </Link>
      </div>
    );
  }

  // Multiple banners - full carousel
  return (
    <div className={`${compact ? "mb-4" : "mb-8"} relative group`}>
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner._id} className="flex-[0_0_100%] min-w-0">
              <Link
                to={`/jobs/${banner.jobId._id}`}
                className="block relative"
              >
                <img
                  src={banner.bannerImageUrl}
                  alt={banner.headline || banner.jobId.title}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: compact ? "5/1" : "3/1" }}
                />
                <BannerOverlay banner={banner} compact={compact} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous banner</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next banner</span>
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            className={cn(
              "rounded-full transition-all duration-200",
              index === selectedIndex
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/75"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/** Overlay with job info + sponsored badge */
const BannerOverlay = ({ banner, compact = false }: { banner: AdRequest; compact?: boolean }) => (
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
    <Badge className={`absolute ${compact ? "top-1.5 right-2 text-[10px] px-1.5 py-0.5" : "top-3 right-3 text-xs"} bg-brand-primary/90 text-white border-0`}>
      <Megaphone className={compact ? "w-2.5 h-2.5 mr-0.5" : "w-3 h-3 mr-1"} />
      Sponsored
    </Badge>
    <div className={`absolute ${compact ? "bottom-1.5 left-3 right-3" : "bottom-3 left-4 right-4"}`}>
      <h3 className={`text-white font-semibold truncate ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base md:text-lg"}`}>
        {banner.headline || banner.jobId.title}
      </h3>
      {!compact && (
        <p className="text-white/80 text-xs sm:text-sm truncate">
          {banner.jobId.organization}
        </p>
      )}
    </div>
  </div>
);

export default AdBannerCarousel;
