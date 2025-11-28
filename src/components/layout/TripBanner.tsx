import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, UserPlus } from 'lucide-react';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { InviteDialog } from '@/components/itinerary/InviteDialog';
import { useAuth } from '@/contexts/AuthContext';

interface TripBannerProps {
  trip: Trip;
}

export const TripBanner: React.FC<TripBannerProps> = ({ trip }) => {
  const { currentUser } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  // Check if current user is the owner of the trip
  const isOwner = currentUser && trip.ownerId === currentUser.uid;
  const isGuestTrip = trip.id.startsWith('guest_');

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{trip.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {trip.participants.length} {trip.participants.length === 1 ? 'participant' : 'participants'}
                  </span>
                </div>
              </div>
            </div>
            
            {isOwner && !isGuestTrip && (
              <Button
                onClick={() => setInviteDialogOpen(true)}
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Invite Friends
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {!isGuestTrip && (
        <InviteDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          tripId={trip.id}
        />
      )}
    </>
  );
};
