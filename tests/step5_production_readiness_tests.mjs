// ==============================================================================
// STEP 5 AUTOMATED TESTS: PRODUCTION LAUNCH PREPARATION & SECURITY AUDIT
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// ==============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.resolve(rootDir, "site");

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓ [PASSED] ${message}`);
        passed++;
    } else {
        console.error(`  ✗ [FAILED] ${message}`);
        failed++;
    }
}

console.log("\n=======================================================");
console.log("RUNNING STEP 5 AUTOMATED TESTS: PRODUCTION READINESS & SECURITY");
console.log("=======================================================\n");

// ------------------------------------------------------------------------------
// SUITE 1: HOSTINGER WEB SERVER CONFIGURATION (.htaccess)
// ------------------------------------------------------------------------------
console.log("Suite 1: Hostinger Web Server Configuration (.htaccess)");
const htaccessPath = path.join(siteDir, ".htaccess");
const htaccessExists = fs.existsSync(htaccessPath);
assert(htaccessExists, "Production .htaccess file exists in site directory");

if (htaccessExists) {
    const htaccess = fs.readFileSync(htaccessPath, "utf8");
    assert(htaccess.includes("RewriteEngine On"), ".htaccess activates RewriteEngine");
    assert(htaccess.includes("RewriteCond %{HTTPS} off"), ".htaccess enforces automatic HTTPS redirection");
    assert(htaccess.includes("ErrorDocument 404 /404.html"), ".htaccess configures custom 404 error handler");
    assert(htaccess.includes("X-Content-Type-Options") && htaccess.includes("nosniff"), ".htaccess sets X-Content-Type-Options: nosniff");
    assert(htaccess.includes("X-Frame-Options") && htaccess.includes("SAMEORIGIN"), ".htaccess sets X-Frame-Options: SAMEORIGIN");
    assert(htaccess.includes("Referrer-Policy"), ".htaccess sets strict Referrer-Policy");
    assert(htaccess.includes("Strict-Transport-Security"), ".htaccess sets Strict-Transport-Security (HSTS)");
    assert(htaccess.includes("mod_deflate.c") && htaccess.includes("text/css") && htaccess.includes("application/javascript"), ".htaccess configures GZIP / Deflate compression for text, css, and js");
    assert(htaccess.includes("mod_expires.c") && htaccess.includes("image/jpeg") && htaccess.includes("font/woff2"), ".htaccess sets long browser cache expiry for images and fonts");
    assert(htaccess.includes("Options -Indexes"), ".htaccess disables directory browsing indexes");
}

// ------------------------------------------------------------------------------
// SUITE 2: SEARCH ENGINE CRAWLING INFRASTRUCTURE (robots.txt & sitemap.xml)
// ------------------------------------------------------------------------------
console.log("\nSuite 2: Search Engine Crawling Infrastructure (robots.txt & sitemap.xml)");
const robotsPath = path.join(siteDir, "robots.txt");
assert(fs.existsSync(robotsPath), "robots.txt exists in site root");

if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, "utf8");
    assert(robots.includes("User-agent: *"), "robots.txt targets all search engine crawlers");
    assert(robots.includes("Disallow: /admin/"), "robots.txt protects /admin/ from public indexation");
    assert(robots.includes("Sitemap: https://kritimalviya.com/sitemap.xml"), "robots.txt points to canonical XML sitemap");
}

const sitemapPath = path.join(siteDir, "sitemap.xml");
assert(fs.existsSync(sitemapPath), "sitemap.xml exists in site root");

if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    assert(sitemap.startsWith("<?xml") && sitemap.includes("<urlset"), "sitemap.xml conforms to standard XML schema");
    assert(sitemap.includes("https://kritimalviya.com/"), "sitemap.xml indexes canonical homepage");
    assert(sitemap.includes("https://kritimalviya.com/consultation.html"), "sitemap.xml indexes consultation portal");
    assert(sitemap.includes("https://kritimalviya.com/services/legal.html"), "sitemap.xml indexes legal counselling practice");
    assert(sitemap.includes("https://kritimalviya.com/services/relationship.html"), "sitemap.xml indexes relationship counselling practice");
    assert(sitemap.includes("https://kritimalviya.com/blog.html"), "sitemap.xml indexes editorial blog");
    assert(!sitemap.includes("/admin/"), "sitemap.xml excludes private admin routes");
}

// ------------------------------------------------------------------------------
// SUITE 3: PRODUCTION 404 ERROR PAGE (404.html)
// ------------------------------------------------------------------------------
console.log("\nSuite 3: Production 404 Error Page (404.html)");
const errorPagePath = path.join(siteDir, "404.html");
assert(fs.existsSync(errorPagePath), "Dedicated 404.html exists in site root");

if (fs.existsSync(errorPagePath)) {
    const errorHtml = fs.readFileSync(errorPagePath, "utf8");
    assert(errorHtml.includes('name="viewport"'), "404.html contains responsive viewport meta tag");
    assert(errorHtml.includes('name="robots" content="noindex'), "404.html prevents search engines from indexing error pages");
    assert(errorHtml.includes("css/style.css"), "404.html links to unified design stylesheet");
    assert(errorHtml.includes("KRITIMALVIYA"), "404.html features official brand header");
    assert(errorHtml.includes("index.html") && errorHtml.includes("consultation.html"), "404.html provides clear navigation recovery CTAs");
}

// ------------------------------------------------------------------------------
// SUITE 4: SUPABASE EDGE FUNCTIONS ARCHITECTURE & SECURITY
// ------------------------------------------------------------------------------
console.log("\nSuite 4: Supabase Edge Functions Architecture & Security");
const fnDir = path.resolve(rootDir, "supabase", "functions");
const requiredFunctions = ["create-booking", "initiate-phonepe-payment", "verify-phonepe-payment"];

requiredFunctions.forEach(fn => {
    const fnFile = path.join(fnDir, fn, "index.ts");
    const exists = fs.existsSync(fnFile);
    assert(exists, `Edge Function '${fn}' exists at ${path.relative(rootDir, fnFile)}`);
    if (exists) {
        const content = fs.readFileSync(fnFile, "utf8");
        assert(content.includes("handleCors"), `Edge Function '${fn}' handles CORS preflight`);
        assert(content.includes("Deno.env.get"), `Edge Function '${fn}' reads secrets from environment variables, not hardcoded strings`);
    }
});

const sharedCors = path.join(fnDir, "_shared", "cors.ts");
const sharedPhonepe = path.join(fnDir, "_shared", "phonepe.ts");
const sharedResend = path.join(fnDir, "_shared", "resend.ts");

assert(fs.existsSync(sharedCors), "Shared CORS module exists");
assert(fs.existsSync(sharedPhonepe), "Shared PhonePe cryptographic module exists");
assert(fs.existsSync(sharedResend), "Shared Resend email dispatcher exists");

// ------------------------------------------------------------------------------
// SUITE 5: AUTOMATION DEPLOYMENT SCRIPTS
// ------------------------------------------------------------------------------
console.log("\nSuite 5: Automation Deployment Scripts");
const ps1Script = path.resolve(rootDir, "scripts", "deploy_supabase_functions.ps1");
const shScript = path.resolve(rootDir, "scripts", "deploy_supabase_functions.sh");

assert(fs.existsSync(ps1Script), "PowerShell deployment script exists in scripts/ directory");
assert(fs.existsSync(shScript), "Bash deployment script exists in scripts/ directory");

if (fs.existsSync(ps1Script)) {
    const ps1 = fs.readFileSync(ps1Script, "utf8");
    assert(ps1.includes("create-booking") && ps1.includes("initiate-phonepe-payment") && ps1.includes("verify-phonepe-payment"), "PowerShell script deploys all 3 Edge Functions");
}

// ------------------------------------------------------------------------------
// SUITE 6: ZERO PRIVILEGED SECRETS IN FRONTEND FILES
// ------------------------------------------------------------------------------
console.log("\nSuite 6: Zero Privileged Secrets in Frontend Files");
const frontendFiles = [
    path.join(siteDir, "js", "supabase.js"),
    path.join(siteDir, "js", "app.js"),
    path.join(siteDir, "index.html"),
    path.join(siteDir, "consultation.html"),
    path.join(siteDir, "payment.html"),
    path.join(siteDir, "confirmation.html"),
    path.join(siteDir, "admin", "admin.html")
];

const forbiddenKeywords = [
    "service_role",
    "SUPABASE_SERVICE_ROLE_KEY",
    "PHONEPE_SALT_KEY",
    "RESEND_API_KEY",
    "re_123",
    "re_"
];

let leakDetected = false;
frontendFiles.forEach(f => {
    if (fs.existsSync(f)) {
        const text = fs.readFileSync(f, "utf8");
        forbiddenKeywords.forEach(kw => {
            // Allow security warning comments explaining what NOT to include
            const lines = text.split("\n");
            lines.forEach((line, idx) => {
                if (line.includes(kw) && !line.includes("Never include") && !line.includes("SECURITY BOUNDARY") && !line.includes("service secrets") && !line.includes("Keep all")) {
                    console.error(`  [LEAK] Potential secret reference '${kw}' in ${path.relative(rootDir, f)}:L${idx + 1}`);
                    leakDetected = true;
                }
            });
        });
    }
});
assert(!leakDetected, "Public frontend files contain zero exposed server secrets or private API tokens");

// ------------------------------------------------------------------------------
// SUMMARY
// ------------------------------------------------------------------------------
console.log("\n=======================================================");
console.log(`STEP 5 TEST EXECUTION COMPLETED: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
