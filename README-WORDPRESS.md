# SleepCycle Pro - WordPress Installation Guide

## 🎯 Aapke paas 3 options hain:

### OPTION 1: WordPress Plugin (Sabse Easy - 2 Minute)
**File:** `SLEEPCYCLE-WORDPRESS-PLUGIN.php`

**Steps:**
1. WordPress Admin → Plugins → Add New → Upload Plugin
2. File ko `.zip` mein convert karein ya directly FTP se `/wp-content/plugins/sleepcycle-pro/` mein upload karein
3. Plugin activate karein
4. Kisi bhi page mein shortcode add karein: `[sleepcycle]`
5. Done! Calculator live hai

**Shortcode Options:**
```
[sleepcycle] - Default dark theme
[sleepcycle theme="light"] - Light theme
[sleepcycle show_naps="false"] - Sirf calculator
[sleepcycle show_debt="false"] - Debt tracker hide
```

---

### OPTION 2: HTML Embed (Kisi bhi page mein)
Agar aapko pura React app chahiye:

1. `dist` folder ke files ko apne server par upload karein
2. WordPress page mein "Custom HTML" block add karein
3. iframe use karein:
```html
<iframe src="https://aapka-domain.com/sleep-app/" 
        width="100%" 
        height="1200" 
        frameborder="0"
        style="border-radius: 24px;">
</iframe>
```

---

### OPTION 3: Complete React App (Advanced)
**Files included:**
- `/src/App.tsx` - Pura source code (2000+ lines)
- `/public/` - Images aur assets
- `package.json` - Dependencies

**Setup:**
```bash
npm install
npm run dev    # Development
npm run build  # Production build
```

Build ke baad `dist` folder ko hosting par upload karein.

---

## 📦 Aapko kya mila hai:

### WordPress Plugin Features:
✅ 90-minute sleep cycle calculator
✅ Wake up / Sleep at modes
✅ Nap calculator (20min & 90min)
✅ Sleep debt tracker
✅ Dark & light themes
✅ Mobile responsive
✅ No API keys needed
✅ GDPR compliant
✅ Fast loading (<50KB)

### Full App Features (React version):
✅ Sab kuch upar wala +
✅ AI Sleep Coach
✅ Sleep tracker dashboard
✅ Sleep sounds (5 types)
✅ Meditation timer
✅ Water intake tracker
✅ Blog section
✅ Testimonials
✅ Premium popup
✅ Animations

---

## 🌍 Target Countries:
- USA
- UK  
- Canada
- Australia

Sabke liye optimized hai!

---

## 🚀 Quick Install for WordPress:

**Method A - Direct:**
1. `SLEEPCYCLE-WORDPRESS-PLUGIN.php` ko copy karein
2. `/wp-content/plugins/sleepcycle-pro/sleepcycle-pro.php` mein paste karein
3. WP Admin → Plugins → Activate
4. New Page → Add shortcode `[sleepcycle]`
5. Publish!

**Method B - ZIP:**
1. File ko `sleepcycle-pro.php` naam dein
2. ZIP karein
3. WordPress mein upload karein

---

## 💰 Monetization Ready:
- AdSense ke liye jagah bani hai
- Affiliate links add kar sakte hain
- Premium upgrade popup included

---

## 📱 Demo:
Live demo dekhne ke liye maine deploy kiya hai (URL preview mein hai)

---

## ❓ Help Chahiye?
- Plugin install nahi ho raha?
- Customization chahiye?
- Apne brand colors chahiye?

Bataiye, main code modify karke de dunga!

---

**Files in this package:**
1. SLEEPCYCLE-WORDPRESS-PLUGIN.php (WordPress plugin)
2. src/App.tsx (Complete React source)
3. public/ (Images)
4. package.json
5. index.html
6. vite.config.ts

Sab kuch ready hai launch ke liye! 🎉
