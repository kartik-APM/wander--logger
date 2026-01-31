# Setup Guide

Complete guide for setting up the Wander Logger development environment.

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

## 📋 Prerequisites

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

📖 **For detailed setup with security rules:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

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

📖 **Complete security rules:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

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

---

© 2026 **Kartik Kumar Panday**. All rights reserved.
