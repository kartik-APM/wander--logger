import { create } from 'zustand';
import { Trip } from '../types/trip';
import { Activity } from '../types/itinerary';

interface TripStore {
  currentTrip: Trip | null;
  selectedDate: string | null;
  selectedActivity: Activity | null;
  setCurrentTrip: (trip: Trip | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedActivity: (activity: Activity | null) => void;
  clearTrip: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  currentTrip: null,
  selectedDate: null,
  selectedActivity: null,
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedActivity: (selectedActivity) => set({ selectedActivity }),
  clearTrip: () => set({ currentTrip: null, selectedDate: null, selectedActivity: null }),
}));
