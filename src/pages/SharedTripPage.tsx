import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { Calendar, MapPin, Clock, FileDown, Globe } from 'lucide-react';
import { getSharedTrip } from '@/lib/firestore';
import { Trip } from '@/types/trip';
import { Activity } from '@/types/itinerary';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const SharedTripPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!shareToken) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const sharedTrip = await getSharedTrip(shareToken);
        if (sharedTrip) {
          setTrip(sharedTrip);
        } else {
          setError('This itinerary is no longer available or the link has expired');
        }
      } catch (err) {
        console.error('Error fetching shared trip:', err);
        setError('Failed to load itinerary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [shareToken]);

  const sortedDates = useMemo(() => {
    if (!trip) return [];
    const dateRange = eachDayOfInterval({
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
    });
    return dateRange.map((date) => format(date, 'yyyy-MM-dd'));
  }, [trip]);

  // Initialize expanded days when sortedDates changes
  useEffect(() => {
    if (sortedDates.length > 0 && expandedDays.length === 0) {
      setExpandedDays(sortedDates);
    }
  }, [sortedDates]);

  const handleDownloadPdf = async () => {
    if (!trip || !printRef.current) return;
    
    setIsGeneratingPdf(true);
    
    // Expand all accordions first
    setExpandedDays(sortedDates);
    
    // Wait for DOM to update with expanded content
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Dynamic import of html2canvas and jspdf
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;
      
      const element = printRef.current;
      
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      // Calculate how many pages we need
      const scaledHeight = imgHeight * ratio;
      const pageHeight = pdfHeight - 20; // Leave some margin
      const totalPages = Math.ceil(scaledHeight / pageHeight);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        const srcY = page * (pageHeight / ratio);
        const srcHeight = Math.min(pageHeight / ratio, imgHeight - srcY);
        
        // Create a temporary canvas for this page section
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = srcHeight;
        const ctx = pageCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, srcY, imgWidth, srcHeight,
            0, 0, imgWidth, srcHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(
            pageImgData,
            'PNG',
            imgX,
            10,
            imgWidth * ratio,
            srcHeight * ratio
          );
        }
      }
      
      // Download the PDF
      const fileName = `${trip.title.replace(/[^a-z0-9]/gi, '_')}_itinerary.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Itinerary Not Found</h1>
          <p className="text-gray-600">{error || 'This itinerary is no longer available'}</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
            <Globe className="h-4 w-4" />
            <span>Shared Itinerary</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')} ({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              variant="secondary"
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 gap-2"
            >
              <FileDown className="h-4 w-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8" ref={printRef}>
        {/* Print header (hidden on screen, shown in PDF) */}
        <div className="hidden print:block mb-8">
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <p className="text-gray-600">
            {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
          </p>
        </div>

        <Accordion type="multiple" value={expandedDays} onValueChange={setExpandedDays} className="w-full space-y-3">
          {sortedDates.map((dateKey) => {
            const date = new Date(dateKey);
            const dayOfWeek = format(date, 'EEEE');
            const formattedDate = format(date, 'MMMM d, yyyy');
            const dayData = trip.days[dateKey];
            const activities = dayData?.activities || [];
            const dayCity = dayData?.city;

            return (
              <AccordionItem
                key={dateKey}
                value={dateKey}
                className="border rounded-lg bg-white overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold">{dayOfWeek}</h3>
                      {dayCity && (
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                          {dayCity}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 border-t">
                  {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No activities planned</p>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity: Activity) => (
                        <SharedActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Notes Section */}
        {trip.notes && trip.notes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Notes & Links</h2>
            <div className="space-y-3">
              {trip.notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{note.title}</h4>
                    {note.link && (
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {note.link}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6 mt-8">
        <div className="container mx-auto max-w-4xl px-4 text-center text-sm text-gray-600">
          <p>Shared via Wander Logger</p>
        </div>
      </footer>
    </div>
  );
};

// Read-only activity card for shared view
const SharedActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{activity.title}</h4>
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
            {activity.time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{activity.time}</span>
              </div>
            )}
            {activity.allDay && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                All Day
              </span>
            )}
            {activity.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{activity.city}</span>
              </div>
            )}
          </div>

          {activity.description && (
            <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
          )}

          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {activity.mapLink && (
            <a
              href={activity.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" />
              View on Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
