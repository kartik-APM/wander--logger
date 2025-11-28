# Firebase Setup Guide

Complete guide to configure Firebase for your Wander Logger app.

---

## 📋 Prerequisites

- Firebase project created: `wander--logger`
- Firebase CLI installed and logged in
- App deployed to Firebase Hosting

---

## 🔐 1. Enable Google Authentication

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **wander--logger**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** (if first time) or go to **Sign-in method** tab
5. Click on **Google** provider
6. Toggle **Enable**
7. Select a **Project support email** from the dropdown
8. Click **Save**

✅ **Done!** Users can now sign in with Google.

---

## 🗄️ 2. Enable Firestore Database

### Steps:

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules next)
4. Select your preferred **Cloud Firestore location** (closest to your users)
   - Recommended for India: `asia-south1`
   - Recommended for US: `us-central1`
5. Click **Enable**

⚠️ **Important:** Location cannot be changed later!

---

## 🛡️ 3. Set Up Firestore Security Rules

### Why Security Rules?

These rules protect your data by ensuring:
- Users can only access their own data
- Trip owners control their trips
- Participants can view shared trips

### Apply These Rules:

1. In Firebase Console, go to **Firestore Database**
2. Click the **Rules** tab
3. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for displaying participant info)
      allow read: if isSignedIn();
      
      // Users can only create and update their own profile
      allow create, update: if isOwner(userId);
      
      // Users cannot delete their profile
      allow delete: if false;
    }
    
    // Trips collection
    match /trips/{tripId} {
      // Read: Only participants can read the trip
      allow read: if isSignedIn() && 
                     request.auth.uid in resource.data.participants;
      
      // Create: Any authenticated user can create a trip
      allow create: if isSignedIn() &&
                       request.auth.uid == request.resource.data.ownerId &&
                       request.auth.uid in request.resource.data.participants;
      
      // Update: Only trip owner can update
      // OR participants can update if they're already in the participants list
      allow update: if isSignedIn() && (
        request.auth.uid == resource.data.ownerId ||
        (request.auth.uid in resource.data.participants &&
         request.auth.uid in request.resource.data.participants)
      );
      
      // Delete: Only trip owner can delete
      allow delete: if isSignedIn() && 
                       request.auth.uid == resource.data.ownerId;
    }
    
    // Invitations collection
    match /invitations/{invitationId} {
      // Read: User can read if they sent it or it's for their email
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.invitedBy ||
        request.auth.token.email == resource.data.invitedEmail
      );
      
      // Create: Any authenticated user can create invitations
      allow create: if isSignedIn() &&
                       request.auth.uid == request.resource.data.invitedBy;
      
      // Update: User can update if it's their invitation or they were invited
      allow update: if isSignedIn() && (
        request.auth.uid == resource.data.invitedBy ||
        request.auth.token.email == resource.data.invitedEmail
      );
      
      // Delete: Only the person who sent it can delete
      allow delete: if isSignedIn() &&
                       request.auth.uid == resource.data.invitedBy;
    }
  }
}
```

4. Click **Publish**

✅ **Done!** Your database is now secure.

---

## 🧪 4. Test Your Security Rules

### Test in Firebase Console:

1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules Playground** (if available)
3. Test different scenarios:
   - Authenticated user reading their own trip ✅
   - Authenticated user reading someone else's trip ❌
   - Unauthenticated user reading any trip ❌

### Test in Your App:

1. Visit your deployed app: https://wander--logger.web.app
2. Try these scenarios:
   - Sign in with Google ✅
   - Create a trip ✅
   - View your trips ✅
   - Sign out and try to access (should fail) ❌

---

## 🌐 5. Add Authorized Domains

Ensure your deployment domain is authorized:

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Verify these are listed:
   - `localhost` (for development) ✅
   - `wander--logger.web.app` (auto-added) ✅
   - `wander--logger.firebaseapp.com` (auto-added) ✅

If you add a custom domain later, add it here too.

---

## 📊 6. Optional: Set Up Analytics

Firebase Analytics is already configured in your code. To view data:

1. Go to **Analytics** in Firebase Console
2. Click **Dashboard**
3. View user engagement, page views, etc.

Analytics data appears after your app has some usage.

---

## 🔄 7. Database Indexes (If Needed)

If you get errors about missing indexes when querying:

1. Go to **Firestore Database** → **Indexes** tab
2. Firebase will show a link to create required indexes in error messages
3. Click the link to auto-create the index

Common indexes for this app:
- `invitations`: `invitedEmail` + `status` (ascending)
- `trips`: `participants` (array) + `updatedAt` (descending)

---

## 🚨 Common Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Cause:** Security rules preventing access
**Solution:** 
1. Check Firestore Rules are published
2. Ensure user is signed in
3. Verify user is in trip's participants array

### Issue: "PERMISSION_DENIED"
**Cause:** User trying to access data they don't own
**Solution:** This is working as intended - security rules are protecting the data

### Issue: Google Sign-In not working
**Cause:** Google provider not enabled
**Solution:** Enable Google provider in Authentication settings

### Issue: Can't create trips
**Cause:** Firestore database not created
**Solution:** Follow step 2 to create Firestore database

---

## 📱 8. Production Checklist

Before launching to real users:

- [ ] Google Authentication enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Rules tested in playground
- [ ] App tested with real sign-in
- [ ] Authorized domains configured
- [ ] Analytics configured (optional)
- [ ] Create test trips as different users
- [ ] Test sharing/collaboration features
- [ ] Test on mobile devices

---

## 🔐 Security Best Practices

### ✅ Do:
- Keep security rules restrictive
- Validate data on the client AND server
- Use authenticated user IDs from `request.auth.uid`
- Test rules thoroughly before production
- Monitor Firestore usage in Console

### ❌ Don't:
- Allow public read/write access
- Trust client-side data validation alone
- Store sensitive data in Firestore without encryption
- Share service account keys in your repository
- Ignore security rule warnings

---

## 📖 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [Test Firestore Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

---

## 🎉 You're All Set!

Your Firebase backend is now fully configured and secure. Users can:

✅ Sign in with Google
✅ Create and manage trips
✅ Share trips with others
✅ View trips on a map
✅ Access from any device

**Live App:** https://wander--logger.web.app

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs) or review the security rules above.
