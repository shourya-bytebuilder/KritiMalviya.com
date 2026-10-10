# STEP 3 — PRODUCTION BOOKING, PHONEPE PAYMENT, VERIFICATION & CONFIRMATION REPORT
**Project:** Adv. Kriti Malviya Chambers (`Kritimalviya.com`)  
**Phase:** STEP 3 of 5 (Consultation Booking, PhonePe PG V1, Verification & Confirmation Engine)  
**Security Standard:** Strict PostgreSQL Server-Side Enforcement · Zero Client Trust · Idempotent Gateways · Nonce Token Confirmation

---

## 1. EXECUTIVE SUMMARY & OBJECTIVE

Step 3 delivers the secure, end-to-end consultation reservation and PhonePe payment settlement pipeline for Adv. Kriti Malviya's legal and relationship counselling platform. It connects the luxury editorial frontend built in Step 1 and the live Supabase PostgreSQL data layer established in Step 2 to:
1. **Server-Enforced Consultation Intake:** Validates client intake information on both browser and server, computes authoritative consultation pricing strictly from the PostgreSQL `services` table, and eliminates any client-side tampering of fees or booking states.
2. **Atomic Double-Booking & Slot Conflict Prevention:** Uses PostgreSQL advisory transaction locking (`pg_advisory_xact_lock`) and interval overlap calculations `(start_time < new_end_time AND end_time > new_start_time)` over active booking states (`CONFIRMED`, `PENDING`, and unexpired `PENDING_PAYMENT` holds). Concurrent attempts to claim the same or overlapping slot are rejected atomically.
3. **Official PhonePe PG V1 Integration:** Implements the official PhonePe Standard Payment Gateway Checkout (PG V1) specification using SHA-256 Checksum generation (`X-VERIFY` header calculation across `/pg/v1/pay`, `/pg/v1/status/{merchantId}/{merchantTransactionId}`, and webhook callbacks).
4. **Idempotent Payment Reconciliation:** Separates booking state (`PENDING_PAYMENT`, `PENDING`, `CONFIRMED`, `CANCELLED`) from payment state (`PENDING`, `PROCESSING`, `PAID`, `FAILED`, `CANCELLED`, `VERIFICATION_PENDING`). Duplicate callbacks or delayed webhooks never generate duplicate revenue, duplicate confirmations, or conflicting appointments.
5. **Anti-IDOR Confirmation Access Control:** Replaces guessable sequential numbers and public references with 192-bit cryptographic confirmation tokens (`confirmation_token`) with time-limited validity. Unauthorized third parties cannot view or scrape another client's booking dossier merely by guessing an Order ID or UUID.
6. **Resend Transactional Email Pipeline:** Implements responsive, brand-aligned editorial HTML email templates for client consultation receipts and chamber administrative notifications with delivery logging in `email_logs`.

---

## 2. SYSTEM ARCHITECTURE & TRANSACTION LIFECYCLE

```text
[ CLIENT BROWSER ]
       │
       ▼ (Step 01 & 02: Service, Mode, Date & Time Selection)
  consultation.html
       │
       ▼ (Step 03: Intake Details Validation)
       │
       ▼ [POST /functions/v1/create-booking]
[ SUPABASE EDGE FUNCTION / DATABASE RPC ]
       ├── 1. Validate customer schema (Name, Email, Phone, Consultation Type)
       ├── 2. Query services table for authoritative fee_snapshot (Never trust client fee!)
       ├── 3. Check blocked_dates & availability schedule (Asia/Kolkata timezone)
       ├── 4. Acquire PostgreSQL transaction lock: pg_advisory_xact_lock()
       ├── 5. Query conflicting overlapping intervals
       ├── 6. Generate reference: KM-YYYYMMDD-XXXX & 192-bit confirmation token
       └── 7. Create booking row (status: PENDING_PAYMENT, 15-min hold)
       │
       ▼ (Return booking_reference, confirmation_token)
  payment.html
       │
       ▼ [POST /functions/v1/initiate-phonepe-payment]
[ SUPABASE EDGE FUNCTION ]
       ├── 1. Authorize ownership via confirmation_token
       ├── 2. Retrieve authoritative fee_snapshot
       ├── 3. Convert fee to integer Paise (Amount × 100)
       ├── 4. Create payment row (merchant_order_id, status: PENDING, idempotency_key)
       ├── 5. Sign payload: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
       └── 6. Invoke PhonePe /pg/v1/pay API
       │
       ▼ (Redirect user to PhonePe Hosted Checkout)
[ OFFICIAL PHONEPE GATEWAY EXPERIENCE ]
  (UPI, NetBanking, Credit/Debit Cards, Wallets)
       │
       ├─────────────────────────────────────────┐
       ▼ (Server-to-Server Webhook)               ▼ (Browser Redirect Return)
[ POST /functions/v1/verify-phonepe-payment ]   payment.html?merchantTxId=...
       │                                         │
       │                                         ▼ [POST /functions/v1/verify-phonepe-payment]
       │                                         │
       └────────────────────┬────────────────────┘
                            │
                            ▼
       ├── 1. Authenticate webhook signature or verify merchantTxId
       ├── 2. Query PhonePe Status API: /pg/v1/status/{merchantId}/{merchantTxId}
       ├── 3. Atomic transition: verify_and_update_payment()
       │      ├── payments: status = PAID, verified_at = now()
       │      ├── bookings: status = CONFIRMED, payment_status = PAID
       │      └── notifications: insert chambers notification
       ├── 4. Dispatch transactional email via Resend (Client Receipt + Chamber Alert)
       └── 5. Deduplicate delivery in email_logs
       │
       ▼ (Authorized Redirect)
  confirmation.html?token=...
       ├── Fetch dossier via RPC get_confirmed_booking_by_token(token)
       └── Render official Order ID, schedule, and print receipt
```

