# Backend Schema
# Adv. Kriti Malviya — Legal & Relationship Counselling Website

**Document:** `backend_schema.md`  
**Version:** 1.0  
**Status:** Backend database and integration schema baseline  
**Last Updated:** 2026-10-07

---

# 1. Purpose

This document defines the proposed backend data model for the Adv. Kriti Malviya website.

The backend is centered around **Supabase PostgreSQL** and supports:

- customer records
- consultation bookings
- availability
- payments
- PhonePe integration
- admin authentication/roles
- website CMS
- gallery
- achievements
- Vlog
- Blog
- notifications
- analytics
- daily reports
- activity logs
- error logs
- system settings

External services:

- **Hostinger** — frontend hosting
- **Supabase** — backend/database/auth
- **Google Drive** — website image/media source
- **YouTube** — video hosting
- **Resend** — transactional email
- **Formspree** — public contact forms
- **PhonePe** — payment gateway

---

# 2. Architecture

```text
                         HOSTINGER
                    Public Website/Admin
                             │
                             ▼
                         SUPABASE
             ┌───────────────┼────────────────┐
             │               │                │
          PostgreSQL       Auth          Edge Functions
             │               │                │
             ▼               ▼                ├────────── PhonePe
       Application Data   Admin Roles          ├────────── Resend
                                                └────────── Other APIs
             │
             ├──────── Google Drive → Images
             └──────── YouTube → Videos

Formspree
   ↑
Public Contact Form
```

Supabase PostgreSQL is the operational source of truth for application data.

---

# 3. Core Design Principles

## 3.1 Database Is the Authority

The browser must never be trusted for:

- booking availability
- payment status
- payment amount
- admin authorization
- customer identity
- booking status
- refunds

## 3.2 Secrets Are Server-Side

Never store private credentials in:

- HTML
- CSS
- frontend JavaScript
- localStorage
- public database fields

Server-side secrets include:

- PhonePe credentials
- Resend API key
- Supabase service-role key
- other private API credentials

## 3.3 RLS Everywhere It Matters

Row Level Security must protect private tables.

## 3.4 Public Content Is Separate From Private Data

Public website content can be readable when marked `visible/published`.

Private operational records require authenticated authorization.

## 3.5 Statuses Are Explicit

Booking, payment, content, and admin states should use controlled values.

---

# 4. PostgreSQL Extensions / Types

Supabase PostgreSQL should use UUIDs.

Recommended:

```sql
gen_random_uuid()
```

where supported by the Supabase environment.

Recommended timestamp:

```sql
timestamptz
```

Recommended money type:

```sql
numeric(12,2)
```

Do not use floating point for monetary amounts.

---

# 5. Enum Strategy

The implementation may use PostgreSQL enums or validated text fields.

For maintainability, controlled text values may initially be preferred.

Recommended status values:

```text
booking_status:
PENDING_PAYMENT
PENDING
CONFIRMED
RESCHEDULED
COMPLETED
CANCELLED
```

```text
payment_status:
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
VERIFICATION_PENDING
```

```text
content_status:
DRAFT
PUBLISHED
ARCHIVED
```

```text
admin_role:
SUPER_ADMIN
ADMIN
EDITOR
VIEWER
```

---

# 6. `profiles`

Application-level profile for authenticated users.

Supabase Auth remains responsible for authentication credentials.

## Columns

```text
id                  UUID PRIMARY KEY
email               TEXT
full_name           TEXT
role                TEXT
status              TEXT
avatar_url           TEXT NULL
created_at           TIMESTAMPTZ
updated_at           TIMESTAMPTZ
last_login           TIMESTAMPTZ NULL
```

## Relationships

```text
profiles.id
    ↓
customers.user_id (optional)
```

```text
profiles.id
    ↓
activity_logs.admin_id
```

```text
profiles.id
    ↓
notifications.recipient_id
```

## Role Values

```text
SUPER_ADMIN
ADMIN
EDITOR
VIEWER
```

## Security

Users must not be allowed to change their own role from the client.

Role changes require privileged backend authorization.

---

# 7. `customers`

Stores customer/client records associated with consultation activity.

## Columns

```text
id                  UUID PRIMARY KEY
user_id             UUID NULL
full_name           TEXT NOT NULL
email               TEXT NOT NULL
phone               TEXT NULL
whatsapp             TEXT NULL
country              TEXT NULL
status              TEXT DEFAULT 'ACTIVE'
created_at           TIMESTAMPTZ
updated_at           TIMESTAMPTZ
last_activity        TIMESTAMPTZ NULL
```

