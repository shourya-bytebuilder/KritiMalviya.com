# Product Requirements Document (PRD)
# Adv. Kriti Malviya — Professional Legal & Relationship Counselling Website

**Document:** `prd.md`  
**Version:** 1.0  
**Status:** Product definition / implementation baseline  
**Last Updated:** 2026-10-07

---

## 1. Product Overview

The Adv. Kriti Malviya website is a premium professional website and private consultation platform for:

- Legal consultation
- Relationship counselling
- Personal counselling
- Professional information
- Educational content
- Video content
- Professional achievements
- Consultation booking
- Online payment
- Customer and booking management
- Website analytics
- Administrative content control

The product is not intended to behave like a generic corporate website, generic counselling marketplace, ecommerce store, or SaaS dashboard.

It should feel like a **premium private professional office presented through an editorial digital experience**.

The public website provides information and trust-building content.

The consultation system allows visitors to request appointments.

The payment system handles consultation fees.

The admin system provides a centralized **Master Control Center** for managing the website, bookings, customers, content, payments, availability, analytics, reports, notifications, and system activity.

---

# 2. Product Goals

## Primary Goals

1. Establish a premium and trustworthy online presence for Adv. Kriti Malviya.
2. Clearly present legal and relationship/personal counselling services.
3. Allow visitors to explore professional background, achievements, gallery, videos, and articles.
4. Allow visitors to request consultations through a structured booking experience.
5. Support consultation payments through a secure payment gateway architecture.
6. Provide administrators with complete operational control.
7. Provide analytics and daily business reports.
8. Provide a scalable backend architecture using Supabase.
9. Protect customer, booking, payment, and confidential consultation information.
10. Keep the website visually sophisticated, fast, responsive, and maintainable.

---

# 3. Product Vision

The long-term product should become a unified digital office for Adv. Kriti Malviya.

A visitor should be able to:

**Discover → Understand → Trust → Book → Pay → Receive Confirmation → Attend Consultation**

The administrator should be able to:

**Monitor → Manage → Edit → Analyze → Report → Control**

The website should therefore consist of two major experiences:

### Public Experience

The professional website visitors see.

### Private Administrative Experience

The authenticated Master Control Center used by authorized administrators.

---

# 4. Target Users

## 4.1 Website Visitor

A person looking for:

- legal guidance
- relationship counselling
- personal counselling
- professional information
- educational material
- consultation booking

## 4.2 Existing Client

A person who has:

- submitted a consultation request
- made a payment
- previously interacted with the professional

The initial system does not require a customer login/dashboard unless added later.

## 4.3 Administrator

The primary person responsible for:

- bookings
- customers
- payments
- content
- availability
- analytics
- reports
- notifications
- website settings

## 4.4 Future Admin Roles

The architecture should support:

- Super Admin
- Admin
- Editor
- Viewer

---

# 5. Brand & Visual Direction

The visual identity should be consistent across the entire public website.

## Colors

Primary:

- Warm cream / ivory
- Charcoal / near-black
- Metallic gold
- Pastel yellow

## Typography

Use a combination of:

- editorial/high-contrast serif typography for major headings
- clean modern sans-serif typography for body text, metadata, controls, and navigation

## Design Characteristics

- premium
- editorial
- elegant
- professional
- sophisticated
- calm
- human
- slightly imperfect rather than sterile
- spacious
- minimal but expressive

## Avoid

- neon
- cyberpunk
- excessive gradients
- generic SaaS design
- overly colorful dashboards
- robotic UI
- excessive glassmorphism
- excessive rounded cards
- cheap template appearance

The public website should feel closer to a **premium legal/editorial publication and private professional office** than a generic business website.

---

# 6. Public Website Structure

The planned public website includes:

1. `hero.html`
2. `gallery.html`
3. `awards.html`
4. `vlog.html`
5. `blog.html`
6. `consultation.html`
7. `payment.html`

Additional supporting pages/system components may include:

8. Contact
9. Privacy Policy
10. Terms
11. Consultation Disclaimer
12. Cancellation/Refund Policy
13. Legal/Payment Terms
14. Individual service pages or a reusable service-page system

