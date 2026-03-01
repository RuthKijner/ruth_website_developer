/* 
############################################
   Create navigation toggle for mobile
############################################
*/
const navToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
    // 1. Get current state
    const isVisible = primaryNav.getAttribute('data-visible') === "true";

    // 2. Toggle state
    if (!isVisible) {
        primaryNav.setAttribute('data-visible', "true");
        navToggle.setAttribute('aria-expanded', "true");
    } else {
        primaryNav.setAttribute('data-visible', "false");
        navToggle.setAttribute('aria-expanded', "false");
    }
});


/* 
############################################
   Checking if we passed the hero section 
############################################
*/

/* ############################################
   Header CTA Logic (Watch the Hero Button) 
############################################
*/

// 1. Grab the specific buttons
const heroBtn = document.querySelector('.hero-section .btn-primary'); 
const navBtn = document.querySelector('.site-header .btn-secondary.nav-cta');

// 2. Create the Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
        // If the Hero CTA button is NO LONGER visible on screen
        if (!entry.isIntersecting) {
            
            // Safety check: Did it disappear because we scrolled DOWN past it?
            // (Meaning its physical position is now above the viewport)
            if (entry.boundingClientRect.top < 0) {
                console.log("⬇️ Scrolled past the Hero CTA: Turning header button Purple!");
                navBtn.classList.add('scrolled');
            }
            
        } 
        // If the Hero CTA button comes BACK into view
        else {
            console.log("⬆️ Hero CTA is visible: Turning header button Transparent!");
            navBtn.classList.remove('scrolled');
        }
    });
}, {
    // ⚠️ PRO TIP: If your header is fixed/sticky at the top, change this rootMargin.
    // For example, if your header is 80px tall, make this "-80px 0px 0px 0px". 
    // This makes the script trigger the exact millisecond the hero button slips behind your sticky header!
    rootMargin: "0px",
    threshold: 0 // Triggers the exact moment the entire button is out of view
});

// 3. Start watching the Hero CTA button (with a safety check to make sure both exist)
if (heroBtn && navBtn) {
    console.log("Started watching the Hero CTA button...");
    observer.observe(heroBtn);
}

/* 
############################################
   Hero Section Animations
############################################
*/

// --- PART 1: Define The Animations ---

    // A. Helper function to animate numbers (0 -> 258)
    const animateValue = (id, start, end, duration, isFloat) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Calculate current number based on progress
            let value = progress * (end - start) + start;
            
            // Format: Float for percentage (106.4), Integer for views (258)
            if (isFloat) {
                obj.innerText = value.toFixed(1);
            } else {
                obj.innerText = Math.floor(value);
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // B. WhatsApp Badge Logic
    const startWhatsappCounter = () => {
        const badge = document.querySelector('.notification-badge');
        const leadsText = document.getElementById('leads-count');
        const badgeContainer = document.querySelector('.badge-container');
        
        let currentNum = 0;
        const finalNum = 3;

        const updateBadge = () => {
            if (currentNum < finalNum) {
                currentNum++;
                badge.innerText = currentNum;

                // Update text based on the number
                if (currentNum === 1) leadsText.innerText = "5 פניות";
                else if (currentNum === 2) leadsText.innerText = "10 פניות";
                else if (currentNum === 3) leadsText.innerText = "13 פניות";

                // Pop Animation
                badgeContainer.classList.add('pop-animation');
                setTimeout(() => badgeContainer.classList.remove('pop-animation'), 200);
            } else {
                clearInterval(timer);
            }
        };
        const timer = setInterval(updateBadge, 800);
    };


    // --- PART 2: The Timeline (Run Sequence) ---

    // 1. Start Stats Animation IMMEDIATELY (Duration: 2000ms)
    animateValue("view-count", 0, 258, 2000, false);     // Integers
    animateValue("percent-count", 0, 106.4, 2000, true); // Floats

    // 2. Start WhatsApp Animation AFTER Stats finish (2000ms delay)
    setTimeout(startWhatsappCounter, 800);
    


    const startPerformanceAnimation = () => {
        // Find all 3 gauges
        const gauges = document.querySelectorAll('.gauge-circle');
        
        gauges.forEach((gauge) => {
            let start = 0;
            const end = 100;
            const duration = 3000; // 1.5 seconds to fill
            
            let startTime = null;

            const animateGauge = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                // 1. Calculate the current number (0 to 100)
                const currentVal = Math.floor(progress * (end - start) + start);
                
                // 2. Update Text
                gauge.innerText = currentVal;
                
                // 3. Update the Ring Fill (CSS Variable)
                gauge.style.setProperty('--p', `${currentVal}%`);

                if (progress < 1) {
                    window.requestAnimationFrame(animateGauge);
                }
            };
            
            window.requestAnimationFrame(animateGauge);
        });
    };

    // Trigger this 4.5 seconds after page load (Wait for Stats + WhatsApp)
    setTimeout(startPerformanceAnimation, 3500);



    // --- PART 3: The Grand Finale (Google Checkmark) ---
    
    const startGoogleAnimation = () => {
        const checkIcon = document.getElementById('google-check');
        if (checkIcon) {
            // Adds the CSS class that triggers the keyframe pop
            checkIcon.classList.add('animate-check');
        }
    };

    // Trigger this at 6800ms (Right after the 3000ms Performance gauges finish)
    setTimeout(startGoogleAnimation, 6800);


