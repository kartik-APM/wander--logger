import { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Activity } from '@/types/itinerary';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ActivityCard } from './ActivityCard';
import { ActivityFormDialog } from './ActivityFormDialog';
import { useDeleteActivity } from '@/hooks/useTripData';
import { useGuestTrips } from '@/hooks/useGuestTrips';
import { useTripStore } from '@/store/tripStore';

interface DayCardProps {
  dateKey: string;
  activities: Activity[];
  tripId: string;
}

export const DayCard: React.FC<DayCardProps> = ({ dateKey, activities, tripId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { selectedActivity, setSelectedActivity } = useTripStore();
  const isGuestTrip = tripId.startsWith('guest_');
  
  // Firebase hooks
  const deleteFirebaseActivity = useDeleteActivity();
  
  // Guest hooks
  const { deleteActivity: deleteGuestActivity } = useGuestTrips();

  const date = new Date(dateKey);
  const dayOfWeek = format(date, 'EEEE');
  const formattedDate = format(date, 'MMMM d, yyyy');

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      if (isGuestTrip) {
        deleteGuestActivity(tripId, dateKey, activityId);
      } else {
        await deleteFirebaseActivity.mutateAsync({ tripId, dateKey, activityId });
      }
      if (selectedActivity?.id === activityId) {
        setSelectedActivity(null);
      }
    }
  };

  const handleEditActivity = () => {
    // Edit is handled by the ActivityCard's dialog
  };

  return (
    <>
      <AccordionItem value={dateKey} className="border rounded-lg mb-3 overflow-hidden">
        <div className="flex items-stretch bg-muted/50 hover:bg-muted">
          {/* Left side - Non-clickable content */}
          <div className="flex-1 px-6 py-4 text-left">
            <h3 className="text-lg font-bold">{dayOfWeek}</h3>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            {activities.length > 0 ? (
              <div className="mt-2 space-y-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground line-clamp-1">
                      {activity.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 italic">
                No activities planned
              </p>
            )}
          </div>
          
          {/* Divider */}
          <div className="w-px bg-border" />
          
          {/* Right side - Clickable accordion trigger */}
          <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50" />
        </div>
        <AccordionContent className="px-6 py-4">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-3">No activities planned for this day</p>
                <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            ) : (
              <>
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    tripId={tripId}
                    dateKey={dateKey}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                    onClick={() => setSelectedActivity(activity)}
                    isSelected={selectedActivity?.id === activity.id}
                  />
                ))}
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Activity
                </Button>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <ActivityFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        tripId={tripId}
        dateKey={dateKey}
        mode="create"
      />
    </>
  );
};
