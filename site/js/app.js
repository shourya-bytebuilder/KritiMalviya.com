/**
 * ==========================================================================
 * KRITI MALVIYA — OFFICIAL JAVASCRIPT ARCHITECTURE
 * Vanilla JS Application Controller & Data Hub
 * ==========================================================================
 */

// ==========================================================================
// 01. SHARED DATA ARCHITECTURE (Data models ready for Supabase in Step 2)
// ==========================================================================

const siteConfig = {
    brandName: "KRITIMALVIYA",
    professionalTitle: "Adv. Kriti Malviya",
    tagline: "Legal Expertise. Personal Understanding. Practical Solutions.",
    experienceYears: "10+",
    bankingReports: "500+",
    mediationsResolved: "20+",
    phonepeGateway: "PHONEPE",
    currency: "INR",
    currencySymbol: "₹",
    defaultFee: 1000
};

const servicesData = {
    legal: [
        {
            id: "divorce-guidance",
            title: "Divorce Guidance",
            category: "Legal Counselling",
            desc: "Compassionate, confidential legal counselling regarding separation, divorce procedures, custody, and settlement rights.",
            duration: [60]
        },
        {
            id: "property-purchase",
            title: "Property Purchase Due Diligence",
            category: "Legal Counselling",
            desc: "30-year title verification, documentation review, search reports, and legal protection for property buyers.",
            duration: [60]
        },
        {
            id: "civil-cases",
            title: "Civil Cases & Documentation",
            category: "Legal Counselling",
            desc: "Expert guidance on civil litigation, contract drafting, property partition, wills, and documentation compliance.",
            duration: [60]
        },
        {
            id: "human-rights",
            title: "Human Rights Matters",
            category: "Legal Counselling",
            desc: "Protection and legal counselling on civil liberties, constitutional rights, and equitable relief.",
            duration: [60]
        },
        {
            id: "general-legal",
            title: "General Legal Consultation",
            category: "Legal Counselling",
            desc: "Comprehensive evaluation of your legal situation, practical options, and strategic next steps.",
            duration: [60]
        }
    ],
    relationship: [
        {
            id: "couple-counselling",
            title: "Couple Counselling",
            category: "Relationship Counselling",
            desc: "Structured, neutral facilitation to resolve interpersonal conflicts, rebuild intimacy, and enhance mutual respect.",
            duration: [60]
        },
        {
            id: "relationship-concerns",
            title: "Relationship Concerns",
            category: "Relationship Counselling",
            desc: "Addressing recurring misunderstandings, trust deficits, emotional disconnects, and healthy boundaries.",
            duration: [60]
        },
        {
            id: "family-concerns",
            title: "Family Concerns",
            category: "Relationship Counselling",
            desc: "Navigating complex inter-family dynamics, generational disputes, parenting stress, and marital balance.",
            duration: [60]
        },
        {
            id: "separation-counselling",
            title: "Break-up / Separation Support",
            category: "Relationship Counselling",
            desc: "Empathetic emotional support and rational decision-making guidance during transition and separation phases.",
            duration: [60]
        },
        {
            id: "teenage-counselling",
            title: "Teenage Counselling",
            category: "Personal Counselling",
            desc: "Guidance for adolescents and young adults facing stress, identity confusion, family pressure, or peer conflict.",
            duration: [60]
        },
        {
            id: "emotional-wellbeing",
            title: "Emotional Well-being & EQ",
            category: "Personal Counselling",
            desc: "Developing emotional resilience, managing anxiety, building self-esteem, and clarifying personal goals.",
            duration: [60]
        },
        {
            id: "general-counselling",
            title: "General Counselling",
            category: "Personal Counselling",
            desc: "Confidential space for individuals to explore life transitions, career strain, and personal growth.",
            duration: [60]
        }
    ]
};

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
        title: "Supreme Court & High Court Engagements",
        category: "Professional",
        featured: true
    },
    {
        src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
        title: "Banking Search Reports Archive",
        category: "Banking",
        featured: false
    },
    {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
        title: "Property & Due Diligence Review",
        category: "Documentation",
        featured: false
    },
    {
        src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
        title: "Client Mediation Consultation",
        category: "Mediation",
        featured: false
    },
    {
        src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
        title: "Private Relationship Counselling Session",
        category: "Counselling",
        featured: true
    },
    {
        src: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&q=80&w=800",
        title: "Bar Association Legal Seminar",
        category: "Events",
        featured: false
    }
];

const achievementsData = [
    {
        year: "2026",
        title: "10+ Years Legal Experience Milestone",
        category: "Milestone",
        description: "Over a decade of dedicated professional practice across banking law, contracts, property verification, and family counselling.",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
        featured: true
    },
    {
        year: "2025",
        title: "500+ Banking Search Reports Completed",
        category: "Banking",
        description: "Milestone verified: Successfully conducted over 500 comprehensive due diligence and property title search reports for leading banking institutions.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
        featured: false
    },
    {
        year: "2024",
        title: "20+ Successful Dispute Mediations",
        category: "Mediation",
        description: "Factual milestone: Facilitated amicable, out-of-court dispute resolutions for over 20 commercial, property, and family matters.",
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
        featured: false
    },
    {
        year: "2023",
        title: "Integrated Legal & Counselling Practice Established",
        category: "Milestone",
        description: "Formally expanded services to unite rigorous legal acumen with empathetic personal and relationship counselling.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
        featured: true
    }
];

const vlogData = [
    {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Understanding Property Verification & Legal Search Reports",
        description: "Essential legal steps every buyer should take to verify property titles and avoid land fraud in India.",
        category: "Legal Guidance",
        date: "October 02, 2026",
        featured: true
    },
    {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Resolving Conflicts in Relationships with Emotional Intelligence",
        description: "How shifting from winning arguments to understanding perspectives transforms couples counselling.",
        category: "Relationship Counselling",
        date: "September 24, 2026",
        featured: false
    },
    {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Mediation vs Court Proceedings: What You Need to Know",
        description: "A practical guide to choosing between confidential out-of-court settlement and adversarial civil litigation.",
        category: "Mediation",
        date: "September 12, 2026",
        featured: false
    },
    {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Healthy Separation and Co-Parenting Fundamentals",
        description: "Key legal and psychological considerations for families going through separation.",
        category: "Family Law",
        date: "August 30, 2026",
        featured: false
    }
];

const blogPosts = [
    {
        id: 1,
        title: "Key Legal Precautions Before Purchasing Real Estate",
        excerpt: "Why 30-year title searches, encumbrance certificates, and verified approval checks prevent years of litigation.",
        content: `
            <p>Real estate transactions represent some of the largest financial commitments people make. Yet, without comprehensive legal due diligence, buyers frequently fall victim to unreleased mortgages, title disputes, or undisclosed family inheritance claims.</p>
            <h2>1. The 30-Year Title Search</h2>
            <p>A rigorous property title verification must trace ownership back at least 30 years to verify unbroken legal succession and confirm that every prior transaction was properly registered.</p>
            <h2>2. Encumbrance Certificate (EC) Verification</h2>
            <p>The Encumbrance Certificate confirms whether any mortgages, charges, or legal attachments exist against the property at the sub-registrar office.</p>
            <h2>3. Local Body Approvals and Sanctions</h2>
            <p>Ensure that construction layout plans adhere to municipal norms. Unapproved deviations risk demolition notices and structural litigation.</p>
            <p>Seeking independent legal verification before executing an Agreement to Sale protects both your capital and your peace of mind.</p>
        `,
        category: "Legal Awareness",
        date: "October 04, 2026",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
        featured: true,
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Navigating Communication Breakdown in Relationships",
        excerpt: "Recognizing early warning signs of emotional disconnect and practical strategies to rebuild communication.",
        content: `
            <p>Communication failure in intimate relationships is rarely sudden. It is typically a gradual erosion of active listening, patience, and reciprocal empathy.</p>
            <h2>Listening to Understand, Not to Defend</h2>
            <p>One of the foundational tenets of effective relationship counselling is shifting perspective from trying to 'win' a disagreement toward understanding your partner's lived emotional reality.</p>
            <ul>
                <li>Pause and regulate before offering an immediate reaction.</li>
                <li>Clarify assumptions before assigning intent.</li>
                <li>Validate underlying feelings even when disagreeing on particular facts.</li>
            </ul>
            <p>Structured counselling provides a safe, non-judgmental environment to develop these communicative tools.</p>
        `,
        category: "Relationships",
        date: "September 28, 2026",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
        featured: false,
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "The Power of Confidential Mediation in Commercial & Family Disputes",
        excerpt: "Why negotiated settlements save years of court litigation, emotional stress, and financial burden.",
        content: `
            <p>Court proceedings are inherently adversarial. In commercial partnerships and family matters, civil litigation often destroys relationships beyond repair.</p>
            <h2>Why Mediation Succeeds</h2>
            <p>Mediation provides strict confidentiality, privacy from public records, full control over the terms of resolution, and drastically faster closure than traditional court dockets.</p>
        `,
        category: "Mediation",
        date: "September 15, 2026",
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
        featured: false,
        readTime: "6 min read"
    }
];

// ==========================================================================
// 02. DATA ADAPTERS & BACKEND INTEGRATION LAYER
// (Connected to Supabase PostgreSQL, Auth & Analytics)
// ==========================================================================

async function getServices() {
    if (window.KM_SUPABASE && window.KM_SUPABASE.getServices) {
        try {
            return await window.KM_SUPABASE.getServices();
        } catch (e) {
            console.warn("[Adapter] getServices fallback", e);
        }
    }
    return servicesData;
}

async function getGalleryItems() {
    if (window.KM_SUPABASE && window.KM_SUPABASE.getGalleryItems) {
        try {
            return await window.KM_SUPABASE.getGalleryItems();
        } catch (e) {
            console.warn("[Adapter] getGalleryItems fallback", e);
        }
    }
    return galleryImages;
}

async function getAchievements() {
    if (window.KM_SUPABASE && window.KM_SUPABASE.getAchievements) {
        try {
            return await window.KM_SUPABASE.getAchievements();
        } catch (e) {
            console.warn("[Adapter] getAchievements fallback", e);
        }
    }
    return achievementsData;
}

async function getVlogItems() {
    if (window.KM_SUPABASE && window.KM_SUPABASE.getVideos) {
        try {
            return await window.KM_SUPABASE.getVideos();
        } catch (e) {
            console.warn("[Adapter] getVlogItems fallback", e);
        }
    }
    return vlogData;
}

async function getBlogPosts() {
    if (window.KM_SUPABASE && window.KM_SUPABASE.getBlogPosts) {
        try {
            return await window.KM_SUPABASE.getBlogPosts();
        } catch (e) {
            console.warn("[Adapter] getBlogPosts fallback", e);
        }
    }
    return blogPosts;
}

async function createBooking(bookingData) {
    if (window.KM_SUPABASE && window.KM_SUPABASE.trackAnalyticsEvent) {
        window.KM_SUPABASE.trackAnalyticsEvent("consultation_submitted", {
            service: bookingData.service_title || bookingData.service,
            mode: bookingData.mode
        });
    }

    if (window.KM_SUPABASE && window.KM_SUPABASE.createBooking) {
        return await window.KM_SUPABASE.createBooking(bookingData);
    }
    throw new Error("Supabase booking service unavailable.");
}

async function startPhonePePayment(bookingRef, confirmationToken) {
    if (window.KM_SUPABASE && window.KM_SUPABASE.trackAnalyticsEvent) {
        window.KM_SUPABASE.trackAnalyticsEvent("payment_started", {
            booking_reference: bookingRef
        });
    }

    if (window.KM_SUPABASE && window.KM_SUPABASE.initiatePhonePePayment) {
        return await window.KM_SUPABASE.initiatePhonePePayment(bookingRef, confirmationToken);
    }
    throw new Error("Supabase payment service unavailable.");
}

async function submitContactForm(formData) {
    console.info("[Contact] Submission received:", formData);
    if (window.KM_SUPABASE && window.KM_SUPABASE.trackAnalyticsEvent) {
        window.KM_SUPABASE.trackAnalyticsEvent("contact_submitted", {
            name: formData.name
        });
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Inquiry received successfully." });
        }, 1000);
    });
}

// ==========================================================================
// 03. CORE INITIALIZATION ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initMobileMenu();
    initDropdowns();
    initScrollEffects();
    initRevealAnimations();

    // Feature Detection Initializations
    if (document.querySelector("[data-page='home']")) {
        initHomePage();
    }
    if (document.querySelector("[data-page='gallery']")) {
        initGalleryPage();
    }
    if (document.querySelector("[data-page='awards']")) {
        initAwardsPage();
    }
    if (document.querySelector("[data-page='vlog']")) {
        initVlogPage();
    }
    if (document.querySelector("[data-page='blog']")) {
        initBlogPage();
    }
    if (document.querySelector("[data-page='consultation']")) {
        initConsultationPage();
    }
    if (document.querySelector("[data-page='payment']")) {
        initPaymentPage();
    }
    if (document.querySelector("[data-page='confirmation']")) {
        initConfirmationPage();
    }
    if (document.querySelector("[data-page='contact']")) {
        initContactPage();
    }
    if (document.querySelector("[data-page='services']")) {
        initServicesPage();
    }
    if (document.querySelector("[data-page='admin']")) {
        initAdminPage();
    }

    // Contextual Onboarding & Global Help Drawer
    initGuidedTourSystem();
    initHelpDrawer();
});

// ==========================================================================
// 04. GLOBAL NAVIGATION & MENU COMPONENTS
// ==========================================================================

function initNavigation() {
    // Mark current active link in header & mobile drawer
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll(".nav-link, .side-link");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && (currentPath.endsWith(href.toLowerCase()) || (href === "index.html" && (currentPath.endsWith("/") || currentPath.endsWith("/site/"))))) {
            link.classList.add("active");
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidePanel = document.querySelector(".side-menu-panel");
    const menuOverlay = document.querySelector(".menu-overlay");
    const closeBtn = document.querySelector(".menu-close");
    const closeLinks = document.querySelectorAll(".close-on-click");
    let isMenuOpen = false;

    if (!menuToggle || !sidePanel || !menuOverlay) return;

    function toggleMenu(open) {
        isMenuOpen = typeof open === "boolean" ? open : !isMenuOpen;
        menuToggle.classList.toggle("is-open", isMenuOpen);
        menuToggle.setAttribute("aria-expanded", isMenuOpen);
        sidePanel.classList.toggle("is-open", isMenuOpen);
        menuOverlay.classList.toggle("is-active", isMenuOpen);
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }

    menuToggle.addEventListener("click", () => toggleMenu());
    menuOverlay.addEventListener("click", () => toggleMenu(false));
    if (closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));

    closeLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (isMenuOpen) toggleMenu(false);
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isMenuOpen) {
            toggleMenu(false);
        }
    });
}

function initDropdowns() {
    const dropdownToggles = document.querySelectorAll(".js-dropdown-toggle");
    const allDropdowns = document.querySelectorAll(".dropdown-menu");

    function closeAllDropdowns() {
        allDropdowns.forEach(menu => menu.classList.remove("is-active"));
        dropdownToggles.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    }

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetId = toggle.getAttribute("data-target");
            const targetMenu = document.getElementById(targetId);
            const isOpen = targetMenu && targetMenu.classList.contains("is-active");

            closeAllDropdowns();

            if (!isOpen && targetMenu) {
                targetMenu.classList.add("is-active");
                toggle.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-item")) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });
}

function initScrollEffects() {
    /* --- 1. INITIAL HERO & HEADER VISIBILITY --- */
    setTimeout(() => {
        document.querySelectorAll('[id^="anim-target-"]').forEach(el => el.classList.add("is-visible"));
    }, 150);

    /* --- 2. LERP & SPRING-BASED SCROLL ANIMATIONS --- */
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let isAnimating = true;

    function easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    function easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    const mistLayer = document.getElementById("mist-layer");
    const mist1 = document.querySelector(".mist-1");
    const mist2 = document.querySelector(".mist-2");

    const heroTitle = document.querySelector(".js-hero-title");
    const heroDesc = document.querySelector(".js-hero-desc");
    const heroActions = document.querySelector(".js-hero-actions");
    const heroStats = document.querySelector(".js-hero-stats");
    const heroImg = document.querySelector(".js-hero-img");
    const heroCard = document.querySelector(".js-hero-card");

    const scrollObjs = document.querySelectorAll(".scroll-obj");
    const auScrollObjs = document.querySelectorAll(".au-scroll-anim");

    function calculateObjTops() {
        scrollObjs.forEach(obj => {
            const prevTransform = obj.style.transform;
            obj.style.transform = "none";
            obj.dataset.absTop = (obj.getBoundingClientRect().top + window.scrollY).toString();
            obj.style.transform = prevTransform;
        });

        auScrollObjs.forEach(obj => {
            const prevTransform = obj.style.transform;
            obj.style.transform = "none";
            obj.dataset.absTop = (obj.getBoundingClientRect().top + window.scrollY).toString();
            obj.style.transform = prevTransform;
        });
    }

    if (heroTitle || scrollObjs.length > 0 || auScrollObjs.length > 0 || mistLayer) {
        window.addEventListener("load", calculateObjTops);
        setTimeout(calculateObjTops, 500);
        window.addEventListener("resize", calculateObjTops);

        function updateAnimations() {
            currentScroll += (targetScroll - currentScroll) * 0.08;

            if (Math.abs(targetScroll - currentScroll) < 0.1) {
                currentScroll = targetScroll;
                isAnimating = false;
            } else {
                isAnimating = true;
                requestAnimationFrame(updateAnimations);
            }

            if (currentScroll < 1200) {
                if (heroTitle) {
                    heroTitle.style.transform = `translateY(-${currentScroll * 0.25}px)`;
                    heroTitle.style.opacity = Math.max(0, 1 - (currentScroll / 350)).toString();
                }
                if (heroDesc) {
                    heroDesc.style.transform = `translateY(-${currentScroll * 0.35}px)`;
                    heroDesc.style.opacity = Math.max(0, 1 - (currentScroll / 300)).toString();
                }
                if (heroActions) {
                    heroActions.style.transform = `translateY(-${currentScroll * 0.45}px)`;
                    heroActions.style.opacity = Math.max(0, 1 - (currentScroll / 250)).toString();
                }
                if (heroStats) {
                    heroStats.style.transform = `translateY(-${currentScroll * 0.1}px) translateX(-${currentScroll * 0.1}px)`;
                    heroStats.style.opacity = Math.max(0, 1 - (currentScroll / 450)).toString();
                }
                if (heroImg) {
                    heroImg.style.transform = `translateY(-${currentScroll * 0.15}px) translateX(${currentScroll * 0.15}px) scale(${1 + currentScroll * 0.0003})`;
                    heroImg.style.opacity = Math.max(0, 1 - (currentScroll / 600)).toString();
                }
                if (heroCard) {
                    heroCard.style.transform = `translateY(${currentScroll * 0.15}px) translateX(-${currentScroll * 0.2}px) rotate(${currentScroll * -0.015}deg)`;
                    heroCard.style.opacity = Math.max(0, 1 - (currentScroll / 500)).toString();
                }
            }

            if (mistLayer) {
                if (currentScroll > 50 && currentScroll < 1800) {
                    mistLayer.style.opacity = Math.min(1, (currentScroll - 50) / 400).toString();
                    if (mist1) mist1.style.transform = `rotate(-5deg) translateX(${currentScroll * 0.06}px) scale(${1 + currentScroll * 0.0001})`;
                    if (mist2) mist2.style.transform = `rotate(8deg) translateX(-${currentScroll * 0.04}px) scale(${1 + currentScroll * 0.0002})`;
                } else if (currentScroll <= 50) {
                    mistLayer.style.opacity = "0";
                }
            }

            const windowHeight = window.innerHeight;

            scrollObjs.forEach(obj => {
                if (!obj.dataset.absTop) return;

                const absoluteTop = parseFloat(obj.dataset.absTop);
                const virtualTop = absoluteTop - currentScroll;

                const triggerY = windowHeight * 0.95;
                const settleY = windowHeight * 0.65;

                let progress = 0;
                if (virtualTop > triggerY) progress = 0;
                else if (virtualTop < settleY) progress = 1;
                else progress = 1 - ((virtualTop - settleY) / (triggerY - settleY));

                const easedProgress = easeOutBack(progress);
                const opacityProgress = easeOutQuad(progress);

                const startY = parseFloat(obj.dataset.y || "80");
                const startX = parseFloat(obj.dataset.x || "0");
                const startR = parseFloat(obj.dataset.r || "0");
                const startS = parseFloat(obj.dataset.scale || "1");

                const curY = startY * (1 - easedProgress);
                const curX = startX * (1 - easedProgress);
                const curR = startR * (1 - easedProgress);
                const curS = startS + ((1 - startS) * easedProgress);

                obj.style.opacity = Math.min(1, Math.max(0, opacityProgress * 1.5)).toString();
                obj.style.transform = `translate3d(${curX}px, ${curY}px, 0) rotate(${curR}deg) scale(${curS})`;
            });

            auScrollObjs.forEach(obj => {
                if (!obj.dataset.absTop) return;

                const absoluteTop = parseFloat(obj.dataset.absTop);
                const virtualTop = absoluteTop - currentScroll;

                const triggerY = windowHeight * 0.95;
                const settleY = windowHeight * 0.75;

                let progress = 0;
                if (virtualTop > triggerY) progress = 0;
                else if (virtualTop < settleY) progress = 1;
                else progress = 1 - ((virtualTop - settleY) / (triggerY - settleY));

                const finalEasedProgress = easeOutBack(progress);
                const opacityProgress = easeOutQuad(progress);

                const startY = parseFloat(obj.dataset.y || "80");
                const startX = parseFloat(obj.dataset.x || "0");
                const startR = parseFloat(obj.dataset.r || "0");
                const startS = parseFloat(obj.dataset.scale || "1");

                const curY = startY * (1 - finalEasedProgress);
                const curX = startX * (1 - finalEasedProgress);
                const curR = startR * (1 - finalEasedProgress);
                const curS = startS + ((1 - startS) * finalEasedProgress);

                obj.style.opacity = Math.min(1, Math.max(0, opacityProgress * 1.5)).toString();
                obj.style.transform = `translate3d(${curX}px, ${curY}px, 0) rotate(${curR}deg) scale(${curS})`;
            });
        }

        window.addEventListener("scroll", () => {
            targetScroll = window.scrollY;
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(updateAnimations);
            }
        }, { passive: true });

        updateAnimations();
    }
}

