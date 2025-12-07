# Vercel Deployment Guide

## 📋 Overview

**Important:** Vercel par sirf **Web Version** deploy hogi (browser ke liye). Mobile app (Android/iOS) ke liye Play Store ya App Store use karna hoga.

## 🚀 Quick Deployment Steps

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time)
- Project name? `tirthankar-vardhaman-jain-panchang` (or your choice)
- Directory? `./` (current directory)
- Override settings? **No**

#### Step 4: Production Deploy
```bash
vercel --prod
```

### Method 2: GitHub Integration (Easier)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npx expo export:web`
   - **Output Directory:** `web-build`
   - **Install Command:** `npm install`
5. Click "Deploy"

### Method 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import Git repository or upload folder
4. Configure build settings:
   - Build Command: `npx expo export:web`
   - Output Directory: `web-build`
5. Deploy

## ⚙️ Configuration Files

### vercel.json (Already Created)
```json
{
  "buildCommand": "npx expo export:web",
  "outputDirectory": "web-build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables (If Needed)
If you need environment variables:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables:
   - `NODE_ENV=production`
   - Any API keys or configs

## 📝 Build Process

### Local Build Test
```bash
# Build web version locally
npm run build:web

# Test locally
npx serve web-build
```

### Production Build
Vercel automatically runs:
```bash
npm install
npx expo export:web
```

## 🔧 Troubleshooting

### Issue: Build Fails
**Solution:** Check Node.js version
- Vercel uses Node.js 18.x by default
- Add `.nvmrc` file if needed:
  ```
  18
  ```

### Issue: Routes Not Working
**Solution:** Already handled in `vercel.json` with rewrites

### Issue: Images Not Loading
**Solution:** Check CDN URLs are accessible
- Current: `https://ik.imagekit.io/amargranthalya/...`
- Should work fine on Vercel

### Issue: Build Timeout
**Solution:** 
- First build might take 5-10 minutes
- Subsequent builds are faster
- Check Vercel logs for errors

## 🌐 Custom Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## 📊 Deployment Status

After deployment:
- **Preview URL:** `https://your-project.vercel.app`
- **Production URL:** `https://your-project.vercel.app` (or custom domain)

## 🔄 Continuous Deployment

If connected to GitHub:
- Every push to `main` branch = Production deploy
- Every pull request = Preview deploy
- Automatic and free!

## ⚠️ Important Notes

1. **Web Only:** Vercel par sirf web version deploy hogi
2. **Mobile Apps:** Play Store/App Store ke liye separate build chahiye
3. **Free Tier:** 
   - 100GB bandwidth/month
   - Unlimited deployments
   - Custom domains
4. **Performance:** 
   - CDN automatically enabled
   - Global edge network
   - Fast loading times

## 📱 Mobile vs Web

| Feature | Web (Vercel) | Mobile (Play Store) |
|---------|--------------|---------------------|
| Access | Browser | App Store |
| URL | `https://your-app.vercel.app` | Install from store |
| Updates | Instant | App update needed |
| Offline | Limited | Full support |
| Native Features | Limited | Full access |

## ✅ Checklist

Before deploying:
- [ ] Test web build locally: `npm run build:web`
- [ ] Check all images load correctly
- [ ] Test on mobile browser
- [ ] Verify all features work
- [ ] Check console for errors
- [ ] Test zoom and swipe gestures (web version)

## 🚀 Quick Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Export](https://docs.expo.dev/distribution/publishing-websites/)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**Estimated Time:** 5-10 minutes for first deployment

**Cost:** Free tier available (more than enough for this app)

