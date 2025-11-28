# Changelog

All notable changes to the Wander Logger project.

---

## [Recent Updates] - Nov 28, 2025

### 📚 Documentation Reorganization
- **Moved all `.md` files to `/docs` folder** for better project structure
- Created `/docs/README.md` as documentation index
- Updated main `README.md` with references to docs folder

### 🔐 Authentication System Refactor
- Replaced Zustand-based auth with React Context (`AuthContext`)
- Created centralized auth helper functions in `/src/lib/auth.ts`
- Improved error handling and loading states
- Better provider detection (Google vs Email/Password)
- Removed deprecated `/src/hooks/useAuth.ts` hook

### 🐛 Bug Fixes

#### Activity Form Issues
- **Fixed NaN bug** in latitude/longitude fields
  - Changed from `valueAsNumber` to custom `setValueAs` function
  - Empty fields now properly return `undefined` instead of `NaN`
  
- **Fixed "All Day" checkbox issue**
  - Form now submits correctly when "All day activity" is checked
  - Time field properly clears when all-day is selected
  
- **Added data cleaning before submission**
  - Filters out undefined, empty strings, and NaN values
  - Better error messages for failed submissions

#### Authentication Fixes
- Fixed `ActivityFormDialog` using old auth store
- Updated all components to use new `AuthContext`
- Removed authentication state conflicts

### 🚀 Deployment Setup
- Added Firebase Hosting configuration (`firebase.json`, `.firebaserc`)
- Added deployment scripts to `package.json`:
  - `npm run deploy` - Build and deploy
  - `npm run deploy:preview` - Deploy to preview channel
- Installed `@types/google.maps` for TypeScript support

### 📦 Dependencies
- Added: `@types/google.maps` (dev dependency)
- No other dependency changes

### 🗂️ Project Structure Changes

```
New structure:
/docs
├── README.md                    # Documentation index
├── AUTH_REFACTOR_SUMMARY.md     # Auth architecture docs
├── DEPLOYMENT_GUIDE.md          # Complete deployment guide
├── FIREBASE_SETUP.md            # Firebase Console setup
├── GUEST_MODE.md                # Guest mode documentation
├── QUICK_DEPLOY.md              # Quick deploy reference
└── CHANGELOG.md                 # This file

Removed from root:
- AUTH_REFACTOR_SUMMARY.md (moved to docs/)
- GUEST_MODE.md (moved to docs/)
- DEPLOYMENT_GUIDE.md (moved to docs/)
- FIREBASE_SETUP.md (moved to docs/)
- QUICK_DEPLOY.md (moved to docs/)
```

### 🔧 Configuration Files
- `.firebaserc` - Firebase project configuration
- `firebase.json` - Hosting and caching rules
- Updated `.gitignore` - Removed `.firebaserc` from gitignore

---

## Live Application

**Production URL:** https://wander--logger.web.app

---

## Next Steps

### Required for Full Functionality:
1. ✅ Enable Google Sign-In in Firebase Console
2. ✅ Create Firestore Database
3. ✅ Apply Security Rules (see `/docs/FIREBASE_SETUP.md`)

### Optional Enhancements:
- [ ] Add email/password authentication UI
- [ ] Implement trip sharing via Firebase Functions
- [ ] Add offline support with service workers
- [ ] Optimize bundle size with code splitting
- [ ] Add unit and integration tests

---

## Migration Notes

If you were using the old authentication system:

```typescript
// Old (deprecated):
import { useAuth } from '@/hooks/useAuth';
const { user } = useAuth();

// New (current):
import { useAuth } from '@/contexts/AuthContext';
const { currentUser } = useAuth();
```

All components have been updated to use the new pattern.

---

## Breaking Changes

None. The refactor maintains backward compatibility with existing data structures.

---

## Performance Improvements

- Reduced bundle size by removing duplicate auth code
- Better TypeScript type checking with Google Maps types
- Optimized form validation and data cleaning

---

## Known Issues

None at this time. See GitHub Issues for feature requests and community-reported bugs.

---

**Last Updated:** Nov 28, 2025