---

# 7. Homepage — `hero.html`

The homepage is the primary landing experience.

## Header

Brand:

`KRITIMALVIYA`

Primary navigation:

- HOME
- RELATIONSHIP CONSELLING
- LEGAL CONSELLING

Relationship counselling menu:

- ADHD
- LBI CBT
- Break-up Counselling
- Couple Counselling
- Teenage Counselling
- Emotional Intelligence Counselling
- Low Esteem Counselling
- Trauma Recovery Counselling
- Procrastination
- Psycho Therapy
- Gen-Z Counselling
- Parenting

Legal counselling menu:

- Divorce Guidance
- Property Purchase
- Civil Cases
- Human Rights

Hamburger navigation:

- Home
- Advocate Kriti Malviya
- Photo Gallery
- Awards And Achievements
- Vlog
- Blog
- About Us

## Hero

The hero should contain:

- professional headline
- supporting text
- primary CTA
- professional portrait/image
- premium transitions
- subtle pastel-yellow/gold accents

The professional image should support a transparent/no-background presentation where applicable.

## About Advocate

The homepage includes an About Advocate section.

Established information:

> Adv. Kirti Malviya is a legal professional with 10+ years of experience across banking, property, contracts, documentation, family-related matters, and dispute resolution.

Her practice focuses on:

- clear guidance
- practical solutions
- confidentiality
- negotiation
- documentation
- compliance
- practical dispute resolution

Professional experience includes:

- 500+ banking search reports
- 20+ mediations resolved

She also provides relationship and personal counselling for individuals and couples dealing with:

- communication difficulties
- relationship conflicts
- family concerns
- separation
- emotional decision-making

The website must not invent additional credentials.

## About Us

A separate About Us section is included toward the end of the homepage.

The existing homepage footer should remain unchanged unless explicitly redesigned later.

---

# 8. Gallery — `gallery.html`

Purpose:

Create a premium professional photo archive.

Requirements:

- standalone page
- responsive masonry/bento layout
- Google Drive-compatible image URLs
- lazy loading
- broken image handling
- category filtering
- image counter
- lightbox
- previous/next navigation
- keyboard navigation
- mobile support
- scroll reveal

Images should be data-driven.

Example conceptual structure:

```javascript
const galleryImages = [
  {
    src: "...",
    title: "...",
    category: "...",
    featured: true
  }
];
```

Adding/removing images should not require rebuilding the layout manually.

---

# 9. Awards & Achievements — `awards.html`

Purpose:

Present professional achievements as a premium portfolio/archive.

Important distinction:

The page must not invent awards.

Known professional milestones include:

- 10+ years of experience
- 500+ banking search reports
- 20+ mediations resolved

The page should separate:

### Awards

Actual awards entered by the administrator.

### Professional Milestones

Verified professional experience and achievements.

Features:

- chronological timeline
- achievement cards
- featured achievement
- category filters
- dynamic counter
- optional images
- lightbox
- responsive layout
- scroll-controlled reveal

---

# 10. Vlog — `vlog.html`

Purpose:

Create a premium editorial video archive.

Video data should be editable through a centralized data structure and eventually through the admin CMS.

Each video should support:

- YouTube URL
- title
- description
- category
- date
- featured status

Supported YouTube URL types:

- `youtube.com/watch?v=...`
- `youtu.be/...`
- `youtube.com/shorts/...`

Features:

- automatic YouTube ID extraction
- automatic thumbnail generation
- featured video
- responsive grid
- category filtering
- search
- video viewer
- previous/next
- keyboard navigation
- desktop hover preview
- mobile tap-to-open
- lazy iframe loading
- reduced-motion support

The system must respect YouTube embedding restrictions.

---

# 11. Blog — `blog.html`

Purpose:

Create a premium professional knowledge journal.

The blog should not resemble a generic WordPress/news website.

Data structure should support:

```javascript
const blogPosts = [
  {
    id: "...",
    title: "...",
    excerpt: "...",
    content: "...",
    category: "...",
    date: "...",
    image: "...",
    featured: false,
    readTime: "..."
  }
];
```

