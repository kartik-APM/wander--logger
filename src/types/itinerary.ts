import { Timestamp } from 'firebase/firestore';

export interface Activity {
  id: string;
  title: string;
  allDay?: boolean;
  time?: string;
  description?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  mapLink?: string;
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
  allDay?: boolean;
  time?: string;
  description?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  mapLink?: string;
}
