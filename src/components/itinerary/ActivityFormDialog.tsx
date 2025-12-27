import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Activity, ActivityFormData } from '@/types/itinerary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAddActivity, useUpdateActivity } from '@/hooks/useTripData';
import { useGuestTrips } from '@/hooks/useGuestTrips';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  dateKey: string;
  activity?: Activity;
  mode: 'create' | 'edit';
}

export const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  open,
  onOpenChange,
  tripId,
  dateKey,
  activity,
  mode,
}) => {
  const { currentUser } = useAuth();
  const isGuestTrip = tripId.startsWith('guest_');
  
  // Firebase hooks
  const addFirebaseActivity = useAddActivity();
  const updateFirebaseActivity = useUpdateActivity();
  
  // Guest hooks
  const { addActivity: addGuestActivity, updateActivity: updateGuestActivity } = useGuestTrips();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormData>({
    defaultValues: activity
      ? {
          title: activity.title,
          allDay: activity.allDay,
          time: activity.time,
          description: activity.description,
          placeId: activity.placeId,
          lat: activity.lat,
          lng: activity.lng,
          mapLink: activity.mapLink,
        }
      : undefined,
  });

  const isAllDay = watch('allDay');
  
  // Clear time when all day is checked
  useEffect(() => {
    if (isAllDay) {
      setValue('time', undefined);
    }
  }, [isAllDay, setValue]);

  const onSubmit = async (data: ActivityFormData) => {
    try {
      // Clean up the data - save empty strings for undefined/null values
      const cleanedData: any = {
        title: data.title,
        allDay: data.allDay,
        time: data.time || '',
        description: data.description || '',
        placeId: data.placeId || '',
        mapLink: data.mapLink || '',
      };
      
      // Only add numeric fields if they have valid values
      if (data.lat !== undefined && !isNaN(data.lat)) cleanedData.lat = data.lat;
      if (data.lng !== undefined && !isNaN(data.lng)) cleanedData.lng = data.lng;

      if (isGuestTrip) {
        // Guest mode
        if (mode === 'create') {
          addGuestActivity(tripId, dateKey, cleanedData);
        } else if (mode === 'edit' && activity) {
          updateGuestActivity(tripId, dateKey, activity.id, cleanedData);
        }
      } else {
        // Authenticated mode
        if (!currentUser) {
          console.error('User not authenticated');
          return;
        }
        
        if (mode === 'create') {
          await addFirebaseActivity.mutateAsync({
            tripId,
            dateKey,
            userId: currentUser.uid,
            activityData: cleanedData,
          });
        } else if (mode === 'edit' && activity) {
          await updateFirebaseActivity.mutateAsync({
            tripId,
            dateKey,
            activityId: activity.id,
            activityData: cleanedData,
          });
        }
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save activity:', error);
      alert('Failed to save activity. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Activity' : 'Edit Activity'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new activity to your itinerary'
              : 'Update activity details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Visit Eiffel Tower"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="allDay"
              type="checkbox"
              {...register('allDay')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="allDay" className="cursor-pointer font-normal">
              All day activity
            </Label>
          </div>

          {!isAllDay && (
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                placeholder="09:00 AM"
                {...register('time')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add notes or details about this activity..."
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapLink">Map Link</Label>
            <Input
              id="mapLink"
              type="url"
              placeholder="e.g., https://maps.google.com/..."
              {...register('mapLink')}
            />
            <p className="text-xs text-muted-foreground">
              Paste a Google Maps or any map link for this location
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="48.8584"
                {...register('lat', {
                  setValueAs: (v) => v === '' || v === null ? undefined : parseFloat(v)
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="2.2945"
                {...register('lng', {
                  setValueAs: (v) => v === '' || v === null ? undefined : parseFloat(v)
                })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isGuestTrip ? false : (addFirebaseActivity.isPending || updateFirebaseActivity.isPending)}>
              {mode === 'create' ? 'Add Activity' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
