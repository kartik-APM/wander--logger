import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticipantAvatars } from '@/components/ui/ParticipantAvatars';
import { useParticipantProfiles } from '@/hooks/useParticipantProfiles';
import { getRandomTripColor } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const isGuestTrip = trip.id.startsWith('guest_');
  const { data: participants = [], isLoading: participantsLoading } = useParticipantProfiles(
    isGuestTrip ? [] : trip.participants
  );
  
  // Use useMemo to ensure color is stable for this trip card instance
  const gradientColor = useMemo(() => getRandomTripColor(), []);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
      onClick={onClick}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor}`} />
      
      {/* Subtle background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-20 transition-opacity duration-200`} />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-start">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
          <span className="line-clamp-1">{trip.title}</span>
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
      <CardContent className="relative">
        <div className="text-sm text-muted-foreground">
          {Object.keys(trip.days).length} days planned
        </div>
      </CardContent>
    </Card>
  );
};
