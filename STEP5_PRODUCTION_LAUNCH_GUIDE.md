# STEP 5 — PRODUCTION LAUNCH GUIDE & FINAL SECURITY AUDIT

**Project:** Adv. Kriti Malviya Chambers Official Web Platform  
**Target Domain:** `https://kritimalviya.com`  
**Hosting Infrastructure:** Hostinger Cloud / Premium Web Hosting + Supabase Enterprise Backend  
**Date:** October 10, 2026  
**Status:** ALL PRODUCTION READINESS CHECKS PASSED (159 / 159 Tests Green)

---

## 1. Executive Summary

With the successful completion of the Live Admin Smoke Test, Mobile Viewport Polishing across all subpages, and automated production readiness verification, the platform is fully prepared for domain cutover and live deployment to Hostinger.

### Test Matrix Summary:
| Test Suite | File | Tests Run | Result |
| :--- | :--- | :--- | :--- |
| **Step 3 Booking & Payment Engine** | `tests/step3_booking_payment_tests.mjs` | 19 | **19 / 19 PASSED** |
| **Step 4 Master Admin Control Center** | `tests/step4_admin_tests.mjs` | 62 | **62 / 62 PASSED** |
| **Pre-Step 5 Layout & Drive Stabilization** | `tests/pre_step5_stabilization_tests.mjs` | 33 | **33 / 33 PASSED** |
| **Step 5 Production Readiness & Security** | `tests/step5_production_readiness_tests.mjs` | 45 | **45 / 45 PASSED** |
| **Grand Total** | All Suites Combined | **159** | **159 / 159 PASSED (100%)** |

---

## 2. Production Assets Created & Configured

### A. Web Server Configuration (`site/.htaccess`)
- **HTTPS Enforcement:** Automatically upgrades all HTTP connections to HTTPS with 301 Permanent Redirect.
- **Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- **GZIP / Deflate Asset Compression:** Compresses HTML, CSS, JavaScript, JSON, SVG, and web fonts.
- **Cache-Control & Expires Headers:** 1-year caching on static images and fonts; immediate revalidation on HTML documents.
- **404 Routing:** Routes missing URLs to dedicated `/404.html`.

### B. Search Engine Infrastructure
- **`site/robots.txt`:** Allows search engine indexing across all public services, articles, and pages while strictly shielding `/admin/*` from search crawler indexing.
- **`site/sitemap.xml`:** Fully formed XML sitemap indexing 9 canonical public URLs with appropriate update frequencies and page priorities.

### C. Luxury Editorial 404 Page (`site/404.html`)
- Warm-cream editorial aesthetic matching the brand language.
- Reassuring message and direct navigation recovery CTAs back to Homepage and Consultation portal.
- Marked with `robots: noindex, follow` to prevent soft 404 indexing penalties.

---

## 3. Hostinger Deployment Procedure

### Step 1: Upload Public Assets to Hostinger
1. Access the Hostinger hPanel File Manager or connect via SFTP/FTP.
2. Navigate to the `public_html/` root directory for `kritimalviya.com`.
3. Upload the entire contents of the `site/` folder directly into `public_html/`:
   ```
   public_html/
   ├── .htaccess
   ├── robots.txt
   ├── sitemap.xml
   ├── 404.html
   ├── index.html
   ├── consultation.html
   ├── payment.html
   ├── confirmation.html
   ├── contact.html
   ├── blog.html
   ├── awards.html
   ├── gallery.html
   ├── vlog.html
   ├── admin/
   │   └── admin.html
   ├── assets/
   │   ├── AboutMe.png
   │   ├── lawyer logo.jpg
   │   ├── NB_K.jpeg
   │   └── NB_K2.png
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── app.js
   │   └── supabase.js
   └── services/
       ├── legal.html
       └── relationship.html
   ```

### Step 2: SSL Certificate Activation
1. In Hostinger hPanel, navigate to **Security** → **SSL**.
2. Confirm the Let's Encrypt / Hostinger SSL certificate is installed and active for `kritimalviya.com` and `www.kritimalviya.com`.
3. Enable **Force HTTPS** in hPanel (in addition to the `.htaccess` rewrite rules).

---

## 4. Supabase Edge Functions Deployment

The project includes one-click deployment automation scripts:

### Running Deployment via PowerShell (Windows):
```powershell
.\scripts\deploy_supabase_functions.ps1
```

### Running Deployment via Bash (macOS / Linux / CI):
```bash
chmod +x ./scripts/deploy_supabase_functions.sh
./scripts/deploy_supabase_functions.sh
```

### Required Production Secrets:
Before running live traffic, set the production secrets in the Supabase runtime:
```bash
# 1. PhonePe Live Credentials
npx supabase secrets set PHONEPE_MERCHANT_ID=YOUR_PRODUCTION_MERCHANT_ID
npx supabase secrets set PHONEPE_SALT_KEY=YOUR_PRODUCTION_SALT_KEY
npx supabase secrets set PHONEPE_SALT_INDEX=1
npx supabase secrets set PHONEPE_ENVIRONMENT=LIVE

# 2. Resend Production Email API Key
npx supabase secrets set RESEND_API_KEY=re_YOUR_PRODUCTION_KEY
npx supabase secrets set RESEND_FROM_EMAIL="Adv. Kriti Malviya <consultations@kritimalviya.com>"
npx supabase secrets set ADMIN_NOTIFY_EMAIL="contact@kritimalviya.com"

# 3. Canonical Domain
npx supabase secrets set PUBLIC_SITE_URL=https://kritimalviya.com
```

---

## 5. DNS Cutover Checklist

| Record Type | Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | Hostinger IP Address | Points apex domain to website |
| **CNAME** | `www` | `kritimalviya.com` | Aliases www to apex domain |
| **TXT (Resend)** | `resend._domainkey` | Value from Resend dashboard | DKIM email authentication |
| **TXT (SPF)** | `@` | `v=spf1 include:resend.com ~all` | SPF email spoofing prevention |
| **TXT (DMARC)** | `_dmarc` | `v=DMARC1; p=quarantine;` | DMARC domain protection |

---

## 6. Pre-Launch Verification Completed

1. **Mobile Viewport Polish:**
   - Fixed consultation card `null` subtitle issue by implementing intelligent fallback description mapping.
   - Fixed mobile header brand logo & name truncation on `payment.html` by applying `flex-shrink: 0` and responsive badge scoping.
   - Refined mobile padding and font sizes on `.service-feature-card` for seamless reading on devices under 600px and 480px.
2. **Admin Panel Smoke Tested:**
   - Live login tested with `advocate@kritimalviya.com` / `Kriti@admin`.
   - Verified Availability blocked dates UI and Google Drive URL resolution with live modal preview.
3. **Security Audit:**
   - Zero sensitive server secrets in frontend bundles.
   - PhonePe SHA-256 signatures enforced.
   - CSV formula injection protections active.
   - Row Level Security (RLS) active on all PostgreSQL tables.
