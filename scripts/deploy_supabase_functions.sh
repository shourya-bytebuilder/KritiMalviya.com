#!/usr/bin/env bash
# ==============================================================================
# ADV. KRITI MALVIYA CHAMBERS — SUPABASE EDGE FUNCTIONS DEPLOYMENT SCRIPT
# Environment: Linux / macOS / Bash CI/CD
# ==============================================================================

set -e

PROJECT_REF="${1:-jsykvtzohbappquzskwm}"

echo "=========================================================="
echo "  KRITIMALVIYA.COM — SUPABASE EDGE FUNCTIONS DEPLOYMENT   "
echo "=========================================================="

# 1. Check Node.js / npx
if ! command -v npx &> /dev/null; then
    echo "Error: npx is required to run Supabase CLI. Please install Node.js."
    exit 1
fi

echo -e "\n[1/4] Checking Supabase CLI..."
npx supabase --version

# 2. Link Project
echo -e "\n[2/4] Linking to Supabase Project: ${PROJECT_REF}..."
npx supabase link --project-ref "${PROJECT_REF}"

# 3. Deploy Edge Functions
FUNCTIONS=("create-booking" "initiate-phonepe-payment" "verify-phonepe-payment")

echo -e "\n[3/4] Deploying Edge Functions to Production..."
for fn in "${FUNCTIONS[@]}"; do
    echo "  -> Deploying ${fn}..."
    npx supabase functions deploy "${fn}" --project-ref "${PROJECT_REF}" --no-verify-jwt || echo "Warning: ${fn} deployment returned non-zero exit code"
done

# 4. Secrets Guidance Notice
echo -e "\n[4/4] Required Server Secrets Verification:"
echo "Make sure the following production secrets are set via:"
echo "  npx supabase secrets set PHONEPE_MERCHANT_ID=YOUR_LIVE_MID"
echo "  npx supabase secrets set PHONEPE_SALT_KEY=YOUR_LIVE_KEY"
echo "  npx supabase secrets set PHONEPE_SALT_INDEX=1"
echo "  npx supabase secrets set PHONEPE_ENVIRONMENT=LIVE"
echo "  npx supabase secrets set RESEND_API_KEY=re_YOUR_KEY"
echo "  npx supabase secrets set PUBLIC_SITE_URL=https://kritimalviya.com"

echo -e "\n✓ Deployment procedure completed."
