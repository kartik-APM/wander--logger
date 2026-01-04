import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, UserPlus, StickyNote } from 'lucide-react';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { InviteDialog } from '@/components/itinerary/InviteDialog';
import { NotesSection } from '@/components/layout/NotesSection';
import { useAuth } from '@/contexts/AuthContext';
import { ParticipantAvatars } from '@/components/ui/ParticipantAvatars';
import { useParticipantProfiles } from '@/hooks/useParticipantProfiles';

interface TripBannerProps {
  trip: Trip;
}

export const TripBanner: React.FC<TripBannerProps> = ({ trip }) => {
  const { currentUser } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  // Calculate number of days
  const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Check if current user is the owner of the trip
  const isOwner = currentUser && trip.ownerId === currentUser.uid;
  const isGuestTrip = trip.id.startsWith('guest_');
  
  // Fetch participant profiles
  const { data: participants = [], isLoading: participantsLoading } = useParticipantProfiles(trip.participants);

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
                    {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')} ({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})
                  </span>
                </div>
                {!isGuestTrip && !participantsLoading && participants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <ParticipantAvatars 
                      participants={participants} 
                      maxDisplay={3} 
                      size="sm" 
                      textClassName="text-white/90"
                    />
                  </div>
                )}
                {isGuestTrip && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>
                      {trip.participants.length} {trip.participants.length === 1 ? 'participant' : 'participants'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setNotesOpen(true)}
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 gap-2"
              >
                <StickyNote className="h-4 w-4" />
                Notes
              </Button>
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
      </div>
      
      {!isGuestTrip && (
        <InviteDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          tripId={trip.id}
        />
      )}
      
      <NotesSection
        open={notesOpen}
        onOpenChange={setNotesOpen}
        tripId={trip.id}
        notes={trip.notes}
        isGuestMode={isGuestTrip}
      />
    </>
  );
};
