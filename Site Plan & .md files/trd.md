# Technical Requirements Document (TRD)
# Adv. Kriti Malviya — Legal & Relationship Counselling Website

**Document:** `trd.md`  
**Version:** 1.0  
**Status:** Technical Architecture Baseline  
**Last Updated:** 2026-10-07

---

## 1. Technical Overview

This document defines the technical architecture, infrastructure, integrations, security model, database design, application behavior, deployment strategy, and implementation requirements for the Adv. Kriti Malviya website.

The system consists of:

1. Public professional website
2. Consultation and appointment request system
3. Payment system
4. Contact/lead forms
5. Content management system
6. Private admin control panel
7. Analytics and reporting
8. Notification system
9. Backend/database infrastructure

---

# 2. Confirmed Technology Stack

The project will use the following services:

| Technology / Service | Purpose |
|---|---|
| HTML5 | Public website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Supabase | Database, Auth, backend services, RLS, Edge Functions |
| Google Drive | Image/file source and media management |
| Resend | Transactional email delivery |
| Formspree | Public contact/form submissions where appropriate |
| PhonePe | Consultation payment gateway |
| Hostinger | Production hosting |
| YouTube | Vlog/video hosting and embeds |

Important:

The architecture must clearly separate:

- frontend/public code
- backend logic
- secrets
- database access
- third-party integrations

No private API credentials may be placed in frontend JavaScript.

---

# 3. High-Level Architecture

The system should follow:

```text
                         INTERNET
                            │
                            ▼
                     ┌──────────────┐
                     │  Hostinger   │
                     │ Static/Web   │
                     │   Hosting    │
                     └──────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       PUBLIC WEBSITE              ADMIN APPLICATION
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Supabase   │
                     │              │
                     │ PostgreSQL   │
                     │ Auth         │
                     │ RLS          │
                     │ Storage*     │
                     │ Edge Funcs   │
                     └──────┬───────┘
                            │
        ┌───────────────────┼────────────────────┐
        │                   │                    │
        ▼                   ▼                    ▼
    PhonePe              Resend              Formspree
    Payments             Email               Forms
        │
        │
        ▼
    Payment
 Verification
```

Google Drive and YouTube are primarily external media/content services.

`*` Supabase Storage is optional because the current project specifically uses Google Drive for image/media references.

---

# 4. Hosting Architecture

## 4.1 Hostinger

Hostinger is the primary production hosting provider for the public frontend.

The public website will be deployed as static web assets.

Expected structure:

```text
public_html/
│
├── index.html / hero.html
├── gallery.html
├── awards.html
├── vlog.html
├── blog.html
├── consultation.html
├── payment.html
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── icons/
│
└── optional supporting files
```

The exact deployment structure may be simplified depending on the final routing setup.

## 4.2 HTTPS

Production must use HTTPS.

All API calls must use HTTPS.

No sensitive information should be submitted over insecure HTTP.

---

# 5. Frontend Architecture

The initial public website should remain lightweight.

Primary technologies:

- HTML5
- CSS3
- Vanilla JavaScript

Avoid unnecessary frameworks unless a future requirement justifies them.

Public pages:

```text
hero.html
gallery.html
awards.html
vlog.html
blog.html
consultation.html
payment.html
```

Admin:

```text
admin.html
```

The pages should share:

- design language
- navigation
- typography
- responsive behavior
- accessibility conventions

However, standalone pages should not unexpectedly modify one another.

---

# 6. Public Website Architecture

## 6.1 Homepage

The homepage contains:

- header
- navigation
- relationship counselling navigation
- legal counselling navigation
- hero
- about advocate
- about us
- CTA sections
- footer

The homepage may eventually consume editable content from Supabase.

## 6.2 Gallery

Gallery data should support:

- Google Drive image URLs
- title
- category
- featured state
- visibility
- ordering

The frontend should dynamically render images.

## 6.3 Awards

Achievement data:

```text
year
title
category
description
image
featured
visible
order
```

Professional milestones must remain distinct from actual awards.

