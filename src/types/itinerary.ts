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
  tags?: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DayReview {
  rating: number;
  review?: string;
  reviewedBy: string;
  reviewedAt: Timestamp;
}

export interface DayActivities {
  activities: Activity[];
  dayReview?: DayReview;
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
  tags?: string[];
}
