# SITE DESCRIPTION: ADV. KRITI MALVIYA

**Document Purpose:** Official high-level product and website description for the Adv. Kriti Malviya professional website.

---

## 1. DOCUMENT PURPOSE

The `site_description.md` provides the complete conceptual description of the Adv. Kriti Malviya website. It answers fundamental product-level questions:

*   **What is this website?**
*   **Who is it for?**
*   **What does it offer?**
*   **What can visitors do?**
*   **What pages and experiences does it provide?**
*   **How does consultation booking work?**
*   **How does payment work?**
*   **What happens after payment?**
*   **What does the administrator control?**
*   **What external services are integrated?**
*   **What should the website feel like?**
*   **What principles govern the product?**

This document is a high-level product description intended for human clients, designers, developers, project managers, and AI coding agents. 

**It should NOT replace:**
*   `site_map.md` — Structural and page hierarchy.
*   `user_flow.md` — Detailed user journey and state logic.
*   `backend_schema.md` — Database and backend structure.
*   `trd.md` — Technical requirements.
*   **UI/UX documentation** — Visual implementation details.

---

## 2. WEBSITE IDENTITY

**Website:** Adv. Kriti Malviya

This website serves as a premium, professional digital presence for Adv. Kriti Malviya. It conceptually combines:
*   Legal professional services
*   Relationship and personal counselling
*   Professional information and credentials
*   Educational content (Blog)
*   Media and portfolio presentation (Vlog, Photo Gallery, Awards)
*   Consultation booking capabilities
*   Online payment processing
*   Administrative management

**The website communicates:**
Professionalism, clarity, trust, privacy, practical guidance, accessibility, calmness, and a premium presentation.

**The website strictly avoids feeling like:**
A generic corporate template, a SaaS dashboard, a medical portal, an aggressive sales website, a social media platform, or a generic law-firm directory.

---

## 3. CORE PURPOSE

The primary purposes of the website are to:
1.  Introduce Adv. Kriti Malviya.
2.  Explain legal counselling services.
3.  Explain relationship/personal counselling services.
4.  Present professional information.
5.  Showcase photographs and achievements.
6.  Provide educational video content.
7.  Provide written articles/blog content.
8.  Allow visitors to contact the office.
9.  Allow visitors to request a consultation.
10. Allow consultation payment securely through PhonePe.
11. Provide a customer-facing Order ID after successful server-side payment verification.
12. Provide confirmation through the website and via automated email.
13. Provide a robust administrative control center for authorized staff.

---

## 4. TARGET USERS

### 4.1 General Visitor
A person exploring the website to:
*   Learn about Adv. Kriti Malviya.
*   Understand available services.
*   Explore professional information, photos, and achievements.
*   Watch videos and read articles.
*   Contact the office.
*   Potentially book a consultation.

### 4.2 Consultation Customer
A visitor who decides to request a consultation. They can:
*   Select a consultation category, service, date, time, and mode.
*   Provide required intake details.
*   Review the booking.
*   Pay through PhonePe.
*   Receive a unique Order ID and confirmation.
*   *Note: The initial customer experience does NOT require a traditional customer login or account creation.*

### 4.3 Administrator
An authorized person responsible for managing website and business operations. They manage:
*   Bookings, customers, payments, and availability.
*   Website content, gallery, achievements, videos, and blog.
*   Analytics, reports, notifications, and settings.
*   User roles, activity logs, and error logs.

---

## 5. PROFESSIONAL INFORMATION

The website presents verified, factual professional information regarding Adv. Kriti Malviya.

**Key Professional Milestones:**
*   10+ years of legal experience.
*   Experience spanning banking, property, contracts, documentation, family-related matters, and dispute resolution.
*   500+ banking search reports.
*   20+ mediations resolved.

**Professional Approach:**
Focused on clear guidance, practical solutions, and confidential support. The objective is helping clients understand their legal position, exploring available options, explaining implications, and identifying appropriate next steps.

**Relationship/Personal Counselling:**
Provided for individuals and couples dealing with communication difficulties, relationship conflicts, family concerns, separation, and emotional decision-making.

*(No unsupported credentials, invented awards, fabricated testimonials, or guaranteed results are claimed).*

---

## 6. SERVICE OFFERING

Services are structurally divided into two primary categories. The underlying system is data-driven, allowing administrators to modify offerings.

