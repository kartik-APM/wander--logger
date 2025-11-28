import { useState, useEffect } from 'react';
import { Trip, TripFormData } from '@/types/trip';
import { ActivityFormData } from '@/types/itinerary';
import { localStorageService } from '@/lib/localStorage';
import { Timestamp } from 'firebase/firestore';

export const useGuestTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTrips(localStorageService.getGuestTrips());
    setLoading(false);
  }, []);

  const createTrip = (tripData: TripFormData): Trip => {
    const tripId = `guest_${Date.now()}`;
    const newTrip: Trip = {
      id: tripId,
      title: tripData.title,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      ownerId: 'guest',
      participants: ['guest'],
      days: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    localStorageService.saveGuestTrip(newTrip);
    setTrips(localStorageService.getGuestTrips());
    return newTrip;
  };

  const getTrip = (tripId: string): Trip | null => {
    return localStorageService.getGuestTrip(tripId);
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>): void => {
    const trip = getTrip(tripId);
    if (trip) {
      const updatedTrip = { ...trip, ...updates, updatedAt: Timestamp.now() };
      localStorageService.saveGuestTrip(updatedTrip);
      setTrips(localStorageService.getGuestTrips());
    }
  };

  const deleteTrip = (tripId: string): void => {
    localStorageService.deleteGuestTrip(tripId);
    setTrips(localStorageService.getGuestTrips());
  };

  const addActivity = (tripId: string, dateKey: string, activityData: ActivityFormData): void => {
    const trip = getTrip(tripId);
    if (!trip) return;

    const activityId = `activity_${Date.now()}`;
    const newActivity = {
      id: activityId,
      ...activityData,
      createdBy: 'guest',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (!trip.days[dateKey]) {
      trip.days[dateKey] = { activities: [] };
    }

    trip.days[dateKey].activities.push(newActivity);
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  const updateActivity = (
    tripId: string,
    dateKey: string,
    activityId: string,
    activityData: Partial<ActivityFormData>
  ): void => {
    const trip = getTrip(tripId);
    if (!trip || !trip.days[dateKey]) return;

    const activityIndex = trip.days[dateKey].activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) return;

    trip.days[dateKey].activities[activityIndex] = {
      ...trip.days[dateKey].activities[activityIndex],
      ...activityData,
    };
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  const deleteActivity = (tripId: string, dateKey: string, activityId: string): void => {
    const trip = getTrip(tripId);
    if (!trip || !trip.days[dateKey]) return;

    trip.days[dateKey].activities = trip.days[dateKey].activities.filter(a => a.id !== activityId);
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  return {
    trips,
    loading,
    createTrip,
    getTrip,
    updateTrip,
    deleteTrip,
    addActivity,
    updateActivity,
    deleteActivity,
  };
};
