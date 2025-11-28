import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { Trip } from '@/types/trip';

interface TripBannerProps {
  trip: Trip;
}

export const TripBanner: React.FC<TripBannerProps> = ({ trip }) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-6">
      <div className="container mx-auto">
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
    </div>
  );
};
