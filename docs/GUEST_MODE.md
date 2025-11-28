# Guest Mode

## Overview

Guest mode allows users to plan trips without signing in. Trips are stored in browser localStorage.

## Features

**Works in Guest Mode:**
- Create/edit/delete trips and activities
- Day-by-day planning
- Map view

**Requires Sign-In:**
- Cloud backup
- Sharing/collaboration  
- Cross-device sync

## How It Works

1. Guest trips use ID prefix: `guest_`
2. Stored in localStorage: `wander_logger_guest_trips`
3. Banner prompts sign-in for cloud features
4. After sign-in, guest trips remain accessible

## Technical Details

**Files:**
- `src/lib/localStorage.ts` - Storage operations
- `src/hooks/useGuestTrips.ts` - CRUD hooks
- `src/components/layout/GuestBanner.tsx` - Banner component

**Trip Detection:**
```typescript
const isGuestTrip = tripId.startsWith('guest_');
```

## Storage

- **localStorage limit**: ~5-10MB
- **Capacity**: ~100-200 trips
- Data stays on device (privacy-friendly)

## Migration

Currently manual - guest trips remain in localStorage after sign-in. Users can reference them when creating cloud trips.
