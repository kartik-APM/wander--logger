import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Available color gradients
const TRIP_COLORS = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
  'from-yellow-500 to-yellow-600',
  'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-violet-600'
];

// Color queue management
let colorQueue: string[] = [];
let usedColorsInCurrentCycle: Set<string> = new Set();

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a consistent random color based on trip ID
export const generateTripColor = (tripId: string): string => {
  // Simple hash function to get consistent index
  let hash = 0;
  for (let i = 0; i < tripId.length; i++) {
    const char = tripId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return TRIP_COLORS[Math.abs(hash) % TRIP_COLORS.length];
};

// Generate a truly random color that changes on each refresh
// Ensures no colors repeat until all have been used
export const getRandomTripColor = (): string => {
  // If queue is empty or all colors have been used, create a new shuffled queue
  if (colorQueue.length === 0 || usedColorsInCurrentCycle.size === TRIP_COLORS.length) {
    colorQueue = shuffleArray(TRIP_COLORS);
    usedColorsInCurrentCycle.clear();
  }
  
  // Get the next color from the queue
  const nextColor = colorQueue.pop()!;
  usedColorsInCurrentCycle.add(nextColor);
  
  return nextColor;
};

// Generate color based on current date (changes daily at 2 PM) and tripId
export const getDailyTripColor = (tripId: string): string => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // If it's before 2 PM, use yesterday's date for color calculation
  const colorDate = new Date(now);
  if (currentHour < 14) {
    colorDate.setDate(colorDate.getDate() - 1);
  }
  
  // Create a date string for consistent hashing (YYYY-MM-DD format)
  const dateString = colorDate.toISOString().split('T')[0];
  
  // Combine date and tripId for unique daily colors per trip
  const hashString = `${dateString}-${tripId}`;
  
  // Simple hash function based on date + tripId
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return TRIP_COLORS[Math.abs(hash) % TRIP_COLORS.length];
};
