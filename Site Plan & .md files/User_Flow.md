# USER FLOW SPECIFICATION: ADV. KRITI MALVIYA

**Document Purpose:** Official and canonical user flow and system behavior specification for the Adv. Kriti Malviya professional website.

---

## PROJECT CONTEXT

*   **Website:** Adv. Kriti Malviya
*   **Purpose:** Professional legal and relationship counselling portfolio and consultation booking platform.
*   **Frontend Hosting:** Hostinger
*   **Backend / Database:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth (Administrators only)
*   **Media:** Google Drive
*   **Video:** YouTube
*   **Email:** Resend
*   **Contact Forms:** Formspree
*   **Payment Gateway:** PhonePe
*   **Timezone:** Asia/Kolkata
*   **Currency:** INR
*   **Design Language:** Premium editorial, warm cream/off-white backgrounds, charcoal/black typography, metallic gold/pastel yellow accents, editorial serif headings, sophisticated whitespace, calm and professional.

---

## 1. PURPOSE OF THIS DOCUMENT

This document defines the complete customer-facing and system-facing flow of the website, mapping the journey from the landing page through consultation booking, payment, and final confirmation. It explicitly distinguishes between:
1.  **USER ACTION:** What the user does.
2.  **FRONTEND RESPONSE:** How the UI reacts.
3.  **BACKEND ACTION:** Server-side processing.
4.  **DATABASE STATE:** The condition of the data in Supabase.
5.  **PAYMENT STATE:** The condition of the PhonePe transaction.
6.  **EMAIL/NOTIFICATION ACTION:** Automated communications triggered by state changes.

---

## 2. HIGH-LEVEL USER JOURNEY

```text
[ LANDING PAGE ]
       │
       ▼
[ EXPLORE PAGES ] ─────► (About, Gallery, Blog, Vlog, etc.)
       │
       ▼
[ BOOK CONSULTATION ]
       │
       ▼
[ SELECT CATEGORY & SERVICE ]
       │
       ▼
[ SELECT DATE & TIME ]
       │
       ▼
[ ENTER DETAILS ]
       │
       ▼
[ REVIEW BOOKING ]
       │
       ▼
[ PHONEPE PAYMENT ] ───► (Backend Verification)
       │
       ▼
[ CONFIRMATION & ORDER ID ]