### Legal Counselling
*   Divorce Guidance
*   Property Purchase
*   Civil Cases
*   Human Rights
*   General Legal Consultation

### Relationship / Personal Counselling
*   Couple Counselling
*   Relationship Concerns
*   Family Concerns
*   Break-up / Separation
*   Teenage Counselling
*   Emotional Well-being
*   General Counselling

*(Note: Consultation durations and fees are configurable backend values; pricing is not hardcoded into the frontend).*

---

## 7. WEBSITE EXPERIENCE

The website utilizes a premium editorial visual language rather than a conventional corporate template. 

**Visual Character:**
*   Warm cream/off-white foundation.
*   Charcoal/black text for maximum readability.
*   Metallic gold and pastel yellow accents.
*   Editorial serif typography for important headings.
*   Clean sans-serif typography for supporting information and UI.
*   Generous whitespace, thin lines, subtle visual hierarchy, and restrained motion.
*   Premium photography, sophisticated asymmetry, and responsive layouts.

**Constraints:**
Avoids excessive gradients, neon colors, cyberpunk styling, excessive glassmorphism, overly rounded SaaS-style cards, robotic interfaces, excessive animation, and aggressive conversion patterns.

---

## 8. WEBSITE CONTENT EXPERIENCE

### Home
The primary introduction. Communicates identity, professional positioning, key services, visual brand, and offers the primary consultation CTA.

### About
Provides deeper professional context about Adv. Kriti Malviya.

### Legal Counselling & Relationship Counselling
Explains the respective consultation categories and distinct services.

### Photo Gallery
A premium visual archive. Images are primarily sourced from Google Drive URLs.

### Awards & Achievements
Presents verified awards and factual professional milestones (e.g., 10+ years experience, 500+ reports). Clearly distinguishes actual awards from career statistics.

### Vlog
An editorial video archive utilizing YouTube for video hosting.

### Blog / Journal
Written educational and professional content.

### Contact
General contact and inquiry functionality routed through Formspree.

### Consultation
The structured appointment booking process.

### Payment
Secure payment initiation via PhonePe, including status handling.

### Confirmation
The final booking confirmation page displaying the Order ID.

---

## 9. CONSULTATION SYSTEM

**The Customer Journey:**
Landing Page ➔ Book Consultation ➔ Consultation Selection ➔ Date & Time ➔ Customer Details ➔ Review ➔ Payment ➔ PhonePe ➔ Payment Verification ➔ Confirmation ➔ Order ID.

**System Requirements:**
*   Show real backend-controlled availability.
*   Prevent double booking via atomic server-side checks.
*   Validate information server-side.
*   Maintain accurate booking and payment status.
*   Generate a unique Order ID.
*   Support future administrative management.
*   Ensure the customer always understands their current booking state.

---

## 10. PAYMENT EXPERIENCE

**Payment Gateway:** PHONEPE

The customer reviews their service, date, time, mode, consultation fee (configurable), and total amount before proceeding to PhonePe.

*Critical Product Rule:* Payment is NOT considered successful merely because the browser returns to the website. Payment must be verified cryptographically server-side.

**After Trusted Verification:**
*   Payment Status: `PAID`
*   Booking Status: `CONFIRMED`
*   The system then securely generates and displays the customer-facing Order ID.

---

## 11. ORDER ID SYSTEM

The customer-facing Order ID is the primary booking reference.

*   **Format:** `KM-YYYYMMDD-XXXX` (e.g., `KM-20261008-A7K9`)
*   **Characteristics:** Generated server-side, unique, stored in Supabase, associated with the booking, safely shown to the customer post-verification, copyable via UI, and included in the confirmation email.

*Crucial Distinction:* The **Order ID** is the primary customer reference. The **PhonePe Transaction ID** is strictly a payment gateway reference used for backend reconciliation and is NOT the primary customer-facing ID.

---

## 12. CONFIRMATION EXPERIENCE

Following successful backend payment verification, the customer sees a definitive confirmation experience. 

*   **Communicates:** Booking confirmed, payment status, Order ID, consultation details (date, time, mode), amount paid, and next steps.
*   **Actions:** Customer can copy the Order ID, review info, return to the website, or access support.
*   *Constraint:* The confirmation page must never display a false success state or be accessible without a valid verified session.

