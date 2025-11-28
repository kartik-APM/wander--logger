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
import { useTripStore } from '@/store/tripStore';

interface DayCardProps {
  dateKey: string;
  activities: Activity[];
  tripId: string;
}

export const DayCard: React.FC<DayCardProps> = ({ dateKey, activities, tripId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { selectedActivity, setSelectedActivity } = useTripStore();
  const deleteActivity = useDeleteActivity();

  const date = new Date(dateKey);
  const dayOfWeek = format(date, 'EEEE');
  const formattedDate = format(date, 'MMMM d, yyyy');

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity.mutateAsync({ tripId, dateKey, activityId });
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
        <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/50 hover:bg-muted">
          <div className="text-left">
            <h3 className="text-lg font-bold">{dayOfWeek}</h3>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </p>
          </div>
        </AccordionTrigger>
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
