# Firebase Hosting Deployment Guide

## 🚀 Deploy Wander Logger to Firebase Hosting

### Prerequisites
- Node.js and npm installed
- Firebase project created (`wander--logger`)
- Google account access

---

## Step 1: Install Firebase CLI

Open your **terminal** in this project directory and run:

```bash
npm install -g firebase-tools
```

This installs the Firebase CLI globally on your computer.

---

## Step 2: Login to Firebase

```bash
firebase login
```

- This will open your browser
- Sign in with your Google account (the one you used for Firebase Console)
- Authorize Firebase CLI

---

## Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted, answer as follows:

### Question 1: "Please select an option"
```
? Please select an option: (Use arrow keys)
❯ Use an existing project
  Create a new project
  Add Firebase to an existing Google Cloud Platform project
```
**Answer:** Select **"Use an existing project"**

### Question 2: "Select a default Firebase project"
```
? Select a default Firebase project for this directory:
❯ wander--logger (wander--logger)
```
**Answer:** Select **"wander--logger"**

### Question 3: "What do you want to use as your public directory?"
```
? What do you want to use as your public directory? (public)
```
**Answer:** Type **`dist`** (this is where Vite builds your app)

### Question 4: "Configure as a single-page app (rewrite all urls to /index.html)?"
```
? Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
```
**Answer:** Type **`y`** (yes) - This is important for React Router to work!

### Question 5: "Set up automatic builds and deploys with GitHub?"
```
? Set up automatic builds and deploys with GitHub? (y/N)
```
**Answer:** Type **`N`** (no) for now - You can set this up later if needed

### Question 6: "File dist/index.html already exists. Overwrite?"
```
? File dist/index.html already exists. Overwrite? (y/N)
```
**Answer:** Type **`N`** (no) - Don't overwrite your build files!

---

## Step 4: Build Your App

Before deploying, you need to build the production version:

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

---

## Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

This uploads your app to Firebase Hosting.

### Expected Output:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/wander--logger/overview
Hosting URL: https://wander--logger.web.app
```

---

## 🎉 Your App is Live!

Your app will be available at:
- **Primary URL:** `https://wander--logger.web.app`
- **Custom Domain (if configured):** `https://wander--logger.firebaseapp.com`

---

## 📝 Future Deployments

Whenever you make changes and want to deploy:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

That's it! 🚀

---

## 🔧 Quick Commands Reference

```bash
# View current Firebase projects
firebase projects:list

# Check hosting status
firebase hosting:sites:list

# Deploy with preview (test before going live)
firebase hosting:channel:deploy preview

# View deployment history
firebase hosting:clone

# Open hosting in browser
firebase open hosting:site
```

---

## ⚙️ Configuration Files Created

After initialization, you'll have:

1. **`firebase.json`** - Firebase configuration
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

2. **`.firebaserc`** - Project aliases
   ```json
   {
     "projects": {
       "default": "wander--logger"
     }
   }
   ```

---

## 🐛 Troubleshooting

### Issue: "command not found: firebase"
**Solution:** 
```bash
# Reinstall Firebase CLI
npm install -g firebase-tools

# Or use npx (no installation needed)
npx firebase-tools init hosting
```

### Issue: "Permission denied"
**Solution:**
```bash
# On Mac/Linux, use sudo
sudo npm install -g firebase-tools

# Or fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to PATH: export PATH=~/.npm-global/bin:$PATH
```

### Issue: "Not authorized"
**Solution:**
```bash
# Logout and login again
firebase logout
firebase login
```

### Issue: Build errors
**Solution:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## 🔐 Environment Variables in Production

**Important:** Your `.env` file is NOT uploaded to Firebase Hosting (it's gitignored).

Your environment variables are already in `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyAlkK6mD6M1qeO2YD1w7kpcyd4dHeSK690
VITE_FIREBASE_AUTH_DOMAIN=wander--logger.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wander--logger
VITE_FIREBASE_STORAGE_BUCKET=wander--logger.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=132255904582
VITE_FIREBASE_APP_ID=1:132255904582:web:b3fb3ab2faa3052347ab47
VITE_FIREBASE_MEASUREMENT_ID=G-JP40W0QYQJ
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
```

These are **safe to expose** in your frontend build. They're baked into your `dist/` folder during build.

---

## 🌐 Custom Domain (Optional)

To add a custom domain like `wanderlogger.com`:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Hosting** → **Add custom domain**
3. Follow the DNS setup instructions
4. Firebase provides free SSL certificates!

---

## 📊 Analytics & Monitoring

After deployment, you can monitor your app:

1. **Firebase Console** → **Hosting**
   - View deployment history
   - Monitor bandwidth usage
   - See visitor stats

2. **Google Analytics** (already configured)
   - User engagement
   - Page views
   - User flows

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Test authentication locally
- [ ] Verify all environment variables are set
- [ ] Enable Google Sign-In in Firebase Console
- [ ] Set up Firestore security rules
- [ ] Test guest mode functionality
- [ ] Test on different browsers
- [ ] Run production build locally: `npm run build && npm run preview`
- [ ] Update `README.md` with live URL

---

## 🎯 Complete Deployment Workflow

```bash
# 1. Install Firebase CLI (one time)
npm install -g firebase-tools

# 2. Login (one time)
firebase login

# 3. Initialize hosting (one time)
firebase init hosting

# 4. Build your app (every deployment)
npm run build

# 5. Deploy (every deployment)
firebase deploy --only hosting

# 6. Visit your live app!
# https://wander--logger.web.app
```

---

## 📱 Mobile Responsiveness

Your app is already mobile-responsive with Tailwind CSS. After deployment, test on:
- Mobile browsers (iOS Safari, Chrome)
- Tablets
- Desktop browsers

---

## 🔄 CI/CD (Optional Future Enhancement)

For automatic deployments on git push, you can set up GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: wander--logger
```

---

## 🎉 You're Ready to Deploy!

Start with Step 1 and follow the guide. Your app will be live in minutes! 🚀