## 6.4 Vlog

Vlog uses YouTube URLs.

The frontend extracts the YouTube video ID.

Supported:

```text
youtube.com/watch?v=ID
youtu.be/ID
youtube.com/shorts/ID
```

YouTube thumbnails may be generated from the public YouTube thumbnail endpoints where appropriate.

Full iframes should be loaded only when required.

## 6.5 Blog

Blog data should support:

```text
id
title
excerpt
content
category
date
image
featured
read_time
status
created_at
updated_at
```

Content must be sanitized before rendering.

Do not use unsanitized administrator-entered HTML directly in the DOM.

---

# 7. Google Drive Integration

Google Drive is the preferred source for website images/media supplied by the client.

## Requirements

The system should support:

- publicly accessible Google Drive files
- image references
- shareable file URLs
- preview/image-compatible URLs where required

Important:

A normal Google Drive sharing URL is not automatically guaranteed to work directly inside an HTML `<img>`.

Therefore, the implementation should support an administrator-provided image URL format compatible with browser rendering.

The system must NOT:

- bypass Google Drive permissions
- expose private files
- attempt unauthorized access
- scrape private Drive data

## Recommended Data Model

Store the URL as data:

```text
image_url
```

rather than hardcoding images throughout HTML.

Example:

```javascript
{
  src: "GOOGLE_DRIVE_IMAGE_URL",
  title: "Professional Event",
  category: "Events"
}
```

---

# 8. YouTube Integration

YouTube is the video hosting platform.

The site does not need to host video files itself.

Store:

```text
youtube_url
youtube_video_id
title
description
category
date
featured
status
```

The frontend should derive the video ID where possible.

## Performance

Do not load every YouTube iframe immediately.

Use:

1. thumbnail first
2. iframe only when opened
3. optional desktop hover preview
4. no sound autoplay

Respect YouTube embedding restrictions.

---

# 9. Supabase Architecture

Supabase is the central backend.

Services used:

- PostgreSQL database
- Supabase Auth
- Row Level Security
- Edge Functions
- optional Storage
- database triggers/functions where appropriate

---

# 10. Database Design

Recommended tables:

```text
profiles
customers
bookings
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

---

# 11. Profiles / Admin Users

Table:

```text
profiles
```

Suggested fields:

```text
id UUID PRIMARY KEY
email TEXT
full_name TEXT
role TEXT
status TEXT
created_at TIMESTAMP
last_login TIMESTAMP
updated_at TIMESTAMP
```

Roles:

```text
super_admin
admin
editor
viewer
```

Supabase Auth remains responsible for credentials.

The `profiles` table stores application-level profile and role information.

Never store raw passwords.

---

# 12. Customers Table

Suggested structure:

```text
customers
```

Fields:

```text
id UUID
full_name TEXT
email TEXT
phone TEXT
whatsapp TEXT
country TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
last_activity TIMESTAMP
status TEXT
```

Potential statuses:

```text
active
inactive
blocked
```

Only necessary customer information should be stored.

---

# 13. Bookings Table

Suggested fields:

```text
bookings
```

```text
id UUID
booking_reference TEXT UNIQUE
customer_id UUID
consultation_type TEXT
service_id UUID
date DATE
start_time TIME
end_time TIME
duration_minutes INTEGER
mode TEXT
short_description TEXT
preferred_contact TEXT
status TEXT
payment_status TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

Booking status:

```text
PENDING_PAYMENT
PENDING
CONFIRMED
RESCHEDULED
COMPLETED
CANCELLED
```

Payment status:

```text
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
VERIFICATION_PENDING
```

---

# 14. Availability Architecture

Tables:

```text
availability
blocked_dates
```

Availability should support:

- day of week
- start time
- end time
- duration
- active state

Blocked dates support:

- date
- reason
- created_by
- active

Special availability can be represented using an appropriate exception model.

---

# 15. Double Booking Prevention

Double booking prevention MUST NOT rely only on JavaScript.

The backend/database must enforce slot availability.

Recommended approach:

