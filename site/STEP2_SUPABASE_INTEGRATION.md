# STEP 2 — SUPABASE BACKEND INTEGRATION SPECIFICATION & ARCHITECTURE REPORT
**Project:** Adv. Kriti Malviya Chambers (`Kritimalviya.com`)  
**Phase:** STEP 2 of 5 (Backend Integration Layer)  
**Security Standard:** Strict PostgreSQL Row Level Security (RLS) · Zero Secret Exposure · Client is Never Source of Truth

---

## 1. EXECUTIVE SUMMARY & OBJECTIVE

Step 2 connects the static, pixel-perfect editorial frontend built in Step 1 to live Supabase PostgreSQL, Supabase Auth, Row Level Security policies, and centralized data layers.

### What Step 2 Accomplishes:
1. **Live PostgreSQL CMS Integration:** Dynamic data loading for Services, Gallery items, Achievements, Vlog/Videos, Blog posts, Site Settings, Site Content, Availability slots, and Blocked dates.
2. **Editorial Graceful Empty & Error States:** Dynamic sections display intentional, luxury editorial notices when tables are empty (e.g. *"THE ARCHIVE IS BEING CURATED"*, *"NEW ENTRIES ARE BEING PREPARED"*, *"PROFESSIONAL MILESTONES WILL BE ADDED HERE"*, *"NEW VIDEOS WILL APPEAR HERE"*) rather than failing or showing `undefined` / `[object Object]`.
3. **Supabase Auth Foundation:** Full session detection, user login, role clearance enforcement via the `profiles` table (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `VIEWER`), unauthenticated login overlay, unauthorized access-denied state, and real logout.
4. **Live Admin Dashboard:** Connects the Master Control Center to real metrics (confirmed bookings count, settled revenue, pending consultation requests, content archives) and live bookings with Drawer dossier inspector.
5. **Security & XSS Hardening:** DOMParser-based HTML sanitization for all database blog/content rendering; zero exposure of the `service_role` key, database passwords, PhonePe secrets, or Resend keys in browser-delivered code.
6. **Availability & Timezone Engine:** Date & slot calculator enforcing `Asia/Kolkata` (IST) timezone, 30/60-minute duration intervals, and active working days excluding Sundays and blocked dates.
7. **Privacy-Conscious Telemetry & Centralized Logging:** Client-side error logger (`error_logs`) and analytics event dispatcher (`analytics_events`) with anonymous session tracking.

---

## 2. SUPABASE PROJECT CONFIGURATION

The client connects to the live Supabase project using only public anonymous credentials.

