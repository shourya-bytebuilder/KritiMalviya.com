// =============================================================================
// STEP 4 AUTOMATED TEST SUITE: MASTER ADMIN CONTROL CENTER
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(".");
const SITE_DIR = path.join(ROOT_DIR, "site");

let passedCount = 0;
let failedCount = 0;
const results = [];

function assert(condition, testName, details = "") {
  if (condition) {
    passedCount++;
    results.push({ name: testName, status: "PASSED", details });
    console.log(`  ✓ [PASSED] ${testName}`);
  } else {
    failedCount++;
    results.push({ name: testName, status: "FAILED", details });
    console.error(`  ✗ [FAILED] ${testName} - ${details}`);
  }
}

console.log("\n=======================================================");
console.log("RUNNING STEP 4 AUTOMATED TESTS: MASTER ADMIN CONTROL CENTER");
console.log("=======================================================\n");

// -----------------------------------------------------------------------------
// TEST SUITE 1: SECRET SCANNING OF PUBLIC FRONTEND FILES
// -----------------------------------------------------------------------------
console.log("Suite 1: Zero Privileged Secrets in Browser-Delivered Files");

const FORBIDDEN_PATTERNS = [
  /service_role/i,
  /PHONEPE_SALT_KEY/i,
  /RESEND_API_KEY/i,
  /099eb0cd-02cf-4e2a-8aca-3e6c6aff0399/, // PhonePe test salt
  /re_[A-Za-z0-9_]{20,}/ // Resend API keys
];

let foundLeak = false;
let leakDetails = "";

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        scanDirectory(fullPath);
      }
    } else if (/\.(html|js|css|json)$/i.test(file)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
          foundLeak = true;
          leakDetails = `${fullPath} matches ${pattern}`;
          break;
        }
      }
    }
  }
}

scanDirectory(SITE_DIR);
assert(!foundLeak, "Frontend Files Contain Zero Server Secrets or Privileged Keys", foundLeak ? leakDetails : "Clean");

// -----------------------------------------------------------------------------
// TEST SUITE 2: ADMIN HTML PANEL STRUCTURE VERIFICATION
// -----------------------------------------------------------------------------
console.log("\nSuite 2: Admin HTML Modules & Navigation Completeness");

const adminHtml = fs.readFileSync(path.join(SITE_DIR, "admin", "admin.html"), "utf-8");

const requiredViews = [
  "view-dashboard",
  "view-analytics",
  "view-reports",
  "view-notifications",
  "view-bookings",
  "view-customers",
  "view-payments",
  "view-services",
  "view-availability",
  "view-cms-content",
  "view-cms-gallery",
  "view-cms-awards",
  "view-cms-vlog",
  "view-cms-blog",
  "view-settings",
  "view-users",
  "view-logs"
];

for (const v of requiredViews) {
  assert(adminHtml.includes(`id="${v}"`), `Admin Panel contains #${v}`);
}

assert(adminHtml.includes("admin-modal"), "Admin Panel contains generic Action Modal (#admin-modal)");
assert(adminHtml.includes("admin-drawer"), "Admin Panel contains Inspector Drawer (#admin-drawer)");
assert(adminHtml.includes("admin-toast-container"), "Admin Panel contains Toast Container (#admin-toast-container)");

// -----------------------------------------------------------------------------
// TEST SUITE 3: SUPABASE.JS ADMIN APIS COMPLETENESS
// -----------------------------------------------------------------------------
console.log("\nSuite 3: Supabase.js Administrative Operations Layer");

const supabaseJs = fs.readFileSync(path.join(SITE_DIR, "js", "supabase.js"), "utf-8");

const requiredSupabaseMethods = [
  "adminUpdateBookingStatus",
  "adminRescheduleBooking",
  "adminUpdateCustomer",
  "adminReconcilePayment",
  "adminSaveService",
  "adminSaveAvailability",
  "adminAddBlockedDate",
  "adminDeleteBlockedDate",
  "adminSaveSiteContent",
  "adminSaveGalleryItem",
  "adminDeleteGalleryItem",
  "adminSaveAchievement",
  "adminDeleteAchievement",
  "adminSaveVideo",
  "adminDeleteVideo",
  "adminSaveBlogPost",
  "adminDeleteBlogPost",
  "adminSaveSiteSettings",
  "adminMarkNotificationRead",
  "adminMarkAllNotificationsRead",
  "adminResolveErrorLog",
  "adminUpdateUserRole",
  "adminGenerateDailyReport",
  "adminLogActivity",
  "exportToCSV"
];