1. frontend requests availability
2. backend checks current slot
3. backend creates/reserves booking atomically
4. conflicting booking fails
5. frontend receives the actual result

Database constraints, transactions, locking, or an equivalent safe reservation mechanism should be used.

Two users attempting the same slot simultaneously must not both succeed.

---

# 16. Services Table

Suggested fields:

```text
services
```

```text
id UUID
title TEXT
category TEXT
description TEXT
duration_minutes INTEGER
fee NUMERIC
visible BOOLEAN
sort_order INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

Categories:

```text
LEGAL
RELATIONSHIP
PERSONAL
```

The administrator can add/edit/archive services.

---

# 17. Gallery Table

Suggested fields:

```text
gallery_items
```

```text
id UUID
title TEXT
category TEXT
image_url TEXT
featured BOOLEAN
visible BOOLEAN
sort_order INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

Images may point to Google Drive.

---

# 18. Achievements Table

Suggested fields:

```text
achievements
```

```text
id UUID
year INTEGER
title TEXT
category TEXT
description TEXT
image_url TEXT
featured BOOLEAN
visible BOOLEAN
sort_order INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

The system must not automatically create fictional achievements.

---

# 19. Videos Table

Suggested fields:

```text
videos
```

```text
id UUID
youtube_url TEXT
youtube_video_id TEXT
title TEXT
description TEXT
category TEXT
video_date DATE
featured BOOLEAN
visible BOOLEAN
sort_order INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

# 20. Blog Posts Table

Suggested fields:

```text
blog_posts
```

```text
id UUID
title TEXT
slug TEXT UNIQUE
excerpt TEXT
content TEXT
category TEXT
published_at TIMESTAMP
image_url TEXT
featured BOOLEAN
read_time INTEGER
status TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

Statuses:

```text
DRAFT
PUBLISHED
ARCHIVED
```

---

# 21. Site Content Architecture

Dynamic content should be stored separately from application configuration where possible.

Possible table:

```text
site_content
```

Fields:

```text
id UUID
section_key TEXT UNIQUE
content JSONB
updated_by UUID
updated_at TIMESTAMP
```

Example section keys:

```text
homepage_hero
homepage_about
homepage_about_us
contact_information
footer
```

JSONB allows content to evolve without creating a new database table for every text block.

---

# 22. Site Settings

Table:

```text
site_settings
```

Possible fields/configuration:

```text
site_name
logo_url
favicon_url
contact_email
phone
whatsapp
maintenance_mode
booking_enabled
payment_enabled
blog_enabled
gallery_enabled
default_seo_title
default_seo_description
updated_at
```

Sensitive credentials must NOT be stored here.

---

# 23. Payment Architecture — PhonePe

The project will use **PhonePe** as the consultation payment gateway.

The architecture should follow:

```text
Customer
   │
   ▼
payment.html
   │
   ▼
Supabase Edge Function
   │
   ▼
PhonePe payment/order API
   │
   ▼
PhonePe Checkout / Payment Flow
   │
   ▼
Customer completes payment
   │
   ▼
PhonePe callback/status
   │
   ▼
Supabase Edge Function
   │
   ▼
Verify payment
   │
   ▼
Update payments table
   │
   ▼
Update booking payment status
   │
   ▼
Send confirmation email
```

The exact PhonePe API version/endpoints should be confirmed from the current PhonePe merchant/developer documentation during implementation.

Do not hardcode assumptions about the current PhonePe API.

---

# 24. PhonePe Security

PhonePe credentials must remain server-side.

Never expose:

- merchant secret
- client secret
- private API credentials
- signing keys

Frontend should communicate only with the secure backend endpoint.

The frontend must never decide:

```text
payment = successful
```

The backend must verify the actual PhonePe transaction status.

---

# 25. Payments Table

Suggested fields:

```text
payments
```

```text
id UUID
booking_id UUID
customer_id UUID
gateway TEXT
gateway_transaction_id TEXT
gateway_order_id TEXT
amount NUMERIC
currency TEXT
status TEXT
payment_method TEXT
gateway_response JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
verified_at TIMESTAMP
```

Avoid storing unnecessary sensitive payment information.

Never store:

- card number
- CVV
- UPI PIN
- bank password

---

# 26. Payment Verification

Payment confirmation flow:

```text
Create payment
       ↓