/* 
############################################
   Stacking Service Cards Animations
############################################
*/

//Select all service cards
const cards = document.querySelectorAll('.service-card');
    const headerWrapper = document.querySelector('.sticky-header-wrapper'); // Select the wrapper
    const progressBar = document.getElementById('card-progress');
    const totalCards = cards.length; 

    window.addEventListener('scroll', () => {
        let stuckCount = 0;

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            // Get the sticky top value dynamically (26rem converted to px)
            const stickyTop = parseInt(window.getComputedStyle(card).top);

            // Check if THIS card is stuck
            // Using a small buffer (+5px) to ensure smooth triggering
            if (rect.top <= stickyTop + 5) { 
                card.classList.add('is-stuck');
                stuckCount++; 
            } else {
                card.classList.remove('is-stuck');
            }
        });

        // --- NEW LOGIC: Visibility Trigger ---
        // If the FIRST card is stuck, show the bar.
        if (cards[0].classList.contains('is-stuck')) {
            headerWrapper.classList.add('show-bar');
        } else {
            headerWrapper.classList.remove('show-bar');
        }

        // --- Progress Calculation ---
        const percentage = (stuckCount / totalCards) * 100;
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

    }, { passive: true });

    

/*
 ## Keeping title and progress bar on thier places
*/
    const syncStickyExit = () => {
    const titleWrapper = document.querySelector('.sticky-header-wrapper');
    const finalCard = document.querySelector('.service-card:nth-of-type(4)');
    
    if (!titleWrapper || !finalCard) return;

    let ticking = false; // Acts as a traffic light to prevent overload

    const updatePosition = () => {
// 1. READ: Get the card's position
        const cardRect = finalCard.getBoundingClientRect();
        
        // ⚠️ THE RESPONSIVE FIX: Dynamically read the 'top' value from your CSS!
        // If it's desktop, it reads 380. If tablet, it reads 300. It adapts automatically!
        const stickyPoint = parseInt(window.getComputedStyle(finalCard).top);

        // 2. WRITE: Apply the transform
        if (cardRect.top < stickyPoint) {
            const pushDistance = stickyPoint - cardRect.top;
            titleWrapper.style.transform = `translateY(-${pushDistance}px)`;
        } else {
            titleWrapper.style.transform = 'translateY(0)';
        }

        // 3. Reset the traffic light
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        // If a frame is already queued up, ignore this scroll event
        if (!ticking) {
            window.requestAnimationFrame(updatePosition);
            ticking = true;
        }
    }, { passive: true }); // passive: true tells the browser we won't block the scroll
};

syncStickyExit();



/* 
############################################
  Portfolio mockups Animations
############################################
*/