## Relationships

```text
customers.id
    ↓
bookings.customer_id
```

```text
customers.id
    ↓
payments.customer_id
```

## Notes

- Customer passwords are never stored here.
- Authentication belongs to Supabase Auth.
- Do not store unnecessary sensitive counselling/legal information.
- Email should be indexed.
- Phone may be indexed where required for operational search.

---

# 8. `services`

Stores legal and counselling service definitions.

## Columns

```text
id                  UUID PRIMARY KEY
title               TEXT NOT NULL
slug                TEXT UNIQUE
category             TEXT NOT NULL
description          TEXT
duration_minutes     INTEGER
fee                  NUMERIC(12,2)
currency             TEXT DEFAULT 'INR'
visible              BOOLEAN DEFAULT TRUE
sort_order           INTEGER DEFAULT 0
created_at           TIMESTAMPTZ
updated_at           TIMESTAMPTZ
```

## Categories

```text
LEGAL
RELATIONSHIP
PERSONAL
```

## Known Legal Services

```text
Divorce Guidance
Property Purchase
Civil Cases
Human Rights
General Legal Consultation
```

## Known Relationship/Personal Services

```text
Couple Counselling
Relationship Concerns
Family Concerns
Break-up / Separation
Teenage Counselling
Emotional Well-being
General Counselling
```

The administrator may expand this list.

---

# 9. `availability`

Defines normal consultation working hours.

## Columns

```text
id                  UUID PRIMARY KEY
day_of_week         SMALLINT NOT NULL
start_time          TIME NOT NULL
end_time            TIME NOT NULL
slot_duration       INTEGER DEFAULT 60
active              BOOLEAN DEFAULT TRUE
created_by          UUID NULL
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

## Day Mapping

```text
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

## Example

```text
Monday
10:00
17:00
60 minutes
```

Multiple availability windows may exist for the same day.

---

# 10. `blocked_dates`

Stores dates where consultations are unavailable.

## Columns

```text
id                  UUID PRIMARY KEY
blocked_date        DATE NOT NULL UNIQUE
reason              TEXT NULL
created_by          UUID NULL
created_at          TIMESTAMPTZ
```

Examples:

```text
Holiday
Personal leave
Office closed
Special event
```

---

# 11. `availability_exceptions`

Optional table for special working dates.

This allows a normally unavailable date to become available.

## Columns

```text
id                  UUID PRIMARY KEY
exception_date      DATE NOT NULL
start_time          TIME NOT NULL
end_time            TIME NOT NULL
slot_duration       INTEGER DEFAULT 60
active              BOOLEAN DEFAULT TRUE
created_by          UUID NULL
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

This table is optional but recommended for future flexibility.

---

# 12. `bookings`

Core consultation appointment table.

## Columns

```text
id                      UUID PRIMARY KEY
booking_reference       TEXT UNIQUE NOT NULL
customer_id             UUID NOT NULL
service_id              UUID NULL
consultation_type       TEXT NOT NULL
date                    DATE NOT NULL
start_time              TIME NOT NULL
end_time                TIME NOT NULL
duration_minutes        INTEGER NOT NULL
mode                    TEXT NOT NULL
short_description       TEXT NULL
preferred_contact       TEXT NULL
status                  TEXT DEFAULT 'PENDING'
payment_status          TEXT DEFAULT 'PENDING'
created_at              TIMESTAMPTZ
updated_at              TIMESTAMPTZ
confirmed_at            TIMESTAMPTZ NULL
completed_at            TIMESTAMPTZ NULL
cancelled_at            TIMESTAMPTZ NULL
cancelled_by            UUID NULL
rescheduled_from        UUID NULL
```

## Consultation Types

```text
LEGAL
RELATIONSHIP
PERSONAL
```

## Modes

```text
ONLINE
IN_PERSON
```

## Booking Status

```text
PENDING_PAYMENT
PENDING
CONFIRMED
RESCHEDULED
COMPLETED
CANCELLED
```

## Payment Status

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

# 13. Booking Reference

Booking references must be generated server-side.

Recommended format:

```text
KM-YYYYMMDD-XXXX
```

Example:

```text
KM-20261007-4A92
```

The database must enforce uniqueness.

Do not rely on random frontend-generated references.

---

# 14. Double Booking Protection

The booking system must protect against simultaneous requests.

A simple frontend check is insufficient.

Recommended logic:

```text
Request slot
     ↓
Backend transaction
     ↓