PhonePe transaction
       ↓
Customer payment
       ↓
PhonePe callback/status
       ↓
Server-side verification
       ↓
Transaction marked PAID
       ↓
Booking updated
       ↓
Confirmation notification
```

The booking should not be treated as fully paid merely because the browser returns successfully.

---

# 27. Formspree Integration

Formspree should be used for public form submissions where appropriate, especially the contact/inquiry form.

Potential form:

```text
contact.html / contact section
```

Fields may include:

- name
- email
- phone
- subject
- message

Formspree endpoint should be stored/configured safely and not hardcoded as a secret.

Important:

Formspree should not replace the core booking database.

Consultation bookings should ultimately be stored in Supabase so that:

- availability can be managed
- double booking can be prevented
- admin can manage bookings
- payment status can be linked
- reporting can be generated

---

# 28. Resend Email Architecture

Resend will be used for transactional emails.

Examples:

```text
Consultation request received
Consultation confirmed
Consultation rescheduled
Consultation cancelled
Payment received
Payment failed
Consultation reminder
Contact notification
Admin daily report
```

Architecture:

```text
Frontend
   │
   ▼
Supabase Edge Function
   │
   ▼
Resend API
   │
   ▼
Recipient
```

Resend API keys must never be exposed to the browser.

---

# 29. Email Templates

Email templates should be centrally managed.

Suggested templates:

```text
consultation_received
consultation_confirmed
consultation_rescheduled
consultation_cancelled
payment_success
payment_failed
consultation_reminder
contact_received
daily_admin_report
```

Templates should include dynamic variables such as:

```text
{{customer_name}}
{{booking_reference}}
{{consultation_type}}
{{date}}
{{time}}
{{mode}}
{{amount}}
```

The server must validate template variables.

---

# 30. Daily Report Generation

Daily reports can be generated server-side.

Potential process:

```text
Daily scheduled function
        ↓
Aggregate previous day's data
        ↓
Visitors / analytics
Bookings
Customers
Payments
Revenue
Content changes
Errors
        ↓
Create daily_reports row
        ↓
Send admin report using Resend
```

The actual scheduler should use the selected Supabase/hosting scheduling mechanism.

---

# 31. Analytics Architecture

Analytics should be privacy-conscious.

Possible event table:

```text
analytics_events
```

Fields:

```text
id UUID
session_id TEXT
event_name TEXT
page_path TEXT
referrer TEXT
device_type TEXT
timestamp TIMESTAMP
metadata JSONB
```

Avoid collecting unnecessary personally identifiable information.

Potential events:

```text
page_view
consultation_view
consultation_started
consultation_submitted
payment_started
payment_completed
blog_opened
video_opened
gallery_opened
contact_submitted
```

---

# 32. Analytics Data

Admin dashboard can calculate:

- visitors
- page views
- sessions
- consultation funnel
- traffic sources
- top pages
- content engagement
- device breakdown
- payment conversion

If an external analytics provider is later used, the admin architecture should allow it to be integrated without rewriting the public website.

---

# 33. Admin Application Architecture

`admin.html` is the private control interface.

Main sections:

```text
Dashboard
Analytics
Daily Reports

Consultations
Customers
Payments
Availability
Notifications

Homepage
About
Services
Gallery
Awards
Vlog
Blog

Contact
Website Settings
SEO

Activity Logs
Error Logs
System Health
Admin Users

Export
Settings
Logout
```

---

# 34. Admin Authentication Flow

```text
admin.html
    ↓
Supabase Auth
    ↓
Authenticated session
    ↓
Read profile
    ↓
Check role
    ↓
Authorized?
 ┌───────┴────────┐
YES               NO
 ↓                 ↓