// 1. Create the sensor
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
        // 2. If the h2 Title is visible on the screen
        if (entry.isIntersecting) { 
            
            // 3. Find elements inside the same section
            const section = entry.target.closest('.portfolio-section');
            const mockup = section.querySelector('.mockup-composite');
            
            // 4. Add the class that scales the mockup up to 100%
            if (mockup) {
                mockup.classList.add('is-visible');
            }
            
            // ⚠️ THE NEW ADDITION: Find the small hexagon and wake it up!
            const smallHex = section.querySelector('.shape-hex-small');
            if (smallHex) {
                smallHex.classList.add('is-breathing');
            }
            
            // 5. Turn off the sensor so it only happens once
            revealObserver.unobserve(entry.target); 
        }
    });
}, { 
    threshold: 1 // Triggers when the h2 is 100% visible on the screen
});

// 6. Tell the sensor to watch the h2 Title in your portfolio header
const titleTarget = document.querySelector('.portfolio-header h2');
if (titleTarget) {
    revealObserver.observe(titleTarget);
}



/* ############################################
  About Me Shapes Breathing Animation
############################################
*/

// 1. Create a sensor specifically for the About section shapes
const aboutShapesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
        // 2. When the shape enters the screen
        if (entry.isIntersecting) {
            
            // 3. Add the class that triggers your CSS @keyframes
            entry.target.classList.add('is-breathing');
            
            // 4. Turn off the sensor so it just keeps breathing forever
            aboutShapesObserver.unobserve(entry.target);
        }
    });
}, {
    // Triggers when just 10% of the shape becomes visible
    threshold: 0.1 
});

// 5. Find your specific About section shapes and tell the sensor to watch them
const aboutShapes = document.querySelectorAll('.shape-above-head, .shape-above-title');

aboutShapes.forEach(shape => {
    if (shape) {
        aboutShapesObserver.observe(shape);
    }
});


/* 
############################################
  Pricing Cards Animations
############################################
*/
window.addEventListener("load", (event) => {
    // 1. Register the plugin
    gsap.registerPlugin(ScrollTrigger);

// 2. Create the GSAP Media Query logic
let pricingMm = gsap.matchMedia();
pricingMm.add("(max-width: 1100px)", () => {

// ==========================================
// 2. Set the 3D Deck Initial States
// (Replacing filter with our CSS variable)
// ==========================================
gsap.set("#card-1", { y: "0rem", scale: 1, "--overlay-opacity": 0, transformOrigin: "center center", lazy: true });
gsap.set("#card-2", { y: "3.5rem", scale: 0.95, "--overlay-opacity": 0.08, transformOrigin: "bottom center", lazy: true });
gsap.set("#card-3", { y: "7rem", scale: 0.90, "--overlay-opacity": 0.15, transformOrigin: "bottom center", lazy: true });

// ==========================================
// 3. The Scroll Scrub Timeline (SEO Safe)
// ==========================================
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".pricing-scroll-track",
        start: "top top", 
        end: "bottom bottom", 
        scrub: 0.8 
    }
});

// --- PHASE 1 ---
tl.to("#card-1", { 
    yPercent: -150,    // 👈 Increased from -120 to -150 to ensure it flies completely out of view
    rotation: -4,      
    ease: "power1.inOut", 
    duration: 0.4,
    lazy: true 
}, "phase1")
// 🗑️ Removed the opacity: 0 block here!

.to("#card-2", { 
    y: "0rem", scale: 1, "--overlay-opacity": 0, 
    duration: 0.4,
    lazy: true 
}, "phase1")
.to("#card-3", { 
    y: "3.5rem", scale: 0.95, "--overlay-opacity": 0.08, 
    duration: 0.4,
    lazy: true 
}, "phase1");


// --- PHASE 2 ---
tl.to("#card-2", { 
    yPercent: -150,   // 👈 Increased here as well
    rotation: 4, 
    ease: "power1.inOut", 
    duration: 0.4,
    lazy: true 
}, "phase2")
// 🗑️ Removed the opacity: 0 block here!

.to("#card-3", { 
    y: "0rem", scale: 1, "--overlay-opacity": 0, 
    duration: 0.4,
    lazy: true 
}, "phase2");
 
});
});
