import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';
import { Trip, TripFormData, Invitation } from '../types/trip';
import { User } from '../types/user';
import { Activity, ActivityFormData } from '../types/itinerary';
import { eachDayOfInterval, format } from 'date-fns';

// ============================================
// USER OPERATIONS
// ============================================

export const createUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<User>
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// TRIP OPERATIONS
// ============================================

const generateDaysMap = (startDate: string, endDate: string) => {
  const days: Record<string, { activities: Activity[] }> = {};
  const dateRange = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  dateRange.forEach((date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    days[dateKey] = { activities: [] };
  });

  return days;
};

export const createTrip = async (
  userId: string,
  tripData: TripFormData
): Promise<string> => {
  const tripRef = doc(collection(db, 'trips'));
  const days = generateDaysMap(tripData.startDate, tripData.endDate);

  const trip: Omit<Trip, 'id'> = {
    ownerId: userId,
    title: tripData.title,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    participants: [userId],
    invitedEmails: [],
    days,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(tripRef, trip);
  return tripRef.id;
};

export const getTrip = async (tripId: string): Promise<Trip | null> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (tripDoc.exists()) {
    return { id: tripDoc.id, ...tripDoc.data() } as Trip;
  }
  return null;
};

export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  const tripsRef = collection(db, 'trips');
  const q = query(tripsRef, where('participants', 'array-contains', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Trip)
  );
};

export const updateTrip = async (
  tripId: string,
  data: Partial<Trip>
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  await deleteDoc(tripRef);
};

export const subscribeToTrip = (
  tripId: string,
  callback: (trip: Trip | null) => void
) => {
  const tripRef = doc(db, 'trips', tripId);
  return onSnapshot(tripRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Trip);
    } else {
      callback(null);
    }
  });
};

// ============================================
// ACTIVITY OPERATIONS
// ============================================

export const addActivity = async (
  tripId: string,
  dateKey: string,
  userId: string,
  activityData: ActivityFormData
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newActivity: Activity = {
    id: activityId,
    ...activityData,
    createdBy: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      activities: [...(trip.days[dateKey]?.activities || []), newActivity],
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const updateActivity = async (
  tripId: string,
  dateKey: string,
  activityId: string,
  activityData: Partial<ActivityFormData>
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const dayActivities = trip.days[dateKey]?.activities || [];
  const activityIndex = dayActivities.findIndex((a) => a.id === activityId);

  if (activityIndex === -1) {
    throw new Error('Activity not found');
  }

  const updatedActivities = [...dayActivities];
  updatedActivities[activityIndex] = {
    ...updatedActivities[activityIndex],
    ...activityData,
    updatedAt: Timestamp.now(),
  };

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      activities: updatedActivities,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const deleteActivity = async (
  tripId: string,
  dateKey: string,
  activityId: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const dayActivities = trip.days[dateKey]?.activities || [];
  const filteredActivities = dayActivities.filter((a) => a.id !== activityId);

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      activities: filteredActivities,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// INVITATION OPERATIONS
// ============================================

export const createInvitation = async (
  tripId: string,
  invitedEmail: string,
  invitedBy: string
): Promise<string> => {
  const invitationRef = doc(collection(db, 'invitations'));
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const invitation: Omit<Invitation, 'id'> = {
    tripId,
    invitedEmail,
    invitedBy,
    status: 'pending',
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
  };

  await setDoc(invitationRef, invitation);

  // Add email to trip's invitedEmails array
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, {
    invitedEmails: arrayUnion(invitedEmail),
    updatedAt: serverTimestamp(),
  });

  return invitationRef.id;
};

export const getInvitation = async (
  invitationId: string
): Promise<Invitation | null> => {
  const invitationRef = doc(db, 'invitations', invitationId);
  const invitationDoc = await getDoc(invitationRef);

  if (invitationDoc.exists()) {
    return { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;
  }
  return null;
};

export const acceptInvitation = async (
  invitationId: string,
  userId: string
): Promise<void> => {
  const invitation = await getInvitation(invitationId);

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  // Update invitation status
  const invitationRef = doc(db, 'invitations', invitationId);
  await updateDoc(invitationRef, {
    status: 'accepted',
  });

  // Add user to trip participants
  const tripRef = doc(db, 'trips', invitation.tripId);
  await updateDoc(tripRef, {
    participants: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

export const declineInvitation = async (
  invitationId: string
): Promise<void> => {
  const invitationRef = doc(db, 'invitations', invitationId);
  await updateDoc(invitationRef, {
    status: 'declined',
  });
};

export const getUserInvitations = async (
  userEmail: string
): Promise<Invitation[]> => {
  const invitationsRef = collection(db, 'invitations');
  const q = query(
    invitationsRef,
    where('invitedEmail', '==', userEmail),
    where('status', '==', 'pending')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Invitation)
  );
};
