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
import { useUserStore } from '@/store/userStore';

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
  const { user } = useUserStore();
  const addActivity = useAddActivity();
  const updateActivity = useUpdateActivity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    defaultValues: activity
      ? {
          title: activity.title,
          time: activity.time,
          description: activity.description,
          placeId: activity.placeId,
          lat: activity.lat,
          lng: activity.lng,
        }
      : undefined,
  });

  const onSubmit = async (data: ActivityFormData) => {
    if (!user) return;

    try {
      if (mode === 'create') {
        await addActivity.mutateAsync({
          tripId,
          dateKey,
          userId: user.uid,
          activityData: data,
        });
      } else if (mode === 'edit' && activity) {
        await updateActivity.mutateAsync({
          tripId,
          dateKey,
          activityId: activity.id,
          activityData: data,
        });
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save activity:', error);
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

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              placeholder="09:00 AM"
              {...register('time')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add notes or details about this activity..."
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="48.8584"
                {...register('lat', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="2.2945"
                {...register('lng', { valueAsNumber: true })}
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
            <Button type="submit" disabled={addActivity.isPending || updateActivity.isPending}>
              {mode === 'create' ? 'Add Activity' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
