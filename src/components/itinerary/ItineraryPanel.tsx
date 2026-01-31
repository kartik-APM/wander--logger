import { memo, useMemo } from 'react';
import { Trip } from '@/types/trip';
import { Accordion } from '@/components/ui/accordion';
import { DayCard } from './DayCard';
import { eachDayOfInterval, format } from 'date-fns';

interface ItineraryPanelProps {
  trip: Trip;
}

const ItineraryPanelComponent: React.FC<ItineraryPanelProps> = ({ trip }) => {
  const sortedDates = useMemo(() => {
    const dateRange = eachDayOfInterval({
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
    });
    return dateRange.map((date) => format(date, 'yyyy-MM-dd'));
  }, [trip.startDate, trip.endDate]);

  return (
    <div className="bg-background">
      <div className="p-6 border-b sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-bold">Itinerary</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Plan your daily activities
        </p>
      </div>
      
      <div className="p-6">
        <Accordion type="multiple" className="w-full">
          {sortedDates.map((dateKey) => (
            <DayCard
              key={dateKey}
              dateKey={dateKey}
              activities={trip.days[dateKey]?.activities || []}
              tripId={trip.id}
              existingReview={trip.days[dateKey]?.dayReview}
              existingCity={trip.days[dateKey]?.city}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export const ItineraryPanel = memo(ItineraryPanelComponent);