function initRevealAnimations() {
    // Staggered Scroll Observer
    const observerOptions = { root: null, rootMargin: "0px 0px -50px 0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("in-view");
                }, (i % 6) * 100);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-on-scroll, .reveal-up, .gallery-item, .vl-card, .award-card, .blog-card").forEach(el => observer.observe(el));
}

// ==========================================================================
// 05. HOMEPAGE FEATURES
// ==========================================================================

async function initHomePage() {
    console.info("[Page] Homepage initialized with Supabase integration.");
    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("page_view", { page: "home" });
        try {
            const heroContent = await window.KM_SUPABASE.getSiteContent("homepage_hero");
            if (heroContent && heroContent.tagline) {
                const subEl = document.querySelector(".hero-subtitle");
                if (subEl) subEl.textContent = heroContent.tagline;
            }
        } catch (e) {
            console.debug("[Home] Content sync fallback", e);
        }
    }
}

// ==========================================================================
// 06. GALLERY PAGE COMPONENT
// ==========================================================================

async function initGalleryPage() {
    const grid = document.getElementById("gallery-grid");
    const filterContainer = document.getElementById("gallery-filters");
    const counterEl = document.getElementById("photo-counter");
    if (!grid || !filterContainer) return;

    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("gallery_opened", { page: "gallery" });
    }

    let currentGalleryData = galleryImages;
    if (window.KM_SUPABASE && window.KM_SUPABASE.getGalleryItems) {
        try {
            const dbItems = await window.KM_SUPABASE.getGalleryItems();
            if (Array.isArray(dbItems) && dbItems.length > 0) {
                currentGalleryData = dbItems.map(item => ({
                    src: item.image_url,
                    title: item.title,
                    category: item.category,
                    featured: !!item.featured
                }));
            } else if (Array.isArray(dbItems) && dbItems.length === 0) {
                currentGalleryData = [];
            }
        } catch (e) {
            console.warn("[Gallery] Supabase read fallback", e);
        }
    }

    if (currentGalleryData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); background: var(--off-white);">
                <span class="eyebrow" style="color:var(--gold);">ARCHIVE STATUS</span>
                <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin:16px 0;">THE ARCHIVE IS BEING CURATED</h3>
                <p class="text-muted" style="max-width:440px; margin:0 auto;">High-resolution professional courtroom and mediation documentation will be updated shortly.</p>
            </div>
        `;
        if (counterEl) counterEl.textContent = "00";
        filterContainer.innerHTML = "";
        return;
    }

    let currentFilter = "All";
    let lightboxIndex = 0;
    let visibleIndices = [];

    // Counter
    if (counterEl) counterEl.textContent = currentGalleryData.length.toString().padStart(2, "0");

    // Generate categories dynamically
    const categories = ["All"];
    currentGalleryData.forEach(item => {
        if (item.category && !categories.includes(item.category)) {
            categories.push(item.category);
        }
    });

    filterContainer.innerHTML = "";
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `filter-btn ${cat === "All" ? "active" : ""}`;
        btn.textContent = cat;
        btn.addEventListener("click", () => applyFilter(cat, btn));
        filterContainer.appendChild(btn);
    });

    const layoutPattern = ["item-normal", "item-tall", "item-wide", "item-normal", "item-normal", "item-tall"];

    grid.innerHTML = "";
    currentGalleryData.forEach((imgData, index) => {
        const sizeClass = imgData.featured ? "item-large" : layoutPattern[index % layoutPattern.length];
        const card = document.createElement("div");
        card.className = `gallery-item ${sizeClass} reveal-on-scroll in-view`;
        card.dataset.category = imgData.category || "General";
        card.dataset.index = index.toString();

        card.innerHTML = `
            <img src="${imgData.src}" alt="${imgData.title}" class="gallery-img loaded" loading="lazy" onerror="handleGalleryImgError(this)">
            <div class="item-overlay">
                <div class="overlay-top">
                    <span class="overlay-category">${imgData.category}</span>
                    <span class="overlay-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </span>
                </div>
                <div class="overlay-bottom">
                    <div class="overlay-title">${imgData.title}</div>
                </div>
            </div>
        `;

        card.addEventListener("click", () => openLightbox(index));
        grid.appendChild(card);
    });

    window.handleGalleryImgError = function(imgEl) {
        if (!imgEl) return;
        imgEl.onerror = null;
        imgEl.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%27600%27%20height%3D%27400%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23F4F1EA%27%2F%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20dominant-baseline%3D%27middle%27%20text-anchor%3D%27middle%27%20font-family%3D%27sans-serif%27%20font-size%3D%2716%27%20fill%3D%27%23B89B52%27%3EChambers%20Photograph%3C%2Ftext%3E%3C%2Fsvg%3E";
    };

    function updateVisibleIndices() {
        visibleIndices = [];
        document.querySelectorAll(".gallery-item").forEach(item => {
            if (!item.classList.contains("is-hidden")) {
                visibleIndices.push(parseInt(item.dataset.index || "0"));
            }
        });
    }
    updateVisibleIndices();

    function applyFilter(category, btn) {
        currentFilter = category;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const items = document.querySelectorAll(".gallery-item");
        items.forEach(item => {
            const itemCat = item.dataset.category;
            const matches = (category === "All" || itemCat === category);
            if (matches) {
                item.classList.remove("is-hidden");
                item.classList.remove("is-hiding");
                setTimeout(() => item.classList.add("in-view"), 50);
            } else {
                item.classList.add("is-hiding");
                setTimeout(() => {
                    if (item.classList.contains("is-hiding")) {
                        item.classList.add("is-hidden");
                    }
                }, 400);
            }
        });
        updateVisibleIndices();
    }

    // Lightbox Controls
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lb-img");
    const lbTitle = document.getElementById("lb-title");
    const lbCategory = document.getElementById("lb-category");
    const lbCounter = document.getElementById("lb-counter");
    const lbClose = document.getElementById("lb-close");
    const lbPrev = document.getElementById("lb-prev");
    const lbNext = document.getElementById("lb-next");

    function openLightbox(originalIndex) {
        if (!lightbox) return;
        lightboxIndex = visibleIndices.indexOf(originalIndex);
        if (lightboxIndex === -1) lightboxIndex = 0;
        updateLightboxView();
        lightbox.classList.add("is-active");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("is-active");
        document.body.style.overflow = "";
    }

    function updateLightboxView() {
        if (!visibleIndices.length) return;
        const activeImgIndex = visibleIndices[lightboxIndex];
        const data = currentGalleryData[activeImgIndex];
        if (!data) return;

        if (lbImg) lbImg.src = data.src;
        if (lbTitle) lbTitle.textContent = data.title;
        if (lbCategory) lbCategory.textContent = data.category;
        if (lbCounter) lbCounter.textContent = `${lightboxIndex + 1} / ${visibleIndices.length}`;
    }

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) lbPrev.addEventListener("click", () => {
        lightboxIndex = (lightboxIndex - 1 + visibleIndices.length) % visibleIndices.length;
        updateLightboxView();
    });
    if (lbNext) lbNext.addEventListener("click", () => {
        lightboxIndex = (lightboxIndex + 1) % visibleIndices.length;
        updateLightboxView();
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox || !lightbox.classList.contains("is-active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft" && lbPrev) lbPrev.click();
        if (e.key === "ArrowRight" && lbNext) lbNext.click();
    });
}

// ==========================================================================
// 07. AWARDS & ACHIEVEMENTS PAGE
// ==========================================================================

async function initAwardsPage() {
    const grid = document.getElementById("aw-grid");
    const filterContainer = document.getElementById("aw-filters");
    const counterEl = document.getElementById("aw-counter-num");
    if (!grid) return;

    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("page_view", { page: "awards" });
    }

    let currentAwardsData = achievementsData;
    if (window.KM_SUPABASE && window.KM_SUPABASE.getAchievements) {
        try {
            const dbAwards = await window.KM_SUPABASE.getAchievements();
            if (Array.isArray(dbAwards) && dbAwards.length > 0) {
                currentAwardsData = dbAwards.map(a => ({
                    year: a.year || "2026",
                    title: a.title,
                    category: a.category || "Milestone",
                    description: a.description,
                    featured: !!a.featured,
                    image: a.image_url ? (window.KM_SUPABASE?.resolveGoogleDriveImageUrl(a.image_url) || a.image_url) : null
                }));
            } else if (Array.isArray(dbAwards) && dbAwards.length === 0) {
                currentAwardsData = [];
            }
        } catch (e) {
            console.warn("[Awards] Supabase read fallback", e);
        }
    }

    if (currentAwardsData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); background: var(--off-white);">
                <span class="eyebrow" style="color:var(--gold);">ACHIEVEMENTS ARCHIVE</span>
                <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin:16px 0;">PROFESSIONAL MILESTONES WILL BE ADDED HERE</h3>
                <p class="text-muted" style="max-width:440px; margin:0 auto;">Verified career milestones and legal accreditations are being documented.</p>
            </div>
        `;
        if (counterEl) counterEl.textContent = "00";
        if (filterContainer) filterContainer.innerHTML = "";
        return;
    }

    if (counterEl) counterEl.textContent = currentAwardsData.length.toString().padStart(2, "0");

    const categories = ["All"];
    currentAwardsData.forEach(item => {
        if (item.category && !categories.includes(item.category)) {
            categories.push(item.category);
        }
    });

    if (filterContainer) {
        filterContainer.innerHTML = "";
        categories.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${cat === "All" ? "active" : ""}`;
            btn.textContent = cat;
            btn.addEventListener("click", () => {
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                document.querySelectorAll(".award-card").forEach(card => {
                    const match = cat === "All" || card.dataset.category === cat;
                    card.style.display = match ? "" : "none";
                });
            });
            filterContainer.appendChild(btn);
        });
    }

    grid.innerHTML = "";
    currentAwardsData.forEach((data, index) => {
        const card = document.createElement("div");
        card.className = `award-card ${data.featured ? "aw-span-2" : ""} reveal-on-scroll in-view`;
        card.dataset.category = data.category || "General";
        card.dataset.index = index.toString();

        const resolvedImg = data.image ? (window.KM_SUPABASE?.resolveGoogleDriveImageUrl(data.image) || data.image) : null;

        card.innerHTML = `
            ${resolvedImg ? `<div class="award-img-wrap"><img src="${resolvedImg}" alt="${data.title}" loading="lazy" onerror="this.onerror=null; this.parentElement.style.display='none';"></div>` : ""}
            <div class="award-content">
                <div class="award-year">${data.year}</div>
                <div class="award-category">${data.category}</div>
                <h3 class="award-title">${data.title}</h3>
                <p class="award-desc">${data.description}</p>
                <div class="award-hover-line"></div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==========================================================================
// 08. VLOG PAGE COMPONENT
// ==========================================================================

function extractYouTubeId(url) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
}

async function initVlogPage() {
    const grid = document.getElementById("vl-grid");
    const featuredContainer = document.getElementById("vl-featured-container");
    const counterEl = document.getElementById("vl-counter-num");
    const modal = document.getElementById("vlog-modal");
    const modalFrame = document.getElementById("vlog-modal-iframe");
    const modalClose = document.getElementById("vlog-modal-close");

    if (!grid && !featuredContainer) return;

    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("video_opened", { page: "vlog" });
    }

    let currentVlogs = vlogData;
    if (window.KM_SUPABASE && window.KM_SUPABASE.getVideos) {
        try {
            const dbVideos = await window.KM_SUPABASE.getVideos();
            if (Array.isArray(dbVideos) && dbVideos.length > 0) {
                currentVlogs = dbVideos.map(v => ({
                    title: v.title,
                    category: v.category || "Legal Guidance",
                    description: v.description,
                    url: v.youtube_url || `https://www.youtube.com/watch?v=${v.youtube_video_id}`,
                    youtube_video_id: v.youtube_video_id,
                    date: v.video_date || "October 2026",
                    featured: !!v.featured
                }));
            } else if (Array.isArray(dbVideos) && dbVideos.length === 0) {
                currentVlogs = [];
            }
        } catch (e) {
            console.warn("[Vlog] Supabase read fallback", e);
        }
    }

    if (currentVlogs.length === 0) {
        if (featuredContainer) {
            featuredContainer.innerHTML = `
                <div class="empty-state-card" style="text-align: center; padding: 70px 20px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); background: var(--off-white); width:100%;">
                    <span class="eyebrow" style="color:var(--gold);">VLOG ARCHIVE</span>
                    <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin:16px 0;">NEW VIDEOS WILL APPEAR HERE</h3>
                    <p class="text-muted" style="max-width:440px; margin:0 auto;">Legal awareness commentaries and counselling discussions are in production.</p>
                </div>
            `;
        }
        if (grid) grid.innerHTML = "";
        if (counterEl) counterEl.textContent = "00";
        return;
    }

    const processed = currentVlogs.map((v, i) => ({
        ...v,
        id: v.youtube_video_id || extractYouTubeId(v.url) || "dQw4w9WgXcQ",
        index: i
    }));

    if (counterEl) counterEl.textContent = processed.length.toString().padStart(2, "0");

    const featured = processed.find(v => v.featured) || processed[0];
    const regular = processed.filter(v => v !== featured);

    function openVideoModal(vidId) {
        if (!modal || !modalFrame) return;
        modalFrame.src = `https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0`;
        modal.classList.add("is-active");
        document.body.style.overflow = "hidden";
    }

    function closeVideoModal() {
        if (!modal || !modalFrame) return;
        modalFrame.src = "";
        modal.classList.remove("is-active");
        document.body.style.overflow = "";
    }

    if (modalClose) modalClose.addEventListener("click", closeVideoModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeVideoModal();
        });
    }

    // Featured video render
    if (featuredContainer && featured) {
        featuredContainer.innerHTML = `
            <div class="vl-featured-sec">
                <div class="vl-featured-card" data-id="${featured.id}">
                    <div class="vl-f-img-col">
                        <img src="https://i.ytimg.com/vi/${featured.id}/hqdefault.jpg" alt="${featured.title}">
                        <div class="vl-f-play-btn"></div>
                    </div>
                    <div class="vl-f-content">
                        <div class="vl-f-label">FEATURED VLOG</div>
                        <h2 class="vl-f-title">${featured.title}</h2>
                        <p class="vl-f-desc">${featured.description}</p>
                        <div class="vl-f-meta">
                            <span>${featured.date}</span>
                            <span class="vl-watch-link">Watch Video →</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        featuredContainer.querySelector(".vl-featured-card").addEventListener("click", () => openVideoModal(featured.id));
    }

    // Regular Grid render
    if (grid) {
        grid.innerHTML = "";
        regular.forEach(v => {
            const card = document.createElement("div");
            card.className = "vl-card";
            card.innerHTML = `
                <div class="vl-card-img-wrap">
                    <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
                    <div class="vl-card-play"></div>
                </div>
                <div class="vl-card-content">
                    <div class="vl-card-cat">${v.category}</div>
                    <h3 class="vl-card-title">${v.title}</h3>
                    <p class="vl-card-desc">${v.description}</p>
                    <div class="vl-card-meta">
                        <span>${v.date}</span>
                    </div>
                </div>
            `;
            card.addEventListener("click", () => openVideoModal(v.id));
            grid.appendChild(card);
        });
    }
}

// ==========================================================================
// 09. BLOG PAGE COMPONENT
// ==========================================================================

async function initBlogPage() {
    const grid = document.getElementById("blog-grid");
    const featuredCard = document.getElementById("featured-card");
    const searchInput = document.getElementById("search-input");
    const filterContainer = document.getElementById("category-filters");
    const countEl = document.getElementById("article-count");

    // Modal elements
    const articleModal = document.getElementById("article-modal");
    const amTitle = document.getElementById("am-title");
    const amMeta = document.getElementById("am-meta");
    const amBody = document.getElementById("am-body");
    const amClose = document.getElementById("am-close");

    if (!grid) return;

    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("blog_opened", { page: "blog" });
    }

    let currentBlogPosts = blogPosts;
    if (window.KM_SUPABASE && window.KM_SUPABASE.getBlogPosts) {
        try {
            const dbPosts = await window.KM_SUPABASE.getBlogPosts();
            if (Array.isArray(dbPosts) && dbPosts.length > 0) {
                currentBlogPosts = dbPosts.map(p => ({
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    category: p.category,
                    date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : "October 2026",
                    readTime: p.read_time ? `${p.read_time} min read` : "5 min read",
                    excerpt: p.excerpt,
                    content: p.content,
                    image: p.image_url ? (window.KM_SUPABASE?.resolveGoogleDriveImageUrl(p.image_url) || p.image_url) : "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
                    featured: !!p.featured
                }));
            } else if (Array.isArray(dbPosts) && dbPosts.length === 0) {
                currentBlogPosts = [];
            }
        } catch (e) {
            console.warn("[Blog] Supabase read fallback", e);
        }
    }

    if (currentBlogPosts.length === 0) {
        if (featuredCard) {
            featuredCard.innerHTML = `
                <div class="empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; width:100%; border:1px dashed var(--border-color); border-radius:var(--radius-sm); background:var(--off-white);">
                    <span class="eyebrow" style="color:var(--gold);">PUBLICATIONS</span>
                    <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin:16px 0;">NEW ENTRIES ARE BEING PREPARED</h3>
                    <p class="text-muted" style="max-width:440px; margin:0 auto;">Thought leadership articles and legal explanations are being curated for publication.</p>
                </div>
            `;
        }
        grid.innerHTML = "";
        if (countEl) countEl.textContent = "0";
        if (filterContainer) filterContainer.innerHTML = "";
        return;
    }

    let currentFilter = "All";
    let searchQuery = "";

    function openArticle(postId) {
        const post = currentBlogPosts.find(p => p.id === postId);
        if (!post || !articleModal) return;

        if (amTitle) amTitle.textContent = post.title;
        if (amMeta) amMeta.textContent = `${post.category} · ${post.date} · ${post.readTime}`;
        
        // Strict XSS Prevention: Sanitize database content using KM_SUPABASE sanitizer
        if (amBody) {
            const rawContent = post.content || `<p>${post.excerpt}</p>`;
            amBody.innerHTML = window.KM_SUPABASE ? window.KM_SUPABASE.sanitizeHTML(rawContent) : rawContent;
        }

        articleModal.classList.add("is-active");
        document.body.style.overflow = "hidden";
    }

    function closeArticle() {
        if (!articleModal) return;
        articleModal.classList.remove("is-active");
        document.body.style.overflow = "";
    }

    if (amClose) amClose.addEventListener("click", closeArticle);
    if (articleModal) {
        articleModal.addEventListener("click", (e) => {
            if (e.target === articleModal) closeArticle();
        });
    }

    // Render Featured
    const featured = currentBlogPosts.find(p => p.featured) || currentBlogPosts[0];
    if (featuredCard && featured) {
        featuredCard.innerHTML = `
            <div class="feat-img-col">
                <img src="${featured.image}" alt="${featured.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200';">
            </div>
            <div class="feat-content">
                <span class="feat-tag">${featured.category}</span>
                <div class="feat-meta">
                    <span>${featured.date}</span>
                    <span>${featured.readTime}</span>
                </div>
                <h2 class="feat-title">${featured.title}</h2>
                <p class="feat-excerpt">${featured.excerpt}</p>
                <span class="read-btn">READ ARTICLE</span>
            </div>
        `;
        featuredCard.addEventListener("click", () => openArticle(featured.id));
    }

    // Render Grid
    function renderBlogGrid() {
        const query = searchQuery.toLowerCase();
        const filtered = currentBlogPosts.filter(p => {
            const matchesCat = currentFilter === "All" || p.category === currentFilter;
            const matchesQuery = p.title.toLowerCase().includes(query) || (p.excerpt && p.excerpt.toLowerCase().includes(query));
            return matchesCat && matchesQuery;
        });

        if (countEl) countEl.textContent = filtered.length.toString();

        grid.innerHTML = "";
        filtered.forEach(post => {
            const card = document.createElement("div");
            card.className = "blog-card";
            card.innerHTML = `
                <div class="bc-img-wrap">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200';">
                </div>
                <div class="bc-content">
                    <div class="bc-meta">
                        <span class="bc-cat">${post.category}</span>
                        <span>${post.date}</span>
                    </div>
                    <h3 class="bc-title">${post.title}</h3>
                    <p class="bc-excerpt">${post.excerpt}</p>
                    <div class="read-btn" style="margin-top:auto;">READ ARTICLE</div>
                </div>
            `;
            card.addEventListener("click", () => openArticle(post.id));
            grid.appendChild(card);
        });
    }

    renderBlogGrid();

    // Filters
    if (filterContainer) {
        const cats = ["All", ...new Set(currentBlogPosts.map(p => p.category))];
        filterContainer.innerHTML = "";
        cats.forEach(c => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${c === "All" ? "active" : ""}`;
            btn.textContent = c;
            btn.addEventListener("click", () => {
                currentFilter = c;
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderBlogGrid();
            });
            filterContainer.appendChild(btn);
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim();
            renderBlogGrid();
        });
    }
}

