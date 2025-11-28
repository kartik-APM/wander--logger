import { Trip } from '@/types/trip';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DayCard } from './DayCard';
import { eachDayOfInterval, format } from 'date-fns';

interface ItineraryPanelProps {
  trip: Trip;
}

export const ItineraryPanel: React.FC<ItineraryPanelProps> = ({ trip }) => {
  const dateRange = eachDayOfInterval({
    start: new Date(trip.startDate),
    end: new Date(trip.endDate),
  });

  const sortedDates = dateRange.map((date) => format(date, 'yyyy-MM-dd'));

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Itinerary</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Plan your daily activities
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Accordion type="multiple" className="w-full">
            {sortedDates.map((dateKey) => (
              <DayCard
                key={dateKey}
                dateKey={dateKey}
                activities={trip.days[dateKey]?.activities || []}
                tripId={trip.id}
              />
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};
