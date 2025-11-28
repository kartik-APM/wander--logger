# Guest Mode Feature 🚀

## Overview

Wander Logger now supports **guest mode**, allowing users to plan trips without signing in. Guest trips are stored locally in the browser's localStorage and can be upgraded to cloud storage when the user signs in.

## Features

### ✨ What Works in Guest Mode

- ✅ Create unlimited trips
- ✅ Add/edit/delete activities
- ✅ Full itinerary planning with day-by-day organization
- ✅ View trips on Google Maps
- ✅ All UI features work identically to authenticated mode

### 🔒 What Requires Sign-In

- ☁️ Cloud backup (auto-saves after sign-in)
- 👥 Sharing and collaboration
- 📱 Cross-device sync
- 🔄 Real-time updates with collaborators

## User Experience Flow

### 1. Landing on Dashboard (Not Signed In)
```
User sees:
- Blue banner: "You're planning as a guest - Sign in to save to cloud"
- "New Trip" button works without sign-in
- Any existing guest trips are displayed
```

### 2. Creating a Trip as Guest
```
1. Click "New Trip"
2. Fill in trip details (title, dates)
3. Click "Create Trip"
4. Trip is saved to localStorage with prefix "guest_"
5. User is redirected to trip page
```

### 3. Planning Activities
```
- Add/edit/delete activities works offline
- Changes are instantly saved to localStorage
- Map displays all activities with routes
- Banner reminds user to sign in for cloud save
```

### 4. Sign-In Prompt
```
User clicks "Sign In" button:
- Modal explains benefits (cloud save, collaboration, sync)
- Google OAuth login
- After successful login:
  → Guest trips remain in localStorage
  → User can manually migrate by creating new trips
  → Banner disappears
```

## Technical Implementation

### File Structure

```
src/
├── lib/
│   └── localStorage.ts           # LocalStorage management
├── hooks/
│   └── useGuestTrips.ts          # Guest trip CRUD operations
├── components/
│   ├── auth/
│   │   └── SignInPrompt.tsx      # Sign-in modal
│   └── layout/
│       └── GuestBanner.tsx       # Guest mode banner
└── pages/
    ├── DashboardPage.tsx         # Shows guest/Firebase trips
    └── TripPage.tsx              # Renders guest/Firebase trips
```

### Data Flow

#### Guest Trips
```
Browser → localStorage
  ├─ Key: "wander_logger_guest_trips"
  ├─ Format: JSON array of Trip objects
  └─ ID prefix: "guest_" (e.g., "guest_1732800000000")
```

#### Trip ID Detection
```typescript
const isGuestTrip = tripId.startsWith('guest_');
```

### Key Components

#### 1. Local Storage Service (`src/lib/localStorage.ts`)
```typescript
- getGuestTrips(): Trip[]
- saveGuestTrip(trip: Trip): void
- getGuestTrip(tripId: string): Trip | null
- deleteGuestTrip(tripId: string): void
- clearGuestTrips(): void
```

#### 2. Guest Trips Hook (`src/hooks/useGuestTrips.ts`)
```typescript
- createTrip(data: TripFormData): Trip
- getTrip(tripId: string): Trip | null
- addActivity(tripId, dateKey, data): void
- updateActivity(...): void
- deleteActivity(...): void
```

#### 3. Guest Banner Component
- Displays when user is not signed in
- Shows "Sign In" button
- Can be dismissed
- Opens SignInPrompt modal

#### 4. Sign-In Prompt Modal
- Explains benefits of signing in
- Shows features: Cloud Save, Collaborate, Secure
- One-click Google sign-in
- Note about data migration

## User Benefits

### For Guests
- 🚀 **Instant start** - No account needed to try the app
- 💾 **Privacy** - Data stays on your device
- 📱 **Works offline** - No internet required after initial load
- 🎯 **Full features** - Complete itinerary planning

### For Signed-In Users
- ☁️ **Cloud backup** - Never lose your plans
- 🔄 **Auto-sync** - Access from any device  
- 👥 **Collaboration** - Share with friends
- 🔒 **Secure** - Firebase authentication

## Migration Path

### Current Implementation
- Guest trips stay in localStorage after sign-in
- Users can reference them while creating new cloud trips
- Manual migration (copy trip details to new trip)

### Future Enhancement (Optional)
- Auto-migrate guest trips to Firebase on first sign-in
- Prompt: "We found X guest trips. Save them to cloud?"
- One-click migration with progress indicator

## Testing Guest Mode

### Test Scenario 1: Create Guest Trip
```
1. Open app without signing in
2. Click "New Trip"
3. Create trip: "Paris Adventure"
4. Add activities
5. Verify localStorage contains trip
6. Refresh page - trip should still be there
```

### Test Scenario 2: Sign In with Guest Trips
```
1. Create 2-3 guest trips
2. Click "Sign In" in banner
3. Complete Google OAuth
4. Verify:
   - Banner disappears
   - Guest trips still visible
   - Can create new Firebase trips
```

### Test Scenario 3: Mixed Trips
```
1. Create guest trip
2. Sign in
3. Create Firebase trip
4. Verify both trips show on dashboard
5. Edit both - guest uses localStorage, Firebase uses Firestore
```

## Browser Storage Limits

- **localStorage limit**: ~5-10MB (varies by browser)
- **Estimated capacity**: ~100-200 trips with activities
- **Recommendation**: Prompt sign-in after 10 guest trips

## Privacy & Data

- ✅ Guest data never leaves the browser
- ✅ No tracking without sign-in
- ✅ localStorage can be cleared anytime
- ✅ No cookies for guest users

## Future Enhancements

1. **Auto-migration** - Sync guest trips to Firebase on sign-in
2. **Export/Import** - Download guest trips as JSON
3. **Storage warning** - Alert when localStorage is 80% full
4. **Trip templates** - Pre-filled sample trips for guests
5. **Offline mode** - Service worker for full offline support

---

**Implemented**: Nov 28, 2025
**Status**: ✅ Ready for Production
