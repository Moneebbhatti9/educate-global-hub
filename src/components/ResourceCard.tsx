import { Star, Heart, Download, Eye, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResourceCardProps {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  price: number;
  currency: string;
  isFree: boolean;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  uploadDate: string;
  subjects: string[];
  grades: string[];
  type: string;
  onView?: (id: string) => void;
  onPurchase?: (id: string) => void;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

export const ResourceCard = ({
  id,
  title,
  author,
  price,
  currency,
  isFree,
  thumbnail,
  rating,
  reviewCount,
  downloads,
  uploadDate,
  subjects,
  grades,
  type,
  onView,
  onPurchase,
  onWishlist,
  isWishlisted = false,
  className = ""
}: ResourceCardProps) => {
  const handleView = () => {
    onView?.(id);
  };

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPurchase?.(id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlist?.(id);
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleView}
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3">
            {isFree ? (
              <Badge className="bg-green-600 text-white">Free</Badge>
            ) : (
              <Badge className="bg-primary text-white">
                {currency}{price.toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 hover:bg-white"
            onClick={handleWishlist}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleView}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              {!isFree && (
                <Button
                  size="sm"
                  onClick={handlePurchase}
                >
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Author */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="text-xs">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              by {author.name}
            </span>
          </div>

          {/* Subjects & Grades */}
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 2).map((subject) => (
              <Badge key={subject} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))}
            {grades.slice(0, 1).map((grade) => (
              <Badge key={grade} variant="secondary" className="text-xs">
                {grade}
              </Badge>
            ))}
            {(subjects.length > 2 || grades.length > 1) && (
              <Badge variant="secondary" className="text-xs">
                +{(subjects.length - 2) + (grades.length - 1)} more
              </Badge>
            )}
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
                <span>({reviewCount})</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{downloads.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{uploadDate}</span>
            </div>
          </div>

          {/* Resource Type */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
            
            {!isFree && (
              <Button
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={handlePurchase}
              >
                {currency}{price.toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};