Check blocked date
     ↓
Check normal availability
     ↓
Check existing active booking
     ↓
Reserve/create booking
     ↓
Commit
```

The database must prevent two active bookings from occupying the same consultation slot.

Possible implementation options:

- PostgreSQL exclusion constraints
- transaction locking
- atomic database function
- normalized slot table
- another equivalent transactional mechanism

The exact implementation should be selected during SQL implementation.

---

# 15. `payments`

Stores payment transactions.

## Columns

```text
id                          UUID PRIMARY KEY
booking_id                  UUID NOT NULL
customer_id                UUID NOT NULL
gateway                     TEXT DEFAULT 'PHONEPE'
gateway_order_id            TEXT NULL
gateway_transaction_id      TEXT NULL
amount                      NUMERIC(12,2) NOT NULL
currency                    TEXT DEFAULT 'INR'
status                      TEXT DEFAULT 'PENDING'
payment_method              TEXT NULL
gateway_response            JSONB NULL
created_at                  TIMESTAMPTZ
updated_at                  TIMESTAMPTZ
verified_at                 TIMESTAMPTZ NULL
refunded_at                 TIMESTAMPTZ NULL
```

## Important

Never store:

- card number
- CVV
- UPI PIN
- banking password

`gateway_response` must be reviewed carefully and must not become a storage location for unnecessary sensitive payment data.

---

# 16. PhonePe Integration

The current project uses **PhonePe**.

## Flow

```text
payment.html
     ↓
Supabase Edge Function
     ↓
Create PhonePe transaction/order
     ↓
Customer completes payment
     ↓
PhonePe response/callback/status
     ↓
Supabase Edge Function
     ↓
Verify transaction
     ↓
Update payments
     ↓
Update booking
     ↓
Send Resend email
```

## Server-Side Only

PhonePe secrets remain in Edge Function environment variables.

Potential conceptual secrets:

```text
PHONEPE_CLIENT_ID
PHONEPE_CLIENT_SECRET
PHONEPE_MERCHANT_ID
PHONEPE_SALT_KEY / SIGNING_SECRET
```

Exact credentials/names depend on the PhonePe merchant integration being used.

Do not assume these exact names or APIs without checking the current PhonePe documentation during implementation.

---

# 17. Payment Idempotency

PhonePe callbacks/status responses may be received more than once.

The backend must be idempotent.

If a payment is already:

```text
PAID
```

receiving the same successful callback again must not:

- create a second payment
- double-update revenue
- send duplicate confirmation unnecessarily
- create a second booking

Use unique gateway transaction/order identifiers.

---

# 18. `site_content`

Stores editable public website content.

## Columns

```text
id                  UUID PRIMARY KEY
section_key         TEXT UNIQUE NOT NULL
content             JSONB NOT NULL
updated_by          UUID NULL
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

## Example Keys

```text
homepage_hero
homepage_about
homepage_about_us
contact_information
footer
consultation_intro
```

## Example

```json
{
  "title": "Professional Legal Guidance",
  "subtitle": "Clear, practical and confidential support."
}
```

JSONB provides flexibility for different sections.

---

# 19. `site_settings`

Stores global website configuration.

## Columns

```text
id                      UUID PRIMARY KEY
site_name               TEXT
logo_url                TEXT
favicon_url             TEXT
contact_email           TEXT
phone                   TEXT
whatsapp                TEXT
maintenance_mode        BOOLEAN DEFAULT FALSE
booking_enabled         BOOLEAN DEFAULT TRUE
payment_enabled         BOOLEAN DEFAULT TRUE
blog_enabled            BOOLEAN DEFAULT TRUE
gallery_enabled         BOOLEAN DEFAULT TRUE
default_seo_title       TEXT
default_seo_description TEXT
updated_by              UUID NULL
updated_at              TIMESTAMPTZ
```

Do not store third-party private API secrets here.

---

# 20. `gallery_items`

Stores gallery metadata.

Google Drive remains the preferred media source.

## Columns

```text
id                  UUID PRIMARY KEY
title               TEXT
category            TEXT
image_url           TEXT NOT NULL
featured            BOOLEAN DEFAULT FALSE
visible             BOOLEAN DEFAULT TRUE
sort_order          INTEGER DEFAULT 0
alt_text            TEXT NULL
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
created_by          UUID NULL
```

## Media Source

```text
Google Drive
```

The URL should be compatible with browser image rendering.

---

# 21. Google Drive Rules

The backend stores the URL, not the actual private Drive credential.

