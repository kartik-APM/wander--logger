# Firebase Setup Guide

## Prerequisites
- Firebase project created: `wander--logger`
- Firebase CLI installed: `npm install -g firebase-tools`

## 1. Enable Google Authentication

1. [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add support email

## 2. Enable Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select location (cannot change later):
   - India: `asia-south1`
   - US: `us-central1`

## 3. Deploy Firestore Security Rules

Rules are already in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

Or deploy everything:
```bash
firebase deploy
```

## 4. Verify Setup

1. Test sign-in: https://wander--logger.web.app
2. Create a trip
3. Authorized domains auto-configured (localhost, web.app, firebaseapp.com)

## Common Issues

| Issue | Solution |
|-------|----------|
| "Missing or insufficient permissions" | Deploy Firestore rules: `firebase deploy --only firestore:rules` |
| Google Sign-In not working | Enable Google provider in Firebase Console |
| Missing indexes | Click the index creation link in error message |

## Production Checklist

- [ ] Google Authentication enabled
- [ ] Firestore rules deployed  
- [ ] Test sign-in and trip creation
- [ ] Test on mobile devices

**Live App:** https://wander--logger.web.app