Features:

- featured article
- article grid
- category filters
- search
- dynamic article count
- full-screen article reader
- reading progress
- previous/next article
- related articles
- load more
- Google Drive images
- lazy loading
- responsive layout
- reduced-motion support

Article content must support:

- H2
- H3
- paragraphs
- unordered lists
- ordered lists
- blockquotes

No fake credentials, awards, testimonials, or lorem ipsum should be generated.

---

# 12. Consultation — `consultation.html`

Purpose:

Provide an official private consultation request and booking experience.

The consultation flow has four stages:

### 01 — Consultation

Select:

#### Legal

- Divorce Guidance
- Property Purchase
- Civil Cases
- Human Rights
- General Legal Consultation

#### Relationship / Personal

- Couple Counselling
- Relationship Concerns
- Family Concerns
- Break-up / Separation
- Teenage Counselling
- Emotional Well-being
- General Counselling

Configurable duration:

- 30 minutes
- 60 minutes

Mode:

- Online
- In-person

### 02 — Date & Time

Configurable:

- available days
- blocked dates
- consultation duration
- advance booking period
- available slots

The frontend must not claim live availability unless connected to the backend.

### 03 — Client Details

Fields:

- full name
- email
- phone
- WhatsApp
- country
- short description
- preferred contact method

The form should discourage users from submitting highly sensitive/confidential details in the initial booking request.

### 04 — Confirmation

Display:

- consultation details
- date
- time
- mode
- client information
- booking reference

If manual confirmation is required, the button must say:

`REQUEST CONSULTATION`

not falsely imply that the appointment is already confirmed.

---

# 13. Payment — `payment.html`

Purpose:

Provide a secure consultation payment stage.

Flow:

**Consultation → Booking Request → Payment → Verification → Confirmation**

Preferred architecture:

Frontend
→ Supabase Edge Function
→ Razorpay order creation
→ Razorpay Checkout
→ payment
→ backend signature verification
→ booking marked paid

Suggested initial configuration:

```javascript
const paymentSettings = {
  currency: "INR",
  currencySymbol: "₹",
  bookingFee: 1500,
  taxEnabled: false,
  taxRate: 0,
  gateway: "RAZORPAY",
  paymentMode: "TEST",
  requirePaymentBeforeConfirmation: true
};
```

The amount must be calculated centrally.

The frontend must never be trusted for:

- payment amount
- payment success
- payment status
- signature verification

Never expose:

- payment gateway secret keys
- card numbers
- CVV
- UPI PIN
- banking passwords

Payment states:

- PENDING
- PROCESSING
- PAID
- FAILED
- CANCELLED
- REFUNDED
- VERIFICATION_PENDING

Booking status should remain separate from payment status.

---

# 14. Admin Master Control Center — `admin.html`

The administrator dashboard is the private operational core of the product.

It should provide:

- website analytics
- daily reports
- consultations
- customers
- payments
- availability
- notifications
- content management
- website settings
- SEO
- activity logs
- error logs
- system health
- admin users
- exports

The admin page should not be a fake frontend-only dashboard.

Security must be enforced through:

- Supabase Auth
- Row Level Security
- role-based permissions
- secure Edge Functions

---

# 15. Admin Navigation

The admin navigation should include:

## Overview

- Dashboard
- Analytics
- Daily Reports

## Business

- Consultations
- Customers
- Payments
- Availability
- Notifications

## Content

- Homepage
- About
- Services
- Gallery
- Awards & Achievements
- Vlog
- Blog

## Website

- Contact Information
- Website Settings
- SEO Settings

## System

- Activity Logs
- Error Logs
- Database/System Status
- Admin Users

## Utilities

- Export Reports
- Settings
- Logout

---

# 16. Admin Authentication

Admin access must use Supabase Authentication.

Suggested profile model:

```text
profiles
- id
- email
- full_name
- role
- created_at
- last_login
```

Roles:

- super_admin
- admin
- editor
- viewer

Unauthorized users must see:

`ACCESS DENIED`

The dashboard must never rely solely on frontend route hiding for security.