The administrator is responsible for ensuring that the referenced file is accessible.

The system must not:

- bypass Drive permissions
- expose private Drive folders
- store Google account passwords
- attempt unauthorized file access

---

# 22. `achievements`

Stores awards and professional milestones.

## Columns

```text
id                  UUID PRIMARY KEY
year                INTEGER NULL
title               TEXT NOT NULL
category            TEXT
description         TEXT
image_url            TEXT NULL
featured            BOOLEAN DEFAULT FALSE
visible              BOOLEAN DEFAULT TRUE
sort_order          INTEGER DEFAULT 0
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
created_by          UUID NULL
```

## Categories

Potential categories:

```text
AWARD
PROFESSIONAL_MILESTONE
EXPERIENCE
MEDIATION
BANKING
OTHER
```

Known factual milestones:

```text
10+ years experience
500+ banking search reports
20+ mediations resolved
```

Do not automatically generate fictional awards.

---

# 23. `videos`

Stores Vlog metadata.

## Columns

```text
id                  UUID PRIMARY KEY
youtube_url         TEXT NOT NULL
youtube_video_id    TEXT
title               TEXT NOT NULL
description         TEXT
category            TEXT
video_date          DATE NULL
featured            BOOLEAN DEFAULT FALSE
visible             BOOLEAN DEFAULT TRUE
sort_order          INTEGER DEFAULT 0
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
created_by          UUID NULL
```

YouTube remains the video host.

---

# 24. `blog_posts`

Stores blog/journal content.

## Columns

```text
id                  UUID PRIMARY KEY
title               TEXT NOT NULL
slug                TEXT UNIQUE NOT NULL
excerpt             TEXT
content             TEXT
category            TEXT
image_url            TEXT NULL
featured            BOOLEAN DEFAULT FALSE
read_time            INTEGER NULL
status              TEXT DEFAULT 'DRAFT'
published_at         TIMESTAMPTZ NULL
created_by           UUID NULL
created_at           TIMESTAMPTZ
updated_at           TIMESTAMPTZ
```

## Status

```text
DRAFT
PUBLISHED
ARCHIVED
```

## Security

Rich content must be sanitized before public rendering.

Do not allow arbitrary scripts.

---

# 25. Blog Slugs

Slug should be:

- URL-safe
- unique
- stable after publishing where possible

Example:

```text
understanding-property-purchase-documents
```

If a published slug changes, consider a redirect strategy later.

---

# 26. `notifications`

Admin/system notifications.

## Columns

```text
id                  UUID PRIMARY KEY
recipient_id        UUID NOT NULL
type                TEXT NOT NULL
title               TEXT NOT NULL
message             TEXT
read                BOOLEAN DEFAULT FALSE
created_at          TIMESTAMPTZ
read_at             TIMESTAMPTZ NULL
```

## Types

```text
BOOKING
PAYMENT
CUSTOMER
SYSTEM
CONTENT
ERROR
```

---

# 27. `activity_logs`

Records important administrative actions.

## Columns

```text
id                  UUID PRIMARY KEY
admin_id             UUID NOT NULL
action               TEXT NOT NULL
target_type          TEXT NULL
target_id            UUID NULL
metadata             JSONB NULL
created_at           TIMESTAMPTZ
```

## Actions

Examples:

```text
LOGIN
LOGOUT
CREATE_BOOKING
UPDATE_BOOKING
CONFIRM_BOOKING
CANCEL_BOOKING
RESCHEDULE_BOOKING
UPDATE_PAYMENT
CREATE_BLOG
EDIT_BLOG
PUBLISH_BLOG
ARCHIVE_BLOG
ADD_GALLERY
EDIT_GALLERY
UPDATE_SETTINGS
UPDATE_AVAILABILITY
CHANGE_ADMIN_ROLE
EXPORT_DATA
```

Never store private credentials in metadata.

---

# 28. `error_logs`

Stores internal system errors.

## Columns

```text
id                  UUID PRIMARY KEY
severity             TEXT NOT NULL
module               TEXT NOT NULL
message              TEXT NOT NULL
metadata             JSONB NULL
resolved             BOOLEAN DEFAULT FALSE
created_at           TIMESTAMPTZ
resolved_at          TIMESTAMPTZ NULL
resolved_by          UUID NULL
```

## Severity

```text
INFO
WARNING
ERROR
CRITICAL
```

Do not store sensitive secrets or confidential client content.

---

# 29. `analytics_events`

Stores privacy-conscious website events.

