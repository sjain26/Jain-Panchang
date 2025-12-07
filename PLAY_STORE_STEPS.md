# Play Store Deployment - Step by Step (हिंदी में)

## 🎯 Overview
Play Store par app publish karne ke liye ye steps follow karein:

---

## 📋 Part 1: Setup & Build (30-45 minutes)

### Step 1: EAS CLI Install Karein
```bash
npm install -g eas-cli
```

### Step 2: Expo Account se Login
```bash
eas login
```
Agar account nahi hai to: https://expo.dev par sign up karein

### Step 3: EAS Build Configure (Already Done ✅)
`eas.json` file already hai, skip kar sakte hain.

### Step 4: Android App Build Karein
```bash
eas build --platform android --profile production
```

**Important:**
- Ye command cloud par build karega (5-15 minutes)
- AAB (Android App Bundle) file generate hogi
- Build complete hone par download link milega

**Build Status Check:**
```bash
eas build:list
```

---

## 📋 Part 2: Google Play Console Setup (1-2 hours)

### Step 5: Google Play Console Account
1. **Jao:** https://play.google.com/console
2. **$25 One-time Fee:** Pay karein (lifetime)
3. **Account Create:** Developer account banayein

### Step 6: New App Create
1. Play Console → "Create app"
2. **App Name:** "तीर्थंकर वर्धमान Jain Panchang"
3. **Default Language:** Hindi / English
4. **App Type:** Free
5. **Create** button click karein

---

## 📋 Part 3: App Upload (30 minutes)

### Step 7: Production Release Create
1. Left menu → **"Production"**
2. **"Create new release"** click
3. **"Upload"** → AAB file upload karein (Step 4 se)
4. **Release name:** "1.0.0 - Initial Release"
5. **Release notes:**
   ```
   - 13-month calendar with Tithi Darpan
   - Years 2021-2026 available
   - Pinch-to-zoom support
   - Swipe to flip calendar pages
   - Smooth animations
   ```
6. **Save** → **Review** → **Start rollout to Production**

---

## 📋 Part 4: Store Listing (1 hour)

### Step 8: App Information Fill Karein

#### **App Name** (30 characters max)
```
तीर्थंकर वर्धमान Jain Panchang
```

#### **Short Description** (80 characters max)
```
13 महीने का कैलेंडर - 2021 से 2026 तक, तिथि दर्पण सहित
```

#### **Full Description** (4000 characters max)
```
तीर्थंकर वर्धमान Jain Panchang - Complete Jain Calendar Solution

Features:
✅ 13 Months per Year (12 Regular + Tithi Darpan)
✅ Years 2021-2026 Available
✅ High-Quality Calendar Images
✅ Pinch-to-Zoom Support
✅ Swipe Gestures for Navigation
✅ Smooth Animations
✅ Offline Image Caching
✅ Easy Year Selection
✅ Month-wise Navigation

Perfect for:
- Daily Calendar Reference
- Tithi & Panchang Information
- Year Planning
- Religious Calendar Needs

All calendar images are optimized for fast loading and clear viewing.
```

#### **App Category**
- **Primary:** Books & Reference
- **Secondary:** Lifestyle

#### **Contact Details**
- Developer email
- Phone number (optional)
- Website (if available)

---

### Step 9: Graphics Upload (Important!)

#### **1. Feature Graphic** (Required)
- **Size:** 1024x500 pixels
- **Format:** PNG or JPG
- **No transparency**
- **Upload:** Store listing → Graphics → Feature graphic

#### **2. Screenshots** (Required - Minimum 2)
- **Phone Screenshots:**
  - Size: 1080x1920 (Portrait) ya 1920x1080 (Landscape)
  - Minimum: 2 screenshots
  - Recommended: 4-8 screenshots
  - Format: PNG or JPG

**Screenshot Ideas:**
1. Home screen with year selector
2. Calendar image with zoom
3. Month navigation
4. Tithi Darpan view
5. Flip animation demo

#### **3. App Icon** (Required)
- **Size:** 512x512 pixels
- **Format:** PNG
- Already hai: `assets/images/icon.png`

---

### Step 10: Privacy Policy (Required!)

**Google Play requires privacy policy URL.**