Dashboard       Access Denied
```

The frontend must not assume that a user is an admin simply because they successfully authenticated.

---

# 35. Row Level Security

RLS must be enabled for all sensitive Supabase tables.

Example conceptual permissions:

### Public

May read:

- published blog posts
- visible gallery items
- visible achievements
- visible videos
- visible services

### Authenticated Customer

May access only data explicitly associated with their permitted workflow.

### Admin

May manage operational records according to role.

### Super Admin

May manage:

- admins
- permissions
- sensitive system settings

The exact SQL policies belong in the implementation/security phase.

---

# 36. Role Permissions

## Super Admin

Full access.

## Admin

Operational access:

- bookings
- customers
- payments
- availability
- notifications
- content

## Editor

Content:

- blog
- gallery
- vlog
- achievements
- selected site content

## Viewer

Read-only dashboard/report access.

---

# 37. Activity Logs

Table:

```text
activity_logs
```

Suggested fields:

```text
id UUID
admin_id UUID
action TEXT
target_type TEXT
target_id UUID
metadata JSONB
created_at TIMESTAMP
```

Examples:

```text
LOGIN
CREATE_BOOKING
UPDATE_BOOKING
CANCEL_BOOKING
UPDATE_PAYMENT
CREATE_BLOG
PUBLISH_BLOG
UPDATE_GALLERY
UPDATE_SETTINGS
CHANGE_AVAILABILITY
```

Do not log sensitive secrets.

---

# 38. Error Logs

Table:

```text
error_logs
```

Suggested fields:

```text
id UUID
severity TEXT
module TEXT
message TEXT
metadata JSONB
resolved BOOLEAN
created_at TIMESTAMP
resolved_at TIMESTAMP
resolved_by UUID
```

---

# 39. Notification Architecture

Table:

```text
notifications
```

Fields:

```text
id UUID
recipient_id UUID
type TEXT
title TEXT
message TEXT
read BOOLEAN
created_at TIMESTAMP
```

Notification types:

```text
BOOKING
PAYMENT
CUSTOMER
SYSTEM
CONTENT
ERROR
```

---

# 40. Admin Content Management

Admin should be able to modify:

### Homepage

- hero content
- CTA
- about content
- selected sections

### About

- biography
- professional information
- statistics
- counselling information

### Services

- add
- edit
- archive
- reorder

### Gallery

- add image
- edit
- feature
- hide
- reorder

### Achievements

- add
- edit
- archive
- feature

### Vlog

- add YouTube URL
- edit metadata
- feature
- hide

### Blog

- create
- edit
- draft
- publish
- unpublish
- archive
- feature

---

# 41. Google Drive Media Workflow

Recommended operational workflow:

```text
Administrator uploads image to Google Drive
            ↓
Sets appropriate sharing/access
            ↓
Copies compatible image URL
            ↓
Adds image through Admin CMS
            ↓
URL stored in gallery_items
            ↓
Public gallery renders image
```

The system does not need to copy every image into Supabase Storage.

Supabase Storage can be introduced later if required.

---

# 42. Contact Workflow

```text
Visitor
  ↓
Contact form
  ↓
Formspree
  ↓
Email notification
```

Where appropriate, a server-side integration may also create an internal lead/contact record.

The architecture should avoid creating duplicate sources of truth.

For consultation requests, Supabase remains the operational source of truth.

---

# 43. Consultation Workflow

```text
Visitor
   ↓
consultation.html
   ↓
Select service
   ↓
Select date/time
   ↓
Backend availability check
   ↓
Enter customer details
   ↓
Create booking
   ↓
Payment if required
   ↓
PhonePe
   ↓
Server verification
   ↓
Booking payment updated
   ↓
Resend confirmation
   ↓
Admin notification
```

---

# 44. Booking Reference

Every booking should receive a unique reference.

Example:

```text
KM-20261007-XXXX
```

The exact generation algorithm should guarantee uniqueness.

The reference must be generated server-side.

---

# 45. Payment / Booking State Machine

Conceptual flow:

```text
PENDING
   ↓
PENDING_PAYMENT
   ↓