---

# 17. Admin Dashboard

The main dashboard should dynamically display:

### Website

- visitors today
- visitors this week
- visitors this month
- page views
- traffic sources

### Consultations

- pending
- confirmed
- completed
- cancelled

### Customers

- total
- new today
- new this month
- returning

### Payments

- pending
- successful
- failed
- monthly revenue
- total revenue

### Content

- blog posts
- drafts
- videos
- gallery images
- achievements

No fake data should be displayed in production.

---

# 18. Analytics

Analytics should support:

- total visitors
- unique visitors
- sessions
- page views
- average session duration
- bounce rate if available
- returning visitors
- traffic sources
- top pages
- device types
- privacy-compliant geography where appropriate

Time ranges:

- today
- yesterday
- 7 days
- 30 days
- 90 days
- custom

Analytics should be privacy-conscious and avoid unnecessary personal data collection.

---

# 19. Daily Reports

The admin should receive/view day-to-day reports containing:

- visitors
- new customers
- consultations
- confirmed consultations
- payments
- revenue
- new blog posts
- gallery changes
- system errors
- important activity

Reports should support:

- viewing
- printing
- CSV export
- JSON export
- PDF-ready print layout

---

# 20. Customer Management

Customer management should include:

- total customers
- new customers
- registration dates
- consultation history
- payment history
- last activity

Search by:

- name
- email
- phone
- booking reference

Never store or display customer passwords.

Customer data must be protected by role-based access.

---

# 21. Consultation Management

Admin can:

- view bookings
- confirm
- reschedule
- cancel
- mark completed
- inspect payment status

Booking data includes:

- booking reference
- consultation type
- date
- time
- duration
- mode
- client information
- payment status
- booking status
- created timestamp

Double-booking prevention must be implemented at the backend/database layer.

---

# 22. Availability Management

Admin can control:

- working days
- working hours
- consultation duration
- available slots
- blocked dates
- holidays
- special slots

Changes must propagate to the consultation booking system.

---

# 23. Content Management System

The admin should eventually control the public website without manually editing HTML.

Editable areas:

- homepage
- about
- services
- gallery
- achievements
- vlog
- blog
- contact
- footer where applicable
- SEO metadata

Content changes should be stored in Supabase.

---

# 24. Service Management

Services should support:

- title
- category
- description
- duration
- consultation fee
- visibility
- ordering

Categories:

- Legal
- Relationship / Personal

The administrator should be able to add/edit/archive services.

---

# 25. Notification System

Notifications should cover:

- new consultation
- successful payment
- failed payment
- cancelled booking
- new customer
- system error
- content update
- availability change

Future delivery channels:

- email
- WhatsApp
- in-app/admin notifications

No fake message delivery should be reported.

---

# 26. Email System

Potential templates:

- consultation request received
- consultation confirmed
- consultation rescheduled
- consultation cancelled
- payment received
- payment failed
- consultation reminder
- contact request received

Private email provider credentials must remain server-side.

---

# 27. Activity Logging

Record important administrator actions.

Examples:

- login
- booking viewed
- booking confirmed
- booking cancelled
- payment viewed
- blog created
- blog edited
- blog published
- gallery updated
- settings changed
- availability changed

Activity records should contain:

- timestamp
- administrator
- action
- target
- result

Only collect device/IP information where appropriate and legally justified.

---

# 28. Error Logging

The system should provide an internal error log with:

- timestamp
- severity
- module
- message
- status
- resolution state

Severity:

- INFO
- WARNING
- ERROR
- CRITICAL

Sensitive internal stack traces must not be exposed publicly.

---

# 29. System Health

Admin should be able to see status for:

- Supabase
- Authentication
- Database
- Storage
- Edge Functions
- payment gateway
- email provider
- analytics

Possible statuses:

- CONNECTED
- WARNING
- ERROR
- NOT CONFIGURED

Statuses must reflect actual checks.

---

# 30. Export System

Authorized administrators should be able to export:

- customers
- consultations
- payments
- analytics
- daily reports
- activity logs
- blog posts
- gallery
- vlog
- achievements

