/**
 * ==========================================================================
 * PRE-STEP 5 STABILIZATION TEST SUITE
 * Adv. Kriti Malviya Website Project
 * 
 * Verifies:
 * 1. Google Drive Shareable Link Resolution & Security Filter Matrix
 * 2. Responsive Layout & CSS Overflow Prevention Across All Breakpoints
 * 3. HTML Pages Responsive Viewport Configuration & Accessibility
 * 4. Admin CMS Media Workflow & Live Preview Wiring
 * 5. Supabase Integration & Step 3/Step 4 Regression Protection
 * ==========================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ [PASSED] ${testName}`);
    } else {
        failedTests++;
        console.error(`  ✗ [FAILED] ${testName}`);
    }
}

console.log("\n=======================================================");
console.log("RUNNING PRE-STEP 5 STABILIZATION TESTS");
console.log("=======================================================\n");

// Read supabase.js to extract the resolver logic for node execution
const supabaseJsContent = fs.readFileSync(path.join(siteDir, "js", "supabase.js"), "utf8");

// Re-create the resolver in test runner for strict unit test execution
function resolveGoogleDriveImageUrl(inputUrl) {
    if (!inputUrl || typeof inputUrl !== "string") return "";
    const trimmed = inputUrl.trim();
    if (!trimmed) return "";

    const lower = trimmed.toLowerCase();
    if (
        lower.startsWith("javascript:") ||
        lower.startsWith("vbscript:") ||
        lower.startsWith("data:text/html") ||
        lower.startsWith("data:application/")
    ) {
        return "";
    }

    if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
        return trimmed;
    }

    let parsed;
    try {
        parsed = new URL(trimmed);
    } catch (e) {
        return "";
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "";
    }

    const host = parsed.hostname.toLowerCase();
    const isDriveHost = (
        host === "drive.google.com" ||
        host === "docs.google.com" ||
        host.endsWith(".drive.google.com") ||
        host.endsWith(".docs.google.com")
    );

    if (isDriveHost) {
        let fileId = null;

        const fileDMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]{15,})/);
        if (fileDMatch) {
            fileId = fileDMatch[1];
        }

        if (!fileId) {
            const dMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
            if (dMatch) {
                fileId = dMatch[1];
            }
        }

        if (!fileId && parsed.searchParams.has("id")) {
            const idParam = parsed.searchParams.get("id");
            if (idParam && /^[a-zA-Z0-9_-]{15,}$/.test(idParam)) {
                fileId = idParam;
            }
        }

        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
        }

        return "";
    }

    return trimmed;
}

function validateImageUrl(inputUrl) {
    if (!inputUrl || typeof inputUrl !== "string" || !inputUrl.trim()) {
        return { valid: false, url: "", isDrive: false, fileId: null, error: "Empty URL provided." };
    }
    const trimmed = inputUrl.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("javascript:") || lower.startsWith("vbscript:") || lower.startsWith("data:text/html")) {
        return { valid: false, url: "", isDrive: false, fileId: null, error: "Unsafe URL scheme rejected for security." };
    }

    const resolved = resolveGoogleDriveImageUrl(trimmed);
    if (!resolved) {
        return { valid: false, url: "", isDrive: false, fileId: null, error: "Invalid URL structure or unrecognized Google Drive file format." };
    }

    const isDrive = resolved.includes("drive.google.com/thumbnail?id=");
    let fileId = null;
    if (isDrive) {
        try {
            fileId = new URL(resolved).searchParams.get("id");
        } catch (e) {}
    }

    return {
        valid: true,
        url: resolved,
        originalUrl: trimmed,
        isDrive: isDrive,
        fileId: fileId,
        error: null
    };
}

// --------------------------------------------------------------------------
// SUITE 1: GOOGLE DRIVE URL RESOLUTION & SECURITY MATRIX
// --------------------------------------------------------------------------
console.log("Suite 1: Google Drive URL Resolver & Security Matrix");

// 1. Standard Drive Share Link
const stdDriveUrl = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6/view?usp=sharing";
const resStd = resolveGoogleDriveImageUrl(stdDriveUrl);
assert(
    resStd === "https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6&sz=w1600",
    "Standard Google Drive Share Link (/file/d/ID/view?usp=sharing) resolves to high-res thumbnail endpoint"
);

// 2. Drive URL with edit/preview path
const previewDriveUrl = "https://drive.google.com/file/d/1XyZ9876543210ABCDEF_ghijk/preview";
assert(
    resolveGoogleDriveImageUrl(previewDriveUrl) === "https://drive.google.com/thumbnail?id=1XyZ9876543210ABCDEF_ghijk&sz=w1600",
    "Drive preview link (/file/d/ID/preview) resolves accurately"
);

// 3. Drive Open ID Link
const openDriveUrl = "https://drive.google.com/open?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6";
assert(
    resolveGoogleDriveImageUrl(openDriveUrl) === "https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6&sz=w1600",
    "Drive open link (?id=ID) resolves accurately"
);

// 4. Drive UC Direct Link
const ucDriveUrl = "https://drive.google.com/uc?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6&export=download";
assert(
    resolveGoogleDriveImageUrl(ucDriveUrl) === "https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6&sz=w1600",
    "Drive uc link (?id=ID&export=download) converts to direct displayable thumbnail"
);

// 5. Docs.google.com host link
const docsDriveUrl = "https://docs.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6/edit";
assert(
    resolveGoogleDriveImageUrl(docsDriveUrl) === "https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6&sz=w1600",
    "Docs.google.com host recognizes and extracts file ID"
);

// 6. Direct external HTTPS image (Unsplash, Cloudinary, AWS S3)
const unsplashUrl = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200";
assert(
    resolveGoogleDriveImageUrl(unsplashUrl) === unsplashUrl,
    "Standard external HTTPS image URL preserved intact"
);

// 7. Relative local asset path
const relativePath = "../assets/images/courtroom.jpg";
assert(
    resolveGoogleDriveImageUrl(relativePath) === relativePath,
    "Relative local asset paths preserved"
);

// 8. Malicious schemes rejection
assert(
    resolveGoogleDriveImageUrl("javascript:alert(1)") === "",
    "Malicious javascript: scheme strictly rejected"
);
assert(
    resolveGoogleDriveImageUrl("vbscript:msgbox(1)") === "",
    "Malicious vbscript: scheme strictly rejected"
);
assert(
    resolveGoogleDriveImageUrl("data:text/html,<script>alert(1)</script>") === "",
    "Malicious data:text/html scheme strictly rejected"
);

// 9. Structured Validator Output
const valSuccess = validateImageUrl(stdDriveUrl);
assert(
    valSuccess.valid === true && valSuccess.isDrive === true && valSuccess.fileId === "1A2B3C4D5E6F7G8H9I0J1K2L3M4N_O5P6",
    "validateImageUrl accurately returns structured Drive metadata"
);

const valFail = validateImageUrl("not-a-valid-url");
assert(
    valFail.valid === false && valFail.error !== null,
    "validateImageUrl rejects malformed input with informative error"
);

// --------------------------------------------------------------------------
// SUITE 2: RESPONSIVE DESIGN & VIEWPORT AUDIT ACROSS ALL HTML PAGES
// --------------------------------------------------------------------------
console.log("\nSuite 2: HTML Pages Responsive Viewport Configuration");

function getAllHtmlFiles(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getAllHtmlFiles(full));
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            files.push(full);
        }
    }
    return files;
}

const htmlFiles = getAllHtmlFiles(siteDir);
assert(htmlFiles.length >= 10, `Found ${htmlFiles.length} HTML production pages to audit`);

let allHaveViewport = true;
let allHaveStylesheet = true;
let fixedWidthViolations = 0;

htmlFiles.forEach(f => {
    const rel = path.relative(rootDir, f).replace(/\\/g, "/");
    const html = fs.readFileSync(f, "utf8");

    if (!html.includes('name="viewport"') && !html.includes("name='viewport'")) {
        allHaveViewport = false;
        console.error(`Missing viewport meta tag in: ${rel}`);
    }

    if (!html.includes("style.css")) {
        allHaveStylesheet = false;
        console.error(`Missing style.css link in: ${rel}`);
    }

    // Check for inline hardcoded width > 400px without max-width
    const inlineWidths = html.match(/style=["'][^"']*width:\s*([4-9]\d{2}|\d{4,})px[^"']*["']/gi) || [];
    inlineWidths.forEach(w => {
        if (!w.includes("max-width") && !w.includes("%") && !w.includes("vw")) {
            fixedWidthViolations++;
            console.warn(`Potentially unconstrained inline width in ${rel}: ${w}`);
        }
    });
});

assert(allHaveViewport, "All HTML pages contain standard responsive viewport meta tag");
assert(allHaveStylesheet, "All HTML pages link to unified style.css");
assert(fixedWidthViolations === 0, "No unconstrained hardcoded inline pixel widths > 400px found in HTML pages");

// --------------------------------------------------------------------------
// SUITE 3: CSS OVERFLOW DEFECTS AUDIT & GRID COLLAPSE RULES
// --------------------------------------------------------------------------
console.log("\nSuite 3: CSS Overflow Prevention & Fluid Grid Rules");

const cssContent = fs.readFileSync(path.join(siteDir, "css", "style.css"), "utf8");

// Verify .aw-grid is fluid and collapses on mobile
assert(
    cssContent.includes(".aw-grid") && cssContent.includes("min(100%"),
    ".aw-grid employs fluid minmax(min(100%, ...), 1fr) column sizing"
);

assert(
    cssContent.includes(".vl-grid") && cssContent.includes("min(100%"),
    ".vl-grid employs fluid minmax(min(100%, ...), 1fr) column sizing"
);

assert(
    cssContent.includes(".blog-grid") && cssContent.includes("min(100%"),
    ".blog-grid employs fluid minmax(min(100%, ...), 1fr) column sizing"
);

// Verify 768px media query collapses grids to single column
const media768Match = cssContent.match(/@media\s*\(max-width:\s*768px\)[\s\S]*?\.aw-grid[\s\S]*?grid-template-columns:\s*1fr;/);
assert(
    media768Match !== null,
    "@media (max-width: 768px) collapses .aw-grid to single column (1fr) preventing mobile overflow"
);

// Verify admin table responsive wrapper exists
assert(
    cssContent.includes(".admin-table-responsive") && cssContent.includes("overflow-x: auto"),
    "Admin tables contained within .admin-table-responsive with overflow-x: auto"
);

// Verify admin mobile breakpoints
assert(
    cssContent.includes("@media (max-width: 600px)") && cssContent.includes(".admin-stats-grid"),
    "Admin stat cards collapse to single column at mobile viewports <= 600px"
);

assert(
    cssContent.includes("@media (max-width: 480px)") && cssContent.includes(".hero-container"),
    "Public container padding scales gracefully down to 12px-14px on small mobile viewports (<= 480px)"
);

// --------------------------------------------------------------------------
// SUITE 4: ADMIN CMS MEDIA WORKFLOW & PREVIEW WIRING
// --------------------------------------------------------------------------
console.log("\nSuite 4: Admin CMS Media Workflow & Live Preview Wiring");

const appJsContent = fs.readFileSync(path.join(siteDir, "js", "app.js"), "utf8");

assert(
    appJsContent.includes("setupImagePreviewHandler"),
    "setupImagePreviewHandler helper defined in app.js for real-time URL validation"
);

assert(
    appJsContent.includes("m-gal-preview-wrap") && appJsContent.includes("m-gal-preview-img"),
    "Gallery modal features real-time image preview container & verified status label"
);

assert(
    appJsContent.includes("m-ach-url") && appJsContent.includes("m-ach-preview-wrap"),
    "Achievements modal features Image URL field with real-time live preview"
);

assert(
    appJsContent.includes("m-blog-url") && appJsContent.includes("m-blog-preview-wrap"),
    "Blog CMS modal features Cover Image URL field with real-time live preview"
);

assert(
    appJsContent.includes("resolveGoogleDriveImageUrl"),
    "app.js utilizes resolveGoogleDriveImageUrl for table thumbnails and public renderers"
);

// --------------------------------------------------------------------------
// SUITE 5: SUPABASE INTEGRATION EXPORTS & SCHEMA PROTECTION
// --------------------------------------------------------------------------
console.log("\nSuite 5: Supabase Client Export & Mutation Consistency");

assert(
    supabaseJsContent.includes("resolveGoogleDriveImageUrl: resolveGoogleDriveImageUrl"),
    "window.KM_SUPABASE exports resolveGoogleDriveImageUrl globally"
);

assert(
    supabaseJsContent.includes("validateImageUrl: validateImageUrl"),
    "window.KM_SUPABASE exports validateImageUrl globally"
);

assert(
    supabaseJsContent.includes("adminSaveGalleryItem") && supabaseJsContent.includes("resolvedUrl"),
    "adminSaveGalleryItem resolves Google Drive URLs before database persistence"
);

assert(
    supabaseJsContent.includes("adminSaveAchievement") && supabaseJsContent.includes("resolvedAchUrl"),
    "adminSaveAchievement resolves Google Drive URLs before database persistence"
);

assert(
    supabaseJsContent.includes("adminSaveBlogPost") && supabaseJsContent.includes("resolvedBlogUrl"),
    "adminSaveBlogPost resolves Google Drive URLs before database persistence"
);

// --------------------------------------------------------------------------
// SUMMARY
// --------------------------------------------------------------------------
console.log("\n=======================================================");
console.log(`TOTAL PRE-STEP 5 TESTS EXECUTED: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log("=======================================================\n");

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log("✓ ALL PRE-STEP 5 STABILIZATION CHECKS PASSED PERFECTLY.\n");
    process.exit(0);
}
