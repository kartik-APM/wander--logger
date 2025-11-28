import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useUserTrips, useCreateTrip } from '@/hooks/useTripData';
import { useForm } from 'react-hook-form';
import { TripFormData } from '@/types/trip';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: trips, isLoading } = useUserTrips(user?.uid);
  const createTrip = useCreateTrip();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>();

  const onSubmit = async (data: TripFormData) => {
    if (!user) return;

    try {
      const tripId = await createTrip.mutateAsync({
        userId: user.uid,
        tripData: data,
      });
      reset();
      setIsCreateDialogOpen(false);
      navigate(`/trip/${tripId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Trips</h1>
            <p className="text-muted-foreground">
              Plan your adventures and create unforgettable memories
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Trip
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your trips...</p>
            </div>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-1">{trip.title}</span>
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                  </CardTitle>
                  <CardDescription className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(trip.startDate), 'MMM d')} -{' '}
                        {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>
                        {trip.participants.length}{' '}
                        {trip.participants.length === 1 ? 'participant' : 'participants'}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {Object.keys(trip.days).length} days planned
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-6">
                Start planning your next adventure by creating your first trip
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Start planning your next adventure. Add details about your trip.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Vacation in Europe"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsCreateDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTrip.isPending}>
                {createTrip.isPending ? 'Creating...' : 'Create Trip'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