#### Option 1: Create Simple Privacy Policy
Create a file `privacy-policy.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - तीर्थंकर वर्धमान Jain Panchang</title>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Last updated: [Date]</p>
    
    <h2>Data Collection</h2>
    <p>This app does not collect any personal data from users.</p>
    
    <h2>Image Loading</h2>
    <p>Calendar images are loaded from ImageKit.io CDN for fast delivery.</p>
    
    <h2>Permissions</h2>
    <p>This app only requires INTERNET permission to load calendar images.</p>
    
    <h2>Contact</h2>
    <p>For questions: [Your Email]</p>
</body>
</html>
```

#### Option 2: Use Free Hosting
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)

**Then add to app.json:**
```json
{
  "expo": {
    "privacyPolicyUrl": "https://your-domain.com/privacy-policy.html"
  }
}
```

---

### Step 11: Content Rating

1. **Go to:** Content rating section
2. **Questionnaire Fill:**
   - App type: Utility/Reference
   - No violence, no adult content
   - No user-generated content
   - Result: **Everyone** rating
3. **Save** → Get rating certificate

---

### Step 12: Pricing & Distribution

1. **Pricing:** Free
2. **Countries:** All countries (or select specific)
3. **Device Categories:** Phones & Tablets
4. **Consent:** Accept Google Play policies

---

## 📋 Part 5: Final Submission

### Step 13: Review & Submit

1. **Check All Sections:**
   - ✅ App information complete
   - ✅ Graphics uploaded
   - ✅ Privacy policy added
   - ✅ Content rating done
   - ✅ AAB file uploaded
   - ✅ Release created

2. **Submit for Review:**
   - Click "Submit for review"
   - Wait for Google approval (1-3 days)

---

## ✅ Quick Checklist

### Before Building:
- [ ] `app.json` me version correct hai
- [ ] App icon ready hai
- [ ] Splash screen ready hai

### Before Uploading:
- [ ] AAB file build ho gaya
- [ ] AAB file download kar liya

### Before Submitting:
- [ ] Feature graphic ready (1024x500)
- [ ] Screenshots ready (minimum 2)
- [ ] Privacy policy URL ready
- [ ] App description written
- [ ] Content rating completed
- [ ] All store listing fields filled

---

## 🚀 Quick Commands Summary

```bash
# 1. EAS CLI Install
npm install -g eas-cli

# 2. Login
eas login

# 3. Build Production AAB
eas build --platform android --profile production

# 4. Check Build Status
eas build:list

# 5. Download Build (if needed)
eas build:download
```

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Google Play Registration | $25 (one-time) |
| EAS Build (Free tier) | Free (limited) |
| EAS Build (Paid) | $29/month (unlimited) |
| **Total (First Time)** | **$25** |

**Note:** EAS Build free tier me limited builds hote hain. Production ke liye paid plan better hai.

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Fails
**Solution:** 
- Check `app.json` for errors
- Ensure all dependencies installed
- Check EAS build logs

### Issue 2: Package Name Already Exists
**Solution:** 
- Change package name in `app.json`:
  ```json
  "package": "app.rork.13_month_calendar_app_v2"
  ```

### Issue 3: Privacy Policy Missing
**Solution:** 
- Create privacy policy page
- Host on GitHub Pages/Netlify/Vercel
- Add URL to `app.json`

### Issue 4: Screenshots Not Uploading
**Solution:** 
- Check image size (1080x1920 recommended)
- Use PNG format
- Compress if too large

---

## 📱 After Publication

### App Live Hone Ke Baad:
1. **App URL:** `https://play.google.com/store/apps/details?id=app.rork.13_month_calendar_app`
2. **Updates:** New version ke liye same process (version increment karein)
3. **Analytics:** Play Console me stats dekh sakte hain

---

## 🎯 Timeline

| Step | Time |
|------|------|
| Setup & Build | 30-45 min |
| Play Console Setup | 1-2 hours |
| Store Listing | 1 hour |
| Google Review | 1-3 days |
| **Total** | **2-3 hours + 1-3 days** |

---

## 📞 Support

Agar koi issue aaye to:
1. Check EAS build logs
2. Check Play Console errors
3. Expo Discord: https://discord.gg/expo
4. Google Play Support: https://support.google.com/googleplay

---

**Good Luck! 🚀**