| Parameter | Configuration Value | Security Tier |
| :--- | :--- | :--- |
| **Project URL** | `https://jsykvtzohbappquzskwm.supabase.co` | Public |
| **Anon / Public Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeWt2dHpvaGJhcHBxdXpza3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODYzNDcsImV4cCI6MjEwNTY2MjM0N30.Fro8BuUx3vRmDihDAC4ldv8wYBgGb6hGDwaI4tcEmAc` | Public (RLS enforced) |
| **Publishable Key** | `sb_publishable_MOkQ6ylPi0poauJqCNb1RQ_rYockSqi` | Public |
| **Service Role Key** | *Strictly withheld from client bundle* | Confidential (Server-Side / Step 3 only) |

> [!IMPORTANT]
> **Client Credential Boundary:** The anon public key is explicitly safe for browser delivery because PostgreSQL Row Level Security (RLS) is active across all tables. The client never possesses administrative rights without an authenticated JWT verified against `profiles`.

---

## 3. DATABASE TABLES & ACCESS ARCHITECTURE

| Table Name | Public Access Policy | Admin / Auth Access Policy | Purpose |
| :--- | :--- | :--- | :--- |
| `site_settings` | **SELECT** (where `is_public = true`) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Brand parameters, contact info, SEO metadata |
| `site_content` | **SELECT** (public section keys) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | Hero copy, advocate profile, footer text |
| `services` | **SELECT** (where `visible = true`, sorted by `sort_order`) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | Legal, relationship & personal consultation catalog |
| `gallery_items` | **SELECT** (where `visible = true`, sorted by `sort_order`) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | High-res imagery, media categories, Google Drive refs |
| `achievements` | **SELECT** (where `visible = true`, sorted by `sort_order`) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | Milestone archives, banking report counters |
| `videos` | **SELECT** (where `visible = true`, sorted by `sort_order`) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | YouTube video IDs, thumbnail mapping, vlogs |
| `blog_posts` | **SELECT** (where `status = 'PUBLISHED'`) | **ALL** (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | Sanitized legal guides and relationship articles |
| `availability` | **SELECT** (active working schedules) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Weekly slot patterns (Mon–Fri, 10:00–17:00 IST) |
| `blocked_dates` | **SELECT** (date strings) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Public holidays, court vacations, chambers leave |
| `profiles` | **DENIED** (Anonymous access denied) | **SELECT** (own user ID or Admin) | Admin user identity and RBAC role assignment |
| `customers` | **DENIED** (Anonymous access denied) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Client directory with contact numbers and emails |
| `bookings` | **DENIED** (Public cannot list all bookings) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Consultation appointments, dates, modes, states |
| `payments` | **DENIED** (Anonymous access denied) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Gateway settlement logs and PhonePe transaction IDs |
| `activity_logs` | **DENIED** (Anonymous access denied) | **ALL** (`SUPER_ADMIN`, `ADMIN`) | Immutable audit trail for administrative operations |
| `error_logs` | **INSERT** (Anon may log errors safely) | **SELECT / ALL** (`SUPER_ADMIN`, `ADMIN`) | Centralized error telemetry and client issues |
| `analytics_events`| **INSERT** (Anon may log telemetry) | **SELECT / ALL** (`SUPER_ADMIN`, `ADMIN`) | Privacy-conscious funnel and page metrics |

---

## 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)

### Role Hierarchy:
1. `SUPER_ADMIN`: Unrestricted master clearance across all operational and platform parameters.
2. `ADMIN`: Full operational access to bookings, customers, payments, and content.
3. `EDITOR`: Content management access (Gallery, Awards, Vlog, Blog, Site Content).
4. `VIEWER`: Read-only access to dashboard metrics and content.

### Authentication Flow:
```
[Visitor Opens /admin/admin.html]
                │
        [Check Auth Session]
        ├── No User Session ─────────────► [Render #admin-login-view]
        │                                         │ (Submit Email + Password)
        │                                         ▼
        │                              [KM_SUPABASE.signInAdmin()]
        │                                         │
        └── Active User Session                   ▼
                │                      [Query profiles table via RLS]
                ├── Insufficient Role ───► [Render #admin-unauthorized-view]
                │                          (Access Denied · Sign Out button)
                │
                └── Role in [SUPER_ADMIN, ADMIN, EDITOR, VIEWER]
                        │
                        ▼
            [Render #admin-layout (Master Control Center)]
            [Display Authenticated Email & Role Badge]
            [Load Live PostgreSQL Dashboard Metrics & Bookings]
```

### Security Enforcement:
- The client **never** trusts `localStorage` or URL query parameters for administrative status.
- Role verification queries the PostgreSQL `profiles` table via Supabase Auth JWT.
- Row Level Security (RLS) protects `bookings`, `payments`, `customers`, and `activity_logs` from unauthorized extraction even if an attacker alters client JavaScript variables in DevTools.

---

## 5. CLIENT ARCHITECTURE & CODE MODULES

The implementation uses zero-framework Vanilla JavaScript, ensuring high performance, zero build dependencies, and complete compatibility with Hostinger static hosting.

### File Structure:
```
Kritimalviya.com/
├── site/
│   ├── index.html                  # Homepage (Live site_content & analytics)
│   ├── gallery.html                # Photo Gallery (Live gallery_items & empty state)
│   ├── awards.html                 # Achievements (Live achievements & empty state)
│   ├── vlog.html                   # Vlog Archive (Live videos & YouTube modal)
│   ├── blog.html                   # Editorial Blog (Live published posts & XSS sanitizer)
│   ├── consultation.html           # Booking Flow (Live services, calendar & slot engine)
│   ├── payment.html                # Step 2 Payment UI Boundary (No fake transactions)
│   ├── confirmation.html           # Step 2 Dossier View (Read-only confirmation preview)
│   ├── contact.html                # Office Inquiries (Live telemetry dispatcher)
│   ├── services/
│   │   ├── legal.html              # Practice Area 01 (Supabase connected)
│   │   └── relationship.html       # Practice Area 02 (Supabase connected)
│   ├── admin/
│   │   └── admin.html              # Master Control Center (Auth + RLS Dashboard)
│   ├── css/
│   │   └── style.css               # Step 1 Editorial Design System & Animations
│   └── js/
│       ├── supabase.js             # Core Supabase Integration Layer & API SDK
│       └── app.js                  # Frontend Application Controller & Event Router
```

### Key Functions in `site/js/supabase.js`:
- `KM_SUPABASE.getServices()`: Fetches visible consultation services ordered by `sort_order`.
- `KM_SUPABASE.getGalleryItems()`: Fetches visible gallery imagery with categories.
- `KM_SUPABASE.getAchievements()`: Fetches verified professional milestones.
- `KM_SUPABASE.getVideos()`: Fetches YouTube vlog records.
- `KM_SUPABASE.getBlogPosts()`: Fetches published blog entries with excerpts and content.
- `KM_SUPABASE.getSiteSettings()`: Fetches public platform configuration.
- `KM_SUPABASE.getSiteContent(section)`: Fetches dynamic section JSON copy.
- `KM_SUPABASE.getAvailability()`: Fetches weekly working day schedules.
- `KM_SUPABASE.getBlockedDates()`: Fetches chamber vacation and holiday dates.
- `KM_SUPABASE.getAvailableSlots(dateStr)`: Generates time slots in `Asia/Kolkata` (IST).
- `KM_SUPABASE.sanitizeHTML(raw)`: DOMParser whitelist sanitizer preventing XSS, script injection, and event-handler attacks.
- `KM_SUPABASE.trackAnalyticsEvent(name, meta)`: Dispatches privacy-conscious telemetry to `analytics_events`.
- `KM_SUPABASE.logError(module, message, meta)`: Logs client anomalies to `error_logs`.
- `KM_SUPABASE.signInAdmin(email, password)`: Supabase Auth login.
- `KM_SUPABASE.signOutAdmin()`: Supabase Auth logout and session clearing.
- `KM_SUPABASE.getCurrentUser()`: Returns authenticated session user.
- `KM_SUPABASE.getCurrentProfile()`: Returns verified role profile from `profiles`.
- `KM_SUPABASE.getAdminDashboardSummary()`: Aggregates real database counts.
- `KM_SUPABASE.getAdminBookings()`: Fetches live consultation bookings under RLS.

---

## 6. EXPLICIT STEP BOUNDARY: WHAT BELONGS TO STEP 3

To maintain architectural integrity, the following operations are strictly demarcated:

| Feature / Capability | Step 2 Status | Step 3 Scope |
| :--- | :--- | :--- |
| **PhonePe Payment Gateway** | **UI Boundary Prepared** (No live checkout) | Full PhonePe API integration, checksum generation, server-side payload signing |
| **Payment Verification** | **Deferred** | Gateway webhook listener & server-side verification callback |
| **Final Booking Reservation** | **UI Intake Flow** | Atomic PostgreSQL reservation transaction (`rpc/reserve_slot`) |
| **Double-Booking Protection** | **Client UX check only** | Database row locking & exclusion constraints |
| **Order ID Generation** | **Session Draft** | Server-side / DB sequence format `KM-YYYYMMDD-XXXX` |
| **Transactional Email** | **Deferred** | Resend API dispatch for client confirmation and advocate notification |

---

## 7. SETUP & VERIFICATION GUIDE

### Step 1: Verify Supabase Tables & Schema
Ensure the tables from `supabase_structure.md` exist in your Supabase project:
- `site_settings`, `site_content`, `services`, `gallery_items`, `achievements`, `videos`, `blog_posts`, `availability`, `blocked_dates`, `profiles`, `customers`, `bookings`, `payments`, `activity_logs`, `error_logs`, `analytics_events`.

### Step 2: Create First Administrator
1. Sign up user `kirtiom@gmail.com` (or your preferred admin email) in **Supabase Auth > Users**.
2. Run SQL in **Supabase SQL Editor** to establish the `SUPER_ADMIN` profile:
```sql
INSERT INTO public.profiles (id, full_name, role, status)
VALUES (
    '0aaaee13-5bca-4baf-a283-c49dcb5c59b1', -- user UUID from auth.users
    'Adv. Kriti Malviya',
    'SUPER_ADMIN',
    'ACTIVE'
)
ON CONFLICT (id) DO UPDATE SET role = 'SUPER_ADMIN';
```

### Step 3: Run the Website
Serve the static folder using your preferred web server:
```bash
cd "Kritimalviya.com/site"
python -m http.server 8000
```
- Open `http://localhost:8000/` for the public homepage.
- Open `http://localhost:8000/admin/admin.html` to test the Admin Control Center.

### Step 4: Verification Checklist
- [x] **Public Content:** Gallery, Awards, Vlog, Blog load dynamically from Supabase.
- [x] **Empty States:** When a table has 0 rows, the site renders an elegant editorial banner rather than broken layouts.
- [x] **XSS Defense:** Blog content is parsed and sanitized before DOM insertion.
- [x] **Admin Login:** Unauthenticated access displays the secure sign-in card.
- [x] **Admin Authorization:** Entering valid admin credentials unlocks the Master Control Center.
- [x] **No Fake Stats:** Admin dashboard calculates counts from real PostgreSQL rows.
- [x] **Security Audit:** Zero `service_role` keys, PhonePe secrets, or Resend keys in client code.
- [x] **Visual Consistency:** Step 1 styling, colors, typography, and animations remain 100% intact.
