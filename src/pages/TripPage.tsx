import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { TripBanner } from '@/components/layout/TripBanner';
import { ItineraryPanel } from '@/components/itinerary/ItineraryPanel';
import { MapView } from '@/components/map/MapView';
import { useTrip } from '@/hooks/useTripData';
import { useGuestTrips } from '@/hooks/useGuestTrips';
import { useAuth } from '@/contexts/AuthContext';
import { useTripStore } from '@/store/tripStore';
import { Trip } from '@/types/trip';

export const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { currentUser } = useAuth();
  const { selectedDate } = useTripStore();
  
  // Determine if this is a guest trip
  const isGuestTrip = tripId?.startsWith('guest_');
  
  // Fetch trip from appropriate source
  const { data: firebaseTrip, isLoading: firebaseLoading, error: firebaseError } = useTrip(isGuestTrip ? undefined : tripId);
  const { getTrip } = useGuestTrips();
  const [guestTrip, setGuestTrip] = useState<Trip | null>(null);
  
  // Load guest trip and refresh on changes
  useEffect(() => {
    if (isGuestTrip && tripId) {
      setGuestTrip(getTrip(tripId));
      
      // Listen for localStorage changes (from other tabs or components)
      const handleStorageChange = () => {
        setGuestTrip(getTrip(tripId));
      };
      
      // Custom event for same-tab updates
      window.addEventListener('guestTripUpdated', handleStorageChange);
      
      return () => {
        window.removeEventListener('guestTripUpdated', handleStorageChange);
      };
    }
  }, [isGuestTrip, tripId, getTrip]);
  
  // Use appropriate trip data
  const trip = isGuestTrip ? guestTrip : firebaseTrip;
  const isLoading = isGuestTrip ? false : firebaseLoading;
  const error = isGuestTrip ? (guestTrip ? null : new Error('Trip not found')) : firebaseError;

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
      {!currentUser && <GuestBanner />}
      <TripBanner trip={trip} />
      
      <div className="flex-1 flex relative">
        {/* Left Panel - Itinerary (Scrollable) */}
        <div className="w-full lg:w-2/5 border-r overflow-y-auto">
          <ItineraryPanel trip={trip} />
        </div>
        
        {/* Right Panel - Map (Fixed) */}
        <div className="hidden lg:block lg:w-3/5 sticky top-0 h-screen">
          <MapView activities={activitiesForMap} />
        </div>
      </div>
    </div>
  );
};
