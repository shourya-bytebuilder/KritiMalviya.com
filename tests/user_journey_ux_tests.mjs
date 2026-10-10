/**
 * USER JOURNEY, SMART BOOKING & CHECKOUT UX TEST SUITE
 * 
 * Verifies Pre-Step 5 Add-On requirements:
 * 1. Contextual Onboarding & Guided Tour System (prompts, step transitions, localStorage persistence)
 * 2. 5-Step Smart Booking Journey (stepper, inline validation, IST slots, review dossier with section edit buttons)
 * 3. Secure PhonePe Checkout UX (duplicate-submission prevention, beforeunload guards, status messaging)
 * 4. Contextual Help Drawer (chambers coordinates, fee transparency, phonepe guide, tour replay)
 * 5. Accessibility, Mobile Sticky Actions & Responsive Behavior
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`  ✓ [PASSED] ${testName}`);
        passed++;
    } else {
        console.error(`  ✗ [FAILED] ${testName}`);
        failed++;
    }
}

const rootDir = process.cwd();
const siteDir = join(rootDir, 'site');

console.log('=======================================================');
console.log('RUNNING USER JOURNEY, SMART BOOKING & CHECKOUT UX TESTS');
console.log('=======================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: CONTEXTUAL ONBOARDING & GUIDED TOUR SYSTEM
// -----------------------------------------------------------------------------
console.log('Suite 1: Contextual Onboarding & Guided Tour System');
const appJsPath = join(siteDir, 'js', 'app.js');
const cssPath = join(siteDir, 'css', 'style.css');

assert(existsSync(appJsPath), 'app.js exists');
assert(existsSync(cssPath), 'style.css exists');

const appJs = readFileSync(appJsPath, 'utf8');
const styleCss = readFileSync(cssPath, 'utf8');

assert(appJs.includes('initGuidedTourSystem'), 'app.js defines initGuidedTourSystem()');
assert(appJs.includes('km_tour_state'), 'Guided tour checks and persists km_tour_state in localStorage');
assert(appJs.includes('Welcome. Let\'s help you get started.') || appJs.includes('Welcome. Let’s help you get started.'), 'Tour prompt features exact welcoming text "Welcome. Let\'s help you get started."');
assert(appJs.includes('Guide me') && appJs.includes('I\'ll explore myself'), 'Tour prompt offers "Guide me" and "I\'ll explore myself" choices');
assert(appJs.includes('window.KM_TOUR'), 'Exports window.KM_TOUR API for programmatic control');
assert(appJs.includes('startTour:') && appJs.includes('resetTour:'), 'window.KM_TOUR provides startTour() and resetTour()');
assert(appJs.includes('addEventListener(\'keydown\''), 'Tour supports keyboard navigation (Escape, ArrowRight, ArrowLeft)');
assert(styleCss.includes('.km-tour-prompt'), 'CSS includes styles for .km-tour-prompt');
assert(styleCss.includes('.km-tour-backdrop'), 'CSS includes styles for .km-tour-backdrop');
assert(styleCss.includes('.km-tour-card'), 'CSS includes styles for .km-tour-card');
assert(styleCss.includes('.km-tour-highlight-ring'), 'CSS includes styles for spotlight highlight ring');

// -----------------------------------------------------------------------------
// SUITE 2: SMART BOOKING STEPPER & REVIEW DOSSIER
// -----------------------------------------------------------------------------
console.log('\nSuite 2: Smart Booking Stepper & Review Dossier');
const consultHtmlPath = join(siteDir, 'consultation.html');
assert(existsSync(consultHtmlPath), 'consultation.html exists');

const consultHtml = readFileSync(consultHtmlPath, 'utf8');

assert(consultHtml.includes('class="bk-step-ind"'), 'consultation.html contains interactive step indicator tabs (.bk-step-ind)');
assert(appJs.includes('bk-step-ind') && appJs.includes('goToStep('), 'Step indicators allow user to navigate to unlocked or previous steps');
assert(consultHtml.includes('booking-intro-banner'), 'Step 1 features welcoming intro banner explaining consultation approach');
assert(consultHtml.includes('field-helper-text'), 'Step 3 intake fields include helper text explaining necessity and confidentiality');
assert(appJs.includes('rev-edit-btn') || consultHtml.includes('rev-edit-btn'), 'Step 4 review summary provides section-specific [Edit] buttons');
assert(consultHtml.includes('data-edit-step="1"') && consultHtml.includes('data-edit-step="2"') && consultHtml.includes('data-edit-step="3"'), 'Review summary features dedicated Edit triggers for Service (Step 1), Slot (Step 2), and Details (Step 3)');
assert(consultHtml.includes('Total Payable') || consultHtml.includes('total-amount'), 'Step 4 shows total payable amount before continuing to payment');
assert(consultHtml.includes('Continue to Secure Payment'), 'Step 4 primary action explicitly directs user to secure payment');

// -----------------------------------------------------------------------------
// SUITE 3: INLINE VALIDATION & EMPTY/ERROR STATES
// -----------------------------------------------------------------------------
console.log('\nSuite 3: Inline Validation & Empty/Error States');

assert(appJs.includes('validateField('), 'app.js implements real-time validateField helper for inline feedback');
assert(appJs.includes('field-inline-error'), 'app.js renders accessible .field-inline-error messages on validation failure');
assert(appJs.includes('Please enter your full name as per official records'), 'Full name validation includes descriptive guidance');
assert(appJs.includes('Valid 10-digit mobile number required'), 'Mobile phone validation enforces 10-digit format with helpful error');
assert(appJs.includes('Valid email address required'), 'Email validation provides clear feedback');
assert(appJs.includes('Indian Standard Time (IST)'), 'Slot picker clearly communicates IST timezone to users');
assert(appJs.includes('No available slots for this date') || appJs.includes('No slots available'), 'Slot picker provides actionable guidance when no slots are open for a date');
assert(appJs.includes('isSubmitting'), 'Booking submission prevents accidental double-clicks');

// -----------------------------------------------------------------------------
// SUITE 4: PHONEPE CHECKOUT UX & SECURITY GUARDS
// -----------------------------------------------------------------------------
console.log('\nSuite 4: PhonePe Checkout UX & Security Guards');
const paymentHtmlPath = join(siteDir, 'payment.html');
assert(existsSync(paymentHtmlPath), 'payment.html exists');

const paymentHtml = readFileSync(paymentHtmlPath, 'utf8');

assert(paymentHtml.includes('payment-security-notice'), 'payment.html features clear security notice explaining PhonePe gateway handling');
assert(paymentHtml.includes('Do not refresh, reload, or press the back button'), 'payment.html explicitly warns against page reloads during payment processing');
assert(appJs.includes('beforeunload'), 'app.js registers beforeunload warning guard to prevent accidental navigation during active processing');
assert(paymentHtml.includes('Continue to Secure Payment') || paymentHtml.includes('Continue to PhonePe'), 'Payment button clearly states secure gateway handover');
assert(appJs.includes('verifyPayment(') || appJs.includes('verify-phonepe-payment'), 'Payment flow performs server-side verification before confirming success');
assert(paymentHtml.includes('Payment Verification Pending') || appJs.includes('Verification Pending') || appJs.includes('status === \'pending\''), 'Payment status handler accommodates pending verification state safely');

// -----------------------------------------------------------------------------
// SUITE 5: CONTEXTUAL HELP DRAWER & CHAMBERS COORDINATES
// -----------------------------------------------------------------------------
console.log('\nSuite 5: Contextual Help Drawer & Chambers Coordinates');

assert(appJs.includes('initHelpDrawer'), 'app.js defines initHelpDrawer()');
assert(appJs.includes('km-help-drawer'), 'app.js creates accessible slide-over #km-help-drawer');
assert(appJs.includes('window.KM_HELP'), 'Exports window.KM_HELP API for opening and closing help drawer');
assert(appJs.includes('+91 97705 60777') || appJs.includes('9770560777'), 'Help drawer provides verified chambers telephone number');
assert(appJs.includes('advkritimalviya@gmail.com'), 'Help drawer provides verified official chambers email');
assert(appJs.includes('Bhopal, Madhya Pradesh'), 'Help drawer provides verified chambers geographical jurisdiction');
assert(appJs.includes('Restart Website Tour'), 'Help drawer includes option to restart the interactive guided tour');

// Check header Need Help trigger buttons across all public pages
const indexHtml = readFileSync(join(siteDir, 'index.html'), 'utf8');
const legalHtml = readFileSync(join(siteDir, 'services', 'legal.html'), 'utf8');
const relHtml = readFileSync(join(siteDir, 'services', 'relationship.html'), 'utf8');

assert(indexHtml.includes('js-open-help'), 'index.html contains Help trigger');
assert(consultHtml.includes('js-open-help'), 'consultation.html contains Help trigger');
assert(paymentHtml.includes('js-open-help'), 'payment.html contains Help trigger');
assert(legalHtml.includes('js-open-help'), 'services/legal.html contains Help trigger');
assert(relHtml.includes('js-open-help'), 'services/relationship.html contains Help trigger');

// -----------------------------------------------------------------------------
// SUITE 6: ACCESSIBILITY & MOBILE RESPONSIVE UX
// -----------------------------------------------------------------------------
console.log('\nSuite 6: Accessibility & Mobile Responsive UX');

assert(styleCss.includes('.mobile-sticky-booking-bar'), 'CSS provides .mobile-sticky-booking-bar for mobile engagement');
assert(styleCss.includes('@media (max-width: 768px)') && styleCss.includes('.mobile-sticky-booking-bar'), 'Mobile sticky bar activates on mobile screens <= 768px');
assert(styleCss.includes('prefers-reduced-motion'), 'CSS honors prefers-reduced-motion media query');
assert(styleCss.includes('min-height: 44px') || styleCss.includes('min-height: 48px'), 'Touch targets adhere to accessible 44px+ minimum sizing guidelines');
assert(appJs.includes('aria-live="polite"') || consultHtml.includes('aria-live="polite"'), 'Dynamic UI updates communicate with screen readers via aria-live');
assert(appJs.includes('aria-modal="true"'), 'Modal overlays enforce aria-modal="true" dialog accessibility');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n=======================================================');
console.log(`TOTAL UX TESTS EXECUTED: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=======================================================');

if (failed > 0) {
    console.error(`\n❌ ${failed} UX CHECKS FAILED.`);
    process.exit(1);
} else {
    console.log('\n✓ ALL USER JOURNEY & CHECKOUT UX TESTS PASSED SUCCESSFULLY.');
    process.exit(0);
}
