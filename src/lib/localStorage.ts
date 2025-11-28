import { Trip } from '@/types/trip';

const GUEST_TRIPS_KEY = 'wander_logger_guest_trips';
const GUEST_MODE_KEY = 'wander_logger_guest_mode';

export const localStorageService = {
  // Get all guest trips
  getGuestTrips(): Trip[] {
    try {
      const trips = localStorage.getItem(GUEST_TRIPS_KEY);
      return trips ? JSON.parse(trips) : [];
    } catch (error) {
      console.error('Error reading guest trips:', error);
      return [];
    }
  },

  // Save guest trip
  saveGuestTrip(trip: Trip): void {
    try {
      const trips = this.getGuestTrips();
      const existingIndex = trips.findIndex(t => t.id === trip.id);
      
      if (existingIndex >= 0) {
        trips[existingIndex] = trip;
      } else {
        trips.push(trip);
      }
      
      localStorage.setItem(GUEST_TRIPS_KEY, JSON.stringify(trips));
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('guestTripUpdated', { detail: { tripId: trip.id } }));
    } catch (error) {
      console.error('Error saving guest trip:', error);
    }
  },

  // Get single guest trip
  getGuestTrip(tripId: string): Trip | null {
    const trips = this.getGuestTrips();
    return trips.find(t => t.id === tripId) || null;
  },

  // Delete guest trip
  deleteGuestTrip(tripId: string): void {
    try {
      const trips = this.getGuestTrips();
      const filtered = trips.filter(t => t.id !== tripId);
      localStorage.setItem(GUEST_TRIPS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting guest trip:', error);
    }
  },

  // Clear all guest trips (after migration to Firebase)
  clearGuestTrips(): void {
    localStorage.removeItem(GUEST_TRIPS_KEY);
  },

  // Check if user has guest trips
  hasGuestTrips(): boolean {
    return this.getGuestTrips().length > 0;
  },

  // Set guest mode flag
  setGuestMode(isGuest: boolean): void {
    localStorage.setItem(GUEST_MODE_KEY, JSON.stringify(isGuest));
  },

  // Check if in guest mode
  isGuestMode(): boolean {
    try {
      const mode = localStorage.getItem(GUEST_MODE_KEY);
      return mode ? JSON.parse(mode) : false;
    } catch {
      return false;
    }
  },
};