---

## 13. EMAIL EXPERIENCE

**Email Provider:** RESEND

Following successful verification and confirmation, the backend triggers an automated confirmation email.
*   **Contents:** Customer name, Order ID, service details, date, time, duration, mode, payment status, amount, next steps, and contact info.
*   **Failure Handling:** If email delivery fails, the booking remains confirmed and the payment remains paid. The failure is logged in the system for administrators to identify and optionally trigger a controlled resend.

---

## 14. CONTACT EXPERIENCE

**Provider:** FORMSPREE

Distinguishes clearly between "Contact" (for general questions/inquiries) and "Consultation" (structured appointment booking). The contact form does not attempt to replace or circumvent the consultation booking system.

---

## 15. MEDIA SYSTEM

*   **Images:** Google Drive serves as the primary image/media source (used for gallery, achievements, and selected imagery). URLs must be browser-compatible previews.
*   **Videos:** YouTube serves as the video host. The website embeds or links to YouTube content to preserve Hostinger bandwidth.

---

## 16. BLOG / KNOWLEDGE SYSTEM

An editorial knowledge area supporting article discovery, dynamic categories, search, featured articles, related articles, and reading progress indicators. Blog content is fully backend-managed (title, slug, excerpt, content, category, image, read time, publication status, date).

---

## 17. ADMIN MASTER CONTROL CENTER

A secure, private operational control center (`admin.html`) enabling authorized administrators to manage:

*   **Website Content:** Homepage, about, services, contact info, footer, consultation messaging.
*   **Booking:** View, status updates, rescheduling, cancellations.
*   **Availability:** Working days, time slots, blocked dates, exceptions.
*   **Customers:** Records, booking history, communication data.
*   **Payments:** Records, statuses, PhonePe reconciliation, refunds (where supported).
*   **Media:** Gallery, achievements, videos, blog.
*   **Analytics:** Visitors, page views, funnels, content engagement.
*   **Reports:** Daily summaries, revenue, important activity, errors.
*   **Notifications:** Booking/payment alerts, system alerts.
*   **Logs:** Activity logs, error logs.
*   **Users:** Role-based access (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `VIEWER`).
*   **Settings:** Site, booking, payment, SEO, contact, and maintenance mode.

---

## 18. ADMIN SECURITY

The admin system is strictly private and relies on true backend security, not just frontend route hiding.

*   **Authentication:** Supabase Auth.
*   **Authorization:** Role-based access control + Supabase Row Level Security (RLS).
*   **Constraints:** Sensitive operations (refunds, role changes) must be protected server-side. Never expose Supabase service-role keys, PhonePe secrets, Resend API keys, or database credentials in the frontend code.

---

## 19. BACKEND ARCHITECTURE

*   **Hostinger:** Public website and admin frontend static hosting.
*   **Supabase:** Central application backend.
    *   **PostgreSQL:** Database.
    *   **Auth:** Admin authentication.
    *   **Edge Functions:** Privileged/server-side operations (payment initialization, PhonePe webhook verification, secure booking ops, email triggers).
*   **Google Drive:** Media source.
*   **YouTube:** Video hosting.
*   **Resend:** Transactional email.
*   **Formspree:** Contact forms.
*   **PhonePe:** Payment gateway.

---

## 20. DATA AND SOURCE OF TRUTH

*   **Supabase** is the primary source of truth for: services, availability, bookings, customers, payments, site content, gallery metadata, achievements, videos, blog posts, notifications, logs, analytics, and reports.
*   **PhonePe** is the source of truth for payment gateway transaction status (reconciled into Supabase).
*   **The Frontend browser is NEVER the source of truth** for payment status, booking status, availability, prices, or Order IDs.

---

## 21. PRIVACY PRINCIPLES

Information collected is strictly limited to what is necessary for consultation processing, communication, booking management, and administrative operations. 
*   Avoids requesting highly sensitive legal/counselling details in initial intake forms.
*   Customer information is never exposed publicly.
*   Analytics are privacy-conscious.
*   Raw payment credentials are never stored or processed directly by the site.

---

## 22. TRUST AND SAFETY PRINCIPLES

The website communicates clearly and honestly. It will NEVER:
*   Fake availability, payment success, or booking confirmations.
*   Fabricate testimonials, awards, or professional credentials.
*   Promise guaranteed legal or counselling outcomes.
*   Expose confidential customer information.

