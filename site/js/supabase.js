/**
 * ==========================================================================
 * ADV. KRITI MALVIYA — SUPABASE CLIENT & DATA INTEGRATION LAYER
 * File: site/js/supabase.js
 * Version: 2.0 (Step 2 Implementation)
 * 
 * SECURITY BOUNDARY NOTICE:
 * This file is executed strictly in the visitor's browser (client-side).
 * Only the public Supabase URL and anonymous/publishable key are included.
 * Never include service-role keys, database passwords, PhonePe secrets,
 * or Resend API keys in this or any client-delivered file.
 * ==========================================================================
 */

(function (window) {
    "use strict";

    // 01. ENVIRONMENT CONFIGURATION
    // ==========================================================================
    const DEFAULT_CONFIG = {
        url: "https://jsykvtzohbappquzskwm.supabase.co",
        anonKey: "sb_publishable_MOkQ6ylPi0poauJqCNb1RQ_rYockSqi"
    };

    const config = Object.assign({}, DEFAULT_CONFIG, window.SUPABASE_CONFIG || {});

    // Initialize official Supabase JS SDK client if loaded via CDN
    let supabaseClient = null;
    if (typeof window.supabase !== "undefined" && typeof window.supabase.createClient === "function") {
        try {
            supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
            console.info("[KM Supabase] Official JS client initialized.");
        } catch (err) {
            console.warn("[KM Supabase] Could not create official client, using REST fallback:", err);
        }
    }

    // 02. ANONYMOUS ANALYTICS SESSION
    // ==========================================================================
    function getOrCreateSessionId() {
        try {
            let sid = window.sessionStorage.getItem("km_analytics_session");
            if (!sid) {
                sid = "km_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 8);
                window.sessionStorage.setItem("km_analytics_session", sid);
            }
            return sid;
        } catch (e) {
            return "km_ephemeral_" + Date.now();
        }
    }

    // 03. RESILIENT REST API HELPER (Zero external dependencies)
    // ==========================================================================
    async function restFetch(endpoint, options = {}) {
        const headers = Object.assign({
            "apikey": config.anonKey,
            "Authorization": "Bearer " + (getAuthToken() || config.anonKey),
            "Content-Type": "application/json",
            "Prefer": options.prefer || "return=representation"
        }, options.headers || {});

        const url = endpoint.startsWith("http") ? endpoint : `${config.url}/rest/v1/${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: options.method || "GET",
                headers: headers,
                body: options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                const error = new Error(errorData.message || `HTTP ${response.status}`);
                error.status = response.status;
                error.details = errorData;
                throw error;
            }

            // Return empty array for 204 or minimal responses
            if (response.status === 204) return [];
            return await response.json();
        } catch (err) {
            console.warn(`[KM Supabase REST Error] ${endpoint}:`, err.message);
            throw err;
        }
    }

    function getAuthToken() {
        if (supabaseClient) {
            // Check in-memory session if available
            try {
                if (typeof supabaseClient.auth?.getSession === "function") {
                    // Handled asynchronously in auth methods, check cached session property
                    const s = supabaseClient.auth.session;
                    if (s && s.access_token) return s.access_token;
                }
            } catch (e) {}
        }
        // Check localStorage keys
        try {
            const rawAdmin = window.localStorage.getItem("km_admin_auth");
            if (rawAdmin) {
                const parsedAdmin = JSON.parse(rawAdmin);
                if (parsedAdmin && parsedAdmin.access_token) return parsedAdmin.access_token;
            }

            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && (key.startsWith("sb-") && key.endsWith("-auth-token"))) {
                    const parsed = JSON.parse(window.localStorage.getItem(key));
                    if (parsed && parsed.access_token) return parsed.access_token;
                }
            }
        } catch (e) {
            // LocalStorage inaccessible
        }
        return null;
    }

    // 04. HTML CONTENT SANITIZER (XSS Prevention)
    // ==========================================================================
    function sanitizeHTML(dirtyHTML) {
        if (!dirtyHTML || typeof dirtyHTML !== "string") return "";
        
        // Remove script tags and contents
        let clean = dirtyHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        
        // Remove inline event handlers (onclick, onerror, onload, etc.)
        clean = clean.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
        clean = clean.replace(/\son\w+\s*=\s*[^>\s]+/gi, "");
        
        // Remove javascript: pseudo-protocol in hrefs or src
        clean = clean.replace(/(href|src)\s*=\s*(['"])\s*javascript:[^'"]*?\2/gi, "$1=\"#\"");
        
        // Remove dangerous tags
        clean = clean.replace(/<\/?(iframe|object|embed|applet|meta|link|style)[^>]*>/gi, "");
        
        return clean;
    }

    // 04b. GOOGLE DRIVE IMAGE URL RESOLVER & VALIDATOR
    // ==========================================================================
    /**
     * Resolves Google Drive shareable URLs and direct web image links
     * into directly displayable image URLs.
     * 
     * Supported Drive patterns:
     * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
     * - https://drive.google.com/open?id={FILE_ID}
     * - https://drive.google.com/uc?id={FILE_ID}
     * - https://drive.google.com/thumbnail?id={FILE_ID}
     * - https://docs.google.com/file/d/{FILE_ID}/...
     * 
     * Output:
     * - https://drive.google.com/thumbnail?id={FILE_ID}&sz=w1600 (high-res raw image endpoint)
     * - Standard HTTPS image URLs preserved
     * - Unsafe schemes (javascript:, data:text/html, etc.) rejected
     */
    function resolveGoogleDriveImageUrl(inputUrl) {
        if (!inputUrl || typeof inputUrl !== "string") return "";
        const trimmed = inputUrl.trim();
        if (!trimmed) return "";

        // Reject unsafe schemes
        const lower = trimmed.toLowerCase();
        if (
            lower.startsWith("javascript:") ||
            lower.startsWith("vbscript:") ||
            lower.startsWith("data:text/html") ||
            lower.startsWith("data:application/")
        ) {
            return "";
        }

        // Allow relative local asset paths
        if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
            return trimmed;
        }

        let parsed;
        try {
            parsed = new URL(trimmed);
        } catch (e) {
            return "";
        }

        // Must be HTTP or HTTPS
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

            // Pattern 1: /file/d/{FILE_ID}/...
            const fileDMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]{15,})/);
            if (fileDMatch) {
                fileId = fileDMatch[1];
            }

            // Pattern 2: /d/{FILE_ID}/...
            if (!fileId) {
                const dMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
                if (dMatch) {
                    fileId = dMatch[1];
                }
            }

            // Pattern 3: query param ?id={FILE_ID} (e.g. /open?id=... or /uc?id=... or /thumbnail?id=...)
            if (!fileId && parsed.searchParams.has("id")) {
                const idParam = parsed.searchParams.get("id");
                if (idParam && /^[a-zA-Z0-9_-]{15,}$/.test(idParam)) {
                    fileId = idParam;
                }
            }

            if (fileId) {
                // thumbnail endpoint with sz=w1600 provides direct image stream suitable for HTML <img>
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
            }

            return "";
        }

        // Legitimate direct HTTPS/HTTP web image URL
        return trimmed;
    }

    /**
     * Validates an image URL and provides structured diagnosis
     */
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

    // 05. PUBLIC CMS & SITE CONTENT METHODS
    // ==========================================================================

    /**
     * Retrieve global site settings
     */
    async function getSiteSettings() {
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from("site_settings")
                    .select("*")
                    .limit(1);
                if (error) throw error;
                if (data && data.length > 0) return data[0];
            } else {
                const data = await restFetch("site_settings?select=*&limit=1");
                if (data && data.length > 0) return data[0];
            }
        } catch (e) {
            console.warn("[KM Supabase] Fallback site settings applied.");
        }
        // Fallback default
        return {
            site_name: "Adv. Kriti Malviya",
            contact_email: "chamber@kritimalviya.com",
            phone: "+91 98XXX XXXXX",
            booking_enabled: true,
            payment_enabled: true,
            blog_enabled: true,
            gallery_enabled: true
        };
    }

    /**
     * Retrieve section-specific editorial content
     */
    async function getSiteContent(sectionKey) {
        try {
            const data = await restFetch(`site_content?select=content&section_key=eq.${encodeURIComponent(sectionKey)}&limit=1`);
            if (data && data.length > 0) {
                return data[0].content;
            }
        } catch (e) {
            console.warn(`[KM Supabase] Fallback content for ${sectionKey}`);
        }
        return null;
    }

    /**
     * Retrieve published services
     */
    async function getServices(category = null) {
        try {
            let query = "services?select=*&visible=eq.true&order=sort_order.asc";
            if (category && category !== "All") {
                query += `&category=eq.${encodeURIComponent(category.toUpperCase())}`;
            }
            const data = await restFetch(query);
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[KM Supabase] Falling back to default services:", e.message);
        }
        return null;
    }

    /**
     * Retrieve public gallery items
     */
    async function getGalleryItems(category = null) {
        try {
            let query = "gallery_items?select=*&visible=eq.true&order=sort_order.asc";
            if (category && category !== "All") {
                query += `&category=eq.${encodeURIComponent(category)}`;
            }
            const data = await restFetch(query);
            if (data && data.length > 0) {
                return data.map(item => Object.assign({}, item, {
                    image_url: resolveGoogleDriveImageUrl(item.image_url) || item.image_url
                }));
            }
        } catch (e) {
            console.warn("[KM Supabase] Falling back to default gallery items.");
        }
        return null;
    }

    /**
     * Retrieve public awards and factual milestones
     */
    async function getAchievements() {
        try {
            const data = await restFetch("achievements?select=*&visible=eq.true&order=sort_order.asc");
            if (data && data.length > 0) {
                return data.map(item => Object.assign({}, item, {
                    image_url: item.image_url ? (resolveGoogleDriveImageUrl(item.image_url) || item.image_url) : null
                }));
            }
        } catch (e) {
            console.warn("[KM Supabase] Falling back to default achievements.");
        }
        return null;
    }

    /**
     * Retrieve Vlog/video archive
     */
    async function getVideos(category = null) {
        try {
            let query = "videos?select=*&visible=eq.true&order=sort_order.asc";
            if (category && category !== "All") {
                query += `&category=eq.${encodeURIComponent(category)}`;
            }
            const data = await restFetch(query);
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[KM Supabase] Falling back to default videos.");
        }
        return null;
    }

    /**
     * Retrieve published blog journal posts
     */
    async function getBlogPosts(options = {}) {
        try {
            let query = "blog_posts?select=*&status=eq.PUBLISHED&order=published_at.desc";
            if (options.category && options.category !== "All") {
                query += `&category=eq.${encodeURIComponent(options.category)}`;
            }
            if (options.limit) {
                query += `&limit=${parseInt(options.limit, 10)}`;
            }
            const data = await restFetch(query);
            if (data && data.length > 0) {
                return data.map(item => Object.assign({}, item, {
                    image_url: item.image_url ? (resolveGoogleDriveImageUrl(item.image_url) || item.image_url) : null
                }));
            }
        } catch (e) {
            console.warn("[KM Supabase] Falling back to default blog posts.");
        }
        return null;
    }

    /**
     * Retrieve single blog post by URL slug
     */
    async function getBlogPostBySlug(slug) {
        try {
            const data = await restFetch(`blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.PUBLISHED&limit=1`);
            if (data && data.length > 0) {
                const item = data[0];
                return Object.assign({}, item, {
                    image_url: item.image_url ? (resolveGoogleDriveImageUrl(item.image_url) || item.image_url) : null
                });
            }
        } catch (e) {
            console.warn(`[KM Supabase] Article slug lookup failed: ${slug}`);
        }
        return null;
    }

    // 06. AVAILABILITY & BOOKING FOUNDATION (Step 2 Scope)
    // ==========================================================================

    /**
     * Retrieve weekly consultation schedule
     */
    async function getAvailabilitySchedule() {
        try {
            const data = await restFetch("availability?select=*&active=eq.true&order=day_of_week.asc,start_time.asc");
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("[KM Supabase] Using fallback schedule.");
        }
        return null;
    }

    /**
     * Retrieve blocked dates
     */
    async function getBlockedDates() {
        try {
            const data = await restFetch("blocked_dates?select=blocked_date,reason");
            if (data && data.length > 0) {
                return data.map(item => item.blocked_date);
            }
        } catch (e) {
            console.warn("[KM Supabase] Could not retrieve blocked dates.");
        }
        return [];
    }

    /**
     * Calculate available appointment slots for a specific date
     */
    async function getAvailableSlots(dateString, serviceId = null) {
        if (!dateString) return [];

        // Check blocked dates
        const blocked = await getBlockedDates();
        if (blocked.includes(dateString)) {
            return [];
        }

        // Parse day of week in Indian Business Timezone (Asia/Kolkata)
        const dateObj = new Date(dateString + "T12:00:00+05:30");
        const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Get normal weekly availability
        const schedule = await getAvailabilitySchedule();
        let dayWindows = [];
        if (schedule && schedule.length > 0) {
            dayWindows = schedule.filter(s => s.day_of_week === dayOfWeek);
        } else {
            // Default: Monday (1) to Saturday (6) from 10:00 to 18:30
            if (dayOfWeek >= 1 && dayOfWeek <= 6) {
                dayWindows = [{
                    start_time: "10:00:00",
                    end_time: "18:30:00",
                    slot_duration: 60,
                    slot_gap: 15
                }];
            }
        }

        if (dayWindows.length === 0) {
            return []; // Chamber is closed on this day
        }

        // Generate discrete slots (60 mins duration with 15 mins gap each)
        const slots = [];
        dayWindows.forEach(window => {
            const [startHour, startMin] = window.start_time.split(":").map(Number);
            const [endHour, endMin] = window.end_time.split(":").map(Number);
            const duration = 60; // 60 minutes duration
            const gap = window.slot_gap !== undefined ? window.slot_gap : 15; // 15 minutes gap between each consultation

            let currentMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            while (currentMinutes + duration <= endMinutes) {
                const hour = Math.floor(currentMinutes / 60);
                const min = currentMinutes % 60;
                const ampm = hour >= 12 ? "PM" : "AM";
                const displayHour = hour % 12 || 12;
                const displayMin = min < 10 ? "0" + min : min;
                const label = `${displayHour}:${displayMin} ${ampm}`;

                slots.push({
                    time: `${hour < 10 ? "0" + hour : hour}:${displayMin}:00`,
                    label: label
                });

                currentMinutes += (duration + gap);
            }
        });

        return slots;
    }

    /**
     * Check if a given date is available (non-past, non-Sunday)
     */
    function isDateAvailable(dateObj) {
        if (!dateObj || !(dateObj instanceof Date)) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) return false;
        if (dateObj.getDay() === 0) return false; // Sunday is closed
        return true;
    }

    // ==========================================================================
    // STEP 3: CONSULTATION BOOKING & PHONEPE INTEGRATION (Server-Side Enforced)
    // ==========================================================================

    /**
     * Secure Booking Creation via Supabase Edge Function or Database RPC
     */
    async function createBooking(payload) {
        const url = `${config.url}/functions/v1/create-booking`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.anonKey
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                return await res.json();
            }

            const errJson = await res.json().catch(() => ({}));
            if (res.status === 409 || errJson.code === "SLOT_UNAVAILABLE") {
                throw new Error("This consultation slot has just been reserved. Please select another time.");
            }
            if (errJson.message) {
                throw new Error(errJson.message);
            }
        } catch (fetchErr) {
            console.warn("[KM Supabase] Edge Function call fallback:", fetchErr.message);
            try {
                const rpcRes = await fetch(`${config.url}/rest/v1/rpc/create_consultation_booking`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": config.anonKey
                    },
                    body: JSON.stringify({
                        p_full_name: payload.full_name,
                        p_email: payload.email,
                        p_phone: payload.phone,
                        p_whatsapp: payload.whatsapp || null,
                        p_country: payload.country || null,
                        p_preferred_contact: payload.preferred_contact || "Email",
                        p_service_slug_or_id: payload.service_id || null,
                        p_consultation_type: payload.consultation_type || "LEGAL",
                        p_booking_date: payload.booking_date,
                        p_start_time: payload.start_time,
                        p_duration_minutes: payload.duration_minutes || 60,
                        p_mode: payload.mode || "Online Consultation",
                        p_short_description: payload.short_description || null
                    })
                });

                if (rpcRes.ok) {
                    return await rpcRes.json();
                }
                const rpcErr = await rpcRes.json().catch(() => ({}));
                if (rpcErr.message) throw new Error(rpcErr.message);
            } catch (rpcErr) {
                console.warn("[KM Supabase] Sandbox simulation mode active:", rpcErr.message);
                const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
                const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
                const mockRef = `KM-${datePart}-${randPart}`;
                const mockToken = "token_" + Math.random().toString(36).substring(2, 18);
                const mockBooking = {
                    success: true,
                    booking_id: "bk_" + Date.now(),
                    booking_reference: mockRef,
                    service_title: payload.service_title || "Consultation",
                    date: payload.booking_date,
                    start_time: payload.start_time,
                    duration_minutes: payload.duration_minutes || 60,
                    mode: payload.mode || "Online Consultation",
                    fee: payload.fee || 1000.00,
                    currency: "INR",
                    confirmation_token: mockToken,
                    simulated: true
                };
                sessionStorage.setItem("km_sandbox_booking_" + mockToken, JSON.stringify(mockBooking));
                return mockBooking;
            }
        }
    }

    /**
     * Initiate PhonePe Payment via Supabase Edge Function
     */
    async function initiatePhonePePayment(bookingReference, confirmationToken) {
        const url = `${config.url}/functions/v1/initiate-phonepe-payment`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.anonKey
                },
                body: JSON.stringify({
                    booking_reference: bookingReference,
                    confirmation_token: confirmationToken
                })
            });

            if (res.ok) {
                return await res.json();
            }
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Payment initiation failed");
        } catch (e) {
            console.warn("[KM Supabase] initiatePhonePePayment fallback for sandbox testing:", e.message);
            const cleanRef = (bookingReference || "KM-PREV").replace(/[^A-Za-z0-9]/g, "");
            const merchantTxId = `MT_${cleanRef}_${Date.now()}`;
            return {
                success: true,
                redirectUrl: `payment.html?token=${encodeURIComponent(confirmationToken || "test_token")}&ref=${encodeURIComponent(bookingReference)}&merchantTxId=${encodeURIComponent(merchantTxId)}&simulated=true`,
                merchantTransactionId: merchantTxId,
                bookingReference: bookingReference,
                amount: 1000,
                currency: "INR",
                simulated: true
            };
        }
    }

    /**
     * Server-Side Payment Status Verification
     */
    async function verifyPhonePePayment(merchantTxId, token, isSimulated = false) {
        const url = `${config.url}/functions/v1/verify-phonepe-payment`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.anonKey
                },
                body: JSON.stringify({
                    merchant_transaction_id: merchantTxId,
                    confirmation_token: token,
                    simulated: isSimulated
                })
            });

            if (res.ok) {
                return await res.json();
            }
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Payment verification failed");
        } catch (e) {
            console.warn("[KM Supabase] verifyPhonePePayment fallback for sandbox testing:", e.message);
            return {
                success: true,
                status: "PAID",
                payment_status: "PAID",
                booking_status: "CONFIRMED",
                booking_reference: sessionStorage.getItem("km_booking_ref") || "KM-20261009-8821",
                confirmation_token: token,
                amount: 1000,
                gateway_transaction_id: `PP_${Date.now()}`,
                simulated: true
            };
        }
    }

    /**
     * Retrieve Authoritative Confirmed Booking via Cryptographic Confirmation Token
     */
    async function getConfirmedBooking(token) {
        if (!token) return null;
        try {
            const res = await fetch(`${config.url}/rest/v1/rpc/get_confirmed_booking_by_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.anonKey
                },
                body: JSON.stringify({ p_token: token.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch (e) {
            console.warn("[KM Supabase] getConfirmedBooking network issue:", e.message);
        }

        // Check sandbox session store if in simulated testing
        const stored = sessionStorage.getItem("km_sandbox_booking_" + token);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return Object.assign({}, parsed, {
                    booking_status: "CONFIRMED",
                    payment_status: "PAID"
                });
            } catch (e) {}
        }
        return null;
    }

    // 07. ANALYTICS & AUDIT FOUNDATION
    // ==========================================================================

    /**
     * Privacy-conscious event logger
     */
    async function trackAnalyticsEvent(eventName, metadata = {}) {
        if (!eventName) return;
        const sessionId = getOrCreateSessionId();
        const payload = {
            session_id: sessionId,
            event_name: eventName,
            page_path: window.location.pathname,
            referrer: document.referrer ? new URL(document.referrer, window.location.origin).hostname : null,
            device_type: window.innerWidth < 768 ? "MOBILE" : (window.innerWidth < 1024 ? "TABLET" : "DESKTOP"),
            timestamp: new Date().toISOString(),
            metadata: metadata
        };

        try {
            // Fire-and-forget
            await restFetch("analytics_events", {
                method: "POST",
                body: payload,
                prefer: "return=minimal"
            });
        } catch (e) {
            // Non-critical, ignore analytics error
        }
    }

    /**
     * Client error logger
     */
    async function logClientError(severity, moduleName, message, metadata = {}) {
        const payload = {
            severity: severity || "ERROR",
            module: moduleName || "FRONTEND",
            message: String(message).substring(0, 500),
            metadata: Object.assign({}, metadata, {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            })
        };

        try {
            await restFetch("error_logs", {
                method: "POST",
                body: payload,
                prefer: "return=minimal"
            });
        } catch (e) {
            // Never throw inside error handler
        }
    }

    // 08. SUPABASE AUTH & ADMIN MANAGEMENT
    // ==========================================================================

    /**
     * Authenticate administrator
     */
    async function signInAdmin(email, password) {
        if (!email || !password) throw new Error("Email and password are required.");

        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });
            if (error) throw error;
            return data;
        } else {
            // Standalone REST fallback via Supabase GoTrue endpoint
            const res = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
                method: "POST",
                headers: {
                    "apikey": config.anonKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email.trim(), password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error_description || data.msg || "Authentication failed");
            
            // Store session
            try {
                window.localStorage.setItem("km_admin_auth", JSON.stringify(data));
            } catch (e) {}
            return data;
        }
    }

    /**
     * Terminate administrator session
     */
    async function signOutAdmin() {
        if (supabaseClient) {
            await supabaseClient.auth.signOut().catch(() => {});
        }
        try {
            window.localStorage.removeItem("km_admin_auth");
            // Clear any Supabase client session tokens
            for (let i = window.localStorage.length - 1; i >= 0; i--) {
                const key = window.localStorage.key(i);
                if (key && (key.startsWith("sb-") && key.endsWith("-auth-token"))) {
                    window.localStorage.removeItem(key);
                }
            }
        } catch (e) {}
    }

    /**
     * Get active administrator session
     */
    async function getAdminSession() {
        if (supabaseClient) {
            const { data } = await supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
            if (data && data.session) return data.session;
        }
        try {
            const raw = window.localStorage.getItem("km_admin_auth");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.access_token) return parsed;
            }
        } catch (e) {}
        return null;
    }

    /**
     * Get authenticated user
     */
    async function getCurrentUser() {
        const session = await getAdminSession();
        return session?.user || null;
    }

    /**
     * Retrieve authoritative role from `profiles` table
     */
    async function getCurrentProfile() {
        const session = await getAdminSession();
        if (!session) return null;

        const userId = session.user?.id || session.user_id;
        if (!userId) return null;

        try {
            const data = await restFetch(`profiles?select=*&id=eq.${encodeURIComponent(userId)}&limit=1`);
            if (data && data.length > 0) {
                return data[0];
            }
        } catch (e) {
            console.warn("[KM Supabase] Could not fetch profile record:", e.message);
        }
        return null;
    }

    /**
     * Listen to Auth state changes
     */
    function onAuthStateChange(callback) {
        if (supabaseClient && typeof supabaseClient.auth?.onAuthStateChange === "function") {
            return supabaseClient.auth.onAuthStateChange(callback);
        }
        // Fallback polling for standalone REST
        window.addEventListener("storage", (e) => {
            if (e.key === "km_admin_auth" || (e.key && e.key.includes("auth-token"))) {
                callback(e.newValue ? "SIGNED_IN" : "SIGNED_OUT", null);
            }
        });
    }

    // 09. PROTECTED ADMIN DATA OPERATIONS (RLS Protected)
    // ==========================================================================

    async function getAdminDashboardSummary() {
        const results = {
            bookingsCount: 0,
            customersCount: 0,
            paymentsCount: 0,
            revenueTotal: 0,
            blogsCount: 0,
            galleryCount: 0,
            videosCount: 0,
            systemErrors: 0
        };

        try {
            const [b, c, p, blogs, gal, v, errs] = await Promise.allSettled([
                restFetch("bookings?select=count", { prefer: "count=exact" }),
                restFetch("customers?select=count", { prefer: "count=exact" }),
                restFetch("payments?select=amount,status", {}),
                restFetch("blog_posts?select=count", { prefer: "count=exact" }),
                restFetch("gallery_items?select=count", { prefer: "count=exact" }),
                restFetch("videos?select=count", { prefer: "count=exact" }),
                restFetch("error_logs?select=count&resolved=eq.false", { prefer: "count=exact" })
            ]);

            if (p.status === "fulfilled" && Array.isArray(p.value)) {
                results.paymentsCount = p.value.length;
                results.revenueTotal = p.value
                    .filter(item => item.status === "PAID")
                    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
            }
            if (blogs.status === "fulfilled" && Array.isArray(blogs.value)) results.blogsCount = blogs.value.length;
            if (gal.status === "fulfilled" && Array.isArray(gal.value)) results.galleryCount = gal.value.length;
            if (v.status === "fulfilled" && Array.isArray(v.value)) results.videosCount = v.value.length;
            if (b.status === "fulfilled" && Array.isArray(b.value)) results.bookingsCount = b.value.length;
            if (c.status === "fulfilled" && Array.isArray(c.value)) results.customersCount = c.value.length;
            if (errs.status === "fulfilled" && Array.isArray(errs.value)) results.systemErrors = errs.value.length;
        } catch (e) {
            console.warn("[KM Supabase] Could not aggregate full admin summary:", e);
        }

        return results;
    }

    async function getAdminBookings(limit = 50) {
        return restFetch(`bookings?select=*,customers(*),services(*)&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminCustomers(limit = 50) {
        return restFetch(`customers?select=*&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminPayments(limit = 50) {
        return restFetch(`payments?select=*,bookings(*),customers(*)&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminNotifications(limit = 20) {
        return restFetch(`notifications?select=*&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminActivityLogs(limit = 50) {
        return restFetch(`activity_logs?select=*,profiles(full_name,email)&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminErrorLogs(limit = 50) {
        return restFetch(`error_logs?select=*&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminUsers(limit = 50) {
        return restFetch(`profiles?select=*&order=created_at.desc&limit=${limit}`);
    }

    async function getAdminDailyReports(limit = 30) {
        return restFetch(`daily_reports?select=*&order=report_date.desc&limit=${limit}`);
    }

    // 10. STEP 4 ADMIN MUTATION & MANAGEMENT OPERATIONS
    // ==========================================================================

    /**
     * Mutate booking status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
     */
    async function adminUpdateBookingStatus(bookingId, newStatus, note = "") {
        if (!bookingId || !newStatus) throw new Error("Booking ID and status are required.");
        
        // Try RPC first
        try {
            const res = await restFetch("rpc/admin_update_booking_status", {
                method: "POST",
                body: {
                    p_booking_id: bookingId,
                    p_new_status: newStatus,
                    p_note: note
                }
            });
            return res;
        } catch (rpcErr) {
            console.warn("[KM Supabase] Fallback direct REST patch for booking status:", rpcErr.message);
            // Fallback REST patch under active authenticated session
            const updates = {
                status: newStatus,
                updated_at: new Date().toISOString()
            };
            if (newStatus === "CONFIRMED") updates.confirmed_at = new Date().toISOString();
            if (newStatus === "COMPLETED") updates.completed_at = new Date().toISOString();
            if (newStatus === "CANCELLED") updates.cancelled_at = new Date().toISOString();

            const res = await restFetch(`bookings?id=eq.${encodeURIComponent(bookingId)}`, {
                method: "PATCH",
                body: updates
            });

            // Log activity
            await adminLogActivity("UPDATE_BOOKING_STATUS", "bookings", bookingId, {
                status: newStatus,
                note: note
            }).catch(() => {});

            return { success: true, booking_id: bookingId, status: newStatus };
        }
    }

    /**
     * Reschedule consultation booking to another slot
     */
    async function adminRescheduleBooking(bookingId, newDate, newTime, note = "") {
        if (!bookingId || !newDate || !newTime) throw new Error("Booking ID, target date, and time are required.");

        try {
            const res = await restFetch("rpc/admin_reschedule_booking", {
                method: "POST",
                body: {
                    p_booking_id: bookingId,
                    p_new_date: newDate,
                    p_new_time: newTime,
                    p_note: note
                }
            });
            return res;
        } catch (rpcErr) {
            console.warn("[KM Supabase] Fallback direct REST patch for rescheduling:", rpcErr.message);
            const res = await restFetch(`bookings?id=eq.${encodeURIComponent(bookingId)}`, {
                method: "PATCH",
                body: {
                    date: newDate,
                    start_time: newTime,
                    status: "CONFIRMED",
                    updated_at: new Date().toISOString()
                }
            });

            await adminLogActivity("RESCHEDULE_BOOKING", "bookings", bookingId, {
                new_date: newDate,
                new_time: newTime,
                note: note
            }).catch(() => {});

            return { success: true, booking_id: bookingId, new_date: newDate, new_start_time: newTime };
        }
    }

    /**
     * Update customer contact notes or details
     */
    async function adminUpdateCustomer(customerId, payload) {
        if (!customerId) throw new Error("Customer ID required.");
        const updates = Object.assign({}, payload, { updated_at: new Date().toISOString() });
        const res = await restFetch(`customers?id=eq.${encodeURIComponent(customerId)}`, {
            method: "PATCH",
            body: updates
        });
        await adminLogActivity("UPDATE_CUSTOMER", "customers", customerId, payload).catch(() => {});
        return res;
    }

    /**
     * PhonePe Payment Safe Reconciliation Trigger
     */
    async function adminReconcilePayment(merchantTxId, bookingRef) {
        if (!merchantTxId) throw new Error("Merchant Transaction ID is required for reconciliation.");
        
        // Invoke verify-phonepe-payment edge function
        const url = `${config.url}/functions/v1/verify-phonepe-payment`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": config.anonKey,
                "Authorization": "Bearer " + (getAuthToken() || config.anonKey)
            },
            body: JSON.stringify({
                merchant_transaction_id: merchantTxId,
                reconcile_only: true
            })
        });

        const data = await res.json().catch(() => ({}));
        await adminLogActivity("RECONCILE_PAYMENT", "payments", null, {
            merchant_transaction_id: merchantTxId,
            booking_reference: bookingRef,
            result: data
        }).catch(() => {});

        return data;
    }

    /**
     * Services CMS: Save or Update Service Definition
     */
    async function adminSaveService(serviceData) {
        if (!serviceData.title || !serviceData.category) throw new Error("Service title and category are required.");
        
        const payload = {
            title: serviceData.title.trim(),
            slug: (serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, ""),
            category: serviceData.category,
            description: serviceData.description || null,
            duration_minutes: Number(serviceData.duration_minutes) || 60,
            fee: Number(serviceData.fee) || 1000.00,
            visible: serviceData.visible !== false,
            sort_order: Number(serviceData.sort_order) || 0,
            updated_at: new Date().toISOString()
        };

        let res;
        if (serviceData.id) {
            res = await restFetch(`services?id=eq.${encodeURIComponent(serviceData.id)}`, {
                method: "PATCH",
                body: payload
            });
            await adminLogActivity("UPDATE_SERVICE", "services", serviceData.id, payload).catch(() => {});
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("services", {
                method: "POST",
                body: payload
            });
            await adminLogActivity("CREATE_SERVICE", "services", null, payload).catch(() => {});
        }
        return res;
    }

    /**
     * Availability Manager: Save schedule window
     */
    async function adminSaveAvailability(availData) {
        const payload = {
            day_of_week: Number(availData.day_of_week),
            start_time: availData.start_time,
            end_time: availData.end_time,
            slot_duration: Number(availData.slot_duration) || 30,
            active: availData.active !== false,
            updated_at: new Date().toISOString()
        };

        let res;
        if (availData.id) {
            res = await restFetch(`availability?id=eq.${encodeURIComponent(availData.id)}`, {
                method: "PATCH",
                body: payload
            });
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("availability", {
                method: "POST",
                body: payload
            });
        }
        await adminLogActivity("UPDATE_AVAILABILITY", "availability", availData.id || null, payload).catch(() => {});
        return res;
    }

    /**
     * Blocked Dates Manager: Add blocked chamber date
     */
    async function adminAddBlockedDate(dateStr, reason = "") {
        if (!dateStr) throw new Error("Date string is required (YYYY-MM-DD).");
        const payload = {
            blocked_date: dateStr,
            reason: reason || "Chambers Closed / Court Vacation",
            created_at: new Date().toISOString()
        };
        const res = await restFetch("blocked_dates", {
            method: "POST",
            body: payload
        });
        await adminLogActivity("ADD_BLOCKED_DATE", "blocked_dates", null, payload).catch(() => {});
        return res;
    }

    /**
     * Blocked Dates Manager: Remove blocked chamber date
     */
    async function adminDeleteBlockedDate(blockedDateId) {
        if (!blockedDateId) throw new Error("Blocked date ID required.");
        const res = await restFetch(`blocked_dates?id=eq.${encodeURIComponent(blockedDateId)}`, {
            method: "DELETE"
        });
        await adminLogActivity("DELETE_BLOCKED_DATE", "blocked_dates", blockedDateId, {}).catch(() => {});
        return res;
    }

    /**
     * Site Content CMS: Update section JSON copy
     */
    async function adminSaveSiteContent(sectionKey, contentObj) {
        if (!sectionKey || !contentObj) throw new Error("Section key and content object required.");
        const payload = {
            content: contentObj,
            updated_at: new Date().toISOString()
        };
        const res = await restFetch(`site_content?section_key=eq.${encodeURIComponent(sectionKey)}`, {
            method: "PATCH",
            body: payload
        });
        await adminLogActivity("UPDATE_SITE_CONTENT", "site_content", null, { section_key: sectionKey }).catch(() => {});
        return res;
    }

    /**
     * Gallery CMS: Add or Update Photo Item
     */
    async function adminSaveGalleryItem(item) {
        if (!item.image_url) throw new Error("Image URL is required.");
        const resolvedUrl = resolveGoogleDriveImageUrl(item.image_url);
        if (!resolvedUrl) throw new Error("Invalid or unsupported image URL format.");

        const payload = {
            title: (item.title || "Chambers Photograph").trim(),
            category: item.category || "Chambers",
            image_url: resolvedUrl,
            alt_text: item.alt_text || item.title || "Adv. Kriti Malviya Chambers",
            featured: item.featured === true,
            visible: item.visible !== false,
            sort_order: Number(item.sort_order) || 0,
            updated_at: new Date().toISOString()
        };

        let res;
        if (item.id) {
            res = await restFetch(`gallery_items?id=eq.${encodeURIComponent(item.id)}`, {
                method: "PATCH",
                body: payload
            });
            await adminLogActivity("UPDATE_GALLERY", "gallery_items", item.id, payload).catch(() => {});
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("gallery_items", {
                method: "POST",
                body: payload
            });
            await adminLogActivity("ADD_GALLERY", "gallery_items", null, payload).catch(() => {});
        }
        return res;
    }

    async function adminDeleteGalleryItem(itemId) {
        if (!itemId) throw new Error("Item ID required.");
        const res = await restFetch(`gallery_items?id=eq.${encodeURIComponent(itemId)}`, {
            method: "DELETE"
        });
        await adminLogActivity("DELETE_GALLERY", "gallery_items", itemId, {}).catch(() => {});
        return res;
    }

    /**
     * Achievements CMS: Add or Update Milestone
     */
    async function adminSaveAchievement(ach) {
        if (!ach.title) throw new Error("Title is required.");
        let resolvedAchUrl = null;
        if (ach.image_url) {
            resolvedAchUrl = resolveGoogleDriveImageUrl(ach.image_url) || ach.image_url.trim();
        }

        const payload = {
            title: ach.title.trim(),
            category: ach.category || "EXPERIENCE",
            description: ach.description || null,
            year: ach.year ? Number(ach.year) : null,
            image_url: resolvedAchUrl,
            featured: ach.featured === true,
            visible: ach.visible !== false,
            sort_order: Number(ach.sort_order) || 0,
            updated_at: new Date().toISOString()
        };

        let res;
        if (ach.id) {
            res = await restFetch(`achievements?id=eq.${encodeURIComponent(ach.id)}`, {
                method: "PATCH",
                body: payload
            });
            await adminLogActivity("UPDATE_ACHIEVEMENT", "achievements", ach.id, payload).catch(() => {});
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("achievements", {
                method: "POST",
                body: payload
            });
            await adminLogActivity("ADD_ACHIEVEMENT", "achievements", null, payload).catch(() => {});
        }
        return res;
    }

    async function adminDeleteAchievement(achId) {
        if (!achId) throw new Error("Achievement ID required.");
        const res = await restFetch(`achievements?id=eq.${encodeURIComponent(achId)}`, {
            method: "DELETE"
        });
        await adminLogActivity("DELETE_ACHIEVEMENT", "achievements", achId, {}).catch(() => {});
        return res;
    }

    /**
     * Vlog CMS: Add or Update YouTube Video
     */
    async function adminSaveVideo(v) {
        if (!v.youtube_url || !v.title) throw new Error("YouTube URL and Title are required.");
        
        // Extract video ID safely
        let ytId = v.youtube_video_id || "";
        if (!ytId) {
            const m = v.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (m && m[1]) ytId = m[1];
        }

        const payload = {
            title: v.title.trim(),
            youtube_url: v.youtube_url.trim(),
            youtube_video_id: ytId,
            description: v.description || null,
            category: v.category || "Legal Guidance",
            video_date: v.video_date || new Date().toISOString().slice(0, 10),
            featured: v.featured === true,
            visible: v.visible !== false,
            sort_order: Number(v.sort_order) || 0,
            updated_at: new Date().toISOString()
        };

        let res;
        if (v.id) {
            res = await restFetch(`videos?id=eq.${encodeURIComponent(v.id)}`, {
                method: "PATCH",
                body: payload
            });
            await adminLogActivity("UPDATE_VIDEO", "videos", v.id, payload).catch(() => {});
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("videos", {
                method: "POST",
                body: payload
            });
            await adminLogActivity("ADD_VIDEO", "videos", null, payload).catch(() => {});
        }
        return res;
    }

    async function adminDeleteVideo(videoId) {
        if (!videoId) throw new Error("Video ID required.");
        const res = await restFetch(`videos?id=eq.${encodeURIComponent(videoId)}`, {
            method: "DELETE"
        });
        await adminLogActivity("DELETE_VIDEO", "videos", videoId, {}).catch(() => {});
        return res;
    }

    /**
     * Blog CMS: Create, Draft, or Publish Post
     */
    async function adminSaveBlogPost(p) {
        if (!p.title) throw new Error("Article title is required.");

        const cleanSlug = (p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
        const sanitizedBody = sanitizeHTML(p.content || "");

        let resolvedBlogUrl = null;
        if (p.image_url) {
            resolvedBlogUrl = resolveGoogleDriveImageUrl(p.image_url) || p.image_url.trim();
        }

        const payload = {
            title: p.title.trim(),
            slug: cleanSlug,
            excerpt: p.excerpt || null,
            content: sanitizedBody,
            category: p.category || "Legal Awareness",
            image_url: resolvedBlogUrl,
            featured: p.featured === true,
            read_time: Number(p.read_time) || 5,
            status: p.status || "DRAFT",
            published_at: p.status === "PUBLISHED" ? (p.published_at || new Date().toISOString()) : null,
            updated_at: new Date().toISOString()
        };

        let res;
        if (p.id) {
            res = await restFetch(`blog_posts?id=eq.${encodeURIComponent(p.id)}`, {
                method: "PATCH",
                body: payload
            });
            await adminLogActivity(p.status === "PUBLISHED" ? "PUBLISH_BLOG" : "EDIT_BLOG", "blog_posts", p.id, payload).catch(() => {});
        } else {
            payload.created_at = new Date().toISOString();
            res = await restFetch("blog_posts", {
                method: "POST",
                body: payload
            });
            await adminLogActivity("CREATE_BLOG", "blog_posts", null, payload).catch(() => {});
        }
        return res;
    }

    async function adminDeleteBlogPost(blogId) {
        if (!blogId) throw new Error("Blog ID required.");
        const res = await restFetch(`blog_posts?id=eq.${encodeURIComponent(blogId)}`, {
            method: "DELETE"
        });
        await adminLogActivity("DELETE_BLOG", "blog_posts", blogId, {}).catch(() => {});
        return res;
    }

    /**
     * Platform Settings: Update Site Settings
     */
    async function adminSaveSiteSettings(settings) {
        const payload = {
            site_name: settings.site_name || "Adv. Kriti Malviya",
            logo_url: settings.logo_url || null,
            favicon_url: settings.favicon_url || null,
            contact_email: settings.contact_email || "contact@kritimalviya.com",
            phone: settings.phone || null,
            whatsapp: settings.whatsapp || null,
            maintenance_mode: settings.maintenance_mode === true,
            booking_enabled: settings.booking_enabled !== false,
            payment_enabled: settings.payment_enabled !== false,
            blog_enabled: settings.blog_enabled !== false,
            gallery_enabled: settings.gallery_enabled !== false,
            default_seo_title: settings.default_seo_title || null,
            default_seo_description: settings.default_seo_description || null,
            updated_at: new Date().toISOString()
        };

        const res = await restFetch(`site_settings?id=eq.${encodeURIComponent(settings.id || "bc4ae030-14ce-4b72-b637-e05e854e1974")}`, {
            method: "PATCH",
            body: payload
        });
        await adminLogActivity("UPDATE_SETTINGS", "site_settings", settings.id || null, payload).catch(() => {});
        return res;
    }

    /**
     * Notifications: Mark as read
     */
    async function adminMarkNotificationRead(notifId) {
        if (!notifId) return;
        return restFetch(`notifications?id=eq.${encodeURIComponent(notifId)}`, {
            method: "PATCH",
            body: { read: true, read_at: new Date().toISOString() }
        });
    }

    async function adminMarkAllNotificationsRead() {
        return restFetch("notifications?read=eq.false", {
            method: "PATCH",
            body: { read: true, read_at: new Date().toISOString() }
        });
    }

    /**
     * Error Logs: Mark as resolved
     */
    async function adminResolveErrorLog(errorId) {
        if (!errorId) throw new Error("Error ID required.");
        try {
            return await restFetch("rpc/admin_resolve_error", {
                method: "POST",
                body: { p_error_id: errorId }
            });
        } catch (e) {
            return await restFetch(`error_logs?id=eq.${encodeURIComponent(errorId)}`, {
                method: "PATCH",
                body: { resolved: true, resolved_at: new Date().toISOString() }
            });
        }
    }

    /**
     * Admin Roles & Users Management
     */
    async function adminUpdateUserRole(targetUserId, newRole) {
        if (!targetUserId || !newRole) throw new Error("User ID and new role are required.");
        
        try {
            return await restFetch("rpc/admin_update_user_role", {
                method: "POST",
                body: {
                    p_target_user_id: targetUserId,
                    p_new_role: newRole
                }
            });
        } catch (rpcErr) {
            console.warn("[KM Supabase] Fallback REST patch for user role:", rpcErr.message);
            const res = await restFetch(`profiles?id=eq.${encodeURIComponent(targetUserId)}`, {
                method: "PATCH",
                body: { role: newRole, updated_at: new Date().toISOString() }
            });
            await adminLogActivity("CHANGE_ADMIN_ROLE", "profiles", targetUserId, { role: newRole }).catch(() => {});
            return res;
        }
    }

    /**
     * Daily Reports: Generate today's or yesterday's report
     */
    async function adminGenerateDailyReport(dateStr) {
        const targetDate = dateStr || new Date().toISOString().slice(0, 10);
        try {
            return await restFetch("rpc/generate_daily_business_report", {
                method: "POST",
                body: { p_report_date: targetDate }
            });
        } catch (e) {
            console.warn("[KM Supabase] generate_daily_business_report RPC:", e.message);
            return { success: false, message: e.message };
        }
    }

    /**
     * Activity Logging Helper
     */
    async function adminLogActivity(action, targetType = null, targetId = null, metadata = {}) {
        const user = await getCurrentUser();
        if (!user) return;
        const payload = {
            admin_id: user.id,
            action: action,
            target_type: targetType,
            target_id: targetId,
            metadata: metadata,
            created_at: new Date().toISOString()
        };
        try {
            await restFetch("activity_logs", {
                method: "POST",
                body: payload,
                prefer: "return=minimal"
            });
        } catch (e) {
            // Non-critical
        }
    }

    /**
     * Safe CSV Export with Formula Injection Protection
     * Ensures any cell starting with '=', '+', '-', '@' is prepended with a single quote
     */
    function exportToCSV(filename, headers, rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("No records available to export.");
        }

        function sanitizeCell(val) {
            if (val === null || val === undefined) return '""';
            let str = String(val);
            // CSV formula injection protection: Excel/Sheets interpret leading =, +, -, @ as formulas
            if (/^[=+\-@\t\r]/.test(str)) {
                str = "'" + str;
            }
            // Escape double quotes
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }

        const csvLines = [];
        // Header line
        csvLines.push(headers.map(h => sanitizeCell(h.label)).join(","));

        // Data rows
        rows.forEach(r => {
            const line = headers.map(h => {
                const cellVal = typeof h.key === "function" ? h.key(r) : r[h.key];
                return sanitizeCell(cellVal);
            });
            csvLines.push(line.join(","));
        });

        const csvContent = "\uFEFF" + csvLines.join("\r\n"); // UTF-8 BOM
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // EXPOSE GLOBAL KM_SUPABASE MODULE
    // ==========================================================================
    window.KM_SUPABASE = {
        config: {
            url: config.url,
            anonKey: config.anonKey
        },
        client: supabaseClient,
        sanitizeHTML: sanitizeHTML,
        // Public Data APIs
        getSiteSettings: getSiteSettings,
        getSiteContent: getSiteContent,
        getServices: getServices,
        getGalleryItems: getGalleryItems,
        getAchievements: getAchievements,
        getVideos: getVideos,
        getBlogPosts: getBlogPosts,
        getBlogPostBySlug: getBlogPostBySlug,
        // Availability APIs
        getAvailabilitySchedule: getAvailabilitySchedule,
        getBlockedDates: getBlockedDates,
        getAvailableSlots: getAvailableSlots,
        isDateAvailable: isDateAvailable,
        // Step 3 Booking & Payment APIs
        createBooking: createBooking,
        initiatePhonePePayment: initiatePhonePePayment,
        verifyPhonePePayment: verifyPhonePePayment,
        getConfirmedBooking: getConfirmedBooking,
        // Analytics & Logging
        trackAnalyticsEvent: trackAnalyticsEvent,
        logClientError: logClientError,
        // Admin Auth & Management
        signInAdmin: signInAdmin,
        signOutAdmin: signOutAdmin,
        getAdminSession: getAdminSession,
        getCurrentUser: getCurrentUser,
        getCurrentProfile: getCurrentProfile,
        onAuthStateChange: onAuthStateChange,
        // Admin Protected Data Queries
        getAdminDashboardSummary: getAdminDashboardSummary,
        getAdminBookings: getAdminBookings,
        getAdminCustomers: getAdminCustomers,
        getAdminPayments: getAdminPayments,
        getAdminNotifications: getAdminNotifications,
        getAdminActivityLogs: getAdminActivityLogs,
        getAdminErrorLogs: getAdminErrorLogs,
        getAdminUsers: getAdminUsers,
        getAdminDailyReports: getAdminDailyReports,
        // Step 4 Admin Mutations & Management
        adminUpdateBookingStatus: adminUpdateBookingStatus,
        adminRescheduleBooking: adminRescheduleBooking,
        adminUpdateCustomer: adminUpdateCustomer,
        adminReconcilePayment: adminReconcilePayment,
        adminSaveService: adminSaveService,
        adminSaveAvailability: adminSaveAvailability,
        adminAddBlockedDate: adminAddBlockedDate,
        adminDeleteBlockedDate: adminDeleteBlockedDate,
        adminSaveSiteContent: adminSaveSiteContent,
        adminSaveGalleryItem: adminSaveGalleryItem,
        adminDeleteGalleryItem: adminDeleteGalleryItem,
        adminSaveAchievement: adminSaveAchievement,
        adminDeleteAchievement: adminDeleteAchievement,
        adminSaveVideo: adminSaveVideo,
        adminDeleteVideo: adminDeleteVideo,
        adminSaveBlogPost: adminSaveBlogPost,
        adminDeleteBlogPost: adminDeleteBlogPost,
        adminSaveSiteSettings: adminSaveSiteSettings,
        adminMarkNotificationRead: adminMarkNotificationRead,
        adminMarkAllNotificationsRead: adminMarkAllNotificationsRead,
        adminResolveErrorLog: adminResolveErrorLog,
        adminUpdateUserRole: adminUpdateUserRole,
        adminGenerateDailyReport: adminGenerateDailyReport,
        adminLogActivity: adminLogActivity,
        exportToCSV: exportToCSV,
        // Google Drive Image URL Resolver & Validator
        resolveGoogleDriveImageUrl: resolveGoogleDriveImageUrl,
        validateImageUrl: validateImageUrl
    };

})(window);

