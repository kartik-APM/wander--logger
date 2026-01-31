import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrip,
  getUserTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity,
  subscribeToTrip,
  createInvitation,
  addDayReview,
  updateDayReview,
  deleteDayReview,
  updateDayCity,
} from '../lib/firestore';
import { Trip, TripFormData } from '../types/trip';
import { ActivityFormData } from '../types/itinerary';
import { useEffect } from 'react';
import { useTripStore } from '../store/tripStore';

export const useTrip = (tripId: string | undefined) => {
  const { setCurrentTrip } = useTripStore();

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = subscribeToTrip(tripId, (trip) => {
      setCurrentTrip(trip);
    });

    return () => unsubscribe();
  }, [tripId, setCurrentTrip]);

  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTrip(tripId!),
    enabled: !!tripId,
  });
};

export const useUserTrips = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['trips', userId],
    queryFn: () => getUserTrips(userId!),
    enabled: !!userId,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, tripData }: { userId: string; tripData: TripFormData }) =>
      createTrip(userId, tripData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips', variables.userId] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: Partial<Trip> }) =>
      updateTrip(tripId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
};

export const useAddActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      userId,
      activityData,
    }: {
      tripId: string;
      dateKey: string;
      userId: string;
      activityData: ActivityFormData;
    }) => addActivity(tripId, dateKey, userId, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      activityId,
      activityData,
    }: {
      tripId: string;
      dateKey: string;
      activityId: string;
      activityData: Partial<ActivityFormData>;
    }) => updateActivity(tripId, dateKey, activityId, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      activityId,
    }: {
      tripId: string;
      dateKey: string;
      activityId: string;
    }) => deleteActivity(tripId, dateKey, activityId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      invitedEmail,
      invitedBy,
    }: {
      tripId: string;
      invitedEmail: string;
      invitedBy: string;
    }) => createInvitation(tripId, invitedEmail, invitedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useAddDayReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      userId,
      rating,
      review,
    }: {
      tripId: string;
      dateKey: string;
      userId: string;
      rating: number;
      review?: string;
    }) => addDayReview(tripId, dateKey, userId, rating, review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useUpdateDayReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      rating,
      review,
    }: {
      tripId: string;
      dateKey: string;
      rating: number;
      review?: string;
    }) => updateDayReview(tripId, dateKey, rating, review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useDeleteDayReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
    }: {
      tripId: string;
      dateKey: string;
    }) => deleteDayReview(tripId, dateKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};

export const useUpdateDayCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      dateKey,
      city,
    }: {
      tripId: string;
      dateKey: string;
      city: string;
    }) => updateDayCity(tripId, dateKey, city),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.tripId] });
    },
  });
};