---

## 23. RESPONSIVE EXPERIENCE

The same core site architecture serves Desktop, Tablet, and Mobile seamlessly.
*   **Desktop:** Editorial layouts, horizontal navigation, larger content compositions.
*   **Mobile:** Hamburger navigation, stacked content, accessible forms, simplified touch interactions.
*   *(There is no separate mobile-only URL architecture).*

---

## 24. ACCESSIBILITY

The product ensures equitable access by supporting semantic HTML, keyboard navigation, visible focus states, accessible menus, labelled inputs, readable typography, sufficient contrast, accessible error/status messages, and reduced-motion user preferences. Critical actions (Book Consultation, Pay, Copy Order ID) remain highly accessible.

---

## 25. PERFORMANCE

The website feels premium without sacrificing speed. It utilizes lazy-loading for non-critical images, minimizes JavaScript payloads, optimizes media, avoids render-blocking scripts, keeps animations lightweight, and avoids excessive network requests.

---

## 26. ANALYTICS

Supports privacy-conscious analytics tracking useful events without collecting unnecessary personal information: `page_view`, `consultation_started`, `consultation_submitted`, `payment_started`, `payment_completed`, `booking_confirmed`, `order_id_copied`, `blog_opened`, `video_opened`, etc.

---

## 27. DAILY REPORTING

Supports daily administrative reports containing visitors, page views, new customers, consultation requests (confirmed/completed), payment counts, revenue, failed payments, content changes, and system errors. Reports are restricted to authorized administrators.

---

## 28. IMPORTANT BUSINESS STATES

The system maintains a strict separation of concerns between Booking and Payment states.

**Booking Status:**
`PENDING_PAYMENT`, `PENDING`, `CONFIRMED`, `RESCHEDULED`, `COMPLETED`, `CANCELLED`

**Payment Status:**
`PENDING`, `PROCESSING`, `PAID`, `FAILED`, `CANCELLED`, `VERIFICATION_PENDING`, `REFUNDED`

---

## 29. ERROR HANDLING

When problems occur (e.g., slot unavailable, payment failure, verification delay, Supabase/PhonePe downtime), the user receives a calm, understandable, and non-technical message outlining the next best action. Technical details and stack traces are securely logged internally and never exposed to customers.

---

## 30. FUTURE-READY ARCHITECTURE

The system is extensible by design. While not currently implemented, the architecture conceptually allows for future expansions such as additional service types, expanded payment capabilities, customer login accounts, richer reporting, and expanded CMS features. *(These are future possibilities, not current active requirements).*

---

## 31. PRODUCT PRINCIPLES

*   **Clarity:** Visitors immediately understand who the site represents, services offered, how to book, pricing, and next steps.
*   **Trust:** Payment and booking states are cryptographically truthful.
*   **Privacy:** Customer data is handled with maximum discretion.
*   **Professionalism:** The aesthetic reflects the gravity of legal and counselling services.
*   **Simplicity:** No unnecessary complexity or friction in user flows.
*   **Control:** Administrators have robust operational oversight.
*   **Accuracy:** Only verified, factual information is displayed.
*   **Maintainability:** Content is data-driven and easily updated.
*   **Performance:** A premium design delivered with high technical speed.

---

## 32. COMPLETE PRODUCT FLOW

```text
VISITOR
   ↓
LANDING PAGE
   ↓
EXPLORE WEBSITE
   ↓
ABOUT / SERVICES / GALLERY / ACHIEVEMENTS / VLOG / BLOG
   ↓
BOOK CONSULTATION
   ↓
SELECT SERVICE
   ↓
SELECT DATE & TIME
   ↓
ENTER DETAILS
   ↓
REVIEW
   ↓
BACKEND VALIDATION
   ↓
PENDING BOOKING
   ↓
PHONEPE PAYMENT
   ↓
SERVER-SIDE VERIFICATION
   ↓
PAYMENT PAID
   ↓
BOOKING CONFIRMED
   ↓
ORDER ID GENERATED
   ↓
CONFIRMATION PAGE
   ↓
COPY ORDER ID
   ↓
RESEND CONFIRMATION EMAIL
   ↓
ADMIN RECORD / REPORTING