PAYMENT_PROCESSING
   ↓
PAID
   ↓
CONFIRMED
   ↓
COMPLETED
```

Failure paths:

```text
PAYMENT_FAILED
PAYMENT_CANCELLED
VERIFICATION_PENDING
CANCELLED
RESCHEDULED
```

Payment state and booking state should remain separate.

---

# 46. Security Requirements

## Frontend

Never store:

- private API keys
- service-role keys
- payment secrets
- Resend API keys

Do not rely on localStorage for sensitive authority.

Session handling should use Supabase Auth.

## Backend

Use:

- RLS
- authorization checks
- validation
- rate limiting where necessary
- secure Edge Functions
- server-side payment verification
- audit logging

---

# 47. Input Validation

Validate on both:

### Frontend

For usability.

### Backend

For security/integrity.

Validate:

- email
- phone
- dates
- time slots
- booking references
- IDs
- amounts
- content lengths
- allowed enum values

Never trust frontend validation.

---

# 48. Content Security

Administrator-entered rich content must be sanitized.

Prevent:

- XSS
- malicious HTML
- script injection
- unsafe iframe injection

Only allow approved content formats.

YouTube embeds should be generated from validated video IDs rather than arbitrary iframe URLs.

---

# 49. Rate Limiting / Abuse Protection

Potential protection areas:

- login attempts
- contact forms
- booking requests
- payment creation
- password reset
- admin API endpoints

Use backend/server-side protection where appropriate.

---

# 50. CORS / API Access

Public frontend hosted on Hostinger will communicate with Supabase over HTTPS.

Supabase endpoints/functions should be configured to accept only the required origins where practical.

The exact production domain should be added to the appropriate Supabase/Auth configuration.

---

# 51. Environment Variables / Secrets

Secrets must exist only in secure server-side configuration.

Potential secrets:

```text
SUPABASE_SERVICE_ROLE_KEY
PHONEPE_CLIENT_SECRET
PHONEPE_MERCHANT_SECRET
RESEND_API_KEY
FORM_PROVIDER_PRIVATE_CONFIGURATION
```

The exact names depend on implementation.

Frontend may safely contain only public configuration such as:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

provided they are appropriately protected by RLS and are intended for client use.

---

# 52. Backup Strategy

Production database backups should be configured through the selected Supabase plan/infrastructure.

Critical content should be exportable.

Admin should be able to export:

- bookings
- customers
- payments
- blog
- gallery
- achievements
- videos
- reports

Google Drive remains an external media source and should be backed up/organized independently by the business owner.

---

# 53. Deployment

## Hostinger

Upload production website files to the configured Hostinger web root.

Ensure:

- HTTPS
- correct domain
- correct DNS
- correct file permissions
- production configuration

## Supabase

Configure:

- project
- database
- Auth
- RLS
- Edge Functions
- secrets
- production URL configuration

## PhonePe

Configure production merchant/payment credentials only on the backend.

## Resend

Configure:

- sending domain
- DNS records
- verified sender
- API key server-side

## Formspree

Configure:

- production form endpoint
- allowed destination
- spam protection

---

# 54. Development Environments

At minimum, distinguish:

```text
DEVELOPMENT
STAGING / TEST
PRODUCTION
```

Payment testing must never accidentally use production credentials.

PhonePe test/sandbox configuration should be used where available before production.

---

# 55. Logging Policy

Logs should help diagnose:

- booking failures
- payment failures
- email failures
- authentication failures
- database failures
- content publishing errors
- availability conflicts

Logs should NOT contain:

- passwords
- payment secrets
- card numbers
- CVV
- UPI PIN
- private API keys
- unnecessary confidential consultation details

---

# 56. Error Handling

Every major frontend operation needs:

### Loading

```text
LOADING...
```

### Success

```text
ACTION COMPLETED
```

### Failure

```text
ACTION FAILED
```

### Empty

```text
NO DATA AVAILABLE
```

### Backend unavailable

```text
BACKEND CONNECTION UNAVAILABLE
```

The interface must never claim success if the backend operation failed.

---

# 57. Admin Dashboard Performance

Use:

- pagination
- debounced search
- database filtering
- database sorting
- lazy loading
- limited queries
- selective joins
- caching where appropriate

Avoid downloading the complete database into the browser.

---

# 58. Frontend Performance

Public pages should use:

- lazy images
- efficient CSS
- native APIs
- minimal dependencies
- deferred scripts
- optimized media
- responsive image sizing

Avoid large JavaScript frameworks for simple pages unless later requirements justify them.

---

# 59. Accessibility

Implement:

- semantic HTML
- accessible labels
- keyboard navigation
- visible focus
- ARIA where necessary
- accessible modals
- readable contrast
- reduced-motion support
- proper form error messages

---

# 60. SEO Technical Requirements

Each public page should have:

```text
<title>
<meta name="description">
canonical URL
Open Graph metadata
Twitter/social metadata where appropriate
```

The admin CMS should eventually allow authorized administrators to edit SEO metadata.

Important public pages:

- Home
- About
- Gallery
- Awards
- Vlog
- Blog
- Consultation

---

# 61. URL / Navigation Architecture

The final production URLs may use clean paths even if development uses standalone HTML files.

Example:

```text
/
 /gallery
 /awards
 /vlog
 /blog
 /consultation
 /payment
 /admin
