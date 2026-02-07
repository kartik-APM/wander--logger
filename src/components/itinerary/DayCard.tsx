import { useState, memo } from 'react';
import { format, isAfter, parseISO, startOfDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { Activity } from '@/types/itinerary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActivityCard } from './ActivityCard';
import { ActivityFormDialog } from './ActivityFormDialog';
import { DayReviewComponent } from './DayReviewComponent';
import { useDeleteActivity, useAddDayReview, useUpdateDayReview, useDeleteDayReview, useUpdateDayCity, useReorderActivities } from '@/hooks/useTripData';
import { useGuestTrips } from '@/hooks/useGuestTrips';
import { useTripStore } from '@/store/tripStore';
import { useAuth } from '@/contexts/AuthContext';

interface DayCardProps {
  dateKey: string;
  activities: Activity[];
  tripId: string;
  existingReview?: any; // DayReview from the trip data
  existingCity?: string;
}

const DayCardComponent: React.FC<DayCardProps> = ({ dateKey, activities, tripId, existingReview, existingCity }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dayCity, setDayCity] = useState(existingCity || '');
  const [showCityInput, setShowCityInput] = useState(!existingCity);
  const { selectedActivity, setSelectedActivity } = useTripStore();
  const { currentUser } = useAuth();
  const isGuestTrip = tripId.startsWith('guest_');
  
  // Firebase hooks
  const deleteFirebaseActivity = useDeleteActivity();
  const addFirebaseReview = useAddDayReview();
  const updateFirebaseReview = useUpdateDayReview();
  const deleteFirebaseReview = useDeleteDayReview();
  const updateFirebaseDayCity = useUpdateDayCity();
  const reorderFirebaseActivities = useReorderActivities();
  
  // Guest hooks
  const { 
    deleteActivity: deleteGuestActivity, 
    addDayReview: addGuestReview,
    updateDayReview: updateGuestReview,
    deleteDayReview: deleteGuestReview,
    updateDayCity: updateGuestDayCity,
    reorderActivities: reorderGuestActivities
  } = useGuestTrips();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const date = new Date(dateKey);
  const dayOfWeek = format(date, 'EEEE');
  const formattedDate = format(date, 'MMMM d, yyyy');
  
  // Check if this day is over (past today)
  const isDayOver = isAfter(startOfDay(new Date()), parseISO(dateKey));

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
      
      // Remove day review if activities change and day is over
      if (isDayOver && existingReview) {
        await handleDeleteReview();
      }
    }
  };

  const handleSaveReview = async (rating: number, review?: string) => {
    const userId = currentUser?.uid || 'guest';
    
    if (isGuestTrip) {
      if (existingReview) {
        updateGuestReview(tripId, dateKey, rating, review);
      } else {
        addGuestReview(tripId, dateKey, rating, review);
      }
    } else {
      if (existingReview) {
        await updateFirebaseReview.mutateAsync({
          tripId,
          dateKey,
          rating,
          review,
        });
      } else {
        await addFirebaseReview.mutateAsync({
          tripId,
          dateKey,
          userId,
          rating,
          review,
        });
      }
    }
  };

  const handleDeleteReview = async () => {
    if (isGuestTrip) {
      deleteGuestReview(tripId, dateKey);
    } else {
      await deleteFirebaseReview.mutateAsync({
        tripId,
        dateKey,
      });
    }
  };

  const handleActivityModified = async () => {
    if (isDayOver && existingReview) {
      await handleDeleteReview();
    }
  };

  const handleEditActivity = () => {
    // Edit is handled by the ActivityCard's dialog
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((act) => act.id === active.id);
      const newIndex = activities.findIndex((act) => act.id === over.id);

      const reorderedActivities = arrayMove(activities, oldIndex, newIndex);

      if (isGuestTrip) {
        reorderGuestActivities(tripId, dateKey, reorderedActivities);
      } else {
        await reorderFirebaseActivities.mutateAsync({
          tripId,
          dateKey,
          reorderedActivities,
        });
      }
    }
  };

  const handleSaveDayCity = async (city: string) => {
    if (isGuestTrip) {
      updateGuestDayCity(tripId, dateKey, city);
    } else {
      await updateFirebaseDayCity.mutateAsync({ tripId, dateKey, city });
    }
  };

  return (
    <>
      <AccordionItem value={dateKey} className="border rounded-lg mb-3 overflow-hidden">
        <div className="flex items-stretch bg-muted/50 hover:bg-muted">
          {/* Left side - Non-clickable content */}
          <div className="flex-1 px-6 py-4 text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">{dayOfWeek}</h3>
              {showCityInput || !dayCity ? (
                <Input
                  type="text"
                  placeholder="City"
                  value={dayCity}
                  onChange={(e) => setDayCity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && dayCity.trim()) {
                      setShowCityInput(false);
                      e.currentTarget.blur();
                      handleSaveDayCity(dayCity);
                    }
                  }}
                  onBlur={() => {
                    if (dayCity.trim()) {
                      setShowCityInput(false);
                      handleSaveDayCity(dayCity);
                    }
                  }}
                  className="h-7 w-32 text-sm"
                />
              ) : (
                <div className="flex items-center gap-2">
                  {dayCity.split(',').map((city, index) => {
                    const trimmedCity = city.trim();
                    if (!trimmedCity) return null;
                    return (
                      <button
                        key={index}
                        onClick={() => setShowCityInput(true)}
                        title="City you spend the day in"
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {trimmedCity}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={activities.map((act) => act.id)}
                    strategy={verticalListSortingStrategy}
                  >
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
                        showFullDescription={true}
                        onActivityModified={handleActivityModified}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
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
            
            {/* Show review component if day is over */}
            {isDayOver && (
              <DayReviewComponent
                existingReview={existingReview}
                onSaveReview={handleSaveReview}
                onDeleteReview={handleDeleteReview}
              />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <ActivityFormDialog
        open={isAddDialogOpen}
        onOpenChange={async (open) => {
          // If closing after adding an activity and review exists, remove the review
          if (!open && isAddDialogOpen && isDayOver && existingReview) {
            await handleDeleteReview();
          }
          setIsAddDialogOpen(open);
        }}
        tripId={tripId}
        dateKey={dateKey}
        mode="create"
      />
    </>
  );
};

export const DayCard = memo(DayCardComponent);