---

## 3. PHONEPE PAYMENT GATEWAY INTEGRATION DETAILS

### 3.1 Specification & API Version
*   **Integration Standard:** PhonePe Standard Payment Gateway (PG V1 Specification).
*   **Protocol:** Server-Side REST with Base64 JSON Payloads and SHA-256 Digest Checksums.
*   **Currency:** Indian Rupee (`INR`).
*   **Monetary Smallest Unit:** Paise (`1 INR = 100 Paise`), converted strictly on server using exact integer arithmetic.

### 3.2 Endpoints & Environments
| Environment | Base URL | Pay Endpoint | Status Endpoint |
| :--- | :--- | :--- | :--- |
| **UAT / Sandbox** | `https://api-preprod.phonepe.com/apis/pg-sandbox` | `/pg/v1/pay` | `/pg/v1/status/{merchantId}/{merchantTransactionId}` |
| **Production (Live)** | `https://api.phonepe.com/apis/hermes` | `/pg/v1/pay` | `/pg/v1/status/{merchantId}/{merchantTransactionId}` |

### 3.3 Cryptographic Checksum Verification Formulas
1. **Pay Request Signature:**
   $$\text{Checksum} = \text{SHA256}(\text{base64Payload} + \text{"/pg/v1/pay"} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$
   Transmitted via header: `X-VERIFY: <Checksum>`

2. **Status Check Request Signature:**
   $$\text{Checksum} = \text{SHA256}(\text{"/pg/v1/status/"} + \text{merchantId} + \text{"/"} + \text{merchantTransactionId} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$
   Transmitted via header: `X-VERIFY: <Checksum>` and `X-MERCHANT-ID: <merchantId>`

3. **Webhook Callback Verification:**
   $$\text{Checksum} = \text{SHA256}(\text{base64Response} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$
   Matches received header `x-verify`.

---

## 4. DATABASE MIGRATIONS & SCHEMA ARCHITECTURE

Migration file created: [`20261009000001_step3_booking_payment_schema.sql`](file:///c:/Users/User/Downloads/kritimalviya%20side%20design%20inspo/Kritimalviya.com/supabase/migrations/20261009000001_step3_booking_payment_schema.sql)

### 4.1 Schema Additions
1. **`bookings` Table Enhancements:**
   *   `fee_snapshot NUMERIC(12,2) NOT NULL DEFAULT 1000.00`: Immutable snapshot of the service fee captured at booking creation time. Future fee changes never modify prior transactions.
   *   `currency TEXT NOT NULL DEFAULT 'INR'`: Authoritative currency designation.
   *   `confirmation_token TEXT UNIQUE`: Cryptographically random 192-bit hex token for authorization.
   *   `confirmation_token_expires_at TIMESTAMPTZ`: Expiration window (48 hours) for guest confirmation access.
   *   `hold_expires_at TIMESTAMPTZ`: 15-minute slot reservation window during payment completion.
   *   `booking_reference TEXT UNIQUE`: Strict database uniqueness constraint.

2. **`payments` Table Enhancements:**
   *   `merchant_order_id TEXT UNIQUE`: PhonePe `merchantTransactionId` with unique index.
   *   `idempotency_key TEXT UNIQUE`: Unique composite key preventing duplicate charge creation.
   *   `gateway TEXT DEFAULT 'PHONEPE'`: Provider tracking.
   *   `verified_at TIMESTAMPTZ`: Precise server-side verification timestamp.

3. **`email_logs` Table Created:**
   *   Maintains an immutable log of sent emails (`idempotency_key`, `type`, `recipient`, `subject`, `provider`, `provider_message_id`, `status`).
   *   Prevents duplicate transactional emails upon repeated webhook callbacks.

### 4.2 Stored Procedures & Functions
*   `generate_booking_reference()`: Server-side generator creating `KM-YYYYMMDD-XXXX` using `Asia/Kolkata` date and uppercase cryptographic random suffix with collision loop resolution.
*   `create_consultation_booking(...)`: `SECURITY DEFINER` function executing atomic validation, customer creation/matching, authoritative fee resolution, advisory transaction lock, slot overlap checking, and temporary hold creation.
*   `verify_and_update_payment(...)`: `SECURITY DEFINER` atomic procedure handling payment state transitions (`PAID`, `FAILED`, `CANCELLED`, `VERIFICATION_PENDING`), booking confirmation, amount reconciliation, and chamber notifications.
*   `get_confirmed_booking_by_token(p_token)`: Access-controlled reader returning only sanitized booking details for the holder of a valid token.

---

## 5. STATE MACHINES & IDEMPOTENCY

### 5.1 Booking State Machine
```text
[ PENDING_PAYMENT ] ── (Payment Verified) ──► [ CONFIRMED ] ── (Session Held) ──► [ COMPLETED ]
        │                                           │
        ├── (Hold Expired / Cancelled)              └── (Rescheduled by Admin) ──► [ RESCHEDULED ]
        ▼                                           │
  [ CANCELLED ]                                     └── (Cancelled by Admin) ────► [ CANCELLED ]
```

### 5.2 Payment State Machine
```text
[ PENDING ] ── (Initiated) ──► [ PROCESSING ] ── (PhonePe COMPLETED) ──► [ PAID ]
                                     │
                                     ├── (PhonePe FAILED/DECLINED) ──► [ FAILED ]
                                     ├── (User Cancelled) ───────────► [ CANCELLED ]
                                     └── (Delayed Settlement) ───────► [ VERIFICATION_PENDING ]
```

### 5.3 Idempotency Guarantees
*   **Duplicate Callback Handling:** If a webhook for an already `PAID` transaction arrives, `verify_and_update_payment` detects the existing state and returns `idempotent: true` without altering timestamps, inserting duplicate notifications, or re-sending emails.
*   **Double-Booking Race Condition Defense:** Concurrent booking requests for the same date and overlapping start/end time acquire transaction-scoped advisory locks. The first transaction reserves the hold; the second transaction fails with `SLOT_UNAVAILABLE` before any state is written.

---

## 6. RESEND TRANSACTIONAL EMAIL INTEGRATION

Module: [`supabase/functions/_shared/resend.ts`](file:///c:/Users/User/Downloads/kritimalviya%20side%20design%20inspo/Kritimalviya.com/supabase/functions/_shared/resend.ts)

*   **Design Language:** Luxury editorial styling matching Adv. Kriti Malviya Chambers (Warm cream `#FAF8F5`, charcoal `#18181B`, metallic gold `#BFA267`, Georgia serif titles).
*   **Templates Implemented:**
    1.  **Client Booking Confirmation Receipt:** Displays Order ID, consultation focus, date & time in `Asia/Kolkata` (IST), duration, mode, payment amount (₹1,000 via PhonePe), next steps, and chambers contact info.
    2.  **Chamber Administrative Notification:** Alerts the advocate of new confirmed consultations with client intake particulars and PhonePe transaction reference.
*   **Deduplication & Safety:** Checked against `email_logs.idempotency_key` (`EMAIL_CONFIRM_<ref>`). If Resend API credentials are not yet configured in Edge Function secrets, the payment flow completes gracefully with an operational warning log rather than aborting.

---

## 7. AUTOMATED TESTING & VERIFICATION RESULTS

An automated test suite was executed across all security boundaries, cryptographic checksums, and business logic:

**Test File:** [`tests/step3_booking_payment_tests.mjs`](file:///c:/Users/User/Downloads/kritimalviya%20side%20design%20inspo/Kritimalviya.com/tests/step3_booking_payment_tests.mjs)

| # | Test Scenario | Category | Result |
| :--- | :--- | :--- | :--- |
| 1 | Secret Scanning of Public Frontend Files (Zero Secrets in JS/HTML/CSS) | Security | **PASSED** |
| 2 | Server Booking Reference Format (`KM-YYYYMMDD-XXXX`) | Formatting | **PASSED** |
| 3 | Database Collision-Handling Loop (500 Unique Consecutive Bookings) | Concurrency | **PASSED** |
| 4 | PhonePe `/pg/v1/pay` Checksum Signature Construction (SHA-256 + Salt) | Gateway | **PASSED** |
| 5 | Genuine PhonePe Webhook Signature Authentication | Gateway | **PASSED** |
| 6 | Forged or Tampered PhonePe Webhook Signature Strict Rejection | Gateway | **PASSED** |
| 7 | Identical Slot Overlap Flagged as Conflict | Double Booking | **PASSED** |
| 8 | Adjacent Non-Overlapping Slots Allowed Without Conflict | Double Booking | **PASSED** |
| 9 | 60-min Consultation Overlapping 30-min Sub-Intervals Blocked | Double Booking | **PASSED** |
| 10 | Enclosing Interval Conflict Detection | Double Booking | **PASSED** |
| 11 | ₹1,000 Conversion to 100,000 Integer Paise for PhonePe API | Money | **PASSED** |
| 12 | Precision Loss Prevention on Fractional Rupee Conversion | Money | **PASSED** |
| 13 | Confirmation Token 192-bit Cryptographic Entropy | Authorization | **PASSED** |
| 14 | Anti-IDOR: Nonce-Based Confirmation Access Immune to Guessing | Authorization | **PASSED** |
| 15 | Valid Customer Email Format Accepted | Validation | **PASSED** |
| 16 | Malformed Email String Rejected | Validation | **PASSED** |
| 17 | Script/XSS Injection in Email Rejected | Security | **PASSED** |
| 18 | Valid Indian Contact Number Format Accepted | Validation | **PASSED** |
| 19 | Short Phone Number Under 8 Digits Rejected | Validation | **PASSED** |

**Execution Summary:** 19 Passed · 0 Failed · 100% Success Rate.

---

## 8. ENVIRONMENT CONFIGURATION & DEPLOYMENT GUIDE

### 8.1 Configuration Template
See [`Kritimalviya.com/.env.example`](file:///c:/Users/User/Downloads/kritimalviya%20side%20design%20inspo/Kritimalviya.com/.env.example):
```text
# --- PUBLIC CLIENT CONFIGURATION ---
PUBLIC_SITE_URL=https://kritimalviya.com
SUPABASE_URL=https://jsykvtzohbappquzskwm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...

# --- SUPABASE EDGE FUNCTION SECRETS ---
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=UAT
RESEND_API_KEY=re_YOUR_KEY
RESEND_FROM_EMAIL=Adv. Kriti Malviya <consultations@kritimalviya.com>
ADMIN_NOTIFY_EMAIL=contact@kritimalviya.com
```

### 8.2 Supabase CLI Commands to Deploy Step 3
Once the merchant account is finalized and Supabase credentials are ready:
```bash
# 1. Apply database migration
npx supabase db push

# 2. Set server secrets in Edge Function runtime
npx supabase secrets set PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID
npx supabase secrets set PHONEPE_SALT_KEY=YOUR_SALT_KEY
npx supabase secrets set PHONEPE_SALT_INDEX=1
npx supabase secrets set PHONEPE_ENVIRONMENT=LIVE
npx supabase secrets set RESEND_API_KEY=re_YOUR_KEY
npx supabase secrets set PUBLIC_SITE_URL=https://kritimalviya.com

# 3. Deploy Edge Functions
npx supabase functions deploy create-booking
npx supabase functions deploy initiate-phonepe-payment
npx supabase functions deploy verify-phonepe-payment
```

---

## 9. STRICT BOUNDARY CHECK & NEXT STEPS

*   [x] **Visual Design:** Step 1 luxury warm-cream editorial aesthetic 100% preserved.
*   [x] **Security Standard:** Client is NEVER the source of truth for fee, status, or confirmation.
*   [x] **PhonePe Standard Gateway:** PG V1 implemented with official SHA-256 Checksums.
*   [x] **Resend Integration:** Production templates and idempotent delivery logging ready.
*   [x] **No Secrets in Frontend:** Thoroughly scanned and verified.
*   [x] **STRICT STOP CONDITION OBSERVED:** Step 4 (Master Admin Control Center) has **NOT** been started. Final Hostinger production deployment has **NOT** been performed.
