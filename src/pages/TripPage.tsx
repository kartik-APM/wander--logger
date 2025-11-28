import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { TripBanner } from '@/components/layout/TripBanner';
import { ItineraryPanel } from '@/components/itinerary/ItineraryPanel';
import { MapView } from '@/components/map/MapView';
import { useTrip } from '@/hooks/useTripData';
import { useTripStore } from '@/store/tripStore';
import { useMemo } from 'react';

export const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading, error } = useTrip(tripId);
  const { selectedDate } = useTripStore();

  const activitiesForMap = useMemo(() => {
    if (!trip) return [];
    
    if (selectedDate && trip.days[selectedDate]) {
      return trip.days[selectedDate].activities;
    }
    
    // Show all activities if no specific date is selected
    return Object.values(trip.days).flatMap(day => day.activities);
  }, [trip, selectedDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-lg mb-4">Failed to load trip</p>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Trip not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <TripBanner trip={trip} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Itinerary */}
        <div className="w-full lg:w-2/5 border-r overflow-hidden">
          <ItineraryPanel trip={trip} />
        </div>
        
        {/* Right Panel - Map */}
        <div className="hidden lg:block lg:w-3/5">
          <MapView activities={activitiesForMap} />
        </div>
      </div>
    </div>
  );
};
