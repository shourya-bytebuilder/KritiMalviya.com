# SUPABASE STRUCTURE SPECIFICATION: ADV. KRITI MALVIYA

**Document Purpose:** The exact, implementation-ready Supabase and PostgreSQL blueprint for the Adv. Kriti Malviya professional website.

---

## 1. Supabase Architecture

The backend relies on Supabase as the primary application database and API gateway.
*   **Database:** Supabase PostgreSQL handles data persistence, atomic concurrency control (double-booking protection), and role-based access.
*   **Authentication:** Supabase Auth manages secure access for administrators. (Public users do not require accounts).
*   **API:** PostgREST provides the auto-generated GraphQL/REST API, protected by Row Level Security (RLS).
*   **Compute:** Supabase Edge Functions handle privileged server-side integrations (PhonePe payment intent generation, webhook verification, and Resend email triggering).
*   **Storage:** Minimal Supabase Storage usage. Public media primarily uses Google Drive and YouTube to optimize bandwidth.

## 2. Project Configuration

**Supabase Dashboard Settings:**
*   **Authentication:** 
    *   Enable Email/Password. 
    *   Disable "Allow new users to sign up" (Admins are invited manually to prevent public registration).
    *   Site URL: `https://[production-domain].com`
    *   Redirect URLs: `https://[production-domain].com/admin.html`
*   **Database:** Enable Point-in-Time Recovery (PITR) for production.
*   **API:** Restrict the public schema to only necessary tables via RLS.

## 3. Environment Variables and Secrets

The following secrets must be configured in the Supabase Dashboard under **Edge Functions -> Secrets**, and NEVER exposed in frontend code.

```text
# Supabase (Managed Automatically, do not expose Service Role)
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[PUBLIC_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SECRET_KEY_NEVER_EXPOSE]

# PhonePe Integration
PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID
PHONEPE_SALT_KEY=YOUR_SECRET_SALT_KEY
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=UAT # Change to 'LIVE' in production

# Resend Integration
RESEND_API_KEY=re_[YOUR_SECRET_KEY]