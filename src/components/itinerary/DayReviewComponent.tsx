import React, { useState } from 'react';
import { MessageSquare, X, Check, Edit3 } from 'lucide-react';
import { StarRating } from '@/components/ui/rating';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DayReview } from '@/types/itinerary';

interface DayReviewComponentProps {
  existingReview?: DayReview;
  onSaveReview: (rating: number, review?: string) => Promise<void>;
  onDeleteReview?: () => Promise<void>;
  disabled?: boolean;
}

export const DayReviewComponent: React.FC<DayReviewComponentProps> = ({
  existingReview,
  onSaveReview,
  onDeleteReview,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(!existingReview);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [review, setReview] = useState(existingReview?.review || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (rating === 0) return;
    
    setIsSaving(true);
    try {
      await onSaveReview(rating, review.trim() || undefined);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save review:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.review || '');
      setIsEditing(false);
    } else {
      setRating(0);
      setReview('');
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (onDeleteReview && window.confirm('Are you sure you want to remove this review?')) {
      await onDeleteReview();
      setRating(0);
      setReview('');
      setIsEditing(true);
    }
  };

  if (!existingReview && !isEditing) {
    return (
      <Card className="p-4 mt-4 border-dashed">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            How was this day? Share your thoughts!
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            disabled={disabled}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mt-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Day Review</h4>
          {existingReview && !isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={disabled}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Rating
            </label>
            <StarRating
              rating={rating}
              onRatingChange={isEditing ? setRating : undefined}
              disabled={!isEditing || disabled}
              size="md"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Review (optional)
            </label>
            {isEditing ? (
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this day..."
                className="resize-none"
                rows={3}
                disabled={disabled}
              />
            ) : (
              <p className="text-sm text-foreground bg-muted/30 rounded-md p-3 min-h-[76px] flex items-start">
                {review || <span className="text-muted-foreground italic">No review added</span>}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving || disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={rating === 0 || isSaving || disabled}
              >
                <Check className="h-3 w-3 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};