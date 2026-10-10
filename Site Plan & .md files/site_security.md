# SITE SECURITY SPECIFICATION: ADV. KRITI MALVIYA

**Document Purpose:** Official and canonical security specification for the complete Adv. Kriti Malviya website and its backend systems.

---

## 1. DOCUMENT PURPOSE

This document serves as the absolute security source of truth for the Adv. Kriti Malviya project. It defines the mandatory rules, boundaries, and architectural patterns required to protect:

*   Website visitors
*   Customers
*   Booking information
*   Consultation information
*   Payment information
*   Administrative accounts
*   Website content
*   Database records
*   API integrations
*   Analytics
*   Logs
*   Media
*   Infrastructure

This specification must be strictly followed by frontend developers, backend developers, administrators, and AI coding agents.

**ABSOLUTE RULE:**
SECURITY MUST NEVER DEPEND ONLY ON FRONTEND CODE. Any security-sensitive decision (pricing, availability, role access, payment success) must ultimately be enforced server-side.

---

## 2. SECURITY OBJECTIVES

The architecture and implementation must satisfy the following primary security objectives:

1.  **Protect customer information:** Ensure privacy and secure storage of PII and consultation concerns.
2.  **Protect booking information:** Prevent unauthorized viewing or modification of appointments.
3.  **Protect payment information:** Ensure secure processing without handling raw credentials.
4.  **Prevent unauthorized admin access:** Secure all administrative routes and data.
5.  **Prevent unauthorized database access:** Lock down the Supabase database using Row Level Security (RLS).
6.  **Prevent double booking:** Use atomic backend transactions to enforce slot availability.
7.  **Prevent payment fraud or false payment confirmation:** Rely strictly on cryptographically verified server-to-server callbacks.
8.  **Prevent privilege escalation:** Block any user or admin from granting themselves higher access rights.
9.  **Protect API secrets:** Keep all sensitive keys strictly on the server/Edge Functions.
10. **Protect website content from unauthorized modification:** Restrict CMS capabilities to authorized roles.
11. **Maintain auditability:** Log critical system, administrative, and payment actions.
12. **Detect important security failures:** Monitor error logs and unexpected system behavior.
13. **Recover safely from incidents:** Ensure database backups and secure rollback capabilities exist.
14. **Minimize collection of sensitive information:** Do not collect or ask for data beyond what is strictly necessary.
15. **Preserve availability and integrity of the booking system:** Protect the core business funnel against abuse or manipulation.

**Core Guiding Principles:**
*   **CONFIDENTIALITY**
*   **INTEGRITY**
*   **AVAILABILITY**
*   **AUTHENTICATION**
*   **AUTHORIZATION**
*   **AUDITABILITY**
*   **MINIMIZATION**

---

## 3. SECURITY ARCHITECTURE

The application follows a decoupled, cloud-native security architecture.

**Public Flow Architecture:**
```text
Visitor
  ↓
Hostinger Website (Static Frontend)
  ↓
Supabase (API Gateway)
  ↓
PostgreSQL Database
  ↓
Supabase RLS / Edge Functions (Enforcement)