import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  disabled = false,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starIndex: number) => {
    if (!disabled && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleStarClick(index)}
          disabled={disabled}
          className={cn(
            sizeClasses[size],
            disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform',
            'focus:outline-none focus:ring-2 focus:ring-ring rounded'
          )}
        >
          <Star
            className={cn(
              'transition-colors',
              index < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground hover:text-yellow-400'
            )}
          />
        </button>
      ))}
    </div>
  );
};