## Columns

```text
id                  UUID PRIMARY KEY
session_id           TEXT NULL
event_name           TEXT NOT NULL
page_path            TEXT
referrer             TEXT NULL
device_type          TEXT NULL
timestamp            TIMESTAMPTZ
metadata             JSONB NULL
```

## Events

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

Do not collect unnecessary personally identifiable information.

---

# 30. Analytics Session Strategy

`session_id` should not directly contain:

- email
- phone
- customer name
- booking reference

Use anonymous/session identifiers.

If privacy requirements change, analytics storage should be adjusted accordingly.

---

# 31. `daily_reports`

Stores generated business summaries.

## Columns

```text
id                      UUID PRIMARY KEY
report_date             DATE UNIQUE NOT NULL
visitors                INTEGER DEFAULT 0
page_views              INTEGER DEFAULT 0
new_customers           INTEGER DEFAULT 0
consultations           INTEGER DEFAULT 0
confirmed_consultations INTEGER DEFAULT 0
completed_consultations INTEGER DEFAULT 0
payments_count          INTEGER DEFAULT 0
revenue                 NUMERIC(12,2) DEFAULT 0
new_blog_posts          INTEGER DEFAULT 0
gallery_changes         INTEGER DEFAULT 0
system_errors            INTEGER DEFAULT 0
important_activity      JSONB NULL
created_at              TIMESTAMPTZ
updated_at              TIMESTAMPTZ
```

---

# 32. Daily Report Process

Conceptual:

```text
Previous day ends
        ↓
Scheduled backend process
        ↓
Aggregate analytics
        ↓
Aggregate bookings
        ↓
Aggregate customers
        ↓
Aggregate payments
        ↓
Aggregate content activity
        ↓
Aggregate errors
        ↓
Create/update daily_reports
        ↓
Send admin report through Resend
```

The exact scheduler may be implemented using Supabase-supported scheduling mechanisms or another secure server-side scheduler.

---

# 33. `contact_submissions`

Optional internal table.

Formspree remains the primary contact-form processing provider.

If an internal database copy is required, use:

```text
contact_submissions
```

## Columns

```text
id                  UUID PRIMARY KEY
name                TEXT
email               TEXT
phone               TEXT NULL
subject             TEXT NULL
message             TEXT
source              TEXT DEFAULT 'FORMSPREE'
status              TEXT DEFAULT 'NEW'
created_at          TIMESTAMPTZ
processed_at        TIMESTAMPTZ NULL
```

This table should only be added if the business requires searchable contact records inside the admin.

Avoid duplicating data unnecessarily.

---

# 34. Formspree Integration

Public contact form:

```text
Visitor
  ↓
Contact Form
  ↓
Formspree
  ↓
Configured email destination
```

Formspree is not the booking database.

Consultation bookings must use Supabase.

---

# 35. Resend Integration

Resend is the transactional email layer.

Email events:

```text
BOOKING_RECEIVED
BOOKING_CONFIRMED
BOOKING_RESCHEDULED
BOOKING_CANCELLED
PAYMENT_SUCCESS
PAYMENT_FAILED
REMINDER
CONTACT_RECEIVED
DAILY_REPORT
```

The frontend must never call Resend with a secret API key.

Use:

```text
Frontend
   ↓
Supabase Edge Function
   ↓
Resend
```

---

# 36. Email Delivery Log

Optional table:

```text
email_logs
```

Recommended if email observability is required.

## Columns

```text
id                  UUID PRIMARY KEY
type                TEXT
recipient           TEXT
subject             TEXT
provider             TEXT DEFAULT 'RESEND'
provider_message_id TEXT NULL
status              TEXT
error_message       TEXT NULL
created_at          TIMESTAMPTZ
sent_at             TIMESTAMPTZ NULL
```

Statuses:

```text
QUEUED
SENT
FAILED
```

Avoid storing unnecessary email body content if it contains confidential information.

---

# 37. Storage Strategy

Current primary media strategy:

```text
Google Drive
```

Supabase Storage is optional.

Potential future uses:

- admin-uploaded files
- private documents
- generated reports
- assets that need application-controlled permissions

Do not automatically duplicate Google Drive media into Supabase Storage unless there is a clear requirement.

---

# 38. Relationships

Core relationships:

```text
profiles
   │
   ├── activity_logs
   ├── notifications
   └── created/updated content
```

```text
customers
   │
   ├── bookings
   └── payments
```

```text
services
   │
   └── bookings
```

```text
bookings
   │
   └── payments
```

