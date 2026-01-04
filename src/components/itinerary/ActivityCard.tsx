import { useState, memo, useMemo } from 'react';
import { Clock, MapPin, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Activity } from '@/types/itinerary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, getDailyTripColor } from '@/lib/utils';
import { ActivityFormDialog } from './ActivityFormDialog';

interface ActivityCardProps {
  activity: Activity;
  tripId: string;
  dateKey: string;
  onEdit: (activityId: string, data: Partial<Activity>) => void;
  onDelete: (activityId: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  showFullDescription?: boolean;
  onActivityModified?: () => Promise<void>;
}

const ActivityCardComponent: React.FC<ActivityCardProps> = ({
  activity,
  tripId,
  dateKey,
  // onEdit, // Not used - ActivityFormDialog handles updates directly
  onDelete,
  onClick,
  isSelected,
  showFullDescription = false,
  onActivityModified,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Generate daily bgColor (updates at 2 PM) unique to this trip
  const bgColor = useMemo(() => getDailyTripColor(tripId), [tripId]);

  return (
    <>
      <Card
        className={cn(
          'p-4 cursor-pointer hover:shadow-md transition-all',
          isSelected && 'ring-2 ring-primary'
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base mb-2 truncate">{activity.title}</h4>
            
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {activity.tags.map((tag) => (
                    <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r ${bgColor} text-white text-xs font-medium opacity-80`}
                    >
                    {tag}
                    </span>
                ))}
              </div>
            )}
            
            {activity.allDay ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                <Clock className="h-3 w-3" />
                <span>All day</span>
              </div>
            ) : activity.time ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{activity.time}</span>
              </div>
            ) : null}
            
            {(activity.lat && activity.lng) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Location added</span>
              </div>
            )}
            
            {activity.mapLink && (
              <a
                href={activity.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline mb-2"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">View on map</span>
              </a>
            )}
            
            {activity.description && (
              <p className={cn(
                "text-sm text-muted-foreground mt-2 whitespace-pre-wrap",
                !showFullDescription && "line-clamp-2"
              )}>
                {activity.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(activity.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <ActivityFormDialog
        open={isEditDialogOpen}
        onOpenChange={async (open) => {
          if (!open && isEditDialogOpen && onActivityModified) {
            await onActivityModified();
          }
          setIsEditDialogOpen(open);
        }}
        tripId={tripId}
        dateKey={dateKey}
        activity={activity}
        mode="edit"
      />
    </>
  );
};

export const ActivityCard = memo(ActivityCardComponent);