```

Hostinger rewrite/routing configuration can be used if needed.

Do not expose unnecessary internal database or API paths.

---

# 62. Admin Content Publishing Model

Content should support:

```text
DRAFT
    ↓
REVIEW
    ↓
PUBLISHED
    ↓
ARCHIVED
```

For the initial version, `DRAFT / PUBLISHED / ARCHIVED` may be sufficient.

---

# 63. Admin Destructive Actions

Require confirmation for:

- delete
- archive
- cancellation
- refund
- blocking all bookings
- maintenance mode
- admin role changes
- deletion of content

Highly destructive actions may require typing:

```text
CONFIRM
```

---

# 64. Maintenance Mode

Website settings may include:

```text
maintenance_mode
```

If enabled:

- public site can show a maintenance page
- admin remains accessible
- booking/payment operations should be intentionally controlled
- users must not be presented with misleading booking/payment availability

Maintenance mode changes should require confirmation.

---

# 65. Third-Party Integration Summary

## Google Drive

Purpose:

- website images/media

Direction:

```text
Google Drive → Public Website
```

## YouTube

Purpose:

- video hosting

Direction:

```text
YouTube → Public Website
```

## Formspree

Purpose:

- public contact/inquiry forms

Direction:

```text
Visitor → Formspree → Notification
```

## Resend

Purpose:

- transactional email

Direction:

```text
Supabase/Edge Function → Resend → Recipient
```

## PhonePe

Purpose:

- consultation payment

Direction:

```text
Website → Supabase Edge Function → PhonePe
PhonePe → Backend Verification → Supabase
```

## Supabase

Purpose:

- database
- authentication
- authorization
- backend
- booking system
- admin system
- reporting
- secure integrations

## Hostinger

Purpose:

- production frontend hosting

---

# 66. Source of Truth

The architecture should establish clear sources of truth.

| Data | Source of Truth |
|---|---|
| Customers | Supabase |
| Bookings | Supabase |
| Availability | Supabase |
| Payment status | Supabase after PhonePe verification |
| Blog | Supabase |
| Gallery metadata | Supabase |
| Gallery media | Google Drive |
| Achievements | Supabase |
| Vlog metadata | Supabase |
| Videos | YouTube |
| Contact submissions | Formspree initially |
| Transactional email | Resend |
| Admin identity | Supabase Auth |
| Admin permissions | Supabase/RLS |
| Public frontend | Hostinger |

---

# 67. Testing Requirements

Before launch, test:

## Frontend

- navigation
- mobile layout
- desktop layout
- forms
- validation
- animations
- accessibility

## Booking

- valid booking
- unavailable slot
- simultaneous booking
- blocked date
- cancelled booking
- reschedule
- confirmation

## Payment

- successful payment
- failed payment
- cancelled payment
- invalid callback
- repeated callback
- duplicate payment attempt
- verification failure

## Admin

- login
- logout
- unauthorized account
- role permissions
- content editing
- booking management
- customer access
- exports
- activity logs

## Email

- successful send
- failed send
- invalid recipient
- template rendering

## Security

- RLS
- authorization
- XSS
- SQL injection resistance through parameterized queries
- secret exposure
- unauthorized API calls
- privilege escalation

---

# 68. Production Checklist

Before launch:

```text
[ ] Hostinger HTTPS active
[ ] Domain configured
[ ] Supabase production project ready
[ ] Database schema deployed
[ ] RLS enabled
[ ] Auth configured
[ ] Admin roles tested
[ ] Edge Functions deployed
[ ] PhonePe production configuration verified
[ ] Resend domain verified
[ ] Formspree production form configured
[ ] Google Drive media permissions checked
[ ] YouTube embeds tested
[ ] Booking flow tested
[ ] Double booking protection tested
[ ] Payment verification tested
[ ] Email notifications tested
[ ] Analytics tested
[ ] Daily reports tested
[ ] Admin exports tested
[ ] Error logging tested
[ ] Privacy/legal pages added
[ ] Mobile testing completed
[ ] Accessibility checks completed
[ ] Performance checks completed
[ ] Secrets removed from frontend
[ ] Production security review completed
```

---

# 69. Technical Principles

## Principle 1 — Backend is the Authority

Never trust browser state for:

- payment
- booking
- authorization
- pricing
- availability

## Principle 2 — Secrets Stay Server-Side

PhonePe, Resend and other private credentials must never enter public JavaScript.

## Principle 3 — Supabase is the Operational Core

Bookings, customers, payments, content, admin roles, availability and reports should be centered around Supabase.

## Principle 4 — Google Drive is the Media Source

Do not unnecessarily duplicate client media into the application database.

## Principle 5 — Hostinger Hosts the Website

Public frontend assets are deployed to Hostinger.

## Principle 6 — Third-Party Services Have Clear Boundaries

Each integration should have one clear responsibility.

## Principle 7 — No Fake Functionality

If a backend feature is not connected, the UI must say so instead of pretending it worked.

## Principle 8 — Privacy First

Legal and counselling-related data must be handled with additional care.

---

# 70. Final Technical Architecture

The final system should conceptually operate as:

```text
                         ┌──────────────────────┐
                         │       VISITOR        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      HOSTINGER       │
                         │   Public Website     │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        Google Drive             YouTube              Supabase
          Images                 Videos               Backend
                                                        │
                            ┌───────────────────────────┼─────────────────────┐
                            │                           │                     │
                            ▼                           ▼                     ▼
                       PostgreSQL                    Auth               Edge Functions
                            │                           │                     │
                            │                           │             ┌───────┼────────┐
                            │                           │             │       │        │
                            │                           │             ▼       ▼        ▼
                            │                           │          PhonePe  Resend  Other
                            │                           │          Payment   Email   APIs
                            │                           │
                            ▼                           ▼
                     Admin / CMS                  Admin Roles
                            │
                            ▼
                       admin.html
```

---

# 71. Final Technical Objective

The finished product should not merely be a collection of HTML pages.

It should be a connected digital platform where:

```text
PUBLIC WEBSITE
       ↓
CONTENT
       ↓
CONSULTATION
       ↓
BOOKING
       ↓
PHONEPE PAYMENT
       ↓
SUPABASE VERIFICATION
       ↓
RESEND NOTIFICATION
       ↓
ADMIN CONTROL CENTER
       ↓
ANALYTICS + REPORTING
```

The technical objective is:

**Premium frontend + secure backend + centralized administration + reliable booking + verified payment + maintainable content system.**

The implementation should prioritize correctness, security, privacy, performance, maintainability, and clear separation of responsibilities between Hostinger, Supabase, Google Drive, Resend, Formspree, PhonePe, and YouTube.