```text
blog_posts
gallery_items
achievements
videos
services
        │
        ▼
   Public Website
```

---

# 39. Foreign Key Map

Recommended relationships:

```text
customers.user_id
    → auth.users.id
```

```text
bookings.customer_id
    → customers.id
```

```text
bookings.service_id
    → services.id
```

```text
payments.booking_id
    → bookings.id
```

```text
payments.customer_id
    → customers.id
```

```text
profiles.id
    → auth.users.id
```

```text
activity_logs.admin_id
    → profiles.id
```

```text
notifications.recipient_id
    → profiles.id
```

```text
availability.created_by
    → profiles.id
```

```text
blocked_dates.created_by
    → profiles.id
```

```text
blog_posts.created_by
    → profiles.id
```

```text
gallery_items.created_by
    → profiles.id
```

```text
achievements.created_by
    → profiles.id
```

```text
videos.created_by
    → profiles.id
```

---

# 40. Delete Strategy

Avoid uncontrolled cascading deletes for important business records.

Recommended:

### Customers

Prefer:

```text
status = INACTIVE
```

rather than hard deletion.

### Bookings

Do not delete completed business records.

Use:

```text
CANCELLED
```

### Payments

Never casually delete payment records.

Maintain transaction history.

### Blog

Use:

```text
ARCHIVED
```

### Gallery

Use:

```text
visible = false
```

where practical.

### Admin Users

Disable/revoke access instead of deleting historical activity relationships.

---

# 41. Auditability

Important records should preserve:

- created_at
- updated_at
- created_by
- updated_by where needed
- status changes
- payment verification
- booking confirmation/cancellation

Financial and booking records should remain auditable.

---

# 42. Security Model

## Public

May read only:

```text
published blog
visible gallery
visible videos
visible achievements
visible services
public site content
```

## Authenticated Admin

Access depends on role.

## Super Admin

Full administrative access.

## Backend Functions

Can perform privileged operations.

---

# 43. RLS Policy Model

Conceptually:

```text
PUBLIC
  ↓
SELECT only published/visible content

AUTHENTICATED
  ↓
Limited user-owned data where required

EDITOR
  ↓
Content tables

ADMIN
  ↓
Operational tables

SUPER_ADMIN
  ↓
All authorized application operations
```

RLS policies must be written explicitly for every protected table.

Never enable a broad:

```sql
USING (true)
```

policy for private production data.

---

# 44. Admin Authorization Helper

A secure PostgreSQL/RLS helper can conceptually determine:

```text
current_user_role()
```

based on the authenticated user's profile.

Example conceptual logic:

```text
auth.uid()
   ↓
profiles.id
   ↓
profiles.role
```

Do not accept a role sent from the frontend.

---

# 45. Sensitive Operations

These should use secure Edge Functions/backend procedures:

```text
create PhonePe transaction
verify PhonePe payment
refund payment
confirm sensitive booking
cancel booking if business rules require it
bulk export
change admin role
send transactional email
generate privileged reports
system health checks involving secrets
```

---

# 46. Booking Creation API Concept

Conceptual endpoint:

```text
createBooking()
```

Input:

```json
{
  "customer": {
    "full_name": "...",
    "email": "...",
    "phone": "..."
  },
  "service_id": "...",
  "date": "2026-10-07",
  "start_time": "15:00",
  "duration_minutes": 60,
  "mode": "ONLINE",
  "short_description": "...",
  "preferred_contact": "WHATSAPP"
}
```

Backend:

1. validate input
2. create/find customer
3. verify service
4. verify availability
5. verify blocked dates
6. check existing bookings
7. create booking atomically
8. generate reference
9. return booking details

---

# 47. Payment Creation API Concept

Conceptual:

```text
createPaymentOrder(booking_id)
```

Backend:

1. authenticate request context
2. verify booking
3. verify amount from database
4. verify booking is payable
5. create PhonePe transaction
6. store gateway identifiers
7. return only safe checkout information

Never accept arbitrary amount from the browser.

---

# 48. Payment Verification API Concept

Conceptual:

```text
verifyPayment(transaction_reference)
```

Backend:

1. locate transaction
2. contact/verify with PhonePe
3. validate response
4. update payment
5. update booking payment state
6. write activity/audit event
7. send confirmation through Resend
8. return safe result

Must be idempotent.

---

# 49. Booking Confirmation Email

After successful verified payment or manual confirmation:

```text
Resend
   ↓
Customer email
```

Information may include:

