# ==============================================================================
# ADV. KRITI MALVIYA CHAMBERS — SUPABASE EDGE FUNCTIONS DEPLOYMENT SCRIPT
# Environment: Windows PowerShell
# ==============================================================================

param (
    [string]$ProjectRef = "jsykvtzohbappquzskwm"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  KRITIMALVIYA.COM — SUPABASE EDGE FUNCTIONS DEPLOYMENT   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Node.js / npx
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "npx is required to run Supabase CLI. Please install Node.js."
    exit 1
}

Write-Host "`n[1/4] Checking Supabase CLI..." -ForegroundColor Yellow
npx supabase --version

# 2. Check project link
Write-Host "`n[2/4] Linking to Supabase Project: $ProjectRef..." -ForegroundColor Yellow
npx supabase link --project-ref $ProjectRef

# 3. Deploy Edge Functions
$functions = @("create-booking", "initiate-phonepe-payment", "verify-phonepe-payment")

Write-Host "`n[3/4] Deploying Edge Functions to Production..." -ForegroundColor Yellow
foreach ($fn in $functions) {
    Write-Host "  -> Deploying $fn..." -ForegroundColor Green
    npx supabase functions deploy $fn --project-ref $ProjectRef --no-verify-jwt
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Deployment of $fn returned exit code $LASTEXITCODE. Verify CLI authentication."
    }
}

# 4. Secrets Guidance Notice
Write-Host "`n[4/4] Required Server Secrets Verification:" -ForegroundColor Yellow
Write-Host "Make sure the following production secrets are set via:" -ForegroundColor Gray
Write-Host "  npx supabase secrets set PHONEPE_MERCHANT_ID=YOUR_LIVE_MID" -ForegroundColor Cyan
Write-Host "  npx supabase secrets set PHONEPE_SALT_KEY=YOUR_LIVE_KEY" -ForegroundColor Cyan
Write-Host "  npx supabase secrets set PHONEPE_SALT_INDEX=1" -ForegroundColor Cyan
Write-Host "  npx supabase secrets set PHONEPE_ENVIRONMENT=LIVE" -ForegroundColor Cyan
Write-Host "  npx supabase secrets set RESEND_API_KEY=re_YOUR_KEY" -ForegroundColor Cyan
Write-Host "  npx supabase secrets set PUBLIC_SITE_URL=https://kritimalviya.com" -ForegroundColor Cyan

Write-Host "`n✓ Deployment procedure completed." -ForegroundColor Green
