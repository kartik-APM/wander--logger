import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticipantAvatars } from '@/components/ui/ParticipantAvatars';
import { useParticipantProfiles } from '@/hooks/useParticipantProfiles';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const isGuestTrip = trip.id.startsWith('guest_');
  const { data: participants = [], isLoading: participantsLoading } = useParticipantProfiles(
    isGuestTrip ? [] : trip.participants
  );

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
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
          {!isGuestTrip && !participantsLoading && participants.length > 0 && (
            <div className="flex items-center gap-2">
              <ParticipantAvatars participants={participants} maxDisplay={3} size="sm" />
            </div>
          )}
          {isGuestTrip && (
            <div className="flex items-center gap-2 text-sm">
              <span>
                {trip.participants.length}{' '}
                {trip.participants.length === 1 ? 'participant' : 'participants'}
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {Object.keys(trip.days).length} days planned
        </div>
      </CardContent>
    </Card>
  );
};
