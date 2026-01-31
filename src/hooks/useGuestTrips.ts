import { useState, useEffect } from 'react';
import { Trip, TripFormData } from '@/types/trip';
import { ActivityFormData, DayReview } from '@/types/itinerary';
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

    const currentActivity = trip.days[dateKey].activities[activityIndex];
    const updatedActivity = { ...currentActivity };
    
    // Update or remove fields based on whether they're undefined
    Object.keys(activityData).forEach((key) => {
      const value = activityData[key as keyof ActivityFormData];
      if (value !== undefined) {
        (updatedActivity as any)[key] = value;
      } else {
        // Remove the field if it's explicitly set to undefined
        delete (updatedActivity as any)[key];
      }
    });
    
    trip.days[dateKey].activities[activityIndex] = updatedActivity;
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

  const addDayReview = (tripId: string, dateKey: string, rating: number, review?: string): void => {
    const trip = getTrip(tripId);
    if (!trip) return;

    const dayReview: DayReview = {
      rating,
      review,
      reviewedBy: 'guest',
      reviewedAt: Timestamp.now(),
    };

    if (!trip.days[dateKey]) {
      trip.days[dateKey] = { activities: [] };
    }

    trip.days[dateKey].dayReview = dayReview;
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  const updateDayReview = (tripId: string, dateKey: string, rating: number, review?: string): void => {
    const trip = getTrip(tripId);
    if (!trip || !trip.days[dateKey]?.dayReview) return;

    const updatedReview: DayReview = {
      ...trip.days[dateKey].dayReview!,
      rating,
      review,
      reviewedAt: Timestamp.now(),
    };

    trip.days[dateKey].dayReview = updatedReview;
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  const deleteDayReview = (tripId: string, dateKey: string): void => {
    const trip = getTrip(tripId);
    if (!trip || !trip.days[dateKey]?.dayReview) return;

    delete trip.days[dateKey].dayReview;
    trip.updatedAt = Timestamp.now();

    localStorageService.saveGuestTrip(trip);
    setTrips(localStorageService.getGuestTrips());
  };

  const updateDayCity = (tripId: string, dateKey: string, city: string): void => {
    const trip = getTrip(tripId);
    if (!trip) return;

    if (!trip.days[dateKey]) {
      trip.days[dateKey] = { activities: [] };
    }

    trip.days[dateKey].city = city;
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
    addDayReview,
    updateDayReview,
    deleteDayReview,
    updateDayCity,
  };
};