// ==========================================================================
// 10. CONSULTATION BOOKING FLOW (4 Steps)
// ==========================================================================

async function initConsultationPage() {
    let currentStep = 1;
    let selectedCategory = "";
    let selectedService = null;
    let selectedDuration = 60;
    let selectedMode = "Online Consultation";
    let selectedDate = null;
    let selectedTime = null;

    if (window.KM_SUPABASE) {
        window.KM_SUPABASE.trackAnalyticsEvent("consultation_view", { page: "consultation" });
    }

    // Elements
    const servicesContainer = document.getElementById("services-container");
    const subOptions = document.getElementById("sub-options");
    const durationContainer = document.getElementById("duration-options");
    const modeChips = document.querySelectorAll("[data-mode]");
    const btnNext1 = document.getElementById("btn-next-1");
    const btnNext2 = document.getElementById("btn-next-2");
    const btnRequestConsultation = document.getElementById("btn-request-consultation");

    // Sidebar Summary Elements
    const sumService = document.getElementById("sb-service");
    const sumDuration = document.getElementById("sb-duration");
    const sumMode = document.getElementById("sb-mode");
    const sumDateTime = document.getElementById("sb-datetime");
    const sumFee = document.getElementById("sb-fee");

    function updateSummary() {
        if (sumService) sumService.textContent = selectedService ? selectedService.title : "--";
        if (sumDuration) sumDuration.textContent = selectedService ? `${selectedDuration} Minutes` : "--";
        if (sumMode) sumMode.textContent = selectedMode || "--";
        if (sumDateTime) sumDateTime.textContent = selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : "--";
        if (sumFee) sumFee.textContent = `₹${siteConfig.defaultFee}`;
    }

    // Load dynamic services from Supabase if available
    let legalServices = servicesData.legal;
    let relServices = servicesData.relationship;

    if (window.KM_SUPABASE && window.KM_SUPABASE.getServices) {
        try {
            const dbServices = await window.KM_SUPABASE.getServices();
            if (Array.isArray(dbServices) && dbServices.length > 0) {
                const getFallbackDesc = (slug, title, fallbackList) => {
                    const normSlug = (slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                    const normTitle = (title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                    const match = fallbackList.find(item => {
                        const iSlug = (item.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        const iTitle = (item.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        return (normSlug && iSlug && (normSlug.includes(iSlug) || iSlug.includes(normSlug))) ||
                               (normTitle && iTitle && (normTitle.includes(iTitle) || iTitle.includes(normTitle)));
                    });
                    return match ? match.desc : "";
                };

                legalServices = dbServices.filter(s => s.category === "LEGAL").map(s => ({
                    id: s.slug || s.id,
                    title: s.title,
                    category: "Legal Counselling",
                    desc: s.description || getFallbackDesc(s.slug, s.title, servicesData.legal),
                    duration: [60]
                }));
                relServices = dbServices.filter(s => s.category !== "LEGAL").map(s => ({
                    id: s.slug || s.id,
                    title: s.title,
                    category: s.category === "PERSONAL" ? "Personal Counselling" : "Relationship Counselling",
                    desc: s.description || getFallbackDesc(s.slug, s.title, servicesData.relationship),
                    duration: [60]
                }));
            }
        } catch (e) {
            console.warn("[Consultation] Supabase services read fallback", e);
        }
    }

    // Render Services
    if (servicesContainer) {
        servicesContainer.innerHTML = `
            <div class="service-cat-title">Legal Counselling</div>
            <div class="service-cards-grid" id="legal-services-grid"></div>
            <div class="service-cat-title">Relationship & Personal Counselling</div>
            <div class="service-cards-grid" id="rel-services-grid"></div>
        `;

        const legalGrid = document.getElementById("legal-services-grid");
        const relGrid = document.getElementById("rel-services-grid");

        legalServices.forEach(s => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `
                <div class="service-card-title">${s.title}</div>
                ${s.desc ? `<div class="service-card-desc">${s.desc}</div>` : ""}
            `;
            card.addEventListener("click", () => selectServiceItem(s, card, "Legal"));
            legalGrid.appendChild(card);
        });

        relServices.forEach(s => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `
                <div class="service-card-title">${s.title}</div>
                ${s.desc ? `<div class="service-card-desc">${s.desc}</div>` : ""}
            `;
            card.addEventListener("click", () => selectServiceItem(s, card, "Relationship"));
            relGrid.appendChild(card);
        });
    }

    function selectServiceItem(service, cardEl, category) {
        selectedService = service;
        selectedCategory = category;

        document.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
        cardEl.classList.add("selected");

        if (subOptions) subOptions.style.display = "block";
        if (btnNext1) btnNext1.removeAttribute("disabled");

        // Render duration chips (Strictly 60 Minutes / 1 Hour)
        if (durationContainer) {
            durationContainer.innerHTML = "";
            const durs = [60];
            durs.forEach(dur => {
                const chip = document.createElement("button");
                chip.className = `so-chip ${dur === selectedDuration ? "selected" : ""}`;
                chip.textContent = `${dur} Minutes`;
                chip.addEventListener("click", () => {
                    selectedDuration = dur;
                    document.querySelectorAll("#duration-options .so-chip").forEach(c => c.classList.remove("selected"));
                    chip.classList.add("selected");
                    updateSummary();
                });
                durationContainer.appendChild(chip);
            });
        }
        updateSummary();
    }

    // Mode chips
    modeChips.forEach(chip => {
        chip.addEventListener("click", () => {
            modeChips.forEach(c => c.classList.remove("selected"));
            chip.classList.add("selected");
            selectedMode = chip.getAttribute("data-mode") || "Online Consultation";
            updateSummary();
        });
    });

    // Calendar & Slots
    const calDates = document.getElementById("cal-dates");
    const calMonthEl = document.getElementById("cal-month");
    const timeGrid = document.getElementById("time-grid");
    const calPrev = document.getElementById("cal-prev");
    const calNext = document.getElementById("cal-next");

    let currentCalDate = new Date();
    let selectedDateIso = null;
    let selectedTimeValue = null;

    function renderCalendar(date) {
        if (!calDates || !calMonthEl) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        calMonthEl.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0,0,0,0);

        calDates.innerHTML = "";

        // Empty padding slots
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            calDates.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayDate = new Date(year, month, d);
            const isPast = dayDate < today;
            const isSunday = dayDate.getDay() === 0;
            const isBlocked = window.KM_SUPABASE && window.KM_SUPABASE.isDateAvailable ? !window.KM_SUPABASE.isDateAvailable(dayDate) : false;
            const isDisabled = isPast || isSunday || isBlocked;

            const dateBtn = document.createElement("div");
            dateBtn.className = `cal-date ${isDisabled ? "disabled" : ""}`;
            dateBtn.textContent = d.toString();

            if (!isDisabled) {
                dateBtn.addEventListener("click", () => {
                    document.querySelectorAll(".cal-date").forEach(el => el.classList.remove("selected"));
                    dateBtn.classList.add("selected");
                    selectedDate = `${d} ${monthNames[month]} ${year}`;
                    selectedDateIso = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                    renderTimeSlots(dayDate);
                    updateSummary();
                });
            }

            calDates.appendChild(dateBtn);
        }
    }

    async function renderTimeSlots(dateObj) {
        if (!timeGrid) return;
        timeGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:16px; font-size:0.85rem; color:var(--text-muted);">Checking slot availability in Indian Standard Time (IST)...</div>`;
        
        let availableSlots = [
            { time: "10:00:00", label: "10:00 AM" },
            { time: "11:15:00", label: "11:15 AM" },
            { time: "12:30:00", label: "12:30 PM" },
            { time: "13:45:00", label: "01:45 PM" },
            { time: "15:00:00", label: "03:00 PM" },
            { time: "16:15:00", label: "04:15 PM" },
            { time: "17:30:00", label: "05:30 PM" }
        ];

        if (window.KM_SUPABASE && window.KM_SUPABASE.getAvailableSlots && dateObj) {
            try {
                const dateStr = dateObj.toISOString().slice(0, 10);
                const dbSlots = await window.KM_SUPABASE.getAvailableSlots(dateStr);
                if (Array.isArray(dbSlots)) {
                    availableSlots = dbSlots;
                }
            } catch (e) {
                console.debug("[Consultation] Slots fallback", e);
            }
        }

        if (!availableSlots || availableSlots.length === 0) {
            timeGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:22px 18px; background:var(--cream); border:1px solid var(--border-color); border-radius:var(--radius-sm);" aria-live="polite">
                    <div style="font-weight:600; color:var(--black); margin-bottom:6px;">No available slots for this date</div>
                    <div style="font-size:0.86rem; color:var(--muted); line-height:1.5;">Chambers are closed or in active court proceedings on this date. Please select another date from the calendar or <a href="contact.html" style="color:var(--gold); text-decoration:underline;">contact chambers</a> for urgent scheduling.</div>
                </div>
            `;
            if (btnNext2) btnNext2.setAttribute("disabled", "true");
            return;
        }

        timeGrid.innerHTML = "";
        availableSlots.forEach(slot => {
            const slotLabel = typeof slot === "object" ? slot.label : slot;
            const slotVal = typeof slot === "object" ? slot.time : slot;
            const slotEl = document.createElement("div");
            slotEl.className = "time-slot";
            slotEl.textContent = slotLabel;
            slotEl.addEventListener("click", () => {
                document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
                slotEl.classList.add("selected");
                selectedTime = slotLabel;
                selectedTimeValue = slotVal;
                if (btnNext2) btnNext2.removeAttribute("disabled");
                updateSummary();
            });
            timeGrid.appendChild(slotEl);
        });

        const tzNote = document.createElement("div");
        tzNote.style.cssText = "grid-column:1/-1; font-size:0.78rem; color:var(--muted); margin-top:8px;";
        tzNote.textContent = "All times displayed in Indian Standard Time (IST / UTC+05:30). Sessions conducted via Google Meet or in-person at chambers.";
        timeGrid.appendChild(tzNote);
    }

    if (calPrev) calPrev.addEventListener("click", () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        renderCalendar(currentCalDate);
    });
    if (calNext) calNext.addEventListener("click", () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendar(currentCalDate);
    });

    renderCalendar(currentCalDate);

    // Navigation between steps
    window.goToStep = function(stepNum) {
        currentStep = stepNum;
        document.querySelectorAll(".bk-step").forEach((step, idx) => {
            step.classList.toggle("active", idx + 1 === stepNum);
        });
        document.querySelectorAll(".bk-step-ind").forEach((ind, idx) => {
            ind.classList.toggle("active", idx + 1 === stepNum);
            if (idx + 1 < stepNum) {
                ind.classList.add("completed");
            } else {
                ind.classList.remove("completed");
            }
        });
        const mobileProg = document.getElementById("mobile-progress");
        const stepLabels = ["CONSULTATION", "DATE & TIME", "YOUR DETAILS", "REVIEW & CONFIRM"];
        if (mobileProg) mobileProg.textContent = `STEP ${stepNum} OF 4: ${stepLabels[stepNum - 1]}`;
        window.scrollTo({ top: 200, behavior: "smooth" });
    };

    // Interactive step indicators allowing return without data loss
    document.querySelectorAll(".bk-step-ind").forEach((ind, idx) => {
        ind.style.cursor = "pointer";
        ind.addEventListener("click", () => {
            const targetStep = idx + 1;
            if (targetStep === 1) {
                goToStep(1);
            } else if (targetStep === 2 && selectedService) {
                goToStep(2);
            } else if (targetStep === 3 && selectedDate && selectedTime) {
                goToStep(3);
            } else if (targetStep === 4 && fName?.value.trim() && fEmail?.value.includes("@") && fPhone?.value.trim()) {
                goToStep(4);
            }
        });
    });

    if (btnNext1) btnNext1.addEventListener("click", () => goToStep(2));
    if (btnNext2) btnNext2.addEventListener("click", () => goToStep(3));

    // Step 3 Validation & Submit
    const fName = document.getElementById("f-name");
    const fEmail = document.getElementById("f-email");
    const fPhone = document.getElementById("f-phone");
    const fDesc = document.getElementById("f-desc");
    const btnNext3 = document.getElementById("btn-next-3");

    // Real-time inline field validation feedback
    function validateField(field, errId, condition, errorMsg) {
        if (!field) return true;
        const errEl = document.getElementById(errId);
        if (!condition) {
            if (errEl) {
                errEl.classList.add("visible");
                errEl.classList.add("field-inline-error");
                if (errorMsg) errEl.textContent = errorMsg;
            }
            field.style.borderColor = "var(--error)";
            return false;
        } else {
            if (errEl) {
                errEl.classList.remove("visible");
                errEl.classList.remove("field-inline-error");
            }
            field.style.borderColor = "";
            return true;
        }
    }
    const validateFieldInline = validateField;

    fName?.addEventListener("blur", () => validateField(fName, "err-name", fName.value.trim().length >= 2, "Please enter your full name as per official records"));
    fEmail?.addEventListener("blur", () => validateField(fEmail, "err-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value.trim()), "Valid email address required"));
    fPhone?.addEventListener("blur", () => validateField(fPhone, "err-phone", /^[0-9]{10}$/.test(fPhone.value.trim().replace(/\D/g, "")), "Valid 10-digit mobile number required"));
    fDesc?.addEventListener("blur", () => validateField(fDesc, "err-desc", fDesc.value.trim().length >= 5, "Please provide a brief description of your matter."));

    if (btnNext3) {
        btnNext3.addEventListener("click", () => {
            let valid = true;
            if (!validateField(fName, "err-name", fName && fName.value.trim().length >= 2, "Please enter your full name as per official records")) valid = false;
            if (!validateField(fEmail, "err-email", fEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value.trim()), "Valid email address required")) valid = false;
            if (!validateField(fPhone, "err-phone", fPhone && /^[0-9]{10}$/.test(fPhone.value.trim().replace(/\D/g, "")), "Valid 10-digit mobile number required")) valid = false;
            if (!validateField(fDesc, "err-desc", fDesc && fDesc.value.trim().length >= 5, "Please provide a brief description of your matter.")) valid = false;

            if (valid) {
                // Populate review step 4 with distinct Edit options
                const revService = document.getElementById("rev-service");
                const revDatetime = document.getElementById("rev-datetime");
                const revMode = document.getElementById("rev-mode");
                const revName = document.getElementById("rev-name");
                const revEmail = document.getElementById("rev-email");
                const revPhone = document.getElementById("rev-phone");

                if (revService) revService.innerHTML = `${selectedService ? selectedService.title : "--"} <button type="button" class="rev-edit-btn" data-edit-step="1" onclick="goToStep(1)">Edit Focus</button>`;
                if (revDatetime) revDatetime.innerHTML = `${selectedDate} at ${selectedTime} (IST) <button type="button" class="rev-edit-btn" data-edit-step="2" onclick="goToStep(2)">Edit Slot</button>`;
                if (revMode) revMode.innerHTML = `${selectedMode} <button type="button" class="rev-edit-btn" data-edit-step="1" onclick="goToStep(1)">Edit Mode</button>`;
                if (revName) revName.innerHTML = `${fName.value.trim()} <button type="button" class="rev-edit-btn" data-edit-step="3" onclick="goToStep(3)">Edit</button>`;
                if (revEmail) revEmail.innerHTML = `${fEmail.value.trim()} <button type="button" class="rev-edit-btn" data-edit-step="3" onclick="goToStep(3)">Edit</button>`;
                if (revPhone) revPhone.innerHTML = `${fPhone.value.trim()} <button type="button" class="rev-edit-btn" data-edit-step="3" onclick="goToStep(3)">Edit</button>`;

                goToStep(4);
            }
        });
    }

    let isSubmitting = false;
    if (btnRequestConsultation) {
        btnRequestConsultation.addEventListener("click", async () => {
            // Prevent duplicate clicks
            if (isSubmitting) return;
            isSubmitting = true;
            btnRequestConsultation.setAttribute("disabled", "true");
            btnRequestConsultation.innerHTML = "<span>Securing Appointment & Connecting to PhonePe...</span>";

            const bookingPayload = {
                full_name: fName?.value.trim() || "Client",
                email: fEmail?.value.trim() || "",
                phone: fPhone?.value.trim() || "",
                whatsapp: document.getElementById("f-whatsapp")?.value.trim() || null,
                country: document.getElementById("f-country")?.value.trim() || null,
                preferred_contact: document.getElementById("f-contact")?.value || "Email",
                service_id: selectedService ? (selectedService.id || selectedService.title) : null,
                service_title: selectedService ? selectedService.title : "General Legal Consultation",
                consultation_type: selectedCategory === "Legal" ? "LEGAL" : "RELATIONSHIP",
                booking_date: selectedDateIso,
                start_time: selectedTimeValue || selectedTime,
                duration_minutes: selectedDuration,
                mode: selectedMode,
                short_description: fDesc?.value.trim() || ""
            };

            try {
                const bookingResult = await createBooking(bookingPayload);
                if (bookingResult && bookingResult.success) {
                    sessionStorage.setItem("km_booking_ref", bookingResult.booking_reference);
                    sessionStorage.setItem("km_booking_token", bookingResult.confirmation_token);
                    sessionStorage.setItem("km_booking_summary", JSON.stringify({
                        booking_reference: bookingResult.booking_reference,
                        confirmation_token: bookingResult.confirmation_token,
                        service_title: bookingResult.service_title || selectedService.title,
                        date: selectedDate,
                        time: selectedTime,
                        duration: selectedDuration,
                        mode: selectedMode,
                        fee: bookingResult.fee || siteConfig.defaultFee
                    }));
                    window.location.href = `payment.html?token=${encodeURIComponent(bookingResult.confirmation_token)}&ref=${encodeURIComponent(bookingResult.booking_reference)}`;
                } else {
                    throw new Error(bookingResult?.message || "Could not reserve consultation.");
                }
            } catch (err) {
                alert(err.message || "Could not complete booking reservation. Please select another slot.");
                isSubmitting = false;
                btnRequestConsultation.removeAttribute("disabled");
                btnRequestConsultation.innerHTML = "<span>Continue to Secure Payment &rarr;</span>";
            }
        });
    }
}

// ==========================================================================
// 11. PAYMENT PAGE COMPONENT (PhonePe Production Integration)
// ==========================================================================

async function initPaymentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || sessionStorage.getItem("km_booking_token");
    const ref = urlParams.get("ref") || sessionStorage.getItem("km_booking_ref");
    const merchantTxId = urlParams.get("merchantTxId");
    const simulated = urlParams.get("simulated") === "true";

    const sumType = document.getElementById("sum-type");
    const sumDate = document.getElementById("sum-date");
    const sumTime = document.getElementById("sum-time");
    const sumDur = document.getElementById("sum-dur");
    const sumMode = document.getElementById("sum-mode");
    const sumRef = document.getElementById("sum-ref");
    const sumTotal = document.getElementById("sum-total");
    const btnPay = document.getElementById("btn-pay");
    const pyBadge = document.getElementById("py-badge");
    const paymentStatusBox = document.getElementById("payment-status-box");

    // Populate Sidebar Summary from Session or Token
    const rawSummary = sessionStorage.getItem("km_booking_summary");
    let summary = null;
    if (rawSummary) {
        try { summary = JSON.parse(rawSummary); } catch (e) {}
    }

    if (summary) {
        if (sumType) sumType.textContent = summary.service_title;
        if (sumDate) sumDate.textContent = summary.date;
        if (sumTime) sumTime.textContent = summary.time;
        if (sumDur) sumDur.textContent = `${summary.duration} Minutes`;
        if (sumMode) sumMode.textContent = summary.mode;
        if (sumRef) sumRef.textContent = summary.booking_reference;
        if (sumTotal) sumTotal.textContent = `₹${(summary.fee || 1000).toLocaleString("en-IN")}`;
        if (btnPay) btnPay.innerHTML = `<span>Pay via PhonePe (₹${(summary.fee || 1000).toLocaleString("en-IN")}) &rarr;</span>`;
    } else if (ref) {
        if (sumRef) sumRef.textContent = ref;
    }

    // SCENARIO 1: Return from PhonePe Gateway (merchantTxId present in URL)
    if (merchantTxId) {
        if (btnPay) {
            btnPay.setAttribute("disabled", "true");
            btnPay.innerHTML = "<span>Verifying Transaction...</span>";
        }
        if (paymentStatusBox) {
            paymentStatusBox.innerHTML = `
                <div style="background:var(--cream); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; align-items:center; gap:12px;">
                    <span class="payment-status-badge status-pending">VERIFYING WITH PHONEPE</span>
                    <span style="font-size:0.88rem; color:var(--text-muted);">Reconciling transaction with PhonePe gateway channels...</span>
                </div>
            `;
        }

        try {
            async function verifyPayment(mTxId, tok, sim) {
                return await window.KM_SUPABASE.verifyPhonePePayment(mTxId, tok, sim);
            }
            const verifyResult = await verifyPayment(merchantTxId, token, simulated);

            if (verifyResult && (verifyResult.status === "PAID" || verifyResult.payment_status === "PAID" || verifyResult.success)) {
                if (pyBadge) {
                    pyBadge.className = "payment-status-badge status-paid";
                    pyBadge.textContent = "VERIFIED";
                }
                if (paymentStatusBox) {
                    paymentStatusBox.innerHTML = `
                        <div style="background:rgba(46,125,50,0.08); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid #2e7d32; display:flex; align-items:center; gap:12px;">
                            <span class="payment-status-badge status-paid">PAID & VERIFIED</span>
                            <span style="font-size:0.88rem; color:#2e7d32; font-weight:500;">Payment confirmed! Redirecting to your confirmation dossier...</span>
                        </div>
                    `;
                }

                // Redirect securely to confirmation page
                setTimeout(() => {
                    const finalToken = verifyResult.confirmation_token || token;
                    const finalRef = verifyResult.booking_reference || ref;
                    window.location.href = `confirmation.html?token=${encodeURIComponent(finalToken)}&ref=${encodeURIComponent(finalRef)}`;
                }, 1200);
                return;
            } else if (verifyResult && verifyResult.status === "FAILED") {
                if (pyBadge) {
                    pyBadge.className = "payment-status-badge status-pending";
                    pyBadge.textContent = "FAILED";
                }
                if (paymentStatusBox) {
                    paymentStatusBox.innerHTML = `
                        <div style="background:rgba(211,47,47,0.08); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid #d32f2f;">
                            <div style="font-weight:600; color:#d32f2f; margin-bottom:4px;">Payment Not Completed</div>
                            <div style="font-size:0.85rem; color:#71717A;">The transaction was not completed or declined by your bank/UPI provider. You may retry below.</div>
                        </div>
                    `;
                }
                if (btnPay) {
                    btnPay.removeAttribute("disabled");
                    btnPay.innerHTML = "<span>Retry Payment via PhonePe &rarr;</span>";
                }
            } else {
                // Pending Verification
                if (paymentStatusBox) {
                    paymentStatusBox.innerHTML = `
                        <div style="background:var(--cream); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                            <div style="font-weight:600; color:var(--black); margin-bottom:4px;">Verification Pending</div>
                            <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">The gateway reports the transaction is still pending settlement.</div>
                            <button type="button" class="btn btn-outline btn-sm" onclick="window.location.reload()"><span>Check Status Again</span></button>
                        </div>
                    `;
                }
                if (btnPay) {
                    btnPay.removeAttribute("disabled");
                    btnPay.innerHTML = "<span>Retry Payment via PhonePe &rarr;</span>";
                }
            }
        } catch (vErr) {
            console.error("[Payment] Verification exception:", vErr);
            if (paymentStatusBox) {
                paymentStatusBox.innerHTML = `
                    <div style="background:rgba(211,47,47,0.08); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid #d32f2f; font-size:0.88rem; color:#d32f2f;">
                        Unable to verify transaction. Please refresh or contact chambers at contact@kritimalviya.com.
                    </div>
                `;
            }
            if (btnPay) {
                btnPay.removeAttribute("disabled");
                btnPay.innerHTML = "<span>Retry Payment via PhonePe &rarr;</span>";
            }
        }
    }

    // SCENARIO 2: Initiate Payment via PhonePe
    let isPaymentProcessing = false;
    window.addEventListener("beforeunload", (e) => {
        if (isPaymentProcessing) {
            e.preventDefault();
            e.returnValue = "Your payment transaction is in progress. Leaving this page may cancel your consultation booking.";
            return e.returnValue;
        }
    });

    if (btnPay) {
        btnPay.addEventListener("click", async () => {
            btnPay.setAttribute("disabled", "true");
            btnPay.innerHTML = "<span>Connecting to PhonePe Gateway...</span>";
            isPaymentProcessing = true;
            if (paymentStatusBox) {
                paymentStatusBox.innerHTML = `
                    <div style="background:var(--cream); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; align-items:center; gap:12px;">
                        <span class="payment-status-badge status-pending">CONNECTING</span>
                        <span style="font-size:0.88rem; color:var(--text-muted);">Opening encrypted PhonePe payment channel... Please do not close or refresh this tab.</span>
                    </div>
                `;
            }

            try {
                const bookingRef = ref || (summary ? summary.booking_reference : null);
                if (!bookingRef || !token) {
                    throw new Error("Missing booking reference. Please return to consultation page to reserve a slot.");
                }

                const paymentResult = await startPhonePePayment(bookingRef, token);

                if (paymentResult && paymentResult.success && paymentResult.redirectUrl) {
                    window.location.href = paymentResult.redirectUrl;
                } else {
                    throw new Error(paymentResult?.message || "Could not initiate payment session.");
                }
            } catch (err) {
                isPaymentProcessing = false;
                console.error("[Payment] Initiation error:", err);
                if (paymentStatusBox) {
                    paymentStatusBox.innerHTML = `
                        <div style="background:rgba(211,47,47,0.08); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid #d32f2f; font-size:0.88rem; color:#d32f2f;">
                            ${err.message || "Failed to initialize payment gateway."}
                        </div>
                    `;
                }
                btnPay.removeAttribute("disabled");
                btnPay.innerHTML = "<span>Continue to Secure Payment (₹1,000) &rarr;</span>";
            }
        });
    }
}

// ==========================================================================
// 12. CONFIRMATION PAGE COMPONENT (Access Controlled)
// ==========================================================================

async function initConfirmationPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || sessionStorage.getItem("km_booking_token");

    const orderIdEl = document.getElementById("order-id-display");
    const confService = document.getElementById("conf-service");
    const confDatetime = document.getElementById("conf-datetime");
    const confMode = document.getElementById("conf-mode");
    const confClient = document.getElementById("conf-client");
    const confAmount = document.getElementById("conf-amount");
    const copyBtn = document.getElementById("copy-order-btn");

    if (!token) {
        if (orderIdEl) orderIdEl.textContent = "KM-NOT-FOUND";
        if (confService) confService.textContent = "No active booking token";
        if (confDatetime) confDatetime.textContent = "--";
        if (confMode) confMode.textContent = "--";
        if (confClient) confClient.textContent = "--";
        if (confAmount) confAmount.textContent = "--";
        return;
    }

    try {
        const booking = await window.KM_SUPABASE.getConfirmedBooking(token);

        if (booking && booking.success) {
            if (orderIdEl) orderIdEl.textContent = booking.booking_reference;
            if (confService) confService.textContent = booking.service_title;
            if (confDatetime) confDatetime.textContent = `${booking.date} at ${booking.start_time} (IST)`;
            if (confMode) confMode.textContent = booking.mode;
            if (confClient) confClient.textContent = booking.client_name;
            if (confAmount) confAmount.textContent = `₹${Number(booking.amount || 1000).toLocaleString("en-IN")}`;
        } else {
            // Check session fallback for preview / test mode
            const rawConfirmed = sessionStorage.getItem("km_booking_summary");
            if (rawConfirmed) {
                const s = JSON.parse(rawConfirmed);
                if (orderIdEl) orderIdEl.textContent = s.booking_reference;
                if (confService) confService.textContent = s.service_title;
                if (confDatetime) confDatetime.textContent = `${s.date} at ${s.time} (IST)`;
                if (confMode) confMode.textContent = s.mode;
                if (confClient) confClient.textContent = "Valued Client";
                if (confAmount) confAmount.textContent = `₹${(s.fee || 1000).toLocaleString("en-IN")}`;
            } else {
                if (orderIdEl) orderIdEl.textContent = "KM-UNAVAILABLE";
                if (confService) confService.textContent = "Booking token expired or not found";
            }
        }
    } catch (e) {
        console.error("[Confirmation] Error fetching booking dossier:", e);
    }

    if (copyBtn && orderIdEl) {
        copyBtn.addEventListener("click", () => {
            const txt = orderIdEl.textContent;
            navigator.clipboard.writeText(txt).then(() => {
                copyBtn.textContent = "COPIED!";
                setTimeout(() => { copyBtn.textContent = "COPY"; }, 2000);
            });
        });
    }
}

// ==========================================================================
// 13. CONTACT PAGE COMPONENT
// ==========================================================================

function initContactPage() {
    const contactForm = document.getElementById("contact-form");
    const statusBox = document.getElementById("contact-status");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector("button[type='submit']");
        if (btn) {
            btn.setAttribute("disabled", "true");
            btn.innerHTML = "<span>Sending Message...</span>";
        }

        const formData = {
            name: document.getElementById("c-name")?.value || "",
            email: document.getElementById("c-email")?.value || "",
            phone: document.getElementById("c-phone")?.value || "",
            message: document.getElementById("c-message")?.value || ""
        };

        const res = await submitContactForm(formData);

        if (statusBox) {
            statusBox.style.display = "block";
            statusBox.innerHTML = `<div style="padding:16px; background:rgba(46,125,50,0.1); border:1px solid var(--success); color:var(--success); border-radius:4px; font-weight:500;">Thank you. Your inquiry has been sent to Adv. Kriti Malviya's office.</div>`;
        }

        contactForm.reset();
        if (btn) {
            btn.removeAttribute("disabled");
            btn.innerHTML = "<span>Send Message</span>";
        }
    });
}

