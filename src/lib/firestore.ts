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
import { Trip, TripFormData, Invitation, Note } from '../types/trip';
import { User } from '../types/user';
import { Activity, ActivityFormData, DayReview } from '../types/itinerary';
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

export const getUsersByIds = async (uids: string[]): Promise<User[]> => {
  if (uids.length === 0) {
    return [];
  }

  const users = await Promise.all(
    uids.map(async (uid) => {
      const user = await getUserProfile(uid);
      return user;
    })
  );

  return users.filter((user): user is User => user !== null);
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
      ...trip.days[dateKey],
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
  const currentActivity = updatedActivities[activityIndex];
  
  // Build the updated activity, removing fields that are undefined
  const updatedActivity: Activity = {
    ...currentActivity,
    updatedAt: Timestamp.now(),
  };
  
  // Only update fields that are explicitly provided
  Object.keys(activityData).forEach((key) => {
    const value = activityData[key as keyof ActivityFormData];
    if (value !== undefined) {
      (updatedActivity as any)[key] = value;
    } else {
      // Remove the field if it's explicitly set to undefined
      delete (updatedActivity as any)[key];
    }
  });
  
  updatedActivities[activityIndex] = updatedActivity;

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
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
      ...trip.days[dateKey],
      activities: filteredActivities,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const reorderActivities = async (
  tripId: string,
  dateKey: string,
  reorderedActivities: Activity[]
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
      activities: reorderedActivities,
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
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

  const invitation: Omit<Invitation, 'id'> = {
    tripId,
    invitedEmail,
    invitedBy,
    status: 'pending',
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
  };

  await setDoc(invitationRef, invitation);

  // Only add email to trip's invitedEmails array if email is provided
  if (invitedEmail && invitedEmail.trim()) {
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      invitedEmails: arrayUnion(invitedEmail),
      updatedAt: serverTimestamp(),
    });
  }

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

// ============================================
// NOTE OPERATIONS
// ============================================

export const addNote = async (
  tripId: string,
  title: string,
  link: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newNote: Note = {
    id: noteId,
    title,
    link,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const updatedNotes = [...(trip.notes || []), newNote];

  await updateDoc(tripRef, {
    notes: updatedNotes,
    updatedAt: serverTimestamp(),
  });
};

export const updateNote = async (
  tripId: string,
  noteId: string,
  title: string,
  link: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const notes = trip.notes || [];
  const noteIndex = notes.findIndex((n) => n.id === noteId);

  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  const updatedNotes = [...notes];
  updatedNotes[noteIndex] = {
    ...updatedNotes[noteIndex],
    title,
    link,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(tripRef, {
    notes: updatedNotes,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNote = async (
  tripId: string,
  noteId: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const notes = trip.notes || [];
  const filteredNotes = notes.filter((n) => n.id !== noteId);

  await updateDoc(tripRef, {
    notes: filteredNotes,
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// DAY REVIEW OPERATIONS
// ============================================

export const addDayReview = async (
  tripId: string,
  dateKey: string,
  userId: string,
  rating: number,
  review?: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const dayReview: DayReview = {
    rating,
    review,
    reviewedBy: userId,
    reviewedAt: Timestamp.now(),
  };

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
      dayReview,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const updateDayReview = async (
  tripId: string,
  dateKey: string,
  rating: number,
  review?: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const existingReview = trip.days[dateKey]?.dayReview;

  if (!existingReview) {
    throw new Error('Day review not found');
  }

  const updatedReview: DayReview = {
    ...existingReview,
    rating,
    review,
    reviewedAt: Timestamp.now(),
  };

  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
      dayReview: updatedReview,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDayReview = async (
  tripId: string,
  dateKey: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
      dayReview: undefined,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};

export const updateDayCity = async (
  tripId: string,
  dateKey: string,
  city: string
): Promise<void> => {
  const tripRef = doc(db, 'trips', tripId);
  const tripDoc = await getDoc(tripRef);

  if (!tripDoc.exists()) {
    throw new Error('Trip not found');
  }

  const trip = tripDoc.data() as Trip;
  const updatedDays = {
    ...trip.days,
    [dateKey]: {
      ...trip.days[dateKey],
      city,
    },
  };

  await updateDoc(tripRef, {
    days: updatedDays,
    updatedAt: serverTimestamp(),
  });
};
