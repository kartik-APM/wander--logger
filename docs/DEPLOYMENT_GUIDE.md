# Deployment Guide

## Prerequisites
- Node.js and npm installed
- Firebase project: `wander--logger`

## Initial Setup (One Time)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login
```

Firebase is already configured (`firebase.json` and `.firebaserc` exist).

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## Deploy

```bash
# Quick deploy (recommended)
npm run deploy

# Or manually
npm run build
firebase deploy --only hosting
```

**Live URL:** https://wander--logger.web.app

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Remember to set environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Firebase: Environment variables are baked into the build from `.env`

## Useful Commands

```bash
firebase projects:list          # List projects
firebase deploy --debug         # Deploy with logs
npm run deploy:preview          # Deploy to preview channel
```

## Configuration Files

- `firebase.json` - Hosting config (public: dist, SPA rewrites)
- `.firebaserc` - Project ID
- `firestore.rules` - Database security rules

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | `npm install -g firebase-tools` or use `npx firebase-tools` |
---

© 2026 **Kartik Kumar Panday**. All rights reserved.| Not authorized | `firebase logout && firebase login` |
| Build errors | `rm -rf dist node_modules && npm install && npm run build` |

## Notes

- Environment variables in `.env` are baked into the build (safe for frontend)
- Firebase provides free SSL certificates
- Custom domains can be added via Firebase Console → Hosting