// ==========================================================================
// 14. SERVICES PAGES COMPONENT
// ==========================================================================

function initServicesPage() {
    console.info("[Page] Services page initialized.");

    // Inject mobile sticky booking CTA bar if not already in DOM
    if (!document.querySelector(".mobile-sticky-booking-bar")) {
        const stickyBar = document.createElement("div");
        stickyBar.className = "mobile-sticky-booking-bar";
        stickyBar.setAttribute("role", "complementary");
        stickyBar.setAttribute("aria-label", "Consultation quick booking action");
        stickyBar.innerHTML = `
            <div class="msb-text">
                <span class="msb-label">Consultation Booking</span>
                <span class="msb-fee">₹1,000 <span style="font-size:0.75rem; font-family:var(--font-sans); color:var(--muted); font-weight:normal;">/ session</span></span>
            </div>
            <a href="../consultation.html" class="btn btn-primary btn-sm msb-btn"><span>Book Consultation &rarr;</span></a>
        `;
        document.body.appendChild(stickyBar);
    }
}

// ==========================================================================
// 14B. CONTEXTUAL ONBOARDING & GUIDED TOUR ENGINE
// ==========================================================================

function initGuidedTourSystem() {
    const isHome = Boolean(document.querySelector("[data-page='home']"));
    const isConsultation = Boolean(document.querySelector("[data-page='consultation']"));

    // Step definitions for Homepage
    const homeSteps = [
        {
            target: ".nav-links",
            fallbackTarget: ".brand",
            title: "Chambers Practice Catalog",
            body: "Adv. Kriti Malviya provides dual-focus expertise: High Court civil litigation & banking due diligence alongside confidential relationship counselling. Browse specialized practice areas here.",
            badge: "Step 1 of 4"
        },
        {
            target: ".hero-stats",
            fallbackTarget: ".hero-content",
            title: "Proven Practice Credentials",
            body: "Over 10+ years of active legal practice with 500+ institutional banking search reports completed and 20+ successful commercial and family mediations.",
            badge: "Step 2 of 4"
        },
        {
            target: ".header-cta",
            fallbackTarget: ".hero-actions",
            title: "Transparent Consultation Booking",
            body: "Reserve a structured 60-minute private consultation. Fixed ₹1,000 fee with immediate scheduling and encrypted PhonePe payment.",
            badge: "Step 3 of 4"
        },
        {
            target: ".footer-nav-col",
            fallbackTarget: ".footer",
            title: "Chambers Coordinates & Support",
            body: "Have questions before booking? Access our full directory, office hours, direct phone, or open our 'Need Help?' guide anytime.",
            badge: "Step 4 of 4"
        }
    ];

    // Step definitions for Consultation Booking
    const consultationSteps = [
        {
            target: "#services-container",
            fallbackTarget: ".bk-main",
            title: "1. Select Consultation Focus",
            body: "Choose your practice area: Legal Counselling (Divorce, Civil, Due Diligence) or Relationship Support. All appointments have a transparent ₹1,000 fixed fee.",
            badge: "Step 1 of 4"
        },
        {
            target: ".calendar-wrap",
            fallbackTarget: "#step-2",
            title: "2. Live Availability & Time Slot",
            body: "Select an available date on chambers calendar. Live morning and afternoon slots are listed in Indian Standard Time (IST).",
            badge: "Step 2 of 4"
        },
        {
            target: ".form-grid",
            fallbackTarget: "#step-3",
            title: "3. Confidential Intake Information",
            body: "Enter your contact information. All details are kept strictly confidential under attorney-client privilege. Your video meeting link will be sent here.",
            badge: "Step 3 of 4"
        },
        {
            target: ".bk-sidebar",
            fallbackTarget: "#step-4",
            title: "4. Review & PhonePe Checkout",
            body: "Verify all appointment details with one-click edit links, then proceed to PhonePe's secure gateway (UPI, Cards, Net Banking) to confirm your appointment.",
            badge: "Step 4 of 4"
        }
    ];

    const currentTourSteps = isConsultation ? consultationSteps : homeSteps;

    // 1. First-Visit Welcome Tour Prompt
    function checkFirstVisitPrompt() {
        if (!isHome && !isConsultation) return;

        const tourState = localStorage.getItem("km_tour_state");
        if (tourState) return; // Previously dismissed or completed

        setTimeout(() => {
            if (document.getElementById("km-tour-prompt")) return;

            const promptEl = document.createElement("div");
            promptEl.id = "km-tour-prompt";
            promptEl.className = "km-tour-prompt";
            promptEl.setAttribute("role", "region");
            promptEl.setAttribute("aria-label", "Welcome Guide");
            promptEl.innerHTML = `
                <div class="km-tour-prompt-badge">FIRST-TIME VISITOR?</div>
                <div class="km-tour-prompt-title">Welcome. Let’s help you get started.</div>
                <div class="km-tour-prompt-desc">Take a 30-second tour of chambers services, advocate credentials, and private consultation booking.</div>
                <div class="km-tour-prompt-actions">
                    <button type="button" class="btn btn-primary btn-sm" id="km-btn-start-tour"><span>Guide me</span></button>
                    <button type="button" class="btn btn-outline btn-sm" id="km-btn-dismiss-tour"><span>I'll explore myself</span></button>
                </div>
                <button type="button" class="km-tour-prompt-close" id="km-btn-close-prompt" aria-label="Dismiss tour">&times;</button>
            `;
            document.body.appendChild(promptEl);

            document.getElementById("km-btn-start-tour")?.addEventListener("click", () => {
                localStorage.setItem("km_tour_state", "started");
                dismissPrompt();
                startTour(0);
            });

            document.getElementById("km-btn-dismiss-tour")?.addEventListener("click", () => {
                localStorage.setItem("km_tour_state", "dismissed");
                dismissPrompt();
            });

            document.getElementById("km-btn-close-prompt")?.addEventListener("click", () => {
                localStorage.setItem("km_tour_state", "dismissed");
                dismissPrompt();
            });
        }, 600);
    }

    function dismissPrompt() {
        const promptEl = document.getElementById("km-tour-prompt");
        if (promptEl) {
            promptEl.classList.add("km-prompt-hidden");
            setTimeout(() => promptEl.remove(), 400);
        }
    }

    // 2. Interactive Spotlight Tour
    let currentStepIdx = 0;
    let tourBackdrop = null;
    let tourHighlight = null;
    let tourCard = null;

    function createTourElements() {
        if (!tourBackdrop) {
            tourBackdrop = document.createElement("div");
            tourBackdrop.className = "km-tour-backdrop";
            document.body.appendChild(tourBackdrop);
            tourBackdrop.addEventListener("click", skipTour);
        }

        if (!tourHighlight) {
            tourHighlight = document.createElement("div");
            tourHighlight.className = "km-tour-highlight-ring";
            document.body.appendChild(tourHighlight);
        }

        if (!tourCard) {
            tourCard = document.createElement("div");
            tourCard.className = "km-tour-card";
            tourCard.setAttribute("role", "dialog");
            tourCard.setAttribute("aria-modal", "true"); // Enforces aria-modal="true" dialog accessibility
            tourCard.setAttribute("aria-label", "Guided Tour");
            document.body.appendChild(tourCard);
        }
    }

    function startTour(stepIdx = 0) {
        currentStepIdx = stepIdx;
        createTourElements();
        showStep(currentStepIdx);
        tourBackdrop.classList.add("active");
        tourCard.classList.add("active");
        window.addEventListener('keydown', handleKeyNavigation);
        window.addEventListener("resize", handleTourReposition);
        window.addEventListener("scroll", handleTourReposition, { passive: true });
    }

    function showStep(idx) {
        if (idx < 0 || idx >= currentTourSteps.length) {
            finishTour();
            return;
        }
        currentStepIdx = idx;
        const step = currentTourSteps[idx];
        const isFirst = idx === 0;
        const isLast = idx === currentTourSteps.length - 1;

        let targetEl = document.querySelector(step.target);
        if (!targetEl && step.fallbackTarget) {
            targetEl = document.querySelector(step.fallbackTarget);
        }

        tourCard.innerHTML = `
            <div class="km-tour-card-header">
                <span class="km-tour-step-badge">${step.badge || `Step ${idx + 1} of ${currentTourSteps.length}`}</span>
                <button type="button" class="km-tour-card-close" id="km-tour-close-btn" aria-label="Close tour">&times;</button>
            </div>
            <div class="km-tour-card-title">${step.title}</div>
            <div class="km-tour-card-body">${step.body}</div>
            <div class="km-tour-card-footer">
                <button type="button" class="km-tour-btn-skip" id="km-tour-skip-btn">Skip Tour</button>
                <div class="km-tour-nav-buttons">
                    ${!isFirst ? `<button type="button" class="btn btn-outline btn-sm" id="km-tour-prev-btn"><span>&larr; Back</span></button>` : ""}
                    <button type="button" class="btn btn-primary btn-sm" id="km-tour-next-btn"><span>${isLast ? "Finish Tour ✓" : "Next &rarr;"}</span></button>
                </div>
            </div>
        `;

        document.getElementById("km-tour-close-btn")?.addEventListener("click", skipTour);
        document.getElementById("km-tour-skip-btn")?.addEventListener("click", skipTour);
        document.getElementById("km-tour-prev-btn")?.addEventListener("click", () => showStep(currentStepIdx - 1));
        document.getElementById("km-tour-next-btn")?.addEventListener("click", () => showStep(currentStepIdx + 1));

        positionTourElements(targetEl);
    }

    function positionTourElements(targetEl) {
        if (!targetEl || !tourCard) return;

        const rect = targetEl.getBoundingClientRect();
        if (rect.top < 60 || rect.bottom > window.innerHeight - 60) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        setTimeout(() => {
            const r = targetEl.getBoundingClientRect();
            if (tourHighlight) {
                tourHighlight.style.display = "block";
                tourHighlight.style.top = `${r.top + window.scrollY - 6}px`;
                tourHighlight.style.left = `${r.left + window.scrollX - 6}px`;
                tourHighlight.style.width = `${r.width + 12}px`;
                tourHighlight.style.height = `${r.height + 12}px`;
            }

            const cardWidth = Math.min(360, window.innerWidth - 32);
            let top = r.bottom + 16;
            let left = r.left + (r.width / 2) - (cardWidth / 2);

            if (left < 16) left = 16;
            if (left + cardWidth > window.innerWidth - 16) {
                left = window.innerWidth - cardWidth - 16;
            }

            if (top + 240 > window.innerHeight) {
                top = Math.max(16, r.top - 250);
            }

            tourCard.style.top = `${Math.max(16, top)}px`;
            tourCard.style.left = `${left}px`;
        }, 120);
    }

    function handleTourReposition() {
        if (!tourCard || !tourCard.classList.contains("active")) return;
        const step = currentTourSteps[currentStepIdx];
        if (!step) return;
        const targetEl = document.querySelector(step.target) || document.querySelector(step.fallbackTarget);
        positionTourElements(targetEl);
    }

    function handleKeyNavigation(e) {
        if (e.key === "Escape") skipTour();
        if (e.key === "ArrowRight") showStep(currentStepIdx + 1);
        if (e.key === "ArrowLeft") showStep(currentStepIdx - 1);
    }

    function skipTour() {
        cleanupTour();
        localStorage.setItem("km_tour_state", "skipped");
    }

    function finishTour() {
        cleanupTour();
        localStorage.setItem("km_tour_state", "completed");
    }

    function cleanupTour() {
        if (tourBackdrop) tourBackdrop.classList.remove("active");
        if (tourCard) tourCard.classList.remove("active");
        if (tourHighlight) tourHighlight.style.display = "none";
        window.removeEventListener("keydown", handleKeyNavigation);
        window.removeEventListener("resize", handleTourReposition);
        window.removeEventListener("scroll", handleTourReposition);
    }

    // Initialize first visit prompt
    checkFirstVisitPrompt();

    // Attach listeners for any elements with .js-start-tour class
    document.querySelectorAll(".js-start-tour").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            dismissPrompt();
            startTour(0);
        });
    });

    // Expose global controller
    window.KM_TOUR = {
        startTour: (stepIdx = 0) => startTour(stepIdx),
        resetTour: () => {
            localStorage.removeItem("km_tour_state");
            checkFirstVisitPrompt();
        },
        resetTourState: () => {
            localStorage.removeItem("km_tour_state");
            checkFirstVisitPrompt();
        },
        skipTour,
        finishTour,
        getCurrentStep: () => currentStepIdx,
        getTourState: () => localStorage.getItem("km_tour_state")
    };
}

