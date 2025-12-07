# Play Store Publication Guide

## 📋 Prerequisites Checklist

### 1. **App Configuration (app.json)**
- ✅ App name: "तीर्थंकर वर्धमान Jain Panchang"
- ✅ Package name: "app.rork.tirthankar_vardhaman_jain_panchang"
- ✅ Version: "1.0.0"
- ✅ Icon & Splash screen configured

### 2. **Required Assets**
- ✅ App Icon (1024x1024 PNG)
- ✅ Adaptive Icon (foreground + background)
- ✅ Splash Screen
- ⚠️ Feature Graphic (1024x500) - **NEEDED**
- ⚠️ Screenshots (at least 2, recommended 4-8) - **NEEDED**

### 3. **Play Store Listing Requirements**

#### **App Information:**
- App Name (30 characters max)
- Short Description (80 characters max)
- Full Description (4000 characters max)
- App Category: Books & Reference / Lifestyle
- Content Rating: Everyone
- Privacy Policy URL - **REQUIRED**

#### **Graphics Required:**
1. **Feature Graphic**: 1024x500 PNG (no transparency)
2. **Phone Screenshots**: 
   - Minimum 2, Maximum 8
   - Resolution: 16:9 or 9:16 aspect ratio
   - Recommended: 1080x1920 or 1920x1080
3. **Tablet Screenshots** (Optional but recommended)
4. **App Icon**: 512x512 PNG (high-res)

## 🚀 Step-by-Step Process

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo Account
```bash
eas login
```

### Step 3: Configure EAS Build
```bash
eas build:configure
```

This will create `eas.json` file.

### Step 4: Update app.json for Production

Update these fields in `app.json`:
- `version`: Increment for each release (e.g., "1.0.1")
- `android.versionCode`: Auto-incremented by EAS
- Add `permissions` if needed
- Add `privacy` policy URL

### Step 5: Build Android App Bundle (AAB)
```bash
eas build --platform android --profile production
```

**Note:** AAB format is required by Play Store (not APK)

### Step 6: Create Google Play Console Account
1. Go to https://play.google.com/console
2. Pay one-time $25 registration fee
3. Create new app

### Step 7: Upload App to Play Console
1. Go to "Production" → "Create new release"
2. Upload the AAB file from Step 5
3. Add release notes
4. Review and publish

### Step 8: Complete Store Listing
Fill in all required fields:
- App name
- Short description
- Full description
- Category
- Screenshots
- Feature graphic
- Privacy policy URL
- Contact details

### Step 9: Content Rating
- Complete content rating questionnaire
- Get rating certificate

### Step 10: Pricing & Distribution
- Set app as Free or Paid
- Select countries for distribution
- Accept Google Play policies

### Step 11: Submit for Review
- Review all information
- Submit app for Google review
- Wait for approval (usually 1-3 days)

## 📝 Important Notes

### App Signing
- EAS Build automatically handles app signing
- Keystore is managed by Expo
- First build creates a new keystore

### Version Management
- Update `version` in `app.json` for each release
- `versionCode` is auto-incremented
- Format: "1.0.0" (major.minor.patch)

### Privacy Policy
- **REQUIRED** by Google Play
- Must be publicly accessible URL
- Should cover:
  - Data collection (if any)
  - Image loading from CDN
  - User permissions used

### Permissions
Current app uses:
- Internet (for loading images)
- No sensitive permissions needed

## 🔧 Recommended Updates to app.json

```json
{
  "expo": {
    "android": {
      "package": "app.rork.13_month_calendar_app",
      "versionCode": 1,
      "permissions": [
        "INTERNET"
      ],
      "playStoreUrl": "https://play.google.com/store/apps/details?id=app.rork.13_month_calendar_app"
    },
    "privacy": "public",
    "privacyPolicyUrl": "YOUR_PRIVACY_POLICY_URL"
  }
}
```

## 📦 Build Commands

### Development Build (Testing)
```bash
eas build --platform android --profile development
```

### Production Build (Play Store)
```bash
eas build --platform android --profile production
```

### Local Build (Alternative)
```bash
npx expo run:android --variant release
```

## ⚠️ Common Issues

1. **Package name already exists**: Change package name in app.json
2. **Version code conflict**: Increment version in app.json
3. **Missing privacy policy**: Create and host privacy policy
4. **App size too large**: Optimize images, use CDN (already done)

## 📚 Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

## ✅ Final Checklist Before Submission

- [ ] App tested on multiple devices
- [ ] All features working correctly
- [ ] Privacy policy URL added
- [ ] Screenshots prepared (2-8 images)
- [ ] Feature graphic created (1024x500)
- [ ] App description written
- [ ] Content rating completed
- [ ] AAB file built successfully
- [ ] Store listing completed
- [ ] App submitted for review

---

**Estimated Time:** 2-3 hours for setup + 1-3 days for Google review

**Cost:** $25 one-time Google Play registration fee