- customer name
- booking reference
- consultation type
- date
- time
- mode
- payment status
- next steps

Do not include unnecessary confidential information.

---

# 50. Admin Daily Email

The admin can receive:

```text
Daily Website Report
```

Contents:

```text
Visitors
Page views
New customers
Consultations
Confirmed consultations
Completed consultations
Payments
Revenue
Content changes
Errors
Important events
```

Send through Resend.

---

# 51. Indexing Recommendations

Add indexes to frequently queried fields.

Recommended:

```text
customers.email
customers.phone
customers.created_at

bookings.booking_reference
bookings.customer_id
bookings.date
bookings.status
bookings.payment_status
bookings.created_at

payments.booking_id
payments.customer_id
payments.status
payments.created_at
payments.gateway_transaction_id

blog_posts.slug
blog_posts.status
blog_posts.published_at
blog_posts.category

gallery_items.category
gallery_items.visible

videos.category
videos.visible

achievements.year
achievements.category

analytics_events.event_name
analytics_events.timestamp

activity_logs.admin_id
activity_logs.created_at

error_logs.created_at
error_logs.severity

notifications.recipient_id
notifications.read
```

Indexes should be reviewed against actual query patterns.

---

# 52. Constraints

Important constraints:

```text
booking_reference UNIQUE
blog_posts.slug UNIQUE
blocked_dates.blocked_date UNIQUE
site_content.section_key UNIQUE
payments gateway identifiers appropriately UNIQUE
```

Additional constraints should ensure:

- positive payment amounts
- valid durations
- valid time ranges
- valid status values
- valid categories

---

# 53. Timezone

The business operates in India.

The application should use an explicit timezone strategy.

Recommended business timezone:

```text
Asia/Kolkata
```

Store timestamps as:

```text
timestamptz
```

and convert for display.

Dates/times for appointments must be interpreted consistently in the business timezone.

Never mix browser-local timezone and business timezone without explicit conversion.

---

# 54. Currency

Primary currency:

```text
INR
```

Database amounts:

```text
NUMERIC(12,2)
```

Default currency:

```text
INR
```

Do not hardcode the consultation fee into multiple places.

Store/configure the authoritative fee through the service/payment configuration and calculate it server-side.

---

# 55. Data Retention

Retention periods should be defined before production based on:

- business requirements
- applicable privacy/legal requirements
- payment provider requirements
- accounting requirements

Do not automatically delete financial/booking history simply to keep the database small.

---

# 56. Backups

Critical data includes:

```text
customers
bookings
payments
services
site_content
site_settings
blog_posts
gallery_items
achievements
videos
availability
activity_logs
daily_reports
```

Database backups should be enabled through Supabase's available backup facilities/plan.

Important media remains in Google Drive and should be maintained by the business owner.

---

# 57. Data Export

Admin exports should support:

```text
customers.csv
bookings.csv
payments.csv
daily_reports.csv
analytics.json
activity_logs.csv
blog_posts.json
gallery.json
videos.json
achievements.json
```

Exports containing personal/financial information require authorization.

---

# 58. Contact Data

If `contact_submissions` is implemented, it should not become a second source of truth for bookings.

Rules:

```text
Contact form → Formspree
Consultation → Supabase
Payment → PhonePe + Supabase
```

---

# 59. External Service Responsibility Matrix

| Service | Responsibility | Secrets in Frontend? |
|---|---|---|
| Hostinger | Host public/admin frontend | N/A |
| Supabase | Database/Auth/Backend | No private keys |
| Google Drive | Images/media | No account credentials |
| YouTube | Videos | No |
| Formspree | Contact forms | No private secret |
| Resend | Transactional email | No |
| PhonePe | Payments | No |

---

# 60. Frontend ↔ Backend Boundary

Public frontend can safely use:

```text
Supabase project URL
Supabase anon/public key
```

provided RLS is correctly implemented.

Frontend must never receive:

```text
Supabase service role
PhonePe secret
Resend API key
other private credentials
```

---

# 61. Environment Configuration

## Frontend

