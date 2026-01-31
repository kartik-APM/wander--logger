# Wander Logger 🗺️

A collaborative trip planning application inspired by Wanderlog. Plan your perfect journey with friends, create detailed itineraries, and visualize your adventures on an interactive map.

![Tech Stack](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.8.0-orange)
![Vite](https://img.shields.io/badge/Vite-5.1.0-purple)

## 📸 Screenshots

### Dashboard
![Dashboard - My Trips](./docs/images/dashboard.png)
*View all your trips with participant avatars, dates, and duration*

### Trip Planning & Map
![Trip Page - Itinerary and Map](./docs/images/trip-page.png)
*Plan day-by-day activities with interactive map visualization showing routes and markers*

### Notes & Links
![Notes Panel](./docs/images/notes-panel.png)
*Save important links, restaurant recommendations, and travel resources*

## ✨ Features

### Core Trip Planning
- **📅 Trip Management** - Create and organize multiple trips with date ranges
- **🗓️ Day-by-Day Itinerary** - Plan activities for each day of your trip with expandable day cards
- **🏙️ City Tags** - Assign cities/locations to each day for better organization
- **📍 Location Integration** - Add locations with latitude/longitude coordinates
- **🕒 Time Scheduling** - Set specific times or all-day events for activities
- **🏷️ Activity Tags** - Organize activities with custom tags
- **📝 Rich Notes System** - Add notes with support for:
  - Google Maps links for places and restaurants
  - YouTube links for travel inspiration
  - External URLs and references
  - Edit and delete capabilities

### Visualization & Maps
- **🗺️ Interactive Maps** - Real-time visualization of your trip route
  - Activity markers showing all planned locations
  - Automatic route drawing between activities
  - Toggle between Map and Satellite views
  - Full-screen map mode
  - Integrated with Google Maps for accurate navigation

### Collaboration & Sharing
- **👥 Real-time Collaboration** - Invite friends and collaborate on trip planning
- **📧 Email Invitations** - Send trip invitations via "Invite Friends" button
- **⚡ Live Sync** - Real-time updates across all collaborators using Firestore
- **👤 Participant Avatars** - Visual display of trip participants with profile pictures
- **👥 Participant Management** - View all collaborators on trip cards and trip pages

### Dashboard & UI
- **🎨 Beautiful Trip Cards** - Visual trip cards featuring:
  - Trip title with location icon
  - Date ranges with calendar icon
  - Participant avatars
  - Duration summary (e.g., "5 days planned")
  - Modern card-based layout
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎯 Trip Banner** - Comprehensive trip header showing dates, duration, and participants

### Authentication & Access
- **🔐 Google Authentication** - Secure login with Firebase Auth
- **👻 Guest Mode** - Plan trips without signing in using local storage
- **🔄 Offline Support** - Guest trips work without internet connection

### System Features
- **📊 Day Reviews** - Rate and review each day of your trip
- **⚙️ Smart Configuration** - Environment validation with helpful setup prompts
- **🔄 Auto-save** - All changes saved automatically to Firestore

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **react-hook-form** - Form management
- **date-fns** - Date utilities
- **Lucide React** - Icon library

### Backend & Services
- **Firebase Authentication** - Google OAuth
- **Cloud Firestore** - Real-time database
- **Google Maps JavaScript API** - Maps and directions

## � Documentation

**Comprehensive guides available in the [`/docs`](./docs) folder:**

- 🚀 **[Quick Deploy Guide](./docs/QUICK_DEPLOY.md)** - Get your app live in 3 steps
- 🔥 **[Firebase Setup Guide](./docs/FIREBASE_SETUP.md)** - Complete Firebase configuration
- 📦 **[Full Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- 🔐 **[Auth System Documentation](./docs/AUTH_REFACTOR_SUMMARY.md)** - Authentication architecture
- 👥 **[Guest Mode Guide](./docs/GUEST_MODE.md)** - Local storage guest functionality

---

## � Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** - [Create one here](https://firebase.google.com/)
- **Google Cloud account** - For Maps API
- **Git** (optional)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd wander--logger
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Google** sign-in provider
4. Enable **Cloud Firestore**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location close to your users
5. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to register a web app
   - Copy the Firebase configuration

📖 **For detailed setup with security rules:** [docs/FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md)

### 4. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
4. Create credentials (API Key)
5. Restrict the API key to your domain (recommended for production)

### 5. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 6. Firestore Security Rules

**⚠️ Important:** You must configure Firestore security rules for the app to work properly.

📖 **Complete security rules:** [docs/FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md#%EF%B8%8F-3-set-up-firestore-security-rules)

The security rules ensure:
- Users can only access their own data
- Trip participants can view shared trips
- Only trip owners can modify/delete trips
- Proper authentication is enforced

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   └── ProtectedRoute.tsx
│   ├── itinerary/           # Itinerary management
│   │   ├── ActivityCard.tsx
│   │   ├── ActivityFormDialog.tsx
│   │   ├── DayCard.tsx
│   │   └── ItineraryPanel.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   └── TripBanner.tsx
│   ├── map/                 # Map components
│   │   └── MapView.tsx
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   └── useTripData.ts
├── lib/                     # Utilities and configs
│   ├── firebase.ts
│   ├── firestore.ts
│   └── utils.ts
├── pages/                   # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── TripPage.tsx
├── store/                   # Zustand stores
│   ├── tripStore.ts
│   └── userStore.ts
├── types/                   # TypeScript types
│   ├── itinerary.ts
│   ├── trip.ts
│   └── user.ts
├── App.tsx                  # Root component
├── main.tsx                # App entry point
└── index.css               # Global styles
```

## 🎯 Usage Guide

### Creating a Trip

1. **Sign in** with your Google account (or use Guest Mode)
2. Click the **"+ New Trip"** button on the dashboard
3. Enter trip details:
   - Trip title (e.g., "Vietnam, 2026" or "Pondicherry")
   - Start date
   - End date
4. Click **"Create Trip"**
5. Your new trip card will appear on the dashboard showing:
   - Trip name with location pin icon
   - Date range
   - Your profile avatar as the first participant
   - Number of days planned

### Planning Your Itinerary

1. **Open a trip** from your dashboard by clicking on the trip card
2. **View the trip banner** showing full trip details, dates, and participants
3. **Expand a day** by clicking on any day card in the itinerary panel
4. **Add city/location** to each day using the city tag feature
5. Click **"Add Activity"** to create activities:
   - Title (required) - e.g., "Hoan Kiem lake", "Flight to Hanoi"
   - Time (optional) - set specific times or mark as all-day
   - Description
   - Latitude/Longitude (for map display)
6. Click **"Add Activity"** to save

### Adding Trip Notes

1. Click the **"Notes"** button in the trip header
2. Click **"+ Add Note"** to create a new note
3. Add useful information like:
   - Restaurant recommendations (e.g., "The Pasta Bar Veneto", "Baker Street")
   - Google Maps links to places
   - YouTube videos for inspiration
   - Hotel information (e.g., "Villa Shanti Hotel Restaurant")
   - Any other useful URLs or text
4. Edit or delete notes using the icons next to each note

### Viewing on the Interactive Map

1. Activities with coordinates automatically appear as markers on the map
2. The route between activities is drawn automatically with blue lines
3. Toggle between **Map** and **Satellite** views
4. Click the fullscreen icon to expand the map
5. Map updates in real-time as you add or modify activities

### Inviting Collaborators

> **Note**: Invitation system requires Firebase Functions for email sending (optional feature)

1. Open a trip
2. Click the **"Invite Friends"** button in the trip header
3. Enter collaborator's email address
4. They'll receive an invitation link
5. Once accepted, they can:
   - View and edit the trip
   - Add activities and notes
   - See real-time updates
6. Collaborator avatars appear on the trip card and trip page

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## 🚢 Deployment

### Quick Deploy to Firebase Hosting

```bash
# One-time setup
npm install -g firebase-tools
firebase login

# Deploy (build + deploy)
npm run deploy
```

📖 **See [Quick Deploy Guide](./docs/QUICK_DEPLOY.md)** for step-by-step instructions.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Detailed Deployment Instructions

For complete deployment guides with troubleshooting:
- **Firebase Hosting:** [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)
- **Quick Reference:** [docs/QUICK_DEPLOY.md](./docs/QUICK_DEPLOY.md)

### Environment Variables

Remember to set environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Firebase: Environment variables are baked into the build from `.env`

## 🔒 Security Best Practices

1. **Never commit** `.env` files to version control
2. **Restrict** Firebase and Google Maps API keys to your domains
3. **Review** Firestore security rules regularly
4. **Enable** Firebase App Check for additional security
5. **Use HTTPS** in production

## 🐛 Troubleshooting

### Google Maps Not Loading

- Check if Maps JavaScript API is enabled
- Verify API key is correct in `.env`
- Check browser console for errors
- Ensure API key has no domain restrictions for localhost

### Firebase Authentication Errors

- Verify Google sign-in is enabled in Firebase Console
- Check Firebase config in `.env`
- Clear browser cache and cookies

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by **Kartik Kumar Panday**

## 📝 Copyright

© 2026 Kartik Kumar Panday. All rights reserved.

---

**Happy Travel Planning! ✈️🌍**