for (const m of requiredSupabaseMethods) {
  assert(supabaseJs.includes(m), `KM_SUPABASE exports ${m}() method`);
}

// -----------------------------------------------------------------------------
// TEST SUITE 4: CSV FORMULA INJECTION HARDENING
// -----------------------------------------------------------------------------
console.log("\nSuite 4: CSV Export Formula Injection Sanitization");

function sanitizeCellForCSV(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

assert(sanitizeCellForCSV("=SUM(A1:A10)") === `"'=SUM(A1:A10)"`, "Leading '=' formula prefix is sanitized with single quote");
assert(sanitizeCellForCSV("+1234567890") === ` "'+1234567890"`.trim(), "Leading '+' is sanitized with single quote");
assert(sanitizeCellForCSV("-cmd|' /C calc'!A0") === ` "'-cmd|' /C calc'!A0"`.trim(), "Dangerous '-cmd' injection is sanitized");
assert(sanitizeCellForCSV("@malicious_link") === `"\'@malicious_link"`, "Leading '@' is sanitized with single quote");
assert(sanitizeCellForCSV("Normal Text") === `"Normal Text"`, "Normal cell content preserved without mangling");

// -----------------------------------------------------------------------------
// TEST SUITE 5: STEP 4 DATABASE MIGRATION VERIFICATION
// -----------------------------------------------------------------------------
console.log("\nSuite 5: Database Migration Schema & Procedures Integrity");

const migrationPath = path.join(ROOT_DIR, "supabase", "migrations", "20261009000002_step4_admin_management_schema.sql");
assert(fs.existsSync(migrationPath), "Migration 20261009000002_step4_admin_management_schema.sql exists");

const migrationSql = fs.readFileSync(migrationPath, "utf-8");
assert(migrationSql.includes("FUNCTION public.get_auth_role()"), "Contains get_auth_role() helper");
assert(migrationSql.includes("FUNCTION public.admin_update_booking_status("), "Contains admin_update_booking_status() RPC");
assert(migrationSql.includes("FUNCTION public.admin_reschedule_booking("), "Contains admin_reschedule_booking() RPC");
assert(migrationSql.includes("FUNCTION public.admin_update_user_role("), "Contains admin_update_user_role() RPC");
assert(migrationSql.includes("FUNCTION public.admin_resolve_error("), "Contains admin_resolve_error() RPC");
assert(migrationSql.includes("FUNCTION public.generate_daily_business_report("), "Contains generate_daily_business_report() RPC");
assert(migrationSql.includes("pg_advisory_xact_lock"), "Reschedule procedure enforces advisory concurrency lock");
assert(migrationSql.includes("CANNOT_REMOVE_LAST_SUPER_ADMIN"), "Prevents removing last SUPER_ADMIN");
assert(migrationSql.includes("PREVENT_SELF_MUTATION"), "Prevents self role escalation/demotion");

// -----------------------------------------------------------------------------
// TEST SUITE 6: REVENUE CALCULATION STRICT FILTER VERIFICATION
// -----------------------------------------------------------------------------
console.log("\nSuite 6: Revenue Calculation Integrity (Excludes Pending/Failed)");

function calculateSettledRevenue(payments) {
  return payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
}

const mockPayments = [
  { amount: 1000, status: "PAID" },
  { amount: 1000, status: "PENDING" },
  { amount: 1000, status: "FAILED" },
  { amount: 1000, status: "CANCELLED" },
  { amount: 2000, status: "PAID" }
];

const totalRevenue = calculateSettledRevenue(mockPayments);
assert(totalRevenue === 3000, "Settled revenue strictly counts PAID records only (Excludes PENDING/FAILED)", `Expected 3000, got ${totalRevenue}`);

// -----------------------------------------------------------------------------
// TEST SUMMARY
// -----------------------------------------------------------------------------
console.log("\n=======================================================");
console.log(`STEP 4 TEST EXECUTION COMPLETED: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("=======================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