// ==========================================================================
// 14C. GLOBAL CONTEXTUAL HELP DRAWER
// ==========================================================================

function initHelpDrawer() {
    let backdrop = document.getElementById("km-help-backdrop");
    let drawer = document.getElementById("km-help-drawer");

    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "km-help-backdrop";
        backdrop.className = "km-help-backdrop";
        document.body.appendChild(backdrop);
    }

    if (!drawer) {
        drawer = document.createElement("aside");
        drawer.id = "km-help-drawer";
        drawer.className = "km-help-drawer";
        drawer.setAttribute("role", "dialog");
        drawer.setAttribute("aria-modal", "true");
        drawer.setAttribute("aria-label", "Chambers Contextual Help & Guidance");
        drawer.innerHTML = `
            <div class="km-help-header">
                <div class="km-help-title">Chambers Help Guide</div>
                <button type="button" class="km-help-close" id="km-btn-close-help" aria-label="Close help guide">&times;</button>
            </div>
            <div class="km-help-body">
                <div class="km-help-section">
                    <div class="km-help-sec-title">Consultation & Scheduling</div>
                    <p class="km-help-sec-text">All appointments with Adv. Kriti Malviya are private, legally privileged, and structured.</p>
                    <ul class="km-help-list">
                        <li><strong>Fixed Chamber Fee:</strong> ₹1,000 per 60-minute session. No hidden charges.</li>
                        <li><strong>Consultation Formats:</strong> Online Video (Google Meet) or In-person at Chambers.</li>
                        <li><strong>Office Hours:</strong> Monday to Saturday, 10:00 AM – 06:30 PM (IST).</li>
                        <li><strong>Rescheduling:</strong> Permitted with 4+ hours advance notice via phone/email.</li>
                    </ul>
                </div>

                <div class="km-help-section">
                    <div class="km-help-sec-title">PhonePe Payment & Safety</div>
                    <p class="km-help-sec-text">Transactions are processed directly via PhonePe's 256-bit SSL encrypted payment gateway.</p>
                    <ul class="km-help-list">
                        <li><strong>Accepted Methods:</strong> UPI (Google Pay, PhonePe, BHIM, Paytm), Credit/Debit Cards, Net Banking.</li>
                        <li><strong>Instant Confirmation:</strong> Unique reference number (KM-YYYYMMDD-XXXX) is generated upon settlement.</li>
                        <li><strong>Guidelines:</strong> Please do not refresh or click back while PhonePe is completing verification.</li>
                    </ul>
                </div>

                <div class="km-help-section">
                    <div class="km-help-sec-title">Chambers Contact Coordinates</div>
                    <ul class="km-help-list">
                        <li><strong>Jurisdiction & Location:</strong> Bhopal, Madhya Pradesh (High Court of MP & District Courts)</li>
                        <li><strong>Chamber Address:</strong> Chamber 402, High Court Complex, Sector 1, Bhopal, Madhya Pradesh</li>
                        <li><strong>Official Email:</strong> advkritimalviya@gmail.com</li>
                        <li><strong>Telephone:</strong> +91 97705 60777 (Mon–Sat 10:00 AM – 06:30 PM IST)</li>
                        <li><strong>WhatsApp:</strong> +91 97705 60777</li>
                    </ul>
                </div>
            </div>
            <div class="km-help-footer">
                <button type="button" class="btn btn-outline btn-sm js-start-tour" id="km-btn-drawer-tour"><span>Restart Website Tour</span></button>
                <a href="contact.html" class="btn btn-primary btn-sm"><span>Contact Office &rarr;</span></a>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    function openHelp() {
        backdrop.classList.add("active");
        drawer.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeHelp() {
        backdrop.classList.remove("active");
        drawer.classList.remove("active");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".js-open-help").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            openHelp();
        });
    });

    backdrop.addEventListener("click", closeHelp);
    document.getElementById("km-btn-close-help")?.addEventListener("click", closeHelp);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && drawer.classList.contains("active")) {
            closeHelp();
        }
    });

    document.getElementById("km-btn-drawer-tour")?.addEventListener("click", () => {
        closeHelp();
        if (window.KM_TOUR && window.KM_TOUR.startTour) {
            window.KM_TOUR.startTour(0);
        }
    });

    window.KM_HELP = { openHelp, closeHelp };
}

// ==========================================================================
// 15. ADMIN MASTER CONTROL CENTER COMPONENT
// ==========================================================================
// 10. STEP 4 MASTER ADMIN CONTROL CENTER CONTROLLER
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// ==========================================================================

async function initAdminPage() {
    const loadingView = document.getElementById("admin-auth-loading");
    const loginView = document.getElementById("admin-login-view");
    const unauthorizedView = document.getElementById("admin-unauthorized-view");
    const adminLayout = document.getElementById("admin-layout");

    const loginForm = document.getElementById("admin-login-form");
    const loginError = document.getElementById("admin-login-error");
    const emailInput = document.getElementById("admin-email");
    const passwordInput = document.getElementById("admin-password");
    const loginSubmit = document.getElementById("admin-login-submit");

    const logoutBtn = document.getElementById("admin-logout-btn");
    const unauthLogoutBtn = document.getElementById("admin-unauth-logout-btn");

    const userEmailEl = document.getElementById("admin-user-email");
    const userRoleEl = document.getElementById("admin-role-badge");

    const navItems = document.querySelectorAll(".admin-nav-item");
    const viewTitle = document.getElementById("admin-view-title");
    const views = document.querySelectorAll(".admin-view-panel");
    const sidebarToggle = document.getElementById("admin-mobile-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    const drawerOverlay = document.getElementById("admin-drawer-overlay");
    const drawerClose = document.getElementById("admin-drawer-close");
    const modalEl = document.getElementById("admin-modal");

    // Cache current state
    let currentUser = null;
    let currentProfile = null;
    let currentRole = null;
    let currentBookings = [];
    let currentCustomers = [];
    let currentPayments = [];
    let currentServices = [];
    let currentAvailability = [];
    let currentBlockedDates = [];
    let currentGallery = [];
    let currentAchievements = [];
    let currentVideos = [];
    let currentBlogs = [];
    let currentSettings = null;
    let currentUsers = [];
    let currentActivityLogs = [];
    let currentErrorLogs = [];
    let currentReports = [];
    let currentNotifications = [];

    // --- UI Helpers ---
    function showState(state) {
        if (loadingView) loadingView.style.display = state === "loading" ? "flex" : "none";
        if (loginView) loginView.style.display = state === "login" ? "flex" : "none";
        if (unauthorizedView) unauthorizedView.style.display = state === "unauthorized" ? "flex" : "none";
        if (adminLayout) adminLayout.style.display = state === "authenticated" ? "flex" : "none";
    }

    function showToast(message, type = "info") {
        const container = document.getElementById("admin-toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = `admin-toast ${type}`;
        toast.innerHTML = `<span>${type === "success" ? "✓" : (type === "error" ? "⚠️" : "ℹ️")}</span><div>${window.KM_SUPABASE?.sanitizeHTML(message) || message}</div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function openModal(title, bodyHTML, onSave) {
        if (!modalEl) return;
        const titleEl = document.getElementById("admin-modal-title");
        const bodyEl = document.getElementById("admin-modal-body");
        const saveBtn = document.getElementById("admin-modal-save-btn");

        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.innerHTML = bodyHTML;
        
        // Remove previous listeners
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

        newSaveBtn.addEventListener("click", async () => {
            newSaveBtn.setAttribute("disabled", "true");
            newSaveBtn.textContent = "Saving...";
            try {
                await onSave();
                closeModal();
            } catch (err) {
                showToast(err.message || "Failed to save changes", "error");
            } finally {
                newSaveBtn.removeAttribute("disabled");
                newSaveBtn.textContent = "Save Changes";
            }
        });

        modalEl.classList.add("active");
    }

    function closeModal() {
        if (modalEl) modalEl.classList.remove("active");
    }

    // Role Enforcement & View Permission Matrix
    function applyRolePermissions() {
        // SUPER_ADMIN: All
        // ADMIN: Bookings, Customers, Payments, Availability, Services, Analytics, Reports, CMS
        // EDITOR: CMS only (site copy, gallery, awards, vlog, blog)
        // VIEWER: Read-only
        if (!currentRole) return;

        navItems.forEach(item => {
            const v = item.getAttribute("data-view");
            if (currentRole === "EDITOR") {
                // Hide financial & settings modules from Editor
                if (["payments", "users", "settings", "logs"].includes(v)) {
                    item.style.display = "none";
                }
            } else if (currentRole === "VIEWER") {
                if (["users", "settings"].includes(v)) {
                    item.style.display = "none";
                }
            } else if (currentRole === "ADMIN") {
                if (["users"].includes(v)) {
                    item.style.display = "none";
                }
            }
        });
    }

    // --- Authentication & Session Validation ---
    async function checkAuthAndLoadDashboard() {
        showState("loading");

        if (!window.KM_SUPABASE) {
            console.warn("[Admin] KM_SUPABASE not available");
            showState("login");
            return;
        }

        currentUser = await window.KM_SUPABASE.getCurrentUser();
        if (!currentUser) {
            showState("login");
            return;
        }

        currentProfile = await window.KM_SUPABASE.getCurrentProfile();
        currentRole = currentProfile?.role || "SUPER_ADMIN";
        const validRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"];

        if (!validRoles.includes(currentRole)) {
            console.warn("[Admin] Account lacks clearance:", currentRole);
            showState("unauthorized");
            return;
        }

        // Render authenticated view
        showState("authenticated");
        if (userEmailEl) userEmailEl.textContent = currentUser.email || "Advocate Admin";
        if (userRoleEl) {
            userRoleEl.textContent = currentRole;
            userRoleEl.className = `admin-badge ${currentRole === "SUPER_ADMIN" ? "badge-paid" : "badge-completed"}`;
        }

        applyRolePermissions();
        await loadDashboardMetrics();
    }

    // --- 01. DASHBOARD DATA LOADER ---
    async function loadDashboardMetrics() {
        try {
            const summary = await window.KM_SUPABASE.getAdminDashboardSummary();
            const statBookings = document.getElementById("stat-bookings");
            const statRevenue = document.getElementById("stat-revenue");
            const statPending = document.getElementById("stat-pending");
            const statCustomers = document.getElementById("stat-customers");
            const statErrors = document.getElementById("stat-errors-count");

            if (statBookings) statBookings.textContent = (summary.bookingsCount || 0).toString();
            // Strictly exclude non-PAID payments
            if (statRevenue) statRevenue.textContent = `₹${(summary.revenueTotal || 0).toLocaleString("en-IN")}`;
            if (statPending) statPending.textContent = (summary.pendingCount || 0).toString();
            if (statCustomers) statCustomers.textContent = (summary.customersCount || 0).toString();
            if (statErrors) statErrors.textContent = (summary.systemErrors || 0).toString();

            // Load recent bookings table
            currentBookings = await window.KM_SUPABASE.getAdminBookings(10);
            renderDashboardBookings(currentBookings);

            // Load recent activity logs
            currentActivityLogs = await window.KM_SUPABASE.getAdminActivityLogs(10);
            renderDashboardActivity(currentActivityLogs);

            // Load unread notifications badge
            loadNotificationsCount();
        } catch (e) {
            console.error("[Admin] Failed to load dashboard metrics:", e);
        }
    }

    function renderDashboardBookings(bookings) {
        const tbody = document.getElementById("admin-bookings-tbody");
        if (!tbody) return;
        if (!Array.isArray(bookings) || bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">No bookings recorded yet. Database connected.</td></tr>`;
            return;
        }
        tbody.innerHTML = bookings.map(b => {
            const clientName = b.customers?.full_name || b.client_name || "Client";
            const serviceTitle = b.services?.title || b.service_title || "Consultation";
            const statusClass = b.status === "CONFIRMED" ? "badge-confirmed" : (b.status === "COMPLETED" ? "badge-completed" : "badge-pending");
            return `
                <tr>
                    <td style="font-family:monospace; font-weight:600; color:var(--gold);">${b.booking_reference || b.id.slice(0,8)}</td>
                    <td><strong>${clientName}</strong></td>
                    <td>${serviceTitle}</td>
                    <td>${b.date || "Scheduled"} · ${b.start_time ? String(b.start_time).slice(0,5) : "10:00"}</td>
                    <td>${b.mode || "Online"}</td>
                    <td><span class="admin-badge ${statusClass}">${b.status}</span></td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openBookingDrawer('${b.id}')"><span>Inspect</span></button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function renderDashboardActivity(logs) {
        const tbody = document.getElementById("admin-dashboard-activity-tbody");
        if (!tbody) return;
        if (!Array.isArray(logs) || logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No administrative activity recorded yet.</td></tr>`;
            return;
        }
        tbody.innerHTML = logs.map(l => {
            const adminEmail = l.profiles?.email || "System Admin";
            const dateStr = new Date(l.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            const metaStr = l.metadata ? JSON.stringify(l.metadata).slice(0, 40) + "..." : "—";
            return `
                <tr>
                    <td style="font-size:0.78rem; color:var(--text-muted);">${dateStr}</td>
                    <td><strong>${adminEmail}</strong></td>
                    <td><span class="admin-badge badge-info">${l.action}</span></td>
                    <td>${l.target_type || "System"}</td>
                    <td style="font-family:monospace; font-size:0.75rem;">${metaStr}</td>
                </tr>
            `;
        }).join("");
    }

    async function loadNotificationsCount() {
        try {
            currentNotifications = await window.KM_SUPABASE.getAdminNotifications(20);
            const unread = currentNotifications.filter(n => !n.read).length;
            const badge = document.getElementById("admin-unread-badge");
            if (badge) {
                if (unread > 0) {
                    badge.textContent = unread.toString();
                    badge.style.display = "block";
                } else {
                    badge.style.display = "none";
                }
            }
        } catch (e) {}
    }

    // --- 02. ANALYTICS LOADER ---
    async function loadAnalytics() {
        const days = Number(document.getElementById("analytics-date-range")?.value || 30);
        try {
            const events = await window.KM_SUPABASE.client?.from("analytics_events")
                ?.select("*")
                ?.gte("timestamp", new Date(Date.now() - days * 86400000).toISOString())
                ?.limit(1000);

            const list = events?.data || [];
            const totalViews = list.length;
            const uniqueSessions = new Set(list.map(e => e.session_id).filter(Boolean)).size;
            const bookingStarts = list.filter(e => e.event_name === "consultation_started" || e.event_name === "booking_start").length;
            const paidConversions = list.filter(e => e.event_name === "payment_completed").length;

            document.getElementById("analytics-total-views").textContent = totalViews.toString();
            document.getElementById("analytics-unique-sessions").textContent = uniqueSessions.toString();
            document.getElementById("analytics-booking-starts").textContent = bookingStarts.toString();
            document.getElementById("analytics-verified-conversions").textContent = paidConversions.toString();

            // Page count breakdown
            const pageMap = {};
            list.forEach(e => {
                const path = e.page_path || "/";
                pageMap[path] = (pageMap[path] || 0) + 1;
            });

            const sortedPages = Object.entries(pageMap).sort((a,b) => b[1] - a[1]);
            const tbody = document.getElementById("analytics-pages-tbody");
            if (tbody) {
                if (sortedPages.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:24px; color:var(--text-muted);">No events in selected timeframe.</td></tr>`;
                } else {
                    tbody.innerHTML = sortedPages.map(([path, count]) => `
                        <tr>
                            <td><code>${path}</code></td>
                            <td><strong>${count}</strong></td>
                            <td>${((count / (totalViews || 1)) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join("");
                }
            }
        } catch (e) {
            console.error("[Admin] Analytics load error:", e);
        }
    }

    // --- 03. DAILY REPORTS LOADER ---
    async function loadDailyReports() {
        try {
            currentReports = await window.KM_SUPABASE.getAdminDailyReports(30);
            const tbody = document.getElementById("admin-reports-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentReports) || currentReports.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:32px; color:var(--text-muted);">No stored daily reports found. Click "Generate Report" above.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentReports.map(r => `
                <tr>
                    <td><strong>${r.report_date}</strong></td>
                    <td>${r.visitors || 0}</td>
                    <td>${r.page_views || 0}</td>
                    <td>${r.new_customers || 0}</td>
                    <td>${r.consultations || 0}</td>
                    <td><span class="admin-badge badge-confirmed">${r.confirmed_consultations || 0}</span></td>
                    <td><span class="admin-badge badge-completed">${r.completed_consultations || 0}</span></td>
                    <td style="font-weight:600; color:var(--gold);">₹${Number(r.revenue || 0).toLocaleString("en-IN")}</td>
                    <td>${r.system_errors || 0}</td>
                </tr>
            `).join("");
        } catch (e) {
            console.error("[Admin] Reports load error:", e);
        }
    }

    // --- 04. NOTIFICATIONS LOADER ---
    async function loadNotifications() {
        try {
            currentNotifications = await window.KM_SUPABASE.getAdminNotifications(50);
            const tbody = document.getElementById("admin-notifications-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentNotifications) || currentNotifications.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">No chamber notifications found.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentNotifications.map(n => `
                <tr style="${n.read ? 'opacity:0.7;' : 'font-weight:500;'}">
                    <td><span class="admin-badge ${n.read ? 'badge-completed' : 'badge-pending'}">${n.read ? 'READ' : 'UNREAD'}</span></td>
                    <td><strong>${n.type}</strong></td>
                    <td>${n.title}</td>
                    <td style="font-size:0.84rem;">${n.message || "—"}</td>
                    <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(n.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                    <td>
                        ${!n.read ? `<button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.markNotificationRead('${n.id}')"><span>Mark Read</span></button>` : '—'}
                    </td>
                </tr>
            `).join("");
        } catch (e) {
            console.error("[Admin] Notifications load error:", e);
        }
    }

    // --- 05. BOOKINGS MANAGEMENT LOADER ---
    async function loadAllBookings() {
        try {
            currentBookings = await window.KM_SUPABASE.getAdminBookings(100);
            renderFilteredBookings(currentBookings);
        } catch (e) {
            console.error("[Admin] Bookings load error:", e);
        }
    }

    function renderFilteredBookings(list) {
        const tbody = document.getElementById("bookings-full-tbody");
        if (!tbody) return;
        if (!Array.isArray(list) || list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:36px; color:var(--text-muted);">No consultations matching filter.</td></tr>`;
            return;
        }
        tbody.innerHTML = list.map(b => {
            const clientName = b.customers?.full_name || b.client_name || "Client";
            const serviceTitle = b.services?.title || b.service_title || "Consultation";
            const bStatusClass = b.status === "CONFIRMED" ? "badge-confirmed" : (b.status === "COMPLETED" ? "badge-completed" : (b.status === "CANCELLED" ? "badge-failed" : "badge-pending"));
            const pStatusClass = b.payment_status === "PAID" ? "badge-paid" : (b.payment_status === "FAILED" ? "badge-failed" : "badge-pending");
            return `
                <tr>
                    <td style="font-family:monospace; font-weight:600; color:var(--gold);">${b.booking_reference || b.id.slice(0,8)}</td>
                    <td><strong>${clientName}</strong></td>
                    <td>${serviceTitle}</td>
                    <td>${b.date || "Scheduled"} · ${b.start_time ? String(b.start_time).slice(0,5) : "10:00"}</td>
                    <td>₹${Number(b.fee_snapshot || 1000).toLocaleString("en-IN")}</td>
                    <td><span class="admin-badge ${bStatusClass}">${b.status}</span></td>
                    <td><span class="admin-badge ${pStatusClass}">${b.payment_status}</span></td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openBookingDrawer('${b.id}')"><span>Inspect</span></button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function filterBookings() {
        const query = (document.getElementById("bookings-search-input")?.value || "").toLowerCase().trim();
        const statusFilter = document.getElementById("bookings-filter-status")?.value || "";
        const modeFilter = document.getElementById("bookings-filter-mode")?.value || "";

        const filtered = currentBookings.filter(b => {
            const ref = (b.booking_reference || "").toLowerCase();
            const client = (b.customers?.full_name || b.client_name || "").toLowerCase();
            const service = (b.services?.title || b.service_title || "").toLowerCase();
            const matchesQuery = !query || ref.includes(query) || client.includes(query) || service.includes(query);
            const matchesStatus = !statusFilter || b.status === statusFilter;
            const matchesMode = !modeFilter || (b.mode || "").includes(modeFilter);
            return matchesQuery && matchesStatus && matchesMode;
        });

        renderFilteredBookings(filtered);
    }

    // --- 06. CUSTOMERS DIRECTORY LOADER ---
    async function loadCustomers() {
        try {
            currentCustomers = await window.KM_SUPABASE.getAdminCustomers(100);
            renderFilteredCustomers(currentCustomers);
        } catch (e) {
            console.error("[Admin] Customers load error:", e);
        }
    }

    function renderFilteredCustomers(list) {
        const tbody = document.getElementById("customers-tbody");
        if (!tbody) return;
        if (!Array.isArray(list) || list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">No client records found.</td></tr>`;
            return;
        }
        tbody.innerHTML = list.map(c => `
            <tr>
                <td><strong>${c.full_name}</strong></td>
                <td><code>${c.email}</code></td>
                <td>${c.phone || "—"}</td>
                <td>${c.country || "India"}</td>
                <td><span class="admin-badge badge-active">${c.status || "ACTIVE"}</span></td>
                <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openCustomerDrawer('${c.id}')"><span>History</span></button>
                </td>
            </tr>
        `).join("");
    }

    function filterCustomers() {
        const query = (document.getElementById("customers-search-input")?.value || "").toLowerCase().trim();
        const filtered = currentCustomers.filter(c => {
            return !query || (c.full_name || "").toLowerCase().includes(query) || (c.email || "").toLowerCase().includes(query) || (c.phone || "").includes(query);
        });
        renderFilteredCustomers(filtered);
    }

    // --- 07. PHONEPE PAYMENTS LOADER ---
    async function loadPayments() {
        try {
            currentPayments = await window.KM_SUPABASE.getAdminPayments(100);
            renderFilteredPayments(currentPayments);
        } catch (e) {
            console.error("[Admin] Payments load error:", e);
        }
    }

    function renderFilteredPayments(list) {
        const tbody = document.getElementById("payments-tbody");
        if (!tbody) return;
        if (!Array.isArray(list) || list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:36px; color:var(--text-muted);">No payment records found.</td></tr>`;
            return;
        }
        tbody.innerHTML = list.map(p => {
            const bRef = p.bookings?.booking_reference || p.booking_reference || "—";
            const statusClass = p.status === "PAID" ? "badge-paid" : (p.status === "FAILED" ? "badge-failed" : "badge-pending");
            return `
                <tr>
                    <td style="font-family:monospace; font-weight:600; color:var(--gold);">${bRef}</td>
                    <td style="font-family:monospace; font-size:0.8rem;">${p.merchant_order_id || p.id.slice(0,12)}</td>
                    <td style="font-weight:600;">₹${Number(p.amount || 0).toLocaleString("en-IN")}</td>
                    <td><span class="admin-badge ${statusClass}">${p.status}</span></td>
                    <td style="font-family:monospace; font-size:0.78rem;">${p.gateway_transaction_id || "—"}</td>
                    <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                    <td style="font-size:0.78rem; color:var(--text-muted);">${p.verified_at ? new Date(p.verified_at).toLocaleDateString("en-IN") : "Pending"}</td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.reconcilePaymentRecord('${p.merchant_order_id}', '${bRef}')"><span>Reconcile</span></button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function filterPayments() {
        const query = (document.getElementById("payments-search-input")?.value || "").toLowerCase().trim();
        const statusFilter = document.getElementById("payments-filter-status")?.value || "";

        const filtered = currentPayments.filter(p => {
            const mId = (p.merchant_order_id || "").toLowerCase();
            const bRef = (p.bookings?.booking_reference || "").toLowerCase();
            const matchesQuery = !query || mId.includes(query) || bRef.includes(query);
            const matchesStatus = !statusFilter || p.status === statusFilter;
            return matchesQuery && matchesStatus;
        });

        renderFilteredPayments(filtered);
    }

    // --- 08. SERVICES CATALOG LOADER ---
    async function loadServices() {
        try {
            currentServices = await window.KM_SUPABASE.getServices();
            const tbody = document.getElementById("services-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentServices) || currentServices.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:36px; color:var(--text-muted);">No services configured.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentServices.map(s => `
                <tr>
                    <td><strong>${s.title}</strong></td>
                    <td><code>${s.slug}</code></td>
                    <td><span class="admin-badge badge-info">${s.category}</span></td>
                    <td>${s.duration_minutes} mins</td>
                    <td style="font-weight:600; color:var(--gold);">₹${Number(s.fee).toLocaleString("en-IN")}</td>
                    <td><span class="admin-badge ${s.visible ? 'badge-confirmed' : 'badge-failed'}">${s.visible ? 'VISIBLE' : 'HIDDEN'}</span></td>
                    <td>${s.sort_order}</td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openServiceModal('${s.id}')"><span>Edit</span></button>
                    </td>
                </tr>
            `).join("");
        } catch (e) {
            console.error("[Admin] Services load error:", e);
        }
    }

    // --- 09. AVAILABILITY & BLOCKED DATES LOADER ---
    async function loadAvailabilityAndBlockedDates() {
        try {
            currentAvailability = await window.KM_SUPABASE.getAvailabilitySchedule();
            currentBlockedDates = await window.KM_SUPABASE.getBlockedDates();

            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const aTbody = document.getElementById("availability-tbody");
            if (aTbody) {
                aTbody.innerHTML = currentAvailability.map(a => `
                    <tr>
                        <td><strong>${dayNames[a.day_of_week] || a.day_of_week}</strong></td>
                        <td>${a.start_time.slice(0,5)}</td>
                        <td>${a.end_time.slice(0,5)}</td>
                        <td>${a.slot_duration} minutes</td>
                        <td><span class="admin-badge ${a.active ? 'badge-confirmed' : 'badge-failed'}">${a.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                        <td>
                            <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openAvailabilityModal('${a.id}')"><span>Configure</span></button>
                        </td>
                    </tr>
                `).join("");
            }

            const bTbody = document.getElementById("blocked-dates-tbody");
            if (bTbody) {
                if (currentBlockedDates.length === 0) {
                    bTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--text-muted);">No blocked dates configured. Chambers are operating on normal schedule.</td></tr>`;
                } else {
                    bTbody.innerHTML = currentBlockedDates.map(b => `
                        <tr>
                            <td><strong>${b.blocked_date}</strong></td>
                            <td>${b.reason || "Court Vacation / Chambers Holiday"}</td>
                            <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(b.created_at).toLocaleDateString("en-IN")}</td>
                            <td>
                                <button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.deleteBlockedDate('${b.id}', '${b.blocked_date}')"><span>Remove</span></button>
                            </td>
                        </tr>
                    `).join("");
                }
            }
        } catch (e) {
            console.error("[Admin] Availability load error:", e);
        }
    }

    // --- 10. SITE CONTENT CMS LOADER ---
    async function loadSiteContent() {
        try {
            const [hero, about, contact] = await Promise.all([
                window.KM_SUPABASE.getSiteContent("homepage_hero"),
                window.KM_SUPABASE.getSiteContent("homepage_about"),
                window.KM_SUPABASE.getSiteContent("contact_information")
            ]);

            if (hero) {
                const darkEl = document.getElementById("cms-hero-dark");
                const lightEl = document.getElementById("cms-hero-light");
                const descEl = document.getElementById("cms-hero-desc");
                if (darkEl) darkEl.value = hero.title_dark || "";
                if (lightEl) lightEl.value = hero.title_light || "";
                if (descEl) descEl.value = hero.description || "";
            }

            if (about) {
                const headEl = document.getElementById("cms-about-headline");
                const leadEl = document.getElementById("cms-about-lead");
                const subleadEl = document.getElementById("cms-about-sublead");
                if (headEl) headEl.value = about.headline || "";
                if (leadEl) leadEl.value = about.lead || "";
                if (subleadEl) subleadEl.value = about.sublead || "";
            }

            if (contact) {
                const chamEl = document.getElementById("cms-contact-chamber");
                const emEl = document.getElementById("cms-contact-email");
                const phEl = document.getElementById("cms-contact-phone");
                const hrEl = document.getElementById("cms-contact-hours");
                const addrEl = document.getElementById("cms-contact-address");
                if (chamEl) chamEl.value = contact.chamber || "";
                if (emEl) emEl.value = contact.email || "";
                if (phEl) phEl.value = contact.phone || "";
                if (hrEl) hrEl.value = contact.hours || "";
                if (addrEl) addrEl.value = contact.address || "";
            }
        } catch (e) {
            console.error("[Admin] Content load error:", e);
        }
    }

    // --- 11. GALLERY CMS LOADER ---
    async function loadGallery() {
        try {
            currentGallery = await window.KM_SUPABASE.getGalleryItems();
            const tbody = document.getElementById("gallery-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentGallery) || currentGallery.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">No photographs stored.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentGallery.map(g => {
                const resolvedSrc = window.KM_SUPABASE?.resolveGoogleDriveImageUrl(g.image_url) || g.image_url;
                return `
                <tr>
                    <td><img src="${resolvedSrc}" alt="${g.title}" style="width:48px; height:48px; object-fit:cover; border-radius:4px;" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 48 48\\'%3E%3Crect width=\\'48\\' height=\\'48\\' fill=\\'%23FAF8F5\\'/%3E%3Ctext x=\\'24\\' y=\\'26\\' text-anchor=\\'middle\\' font-size=\\'10\\' fill=\\'%23B89B52\\'%3EPhoto%3C/text%3E%3C/svg%3E'"></td>
                    <td><strong>${g.title}</strong></td>
                    <td>${g.category}</td>
                    <td><span class="admin-badge ${g.featured ? 'badge-completed' : 'badge-info'}">${g.featured ? 'YES' : 'NO'}</span></td>
                    <td><span class="admin-badge ${g.visible ? 'badge-confirmed' : 'badge-failed'}">${g.visible ? 'VISIBLE' : 'HIDDEN'}</span></td>
                    <td>${g.sort_order}</td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openGalleryModal('${g.id}')"><span>Edit</span></button>
                        <button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.deleteGalleryItem('${g.id}')"><span>Delete</span></button>
                    </td>
                </tr>
            `}).join("");
        } catch (e) {
            console.error("[Admin] Gallery load error:", e);
        }
    }

    // --- 12. ACHIEVEMENTS CMS LOADER ---
    async function loadAchievements() {
        try {
            currentAchievements = await window.KM_SUPABASE.getAchievements();
            const tbody = document.getElementById("achievements-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentAchievements) || currentAchievements.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">No achievements stored.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentAchievements.map(a => {
                const imgThumb = a.image_url 
                    ? `<img src="${window.KM_SUPABASE?.resolveGoogleDriveImageUrl(a.image_url) || a.image_url}" alt="Milestone" style="width:36px; height:36px; object-fit:cover; border-radius:4px; margin-right:8px; vertical-align:middle;" onerror="this.style.display='none';">`
                    : '';
                return `
                <tr>
                    <td>${imgThumb}<strong>${a.title}</strong></td>
                    <td><span class="admin-badge badge-info">${a.category}</span></td>
                    <td>${a.year || "—"}</td>
                    <td style="font-size:0.84rem;">${a.description || "—"}</td>
                    <td><span class="admin-badge ${a.visible ? 'badge-confirmed' : 'badge-failed'}">${a.visible ? 'VISIBLE' : 'HIDDEN'}</span></td>
                    <td>${a.sort_order}</td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openAchievementModal('${a.id}')"><span>Edit</span></button>
                        <button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.deleteAchievement('${a.id}')"><span>Delete</span></button>
                    </td>
                </tr>
            `}).join("");
        } catch (e) {
            console.error("[Admin] Achievements load error:", e);
        }
    }

    // --- 13. VLOG CMS LOADER ---
    async function loadVideos() {
        try {
            currentVideos = await window.KM_SUPABASE.getVideos();
            const tbody = document.getElementById("videos-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentVideos) || currentVideos.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">No videos stored.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentVideos.map(v => `
                <tr>
                    <td><strong>${v.title}</strong></td>
                    <td><code>${v.youtube_video_id || v.youtube_url}</code></td>
                    <td>${v.category}</td>
                    <td>${v.video_date || "—"}</td>
                    <td><span class="admin-badge ${v.visible ? 'badge-confirmed' : 'badge-failed'}">${v.visible ? 'VISIBLE' : 'HIDDEN'}</span></td>
                    <td>${v.sort_order}</td>
                    <td>
                        <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openVideoModal('${v.id}')"><span>Edit</span></button>
                        <button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.deleteVideo('${v.id}')"><span>Delete</span></button>
                    </td>
                </tr>
            `).join("");
        } catch (e) {
            console.error("[Admin] Videos load error:", e);
        }
    }

    // --- 14. BLOG & ARTICLES CMS LOADER ---
    async function loadBlogPosts() {
        try {
            // Load both drafts and published posts
            const res = await window.KM_SUPABASE.client?.from("blog_posts")?.select("*")?.order("created_at", { ascending: false });
            currentBlogs = res?.data || await window.KM_SUPABASE.getBlogPosts(50);
            const tbody = document.getElementById("blog-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentBlogs) || currentBlogs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">No blog posts found.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentBlogs.map(b => {
                const statusClass = b.status === "PUBLISHED" ? "badge-published" : "badge-draft";
                const imgThumb = b.image_url 
                    ? `<img src="${window.KM_SUPABASE?.resolveGoogleDriveImageUrl(b.image_url) || b.image_url}" alt="Cover" style="width:36px; height:36px; object-fit:cover; border-radius:4px; margin-right:8px; vertical-align:middle;" onerror="this.style.display='none';">`
                    : '';
                return `
                    <tr>
                        <td>${imgThumb}<strong>${b.title}</strong></td>
                        <td><code>${b.slug}</code></td>
                        <td>${b.category}</td>
                        <td>${b.read_time} min</td>
                        <td><span class="admin-badge ${statusClass}">${b.status}</span></td>
                        <td style="font-size:0.78rem; color:var(--text-muted);">${b.published_at ? new Date(b.published_at).toLocaleDateString("en-IN") : "Draft"}</td>
                        <td>
                            <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openBlogModal('${b.id}')"><span>Edit</span></button>
                            <button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.deleteBlogPost('${b.id}')"><span>Delete</span></button>
                        </td>
                    </tr>
                `;
            }).join("");
        } catch (e) {
            console.error("[Admin] Blog load error:", e);
        }
    }

    // --- 15. PLATFORM SETTINGS LOADER ---
    async function loadSettings() {
        try {
            currentSettings = await window.KM_SUPABASE.getSiteSettings();
            if (currentSettings) {
                const nameEl = document.getElementById("settings-site-name");
                const emailEl = document.getElementById("settings-email");
                const phoneEl = document.getElementById("settings-phone");
                const waEl = document.getElementById("settings-whatsapp");
                const bEl = document.getElementById("settings-booking-enabled");
                const pEl = document.getElementById("settings-payment-enabled");
                const blogEl = document.getElementById("settings-blog-enabled");
                const galEl = document.getElementById("settings-gallery-enabled");
                const mainEl = document.getElementById("settings-maintenance-mode");

                if (nameEl) nameEl.value = currentSettings.site_name || "";
                if (emailEl) emailEl.value = currentSettings.contact_email || "";
                if (phoneEl) phoneEl.value = currentSettings.phone || "";
                if (waEl) waEl.value = currentSettings.whatsapp || "";
                if (bEl) bEl.checked = currentSettings.booking_enabled !== false;
                if (pEl) pEl.checked = currentSettings.payment_enabled !== false;
                if (blogEl) blogEl.checked = currentSettings.blog_enabled !== false;
                if (galEl) galEl.checked = currentSettings.gallery_enabled !== false;
                if (mainEl) mainEl.checked = currentSettings.maintenance_mode === true;
            }
        } catch (e) {
            console.error("[Admin] Settings load error:", e);
        }
    }

    // --- 16. ADMIN USERS & ROLES LOADER ---
    async function loadUsers() {
        try {
            currentUsers = await window.KM_SUPABASE.getAdminUsers(50);
            const tbody = document.getElementById("users-tbody");
            if (!tbody) return;
            if (!Array.isArray(currentUsers) || currentUsers.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--text-muted);">No administrative accounts found.</td></tr>`;
                return;
            }
            tbody.innerHTML = currentUsers.map(u => {
                const isSuper = currentRole === "SUPER_ADMIN";
                const isSelf = u.id === currentUser?.id;
                return `
                    <tr>
                        <td><strong>${u.full_name || "Advocate Administrator"}</strong></td>
                        <td><code>${u.email}</code></td>
                        <td><span class="admin-badge ${u.role === 'SUPER_ADMIN' ? 'badge-paid' : 'badge-completed'}">${u.role}</span></td>
                        <td>${u.role === 'SUPER_ADMIN' ? 'Master Full Clearance' : (u.role === 'ADMIN' ? 'Operational Management' : 'Content Editor')}</td>
                        <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                        <td>
                            ${isSuper && !isSelf ? `
                                <select class="admin-filter-select" style="padding:4px 8px; font-size:0.75rem;" onchange="window.KM_ADMIN?.changeUserRole('${u.id}', this.value)">
                                    <option value="SUPER_ADMIN" ${u.role === 'SUPER_ADMIN' ? 'selected' : ''}>SUPER_ADMIN</option>
                                    <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                                    <option value="EDITOR" ${u.role === 'EDITOR' ? 'selected' : ''}>EDITOR</option>
                                    <option value="VIEWER" ${u.role === 'VIEWER' ? 'selected' : ''}>VIEWER</option>
                                </select>
                            ` : (isSelf ? '<span style="font-size:0.75rem; color:var(--gold);">Current Active User</span>' : '—')}
                        </td>
                    </tr>
                `;
            }).join("");
        } catch (e) {
            console.error("[Admin] Users load error:", e);
        }
    }

    // --- 17. AUDIT & ERROR LOGS LOADER ---
    async function loadLogs() {
        try {
            currentErrorLogs = await window.KM_SUPABASE.getAdminErrorLogs(50);
            currentActivityLogs = await window.KM_SUPABASE.getAdminActivityLogs(50);

            const errTbody = document.getElementById("error-logs-tbody");
            if (errTbody) {
                if (currentErrorLogs.length === 0) {
                    errTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">No system errors logged.</td></tr>`;
                } else {
                    errTbody.innerHTML = currentErrorLogs.map(e => `
                        <tr>
                            <td><span class="admin-badge ${e.severity === 'CRITICAL' ? 'badge-failed' : 'badge-pending'}">${e.severity}</span></td>
                            <td><strong>${e.module}</strong></td>
                            <td style="font-size:0.84rem;">${e.message}</td>
                            <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(e.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                            <td><span class="admin-badge ${e.resolved ? 'badge-confirmed' : 'badge-failed'}">${e.resolved ? 'RESOLVED' : 'OPEN'}</span></td>
                            <td>
                                ${!e.resolved ? `<button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.resolveError('${e.id}')"><span>Resolve</span></button>` : '—'}
                            </td>
                        </tr>
                    `).join("");
                }
            }

            const actTbody = document.getElementById("activity-logs-tbody");
            if (actTbody) {
                if (currentActivityLogs.length === 0) {
                    actTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No audit logs recorded yet.</td></tr>`;
                } else {
                    actTbody.innerHTML = currentActivityLogs.map(l => `
                        <tr>
                            <td style="font-size:0.78rem; color:var(--text-muted);">${new Date(l.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                            <td><strong>${l.profiles?.email || "Admin"}</strong></td>
                            <td><span class="admin-badge badge-info">${l.action}</span></td>
                            <td>${l.target_type || "System"}</td>
                            <td style="font-family:monospace; font-size:0.75rem;">${l.metadata ? JSON.stringify(l.metadata).slice(0, 50) + "..." : "—"}</td>
                        </tr>
                    `).join("");
                }
            }
        } catch (e) {
            console.error("[Admin] Logs load error:", e);
        }
    }

    // --- TAB SWITCHER DISPATCHER ---
    function navigateView(viewName) {
        navItems.forEach(i => {
            const match = i.getAttribute("data-view") === viewName;
            i.classList.toggle("active", match);
        });

        views.forEach(v => {
            const match = v.getAttribute("id") === `view-${viewName}`;
            v.style.display = match ? "block" : "none";
        });

        const activeNavItem = Array.from(navItems).find(i => i.getAttribute("data-view") === viewName);
        if (viewTitle && activeNavItem) {
            viewTitle.textContent = activeNavItem.textContent.trim().replace(/^\d+\s*/, "");
        }

        if (sidebar && window.innerWidth <= 1024) {
            sidebar.classList.remove("is-open");
        }

        // Lazy load data per view
        switch (viewName) {
            case "dashboard": loadDashboardMetrics(); break;
            case "analytics": loadAnalytics(); break;
            case "reports": loadDailyReports(); break;
            case "notifications": loadNotifications(); break;
            case "bookings": loadAllBookings(); break;
            case "customers": loadCustomers(); break;
            case "payments": loadPayments(); break;
            case "services": loadServices(); break;
            case "availability": loadAvailabilityAndBlockedDates(); break;
            case "cms-content": loadSiteContent(); break;
            case "cms-gallery": loadGallery(); break;
            case "cms-awards": loadAchievements(); break;
            case "cms-vlog": loadVideos(); break;
            case "cms-blog": loadBlogPosts(); break;
            case "settings": loadSettings(); break;
            case "users": loadUsers(); break;
            case "logs": loadLogs(); break;
        }
    }

    // --- EXPORT CONTROLLER WITH CSV FORMULA SANITIZATION ---
    function triggerExport(datasetName) {
        try {
            switch (datasetName) {
                case "bookings":
                    window.KM_SUPABASE.exportToCSV("consultation_bookings", [
                        { label: "Order ID", key: "booking_reference" },
                        { label: "Client Name", key: r => r.customers?.full_name || r.client_name || "" },
                        { label: "Service", key: r => r.services?.title || r.service_title || "" },
                        { label: "Consultation Date", key: "date" },
                        { label: "Start Time", key: "start_time" },
                        { label: "Mode", key: "mode" },
                        { label: "Fee (INR)", key: "fee_snapshot" },
                        { label: "Booking Status", key: "status" },
                        { label: "Payment Status", key: "payment_status" },
                        { label: "Created Timestamp", key: "created_at" }
                    ], currentBookings);
                    showToast("Consultations exported safely with formula injection protection.", "success");
                    break;
                case "customers":
                    window.KM_SUPABASE.exportToCSV("client_database", [
                        { label: "Client ID", key: "id" },
                        { label: "Full Name", key: "full_name" },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        { label: "Country", key: "country" },
                        { label: "Registered At", key: "created_at" }
                    ], currentCustomers);
                    showToast("Client database exported safely.", "success");
                    break;
                case "payments":
                    window.KM_SUPABASE.exportToCSV("phonepe_payments", [
                        { label: "Payment ID", key: "id" },
                        { label: "Merchant Tx ID", key: "merchant_order_id" },
                        { label: "Gateway Tx ID", key: "gateway_transaction_id" },
                        { label: "Amount", key: "amount" },
                        { label: "Currency", key: "currency" },
                        { label: "Status", key: "status" },
                        { label: "Verified At", key: "verified_at" },
                        { label: "Created At", key: "created_at" }
                    ], currentPayments);
                    showToast("Payment ledger exported safely.", "success");
                    break;
                case "reports":
                    window.KM_SUPABASE.exportToCSV("daily_reports", [
                        { label: "Report Date", key: "report_date" },
                        { label: "Sessions", key: "visitors" },
                        { label: "Page Views", key: "page_views" },
                        { label: "Consultations", key: "consultations" },
                        { label: "Confirmed", key: "confirmed_consultations" },
                        { label: "Completed", key: "completed_consultations" },
                        { label: "Settled Revenue", key: "revenue" },
                        { label: "Errors", key: "system_errors" }
                    ], currentReports);
                    showToast("Daily business reports exported safely.", "success");
                    break;
                case "activity_logs":
                    window.KM_SUPABASE.exportToCSV("audit_logs", [
                        { label: "Timestamp", key: "created_at" },
                        { label: "Admin", key: r => r.profiles?.email || "Admin" },
                        { label: "Action", key: "action" },
                        { label: "Target Type", key: "target_type" },
                        { label: "Metadata", key: r => JSON.stringify(r.metadata || {}) }
                    ], currentActivityLogs);
                    showToast("Audit trail exported safely.", "success");
                    break;
            }
        } catch (err) {
            showToast(err.message || "Export failed", "error");
        }
    }

    // --- RECORD INSPECTOR DRAWER ---
    function openBookingDrawer(bookingId) {
        const b = currentBookings.find(x => x.id === bookingId);
        if (!b || !drawerOverlay) return;

        const idEl = document.getElementById("drawer-record-id");
        const titleEl = document.getElementById("drawer-record-title");
        const detailsArea = document.getElementById("drawer-details-area");
        const actionsArea = document.getElementById("drawer-actions-area");

        if (idEl) idEl.textContent = b.booking_reference || b.id.slice(0, 12);
        if (titleEl) titleEl.textContent = "Consultation Dossier";

        const clientName = b.customers?.full_name || b.client_name || "Client";
        const clientEmail = b.customers?.email || b.client_email || "—";
        const clientPhone = b.customers?.phone || b.client_phone || "—";
        const serviceTitle = b.services?.title || b.service_title || "Consultation";

        if (detailsArea) {
            detailsArea.innerHTML = `
                <table class="conf-details-table" style="margin-bottom:20px; width:100%;">
                    <tr><td><strong>Client:</strong></td><td>${clientName}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${clientEmail}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>${clientPhone}</td></tr>
                    <tr><td><strong>Service:</strong></td><td>${serviceTitle}</td></tr>
                    <tr><td><strong>Date & Slot:</strong></td><td>${b.date} · ${b.start_time ? String(b.start_time).slice(0,5) : ""} (${b.duration_minutes || 60} mins)</td></tr>
                    <tr><td><strong>Mode:</strong></td><td>${b.mode || "Online"}</td></tr>
                    <tr><td><strong>Booking Status:</strong></td><td><span class="admin-badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-pending'}">${b.status}</span></td></tr>
                    <tr><td><strong>Payment Status:</strong></td><td><span class="admin-badge ${b.payment_status === 'PAID' ? 'badge-paid' : 'badge-pending'}">${b.payment_status}</span></td></tr>
                    <tr><td><strong>Fee (INR):</strong></td><td>₹${Number(b.fee_snapshot || 1000).toLocaleString("en-IN")}</td></tr>
                </table>
            `;
        }

        if (actionsArea) {
            actionsArea.innerHTML = `
                ${b.status !== 'CONFIRMED' && b.status !== 'COMPLETED' ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.KM_ADMIN?.mutateBookingStatus('${b.id}', 'CONFIRMED')"><span>Confirm Consultation</span></button>` : ''}
                ${b.status !== 'COMPLETED' ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.KM_ADMIN?.mutateBookingStatus('${b.id}', 'COMPLETED')"><span>Mark Completed</span></button>` : ''}
                ${b.status !== 'CANCELLED' ? `<button type="button" class="btn btn-outline btn-sm" style="color:#D32F2F;" onclick="window.KM_ADMIN?.mutateBookingStatus('${b.id}', 'CANCELLED')"><span>Cancel Booking</span></button>` : ''}
                <button type="button" class="btn btn-outline btn-sm" onclick="window.KM_ADMIN?.openRescheduleModal('${b.id}')"><span>Reschedule Slot</span></button>
            `;
        }

        drawerOverlay.classList.add("active");
    }

    function openCustomerDrawer(customerId) {
        const c = currentCustomers.find(x => x.id === customerId);
        if (!c || !drawerOverlay) return;

        const idEl = document.getElementById("drawer-record-id");
        const titleEl = document.getElementById("drawer-record-title");
        const detailsArea = document.getElementById("drawer-details-area");
        const actionsArea = document.getElementById("drawer-actions-area");

        if (idEl) idEl.textContent = `CLIENT-${c.id.slice(0, 8)}`;
        if (titleEl) titleEl.textContent = c.full_name;

        const clientBookings = currentBookings.filter(b => b.customer_id === c.id);

        if (detailsArea) {
            detailsArea.innerHTML = `
                <table class="conf-details-table" style="margin-bottom:20px; width:100%;">
                    <tr><td><strong>Email:</strong></td><td>${c.email}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>${c.phone || "—"}</td></tr>
                    <tr><td><strong>Country:</strong></td><td>${c.country || "India"}</td></tr>
                    <tr><td><strong>Status:</strong></td><td>${c.status || "ACTIVE"}</td></tr>
                    <tr><td><strong>Total Bookings:</strong></td><td>${clientBookings.length} consultations</td></tr>
                </table>
                <h4 style="font-size:0.95rem; margin:16px 0 8px;">Booking History</h4>
                ${clientBookings.length === 0 ? '<p class="text-muted" style="font-size:0.85rem;">No historical appointments on record.</p>' : `
                    <div style="font-size:0.82rem;">
                        ${clientBookings.map(b => `<div>• ${b.booking_reference}: ${b.date} (${b.status})</div>`).join("")}
                    </div>
                `}
            `;
        }

        if (actionsArea) {
            actionsArea.innerHTML = `
                <button type="button" class="btn btn-outline btn-sm" onclick="drawerOverlay.classList.remove('active')"><span>Close Dossier</span></button>
            `;
        }

        drawerOverlay.classList.add("active");
    }

    // --- MODAL BUILDERS ---
    function openServiceModal(serviceId) {
        const s = serviceId ? currentServices.find(x => x.id === serviceId) : null;
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Service Title</label>
                <input type="text" id="m-svc-title" class="form-control" value="${s ? s.title : ''}" required>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="m-svc-cat" class="form-control">
                        <option value="LEGAL" ${s?.category === 'LEGAL' ? 'selected' : ''}>LEGAL</option>
                        <option value="RELATIONSHIP" ${s?.category === 'RELATIONSHIP' ? 'selected' : ''}>RELATIONSHIP</option>
                        <option value="PERSONAL" ${s?.category === 'PERSONAL' ? 'selected' : ''}>PERSONAL</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fee (INR)</label>
                    <input type="number" id="m-svc-fee" class="form-control" value="${s ? s.fee : 1000}" required>
                </div>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Duration (Minutes)</label>
                    <select id="m-svc-dur" class="form-control">
                        <option value="30" ${s?.duration_minutes === 30 ? 'selected' : ''}>30 Minutes</option>
                        <option value="60" ${!s || s.duration_minutes === 60 ? 'selected' : ''}>60 Minutes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Sort Order</label>
                    <input type="number" id="m-svc-order" class="form-control" value="${s ? s.sort_order : 0}">
                </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Description (Optional)</label>
                <textarea id="m-svc-desc" class="form-control" rows="2">${s?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.86rem; cursor:pointer;">
                    <input type="checkbox" id="m-svc-vis" ${!s || s.visible ? 'checked' : ''}> Visible on Website
                </label>
            </div>
        `;

        openModal(s ? "Edit Service" : "Add Service", html, async () => {
            const title = document.getElementById("m-svc-title")?.value;
            const category = document.getElementById("m-svc-cat")?.value;
            const fee = Number(document.getElementById("m-svc-fee")?.value);
            const duration = Number(document.getElementById("m-svc-dur")?.value);
            const sortOrder = Number(document.getElementById("m-svc-order")?.value);
            const description = document.getElementById("m-svc-desc")?.value;
            const visible = document.getElementById("m-svc-vis")?.checked;

            await window.KM_SUPABASE.adminSaveService({
                id: s?.id,
                title,
                category,
                fee,
                duration_minutes: duration,
                sort_order: sortOrder,
                description,
                visible
            });
            showToast("Service saved successfully.", "success");
            await loadServices();
        });
    }

    function openBlockedDateModal() {
        const todayStr = new Date().toISOString().slice(0, 10);
        const html = `
            <div class="form-group" style="margin-bottom:16px;">
                <label class="form-label">Blocked Date (YYYY-MM-DD)</label>
                <input type="date" id="m-block-date" class="form-control" min="${todayStr}" value="${todayStr}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Reason / Holiday Name</label>
                <input type="text" id="m-block-reason" class="form-control" placeholder="Court Vacation / Chambers Holiday" required>
            </div>
        `;

        openModal("Block Chambers Date", html, async () => {
            const dateStr = document.getElementById("m-block-date")?.value;
            const reason = document.getElementById("m-block-reason")?.value;
            await window.KM_SUPABASE.adminAddBlockedDate(dateStr, reason);
            showToast("Chamber date successfully blocked.", "success");
            await loadAvailabilityAndBlockedDates();
        });
    }

    // Helper: Shared Image Preview & Google Drive Verification Handler
    function setupImagePreviewHandler(inputId, previewWrapId, previewImgId, previewStatusId) {
        const input = document.getElementById(inputId);
        const wrap = document.getElementById(previewWrapId);
        const img = document.getElementById(previewImgId);
        const status = document.getElementById(previewStatusId);
        if (!input || !wrap || !img || !status) return;

        function updatePreview() {
            const rawVal = input.value.trim();
            if (!rawVal) {
                wrap.style.display = "none";
                img.style.display = "none";
                status.textContent = "";
                return;
            }

            wrap.style.display = "block";
            status.textContent = "Resolving image URL...";
            status.style.color = "var(--text-muted)";
            img.style.display = "none";

            const validation = window.KM_SUPABASE?.validateImageUrl ? window.KM_SUPABASE.validateImageUrl(rawVal) : { valid: true, url: rawVal };

            if (!validation.valid) {
                status.textContent = "⚠️ " + (validation.error || "Invalid URL structure.");
                status.style.color = "#D32F2F";
                return;
            }

            status.textContent = validation.isDrive 
                ? "Connecting to Google Drive asset... (Ensure permissions are set to 'Anyone with the link — Viewer')" 
                : "Testing image connection...";

            img.onload = () => {
                img.style.display = "inline-block";
                status.textContent = validation.isDrive 
                    ? "✓ Google Drive image resolved and verified successfully." 
                    : "✓ Direct image URL loaded successfully.";
                status.style.color = "#2E7D32";
            };

            img.onerror = () => {
                img.style.display = "none";
                status.textContent = validation.isDrive
                    ? "⚠️ Could not load image from Google Drive. Please verify the file is shared as 'Anyone with the link — Viewer' and not restricted."
                    : "⚠️ Could not load image from this URL. Please verify the link is a valid, publicly accessible image.";
                status.style.color = "#D32F2F";
            };

            img.src = validation.url;
        }

        input.addEventListener("input", updatePreview);
        input.addEventListener("paste", () => setTimeout(updatePreview, 50));
        if (input.value.trim()) {
            updatePreview();
        }
    }

    function openGalleryModal(itemId) {
        const g = itemId ? currentGallery.find(x => x.id === itemId) : null;
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Photograph Title</label>
                <input type="text" id="m-gal-title" class="form-control" value="${g ? g.title : ''}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Image URL (Google Drive Share Link or Direct HTTPS)</label>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
                    💡 Paste any Google Drive share link (e.g. <code>https://drive.google.com/file/d/.../view?usp=sharing</code>). Permissions must be set to <strong>"Anyone with the link — Viewer"</strong>.
                </div>
                <input type="url" id="m-gal-url" class="form-control" value="${g ? g.image_url : ''}" placeholder="https://drive.google.com/file/d/... or https://..." required>
                <div id="m-gal-preview-wrap" style="margin-top:10px; display:none; border:1px dashed var(--border-color); border-radius:4px; padding:12px; background:var(--off-white); text-align:center;">
                    <div id="m-gal-preview-status" style="font-size:0.8rem; margin-bottom:8px;"></div>
                    <img id="m-gal-preview-img" src="" alt="Preview" style="max-height:160px; max-width:100%; object-fit:contain; border-radius:4px; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                </div>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" id="m-gal-cat" class="form-control" value="${g ? g.category : 'Chambers'}">
                </div>
                <div class="form-group">
                    <label class="form-label">Sort Order</label>
                    <input type="number" id="m-gal-order" class="form-control" value="${g ? g.sort_order : 0}">
                </div>
            </div>
            <div style="display:flex; gap:20px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.86rem; cursor:pointer;">
                    <input type="checkbox" id="m-gal-vis" ${!g || g.visible ? 'checked' : ''}> Visible
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.86rem; cursor:pointer;">
                    <input type="checkbox" id="m-gal-feat" ${g?.featured ? 'checked' : ''}> Featured
                </label>
            </div>
        `;

        openModal(g ? "Edit Photograph" : "Add Photograph", html, async () => {
            const title = document.getElementById("m-gal-title")?.value;
            const image_url = document.getElementById("m-gal-url")?.value;
            const category = document.getElementById("m-gal-cat")?.value;
            const sort_order = Number(document.getElementById("m-gal-order")?.value);
            const visible = document.getElementById("m-gal-vis")?.checked;
            const featured = document.getElementById("m-gal-feat")?.checked;

            await window.KM_SUPABASE.adminSaveGalleryItem({
                id: g?.id,
                title,
                image_url,
                category,
                sort_order,
                visible,
                featured
            });
            showToast("Gallery item saved successfully.", "success");
            await loadGallery();
        });

        setupImagePreviewHandler("m-gal-url", "m-gal-preview-wrap", "m-gal-preview-img", "m-gal-preview-status");
    }

    function openAchievementModal(achId) {
        const a = achId ? currentAchievements.find(x => x.id === achId) : null;
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Achievement / Milestone Title</label>
                <input type="text" id="m-ach-title" class="form-control" value="${a ? a.title : ''}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Certificate / Milestone Image URL (Optional)</label>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
                    💡 Google Drive share link (set to <strong>"Anyone with the link — Viewer"</strong>) or direct image URL.
                </div>
                <input type="url" id="m-ach-url" class="form-control" value="${a ? a.image_url || '' : ''}" placeholder="https://drive.google.com/file/d/... or https://...">
                <div id="m-ach-preview-wrap" style="margin-top:10px; display:none; border:1px dashed var(--border-color); border-radius:4px; padding:12px; background:var(--off-white); text-align:center;">
                    <div id="m-ach-preview-status" style="font-size:0.8rem; margin-bottom:8px;"></div>
                    <img id="m-ach-preview-img" src="" alt="Preview" style="max-height:160px; max-width:100%; object-fit:contain; border-radius:4px; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                </div>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="m-ach-cat" class="form-control">
                        <option value="EXPERIENCE" ${a?.category === 'EXPERIENCE' ? 'selected' : ''}>EXPERIENCE</option>
                        <option value="BANKING" ${a?.category === 'BANKING' ? 'selected' : ''}>BANKING</option>
                        <option value="MEDIATION" ${a?.category === 'MEDIATION' ? 'selected' : ''}>MEDIATION</option>
                        <option value="AWARD" ${a?.category === 'AWARD' ? 'selected' : ''}>AWARD</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Year (Optional)</label>
                    <input type="number" id="m-ach-year" class="form-control" value="${a?.year || ''}">
                </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Description</label>
                <textarea id="m-ach-desc" class="form-control" rows="2">${a?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.86rem; cursor:pointer;">
                    <input type="checkbox" id="m-ach-vis" ${!a || a.visible ? 'checked' : ''}> Visible on Achievements Page
                </label>
            </div>
        `;

        openModal(a ? "Edit Milestone" : "Add Milestone", html, async () => {
            const title = document.getElementById("m-ach-title")?.value;
            const image_url = document.getElementById("m-ach-url")?.value;
            const category = document.getElementById("m-ach-cat")?.value;
            const year = document.getElementById("m-ach-year")?.value;
            const description = document.getElementById("m-ach-desc")?.value;
            const visible = document.getElementById("m-ach-vis")?.checked;

            await window.KM_SUPABASE.adminSaveAchievement({
                id: a?.id,
                title,
                image_url: image_url || null,
                category,
                year,
                description,
                visible
            });
            showToast("Achievement saved successfully.", "success");
            await loadAchievements();
        });

        setupImagePreviewHandler("m-ach-url", "m-ach-preview-wrap", "m-ach-preview-img", "m-ach-preview-status");
    }

    function openVideoModal(videoId) {
        const v = videoId ? currentVideos.find(x => x.id === videoId) : null;
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Video Title</label>
                <input type="text" id="m-vid-title" class="form-control" value="${v ? v.title : ''}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">YouTube URL</label>
                <input type="url" id="m-vid-url" class="form-control" value="${v ? v.youtube_url : ''}" placeholder="https://www.youtube.com/watch?v=..." required>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" id="m-vid-cat" class="form-control" value="${v ? v.category : 'Legal Guidance'}">
                </div>
                <div class="form-group">
                    <label class="form-label">Video Date</label>
                    <input type="date" id="m-vid-date" class="form-control" value="${v ? v.video_date : new Date().toISOString().slice(0,10)}">
                </div>
            </div>
            <div class="form-group">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.86rem; cursor:pointer;">
                    <input type="checkbox" id="m-vid-vis" ${!v || v.visible ? 'checked' : ''}> Visible in Vlog Archive
                </label>
            </div>
        `;

        openModal(v ? "Edit Video" : "Add Video", html, async () => {
            const title = document.getElementById("m-vid-title")?.value;
            const youtube_url = document.getElementById("m-vid-url")?.value;
            const category = document.getElementById("m-vid-cat")?.value;
            const video_date = document.getElementById("m-vid-date")?.value;
            const visible = document.getElementById("m-vid-vis")?.checked;

            await window.KM_SUPABASE.adminSaveVideo({
                id: v?.id,
                title,
                youtube_url,
                category,
                video_date,
                visible
            });
            showToast("Video record saved.", "success");
            await loadVideos();
        });
    }

    function openBlogModal(blogId) {
        const b = blogId ? currentBlogs.find(x => x.id === blogId) : null;
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Article Title</label>
                <input type="text" id="m-blog-title" class="form-control" value="${b ? b.title : ''}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Cover Image URL (Google Drive Share Link or Direct HTTPS)</label>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
                    💡 Google Drive share link (set to <strong>"Anyone with the link — Viewer"</strong>) or direct image URL.
                </div>
                <input type="url" id="m-blog-url" class="form-control" value="${b ? b.image_url || '' : ''}" placeholder="https://drive.google.com/file/d/... or https://...">
                <div id="m-blog-preview-wrap" style="margin-top:10px; display:none; border:1px dashed var(--border-color); border-radius:4px; padding:12px; background:var(--off-white); text-align:center;">
                    <div id="m-blog-preview-status" style="font-size:0.8rem; margin-bottom:8px;"></div>
                    <img id="m-blog-preview-img" src="" alt="Preview" style="max-height:160px; max-width:100%; object-fit:contain; border-radius:4px; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                </div>
            </div>
            <div class="form-grid" style="margin-bottom:14px;">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" id="m-blog-cat" class="form-control" value="${b ? b.category : 'Legal Awareness'}">
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="m-blog-status" class="form-control">
                        <option value="DRAFT" ${!b || b.status === 'DRAFT' ? 'selected' : ''}>DRAFT</option>
                        <option value="PUBLISHED" ${b?.status === 'PUBLISHED' ? 'selected' : ''}>PUBLISHED</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">Excerpt / Summary</label>
                <textarea id="m-blog-excerpt" class="form-control" rows="2">${b?.excerpt || ''}</textarea>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">HTML Content (Sanitized on Save)</label>
                <textarea id="m-blog-content" class="form-control" rows="6">${b?.content || ''}</textarea>
            </div>
        `;

        openModal(b ? "Edit Article" : "Create Article", html, async () => {
            const title = document.getElementById("m-blog-title")?.value;
            const image_url = document.getElementById("m-blog-url")?.value;
            const category = document.getElementById("m-blog-cat")?.value;
            const status = document.getElementById("m-blog-status")?.value;
            const excerpt = document.getElementById("m-blog-excerpt")?.value;
            const content = document.getElementById("m-blog-content")?.value;

            await window.KM_SUPABASE.adminSaveBlogPost({
                id: b?.id,
                title,
                image_url: image_url || null,
                category,
                status,
                excerpt,
                content
            });
            showToast("Blog post saved successfully.", "success");
            await loadBlogPosts();
        });

        setupImagePreviewHandler("m-blog-url", "m-blog-preview-wrap", "m-blog-preview-img", "m-blog-preview-status");
    }

    function openRescheduleModal(bookingId) {
        const b = currentBookings.find(x => x.id === bookingId);
        if (!b) return;

        const todayStr = new Date().toISOString().slice(0, 10);
        const html = `
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">New Consultation Date</label>
                <input type="date" id="m-resched-date" class="form-control" min="${todayStr}" value="${b.date || todayStr}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label class="form-label">New Slot Start Time</label>
                <select id="m-resched-time" class="form-control">
                    <option value="10:00:00">10:00 AM</option>
                    <option value="11:15:00">11:15 AM</option>
                    <option value="12:30:00">12:30 PM</option>
                    <option value="13:45:00">01:45 PM</option>
                    <option value="15:00:00">03:00 PM</option>
                    <option value="16:15:00">04:15 PM</option>
                    <option value="17:30:00">05:30 PM</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Administrative Note (Optional)</label>
                <input type="text" id="m-resched-note" class="form-control" placeholder="Rescheduled per client request">
            </div>
        `;

        openModal("Reschedule Appointment", html, async () => {
            const newDate = document.getElementById("m-resched-date")?.value;
            const newTime = document.getElementById("m-resched-time")?.value;
            const note = document.getElementById("m-resched-note")?.value;

            await window.KM_SUPABASE.adminRescheduleBooking(bookingId, newDate, newTime, note);
            showToast("Booking rescheduled successfully.", "success");
            if (drawerOverlay) drawerOverlay.classList.remove("active");
            await loadAllBookings();
            await loadDashboardMetrics();
        });
    }

    // --- FORM ACTIONS ---
    async function saveHeroContent(e) {
        e.preventDefault();
        const dark = document.getElementById("cms-hero-dark")?.value;
        const light = document.getElementById("cms-hero-light")?.value;
        const desc = document.getElementById("cms-hero-desc")?.value;
        try {
            await window.KM_SUPABASE.adminSaveSiteContent("homepage_hero", {
                title_dark: dark,
                title_light: light,
                description: desc
            });
            showToast("Homepage hero copy updated.", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    }

    async function saveAboutContent(e) {
        e.preventDefault();
        const headline = document.getElementById("cms-about-headline")?.value;
        const lead = document.getElementById("cms-about-lead")?.value;
        const sublead = document.getElementById("cms-about-sublead")?.value;
        try {
            await window.KM_SUPABASE.adminSaveSiteContent("homepage_about", {
                headline,
                lead,
                sublead
            });
            showToast("Homepage about copy updated.", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    }

    async function saveContactContent(e) {
        e.preventDefault();
        const chamber = document.getElementById("cms-contact-chamber")?.value;
        const email = document.getElementById("cms-contact-email")?.value;
        const phone = document.getElementById("cms-contact-phone")?.value;
        const hours = document.getElementById("cms-contact-hours")?.value;
        const address = document.getElementById("cms-contact-address")?.value;
        try {
            await window.KM_SUPABASE.adminSaveSiteContent("contact_information", {
                chamber,
                email,
                phone,
                hours,
                address
            });
            showToast("Chamber contact coordinates updated.", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    }

    async function saveSettings(e) {
        e.preventDefault();
        try {
            await window.KM_SUPABASE.adminSaveSiteSettings({
                id: currentSettings?.id,
                site_name: document.getElementById("settings-site-name")?.value,
                contact_email: document.getElementById("settings-email")?.value,
                phone: document.getElementById("settings-phone")?.value,
                whatsapp: document.getElementById("settings-whatsapp")?.value,
                booking_enabled: document.getElementById("settings-booking-enabled")?.checked,
                payment_enabled: document.getElementById("settings-payment-enabled")?.checked,
                blog_enabled: document.getElementById("settings-blog-enabled")?.checked,
                gallery_enabled: document.getElementById("settings-gallery-enabled")?.checked,
                maintenance_mode: document.getElementById("settings-maintenance-mode")?.checked
            });
            showToast("Platform settings saved successfully.", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    }

    // --- MUTATION HELPERS ---
    async function mutateBookingStatus(bookingId, newStatus) {
        if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;
        try {
            await window.KM_SUPABASE.adminUpdateBookingStatus(bookingId, newStatus);
            showToast(`Booking marked as ${newStatus}.`, "success");
            if (drawerOverlay) drawerOverlay.classList.remove("active");
            await loadAllBookings();
            await loadDashboardMetrics();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function reconcilePaymentRecord(merchantTxId, bookingRef) {
        if (!merchantTxId) {
            showToast("No merchant transaction ID available.", "error");
            return;
        }
        showToast("Initiating PhonePe server-side reconciliation...", "info");
        try {
            const res = await window.KM_SUPABASE.adminReconcilePayment(merchantTxId, bookingRef);
            showToast(`Reconciliation complete: ${res.status || res.message || 'Verified'}`, "success");
            await loadPayments();
            await loadDashboardMetrics();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function deleteBlockedDate(blockedDateId, dateStr) {
        if (!confirm(`Unblock date ${dateStr}?`)) return;
        try {
            await window.KM_SUPABASE.adminDeleteBlockedDate(blockedDateId);
            showToast("Date unblocked.", "success");
            await loadAvailabilityAndBlockedDates();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function deleteGalleryItem(itemId) {
        if (!confirm("Are you sure you want to remove this photograph?")) return;
        try {
            await window.KM_SUPABASE.adminDeleteGalleryItem(itemId);
            showToast("Photograph removed.", "success");
            await loadGallery();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function deleteAchievement(achId) {
        if (!confirm("Are you sure you want to remove this milestone?")) return;
        try {
            await window.KM_SUPABASE.adminDeleteAchievement(achId);
            showToast("Milestone removed.", "success");
            await loadAchievements();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function deleteVideo(videoId) {
        if (!confirm("Are you sure you want to remove this video record?")) return;
        try {
            await window.KM_SUPABASE.adminDeleteVideo(videoId);
            showToast("Video record removed.", "success");
            await loadVideos();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function deleteBlogPost(blogId) {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await window.KM_SUPABASE.adminDeleteBlogPost(blogId);
            showToast("Article deleted.", "success");
            await loadBlogPosts();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function markNotificationRead(notifId) {
        try {
            await window.KM_SUPABASE.adminMarkNotificationRead(notifId);
            await loadNotifications();
            await loadNotificationsCount();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function markAllNotificationsRead() {
        try {
            await window.KM_SUPABASE.adminMarkAllNotificationsRead();
            showToast("All notifications marked as read.", "success");
            await loadNotifications();
            await loadNotificationsCount();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function resolveError(errorId) {
        try {
            await window.KM_SUPABASE.adminResolveErrorLog(errorId);
            showToast("Error marked as resolved.", "success");
            await loadLogs();
            await loadDashboardMetrics();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function changeUserRole(targetUserId, newRole) {
        if (!confirm(`Confirm assigning role "${newRole}" to this account?`)) return;
        try {
            await window.KM_SUPABASE.adminUpdateUserRole(targetUserId, newRole);
            showToast(`User role updated to ${newRole}.`, "success");
            await loadUsers();
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    async function triggerDailyReportGeneration() {
        showToast("Generating daily business report...", "info");
        try {
            const res = await window.KM_SUPABASE.adminGenerateDailyReport();
            if (res.success) {
                showToast("Daily business report generated successfully.", "success");
                await loadDailyReports();
            } else {
                showToast(res.message || "Could not generate report", "error");
            }
        } catch (e) {
            showToast(e.message, "error");
        }
    }

    // --- EVENT LISTENERS ---
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (loginError) loginError.style.display = "none";
            if (loginSubmit) {
                loginSubmit.setAttribute("disabled", "true");
                loginSubmit.innerHTML = "<span>Authenticating clearance...</span>";
            }

            const email = emailInput?.value.trim() || "";
            const password = passwordInput?.value || "";

            try {
                await window.KM_SUPABASE.signInAdmin(email, password);
                await checkAuthAndLoadDashboard();
            } catch (err) {
                if (loginError) {
                    loginError.textContent = err.message || "Invalid administrative credentials.";
                    loginError.style.display = "block";
                }
            } finally {
                if (loginSubmit) {
                    loginSubmit.removeAttribute("disabled");
                    loginSubmit.innerHTML = "<span>Sign In to Control Center</span>";
                }
            }
        });
    }

    async function handleLogout() {
        if (window.KM_SUPABASE) {
            await window.KM_SUPABASE.signOutAdmin();
        }
        await checkAuthAndLoadDashboard();
    }

    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (unauthLogoutBtn) unauthLogoutBtn.addEventListener("click", handleLogout);

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetView = item.getAttribute("data-view");
            navigateView(targetView);
        });
    });

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
    }

    const quickExportBtn = document.getElementById("admin-quick-export-btn");
    if (quickExportBtn) {
        quickExportBtn.addEventListener("click", () => triggerExport("bookings"));
    }

    const notifBellBtn = document.getElementById("admin-notif-bell-btn");
    if (notifBellBtn) {
        notifBellBtn.addEventListener("click", () => navigateView("notifications"));
    }

    if (drawerClose && drawerOverlay) {
        drawerClose.addEventListener("click", () => drawerOverlay.classList.remove("active"));
        drawerOverlay.addEventListener("click", (e) => {
            if (e.target === drawerOverlay) drawerOverlay.classList.remove("active");
        });
    }

    // Expose global window.KM_ADMIN methods for inline events
    window.KM_ADMIN = {
        navigateView,
        refreshCurrentView: () => loadDashboardMetrics(),
        triggerExport,
        openBookingDrawer,
        openCustomerDrawer,
        openServiceModal,
        openBlockedDateModal,
        openGalleryModal,
        openAchievementModal,
        openVideoModal,
        openBlogModal,
        openRescheduleModal,
        closeModal,
        saveHeroContent,
        saveAboutContent,
        saveContactContent,
        saveSettings,
        mutateBookingStatus,
        reconcilePaymentRecord,
        deleteBlockedDate,
        deleteGalleryItem,
        deleteAchievement,
        deleteVideo,
        deleteBlogPost,
        markNotificationRead,
        markAllNotificationsRead,
        resolveError,
        changeUserRole,
        triggerDailyReportGeneration,
        filterBookings,
        filterCustomers,
        filterPayments,
        loadAnalytics
    };

    // Initialize check
    await checkAuthAndLoadDashboard();
}

