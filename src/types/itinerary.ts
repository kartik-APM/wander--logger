import { Timestamp } from 'firebase/firestore';

export interface Activity {
  id: string;
  title: string;
  time?: string;
  description?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DayActivities {
  activities: Activity[];
}

export interface DaysMap {
  [dateString: string]: DayActivities;
}

export interface ActivityFormData {
  title: string;
  time?: string;
  description?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}
