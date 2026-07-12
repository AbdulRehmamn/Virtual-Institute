/**
 * Leanovia Virtual Institute - Core Interactivity & SPA Router
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Router
  initRouter();

  // Header Scroll Effect (Sticky Header)
  initStickyHeader();

  // Mobile Navigation Toggle
  initMobileNav();

  // FAQ Accordions
  initFaqAccordion();

  // Scroll Reveal Animations
  initScrollReveal();

  // Stat Numbers Counter Animation
  initStatsCounter();

  // Hero Quick Search Form Handler
  initHeroQuickForm();

  // Request Booking Form Handler (WhatsApp Redirect)
  initBookingForm();
});

/* ==========================================
   SPA ROUTER LOGIC
   ========================================== */
function initRouter() {
  // Listen for hash changes
  window.addEventListener('hashchange', router);
  // Run on initial page load
  router();
}

function parseHashParams() {
  const hash = window.location.hash;
  const params = {};
  if (hash.includes('?')) {
    const queryPart = hash.split('?')[1];
    const pairs = queryPart.split('&');
    for (const pair of pairs) {
      const [key, val] = pair.split('=');
      if (key && val) {
        params[decodeURIComponent(key)] = decodeURIComponent(val);
      }
    }
  }
  return params;
}

function router() {
  const hash = window.location.hash || '#home';
  const homeView = document.getElementById('home-view');
  const bookingView = document.getElementById('booking-view');
  const navHomeLink = document.getElementById('nav-home-link');
  const navCurrLink = document.getElementById('nav-curr-link');
  const navHowLink = document.getElementById('nav-how-link');
  const navFaqLink = document.getElementById('nav-faq-link');
  const navContactLink = document.getElementById('nav-contact-link');

  // Deactivate all nav links
  [navHomeLink, navCurrLink, navHowLink, navFaqLink, navContactLink].forEach(link => {
    if (link) link.classList.remove('active');
  });

  // Check if Hash starts with #book-demo
  if (hash.startsWith('#book-demo')) {
    // Show booking page, hide home page
    if (homeView) homeView.classList.add('hidden');
    if (bookingView) bookingView.classList.remove('hidden');
    if (navContactLink) navContactLink.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Parse params and pre-fill form fields
    const params = parseHashParams();
    if (params.curriculum) {
      const gradeSelect = document.getElementById('grade-level');
      if (gradeSelect) {
        gradeSelect.value = params.curriculum;
      }
    }
    if (params.subject) {
      const subjectInput = document.getElementById('subjects');
      if (subjectInput) {
        subjectInput.value = params.subject;
      }
    }
  } else {
    // Show home page, hide booking page
    if (homeView) homeView.classList.remove('hidden');
    if (bookingView) bookingView.classList.add('hidden');

    // Setup active state for current section link
    if (hash === '#home' || hash === '') {
      if (navHomeLink) navHomeLink.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        if (hash === '#curriculums' && navCurrLink) navCurrLink.classList.add('active');
        if (hash === '#how-it-works' && navHowLink) navHowLink.classList.add('active');
        if (hash === '#faqs' && navFaqLink) navFaqLink.classList.add('active');

        // Scroll to the targeted section on home view
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  // Close mobile nav drawer on navigation
  const navMenu = document.getElementById('nav-menu');
  if (navMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
  }
}

/* ==========================================
   STICKY HEADER
   ========================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });
}

/* ==========================================
   MOBILE NAVIGATION MENU
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars-staggered';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        toggleBtn.querySelector('i').className = 'fa-solid fa-bars-staggered';
      }
    });
  }
}

/* ==========================================
   FAQ ACCORDIONS
   ========================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    
    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other active items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-body').style.maxHeight = null;
          }
        });
        
        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/* ==========================================
   STAT COUNTER ANIMATION
   ========================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const targetVal = parseInt(element.getAttribute('data-val'));
        const duration = 2000; // 2 seconds duration
        let startTime = null;

        function animateCount(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const currentVal = Math.floor(progress * targetVal);

          // Format value with commas for 10000 -> 10,000
          if (targetVal === 100) {
            element.innerHTML = `${currentVal}<span>%</span>`;
          } else if (targetVal >= 1000) {
            element.innerHTML = `${currentVal.toLocaleString()}<span>+</span>`;
          } else {
            element.innerHTML = `${currentVal}<span>+</span>`;
          }

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          }
        }
        
        requestAnimationFrame(animateCount);
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

/* ==========================================
   HERO QUICK FORM SUBMISSION
   ========================================== */
function initHeroQuickForm() {
  const quickForm = document.getElementById('hero-quick-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const curriculum = document.getElementById('hero-select-curriculum').value;
      const subject = document.getElementById('hero-select-grade').value;

      // Navigate to booking view with parameters
      window.location.hash = `#book-demo?curriculum=${encodeURIComponent(curriculum)}&subject=${encodeURIComponent(subject)}`;
    });
  }
}

/* ==========================================
   WHATSAPP BOOKING FORM REQUEST
   ========================================== */
function initBookingForm() {
  const bookingForm = document.getElementById('booking-request-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get Form Inputs
      const studentName = document.getElementById('student-name').value.trim();
      const mobileNumber = document.getElementById('mobile-number').value.trim();
      const emailAddress = document.getElementById('email-address').value.trim();
      const gradeLevel = document.getElementById('grade-level').value;
      const subjects = document.getElementById('subjects').value.trim();
      const tutorGender = document.querySelector('input[name="tutor-gender"]:checked')?.value || 'No Preference';
      const country = document.getElementById('country').value.trim();
      const referral = document.getElementById('referral').value;
      const notes = document.getElementById('notes').value.trim();

      // Format WhatsApp Message using WhatsApp Markdown (*bold*, _italics_)
      const message = 
`*LEANOVIA VIRTUAL INSTITUTE - DEMO REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Student Information:*
• *Name:* ${studentName}
• *WhatsApp:* ${mobileNumber}
• *Email:* ${emailAddress}

📚 *Academic Details:*
• *Grade / Level:* ${gradeLevel}
• *Target Subjects:* ${subjects}

⚙️ *Preferences & Location:*
• *Tutor Gender:* ${tutorGender}
• *Country:* ${country}
• *Source:* ${referral}

📝 *Additional Notes:*
${notes ? `"${notes}"` : 'None provided'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via Leanovia Web Booking System_`;

      // WhatsApp target number
      const targetPhone = "923404403594";
      
      // URL Encode text and redirect
      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
      
      // Open in a new tab/window
      window.open(whatsappUrl, '_blank');
    });
  }
}
