# SITE MAP SPECIFICATION: ADV. KRITI MALVIYA

**Document Purpose:** Official and canonical site map and structural specification for the Adv. Kriti Malviya professional website.

---

## 1. PROJECT OVERVIEW

**Website:** Adv. Kriti Malviya

**Primary Website Purposes:**
*   Present Adv. Kriti Malviya professionally.
*   Explain legal counselling services.
*   Explain relationship/personal counselling services.
*   Showcase professional achievements.
*   Showcase photographs.
*   Showcase videos/vlogs.
*   Publish articles/blog content.
*   Allow visitors to request a consultation.
*   Allow consultation payment through PhonePe.
*   Provide booking confirmation and an Order ID.
*   Provide administrators with a master control system.

**Technology Stack:**
*   **Frontend Hosting:** Hostinger
*   **Backend:** Supabase
*   **Database:** Supabase PostgreSQL
*   **Authentication:** Supabase Auth (Admin only)
*   **Media:** Google Drive
*   **Video:** YouTube
*   **Email:** Resend
*   **Contact Forms:** Formspree
*   **Payment:** PhonePe
*   **Timezone:** Asia/Kolkata
*   **Currency:** INR

**Visual Language:**
Premium editorial aesthetic using warm cream/off-white backgrounds, charcoal/black typography, metallic gold accents, pastel yellow accents, editorial serif headings, clean sans-serif body text, sophisticated whitespace, subtle lines, restrained animations, and responsive design.

---

## 2. PURPOSE OF THE SITE MAP

This document serves as the structural source of truth for the project. It defines:
*   All major website pages and their hierarchy.
*   Navigation structure and URL/route structure.
*   Public vs. private boundary definitions.
*   Booking, payment, and confirmation flows.
*   Admin dashboard pages.
*   Relationships between pages, primary/secondary navigation, and CTA destinations.
*   System and error states.

This specification is designed to be actionable for frontend developers, backend developers, UI designers, SEO planning, and future AI coding agents.

---

## 3. HIGH-LEVEL WEBSITE STRUCTURE

```text
WEBSITE
│
├── HOME
│
├── ABOUT
│
├── LEGAL COUNSELLING
│   ├── Divorce Guidance
│   ├── Property Purchase
│   ├── Civil Cases
│   ├── Human Rights
│   └── General Legal Consultation
│
├── RELATIONSHIP / PERSONAL COUNSELLING
│   ├── Couple Counselling
│   ├── Relationship Concerns
│   ├── Family Concerns
│   ├── Break-up / Separation
│   ├── Teenage Counselling
│   ├── Emotional Well-being
│   └── General Counselling
│
├── PHOTO GALLERY
│
├── AWARDS & ACHIEVEMENTS
│
├── VLOG
│
├── BLOG / JOURNAL
│
├── CONTACT
│
├── BOOK CONSULTATION
│   ├── Consultation Selection
│   ├── Date & Time
│   ├── User Details
│   └── Review
│
├── PAYMENT
│
├── CONFIRMATION
│
└── ADMIN
    ├── Login
    ├── Dashboard
    ├── Bookings
    ├── Customers
    ├── Payments
    ├── Availability
    ├── Content
    ├── Gallery
    ├── Achievements
    ├── Vlog
    ├── Blog
    ├── Analytics
    ├── Reports
    ├── Notifications
    ├── Activity Logs
    ├── Error Logs
    ├── Users / Roles
    └── Settings