Possible:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
PUBLIC_SITE_URL
```

## Edge Functions

Private:

```text
SUPABASE_SERVICE_ROLE_KEY
PHONEPE_* secrets
RESEND_API_KEY
```

The exact environment variable names should be finalized during implementation.

---

# 62. Development / Production Separation

Use separate configuration for:

```text
DEVELOPMENT
TEST/SANDBOX
PRODUCTION
```

Never accidentally use:

- production PhonePe credentials in testing
- production email configuration for development spam
- production customer records during development

---

# 63. Seed Data

Production must not contain fake customers/payments/bookings.

Development may use clearly marked test data.

Example:

```text
TEST CUSTOMER
TEST BOOKING
TEST PAYMENT
```

Test records must never be mixed with production reports.

---

# 64. Schema Migration Strategy

All database schema changes should be version-controlled through migrations.

Example:

```text
001_initial_schema.sql
002_profiles.sql
003_customers.sql
004_bookings.sql
005_payments.sql
006_content.sql
007_analytics.sql
008_admin_logs.sql
```

The final migration structure may differ.

Do not manually change production schema without recording the change.

---

# 65. Recommended Implementation Order

## Step 1

Create Supabase project.

## Step 2

Create profiles/auth architecture.

## Step 3

Create customers/services.

## Step 4

Create availability and blocked dates.

## Step 5

Create bookings and double-booking protection.

## Step 6

Create payments.

## Step 7

Integrate PhonePe through Edge Functions.

## Step 8

Create content tables.

## Step 9

Create notifications/activity/error logs.

## Step 10

Create analytics and daily reports.

## Step 11

Create RLS policies.

## Step 12

Connect admin.html.

## Step 13

Connect public pages.

## Step 14

Connect Resend.

## Step 15

Connect Formspree.

## Step 16

Deploy to Hostinger.

## Step 17

Perform security and production testing.

---

# 66. Final Schema Map

```text
AUTH
│
├── auth.users
│       │
│       ▼
│    profiles
│
DATABASE
│
├── customers
│      │
│      ├── bookings
│      │      │
│      │      └── payments
│      │
│      └── payments
│
├── services
│      └── bookings
│
├── availability
├── blocked_dates
├── availability_exceptions
│
├── gallery_items
├── achievements
├── videos
├── blog_posts
├── site_content
├── site_settings
│
├── notifications
├── activity_logs
├── error_logs
├── analytics_events
├── daily_reports
└── optional contact_submissions
```

---

# 67. Integration Map

```text
                         HOSTINGER
                             │
                             ▼
                    Public/Admin Frontend
                             │
                             ▼
                         SUPABASE
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
                 Database   Auth   Edge Functions
                                      │
                         ┌────────────┼─────────────┐
                         │            │             │
                         ▼            ▼             ▼
                      PhonePe       Resend       Other APIs
                      Payment       Email
```

Media:

```text
Google Drive → Images → Website
YouTube → Videos → Website
```

Contact:

```text
Visitor → Formspree → Contact notification
```

---

# 68. Final Backend Rules

The following rules are mandatory:

1. Supabase is the central application backend.
2. PostgreSQL is the source of truth for business data.
3. PhonePe is the payment gateway.
4. Payment verification happens server-side.
5. Resend handles transactional email.
6. Formspree handles public contact forms.
7. Google Drive remains the primary client media source.
8. YouTube remains the video host.
9. Hostinger hosts the frontend.
10. RLS protects private database records.
11. Admin roles are enforced server-side.
12. Frontend values are never trusted for money or authorization.
13. Double booking is prevented at the database/backend level.
14. Secrets never enter frontend code.
15. No fake production data is permitted.
16. Confidential legal/counselling information is minimized and protected.
17. Financial and booking history remains auditable.
18. External integrations have clearly defined responsibilities.
19. Database migrations must be versioned.
20. Production and testing environments must remain separated.

---

# 69. Final Backend Objective

The backend must support the complete operational cycle:

```text
VISITOR
   ↓
PUBLIC WEBSITE
   ↓
CONSULTATION REQUEST
   ↓
SUPABASE BOOKING
   ↓
AVAILABILITY CHECK
   ↓
PHONEPE PAYMENT
   ↓
SERVER-SIDE VERIFICATION
   ↓
BOOKING CONFIRMATION
   ↓
RESEND EMAIL
   ↓
ADMIN NOTIFICATION
   ↓
CONSULTATION
   ↓
DAILY REPORT
   ↓
ADMIN ANALYTICS
```

At the same time, the admin should be able to control:

```text
CONTENT
BOOKINGS
CUSTOMERS
PAYMENTS
AVAILABILITY
NOTIFICATIONS
ANALYTICS
REPORTS
USERS
SETTINGS
```

The final backend should therefore be:

**secure, relational, auditable, privacy-conscious, payment-safe, maintainable, scalable, and directly compatible with the Hostinger + Supabase + Google Drive + Resend + Formspree + PhonePe architecture.**