Formats:

- CSV
- JSON
- print/PDF-ready report

Exports containing sensitive information must be permission-controlled.

---

# 31. Database Architecture

Suggested Supabase tables:

```text
profiles
bookings
customers
payments
availability
blocked_dates
services
gallery_items
achievements
videos
blog_posts
site_content
site_settings
notifications
activity_logs
error_logs
analytics_events
daily_reports
```

The exact schema may evolve during technical design.

---

# 32. Security Requirements

Security is a core requirement.

The system must use:

- Supabase Auth
- Row Level Security
- role-based authorization
- Edge Functions for sensitive operations
- server-side validation
- input sanitization
- protected exports
- secure payment verification

Never put private keys in:

- HTML
- CSS
- frontend JavaScript
- browser localStorage

Never expose:

- Supabase service-role key
- Razorpay secret
- email API secret
- WhatsApp API secret
- other private credentials

---

# 33. Privacy & Confidentiality

Because the website may handle legal and counselling-related information:

- minimize sensitive information collection
- protect consultation descriptions
- restrict admin access
- avoid unnecessary analytics data
- avoid exposing private information in logs
- do not display sensitive data to unauthorized users
- maintain clear privacy/disclaimer documentation

The booking form should explicitly discourage users from submitting unnecessary confidential details.

---

# 34. Legal/Trust Pages

Before production launch, the system should include:

- Privacy Policy
- Terms & Conditions
- Consultation Disclaimer
- Cancellation Policy
- Refund Policy
- Payment Terms
- Emergency Disclaimer where appropriate
- Cookie/analytics notice if legally required

These should be reviewed appropriately before production use.

---

# 35. Data Integrity Rules

The system must never assume frontend state is authoritative.

Important operations must be verified server-side.

Examples:

### Booking

Frontend:
request slot

Backend:
verify availability
→ reserve/confirm atomically

### Payment

Frontend:
payment response

Backend:
verify gateway signature
→ update payment
→ update booking

### Admin

Frontend:
request action

Backend:
verify authenticated user
→ verify role
→ perform action

---

# 36. Performance Requirements

Public pages should remain fast.

Use:

- lazy image loading
- optimized images
- lightweight JavaScript
- minimal dependencies
- responsive assets
- deferred noncritical scripts

Admin should use:

- pagination
- database-side filtering
- database-side sorting
- debounced search
- selective data loading
- caching where appropriate

Do not load thousands of records at once.

---

# 37. Accessibility

The product should support:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- sufficient contrast
- responsive text sizing
- reduced motion
- accessible modals
- accessible form errors

---

# 38. Responsive Requirements

All public pages must support:

- mobile
- tablet
- laptop
- large desktop

Target range:

320px → 1920px+

Admin:

- desktop sidebar
- mobile drawer
- responsive tables
- responsive cards
- touch-friendly controls

---

# 39. Performance & Animation Principles

Animations should be:

- smooth
- subtle
- meaningful
- editorial
- scroll-aware

Avoid excessive animation.

Use IntersectionObserver or lightweight native APIs where appropriate.

Always respect:

`prefers-reduced-motion`

---

# 40. Content Integrity

The product must not invent:

- awards
- credentials
- testimonials
- client counts
- legal outcomes
- professional claims
- qualifications

Known facts may be presented only as provided by the business owner.

The administrator should be able to edit factual content through the CMS.

---

# 41. Initial Non-Goals

The following are intentionally not required for the first release:

- customer login/dashboard
- loyalty system
- subscriptions
- coupons
- unnecessary gamification
- complex ecommerce
- unnecessary social networking
- large third-party automation stack

These may be considered later if there is a real business need.

---

# 42. Suggested Technical Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- lightweight native browser APIs

Public pages may remain standalone HTML files where practical.

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage where appropriate
- Supabase Edge Functions

## Payment

- Razorpay

## Video

- YouTube embeds/API-compatible public URLs

## Images

- Google Drive URLs where suitable
- Supabase Storage may be used where appropriate

## Deployment

The architecture should remain compatible with standard static hosting and the chosen production hosting environment.

