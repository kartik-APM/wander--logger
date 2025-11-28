import { Timestamp } from 'firebase/firestore';
import { DaysMap } from './itinerary';

export interface Trip {
  id: string;
  ownerId: string;
  title: string;
  startDate: string;
  endDate: string;
  participants: string[];
  invitedEmails?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  days: DaysMap;
}

export interface TripFormData {
  title: string;
  startDate: string;
  endDate: string;
}

export interface Invitation {
  id: string;
  tripId: string;
  invitedEmail: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
  expiresAt: Timestamp;
}
