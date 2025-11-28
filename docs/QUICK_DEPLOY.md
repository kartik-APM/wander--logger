# 🚀 Quick Deploy Guide

## First Time Setup (Run Once)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

That's it! Your Firebase config files are already set up.

---

## Deploy to Production

### Option 1: Using npm script (Recommended)
```bash
npm run deploy
```

### Option 2: Manual steps
```bash
npm run build
firebase deploy --only hosting
```

---

## Deploy to Preview (Testing)
```bash
npm run deploy:preview
```

Preview URLs are temporary and perfect for testing before going live.

---

## Your Live URLs

After deployment, your app will be available at:

- **Production:** `https://wander--logger.web.app`
- **Alternative:** `https://wander--logger.firebaseapp.com`

---

## Useful Commands

```bash
# Build only (no deploy)
npm run build

# Preview build locally
npm run preview

# Check Firebase projects
firebase projects:list

# View deployment logs
firebase deploy --only hosting --debug
```

---

## Troubleshooting

### "Command not found: firebase"
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Or use npx (no install needed)
npx firebase-tools deploy --only hosting
```

### "Not logged in"
```bash
firebase login
```

### Build errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## Files Already Configured ✅

- `firebase.json` - Hosting configuration
- `.firebaserc` - Project ID
- `package.json` - Deploy scripts
- `.env` - Environment variables (baked into build)

---

## Pre-Deployment Checklist

- [ ] Test app locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Firebase Console: Enable Google Sign-In
- [ ] Firebase Console: Set up Firestore rules

---

## 🎉 Ready to Deploy!

Just run:
```bash
npm run deploy
```

Your app will be live at `https://wander--logger.web.app` in about 1 minute!
