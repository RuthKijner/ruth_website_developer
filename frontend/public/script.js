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





 /* ############################################

 Pricing Cards Scroll Animation (Pure Memory Tracker) 

############################################

*/


// ⚠️ THE FIX: A pure internal memory tracker. 

// It guarantees the logic can NEVER skip a step or fire two cards at once.

let activeState = 0; 

let isLocked = false;

const lockDuration = 900; 


function evaluateCards() {

    const track = document.querySelector('.pricing-scroll-track');

    if (!track || isLocked) return;


    const rect = track.getBoundingClientRect();

    const vh = window.innerHeight;

    const distanceScrolled = -rect.top;


    const card1 = document.getElementById('card-1');

    const card2 = document.getElementById('card-2');

    const card3 = document.getElementById('card-3');

    if (!card1 || !card2 || !card3) return;


    // 1. TARGET: Where should the user be based on scroll depth?

    let targetState = 0;

    if (distanceScrolled > vh * 2.0) targetState = 2;      

    else if (distanceScrolled > vh * 1) targetState = 1; 


    // If we are already at the target, do nothing.

    if (targetState === activeState) return;


    // ==========================================

    // 2. MOVE STRICTLY ONE SINGLE STEP AT A TIME

    // ==========================================


    if (targetState > activeState) {

        // --- SCROLLING DOWN ---

        

        if (activeState === 0) {

            // STEP 1: State 0 -> 1 (Card 1 flies back)

            activeState = 1; 

            

            card1.classList.remove('bring-front');

            card1.classList.add('send-back');

            

            card2.classList.remove('bring-front');

            card2.classList.add('move-up'); 

            card3.classList.add('move-up-half'); 

            

            triggerLock(); 

            

        } else if (activeState === 1) {

            // STEP 2: State 1 -> 2 (Card 2 flies back)

            activeState = 2; 

            

            card2.classList.remove('bring-front');

            card2.classList.remove('move-up'); 

            card2.classList.add('send-back');

            

            card3.classList.remove('move-up-half'); 

            card3.classList.add('move-up-full'); 

            

            triggerLock(); 

        }

    } 

    else if (targetState < activeState) {

        // --- SCROLLING UP ---

        

        if (activeState === 2) {

            // STEP 1: State 2 -> 1 (Card 2 returns)

            activeState = 1; 

            

            card2.classList.remove('send-back');

            card2.classList.add('bring-front');

            card2.classList.add('move-up');

            

            card3.classList.remove('move-up-full');

            card3.classList.add('move-up-half');

            

            triggerLock(); 

            

        } else if (activeState === 1) {

            // STEP 2: State 1 -> 0 (Card 1 returns)

            activeState = 0; 

            

            card1.classList.remove('send-back');

            card1.classList.add('bring-front');

            

            card2.classList.remove('bring-front');

            setTimeout(() => {

                card2.classList.remove('move-up');

                card3.classList.remove('move-up-half');

            }, 50);

            

            triggerLock(); 

        }

    }

}


// 3. THE VAULT DOOR LOCK

function triggerLock() {

    isLocked = true; 

    setTimeout(() => {

        isLocked = false; 

        // Force the code to re-check the scroll position ONLY after the animation is fully done

        evaluateCards(); 

    }, lockDuration);

}


// Listen for scrolling

window.addEventListener('scroll', evaluateCards); 