---

# 43. Backend Service Boundaries

Important backend functions should include concepts such as:

```text
authenticateAdmin()
getDashboardStats()
getAnalytics()
getDailyReports()

getConsultations()
checkSlotAvailability()
createBooking()
confirmBooking()
cancelBooking()
rescheduleBooking()

createPaymentOrder()
verifyPayment()
refundPayment()

getCustomers()

getAvailability()
updateAvailability()

getHomepage()
updateHomepage()

getServices()
updateService()

getGallery()
updateGallery()

getAchievements()
updateAchievement()

getVideos()
updateVideo()

getBlogPosts()
updateBlogPost()

getSiteSettings()
updateSiteSettings()

getNotifications()
getActivityLogs()
getErrorLogs()
getSystemHealth()
```

The exact implementation belongs in the technical design.

---

# 44. User Journey — Public Visitor

```text
LANDING PAGE
      ↓
UNDERSTAND SERVICES
      ↓
VIEW ABOUT / ACHIEVEMENTS / BLOG / VLOG
      ↓
SELECT CONSULTATION
      ↓
CHOOSE DATE & TIME
      ↓
ENTER DETAILS
      ↓
SUBMIT REQUEST
      ↓
PAYMENT
      ↓
PAYMENT VERIFICATION
      ↓
BOOKING CONFIRMATION
      ↓
EMAIL / NOTIFICATION
```

---

# 45. User Journey — Administrator

```text
ADMIN LOGIN
      ↓
AUTHENTICATE
      ↓
ROLE VERIFICATION
      ↓
MASTER DASHBOARD
      ↓
MONITOR
      ↓
MANAGE BOOKINGS / CUSTOMERS / PAYMENTS
      ↓
MANAGE CONTENT
      ↓
MANAGE AVAILABILITY
      ↓
VIEW ANALYTICS
      ↓
GENERATE REPORTS
      ↓
REVIEW SYSTEM HEALTH
```

---

# 46. Success Metrics

The first release should measure:

## Website

- visitor growth
- page views
- consultation page visits
- conversion to consultation request

## Business

- consultation requests
- confirmed consultations
- completed consultations
- payment success rate
- revenue

## Content

- blog engagement
- video engagement
- gallery engagement

## Operations

- booking response time
- cancellation rate
- payment failure rate
- system error rate

Analytics must be implemented in a privacy-conscious manner.

---

# 47. Release Phases

## Phase 1 — Public Website

- homepage
- about
- gallery
- achievements
- vlog
- blog
- consultation page
- payment page

## Phase 2 — Backend

- Supabase project
- database
- authentication
- RLS
- bookings
- availability
- customers
- payments

## Phase 3 — Admin

- admin login
- dashboard
- consultations
- customers
- payments
- availability
- notifications
- content management

## Phase 4 — Analytics & Reports

- analytics
- daily reports
- activity logs
- error logs
- exports
- system health

## Phase 5 — Communications

- email notifications
- reminders
- optional WhatsApp integration

## Phase 6 — Launch Hardening

- security review
- permission review
- payment verification testing
- double-booking testing
- mobile testing
- accessibility testing
- performance testing
- legal/document review
- production deployment

---

# 48. Definition of Done

The product is considered ready for production when:

- all public pages are responsive
- navigation works
- content is editable
- consultation booking works
- availability is backend-controlled
- double booking is prevented
- payment verification is server-side
- admin authentication works
- RLS policies protect private data
- admin roles work
- analytics are connected
- daily reports work
- notifications work
- content management works
- exports work
- system errors are visible to admins
- no secrets are exposed
- mobile experience is tested
- accessibility basics are implemented
- performance is acceptable
- privacy/legal documents are present
- production security review is completed

---

# 49. Product Principle

The central principle of this product is:

> **Premium on the outside. Powerful on the inside.**

The public website should communicate:

**Trust. Clarity. Professionalism. Privacy.**

The admin system should provide:

**Control. Visibility. Accuracy. Security.**

The entire product should feel like a modern digital extension of a private professional practice rather than a collection of disconnected web pages.
