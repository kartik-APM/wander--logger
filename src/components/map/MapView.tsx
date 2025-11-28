import { useEffect, useRef, useState, memo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Activity } from '@/types/itinerary';
import { useTripStore } from '@/store/tripStore';

interface MapViewProps {
  activities: Activity[];
}

const MapViewComponent: React.FC<MapViewProps> = ({ activities }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { selectedActivity, setSelectedActivity } = useTripStore();

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry'],
        });

        await loader.load();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 20, lng: 0 },
            zoom: 2,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });

          googleMapRef.current = map;
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#4285F4',
              strokeWeight: 4,
            },
          });
          
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update markers and route when activities change
  useEffect(() => {
    if (!isLoaded || !googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const activitiesWithLocation = activities.filter(
      (activity) => activity.lat && activity.lng
    );

    if (activitiesWithLocation.length === 0) {
      // No activities with location, reset map view
      googleMapRef.current.setCenter({ lat: 20, lng: 0 });
      googleMapRef.current.setZoom(2);
      directionsRendererRef.current?.setDirections({ routes: [] } as any);
      return;
    }

    // Add markers for each activity
    const bounds = new google.maps.LatLngBounds();
    
    activitiesWithLocation.forEach((activity, index) => {
      const position = {
        lat: activity.lat!,
        lng: activity.lng!,
      };

      const marker = new google.maps.Marker({
        position,
        map: googleMapRef.current!,
        title: activity.title,
        label: {
          text: `${index + 1}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        setSelectedActivity(activity);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Fit map to show all markers
    if (activitiesWithLocation.length === 1) {
      googleMapRef.current.setCenter(bounds.getCenter());
      googleMapRef.current.setZoom(15);
    } else {
      googleMapRef.current.fitBounds(bounds);
    }

    // Draw route if there are multiple activities
    if (activitiesWithLocation.length > 1) {
      const directionsService = new google.maps.DirectionsService();
      
      const origin = {
        lat: activitiesWithLocation[0].lat!,
        lng: activitiesWithLocation[0].lng!,
      };
      
      const destination = {
        lat: activitiesWithLocation[activitiesWithLocation.length - 1].lat!,
        lng: activitiesWithLocation[activitiesWithLocation.length - 1].lng!,
      };

      const waypoints = activitiesWithLocation
        .slice(1, -1)
        .map((activity) => ({
          location: { lat: activity.lat!, lng: activity.lng! },
          stopover: true,
        }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRendererRef.current?.setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [activities, isLoaded, setSelectedActivity]);

  // Highlight selected activity marker
  useEffect(() => {
    if (!selectedActivity) return;

    markersRef.current.forEach((marker, index) => {
      const activity = activities.filter(a => a.lat && a.lng)[index];
      if (activity?.id === selectedActivity.id) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 2000);
      }
    });
  }, [selectedActivity, activities]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize component with custom comparison to prevent unnecessary re-renders
export const MapView = memo(MapViewComponent, (prevProps, nextProps) => {
  // Only re-render if activities with location actually changed
  const prevActivitiesWithLocation = prevProps.activities.filter(a => a.lat && a.lng);
  const nextActivitiesWithLocation = nextProps.activities.filter(a => a.lat && a.lng);
  
  if (prevActivitiesWithLocation.length !== nextActivitiesWithLocation.length) {
    return false; // Props changed, re-render
  }
  
  // Check if any activity IDs or positions changed
  for (let i = 0; i < prevActivitiesWithLocation.length; i++) {
    const prev = prevActivitiesWithLocation[i];
    const next = nextActivitiesWithLocation[i];
    
    if (prev.id !== next.id || prev.lat !== next.lat || prev.lng !== next.lng) {
      return false; // Props changed, re-render
    }
  }
  
  return true; // Props same, skip re-render
});
