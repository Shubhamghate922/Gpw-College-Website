/* =========================================================
   GOVERNMENT POLYTECHNIC WASHIM — script.js
   Combined: Page 1 (Header/Nav/Hero/Leadership) +
             Page 2 (Updates & Announcements Ticker/Cards)
   Production-Ready Version — All fixes applied
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     UTILITY: Safe querySelector wrappers
  ========================================================= */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


  /* =========================================================
     1. NAVBAR — STICKY SHADOW ON SCROLL
  ========================================================= */
  const navbar = $('#navbar');

  if (navbar) {
    const handleNavbarScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }


  /* =========================================================
     2. HOME LINK — SMOOTH SCROLL TO TOP
  ========================================================= */
  const homeLink = $('#homeLink');

  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveNav(homeLink.closest('.nav-item'));
    });
  }


  /* =========================================================
     3. ACTIVE NAV ITEM
  ========================================================= */
  const navItems = $$('.nav-item');

  function setActiveNav(targetItem) {
    if (!targetItem) return;
    navItems.forEach(item => item.classList.remove('active'));
    targetItem.classList.add('active');
  }

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (!link) return;
    link.addEventListener('click', () => {
      if (!item.classList.contains('has-dropdown')) {
        setActiveNav(item);
      }
    });
  });


  /* =========================================================
     4. DROPDOWN MENU (Click & Keyboard)
  ========================================================= */
  const dropdownItems = $$('.has-dropdown');

  function closeAllDropdowns(except = null) {
    dropdownItems.forEach(d => {
      if (d === except) return;
      d.classList.remove('open');
      const btn = d.querySelector('[aria-expanded]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownItems.forEach(dropdownItem => {
    const trigger = dropdownItem.querySelector('.nav-link');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdownItem.classList.contains('open');
      closeAllDropdowns(dropdownItem);

      dropdownItem.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      const openTrigger = $('.has-dropdown.open .nav-link');
      if (openTrigger) openTrigger.focus();
    }
  });


  /* =========================================================
     5. MOBILE HAMBURGER MENU
  ========================================================= */
  const hamburger = $('#hamburger');
  const navList   = $('#navList');

  function closeMobileMenu() {
    if (!navList || !hamburger) return;
    navList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (!navList || !hamburger) return;
    navList.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.contains('open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    $$('.nav-link', navList).forEach(link => {
      link.addEventListener('click', () => {
        if (!link.closest('.has-dropdown')) {
          closeMobileMenu();
        }
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }, { passive: true });


  /* =========================================================
     6. LANGUAGE TOGGLE (English ↔ Marathi)
  ========================================================= */
  const langBtn   = $('#langBtn');
  const langLabel = $('#langLabel');

  const LANGS = {
    en: { label: 'English', attr: 'en' },
    mr: { label: 'मराठी',   attr: 'mr' },
  };

  let currentLang = 'en';

  if (langBtn && langLabel) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'mr' : 'en';
      const lang  = LANGS[currentLang];

      langLabel.textContent = lang.label;
      langBtn.setAttribute('lang', lang.attr);
      langBtn.setAttribute('aria-pressed', String(currentLang === 'mr'));

      langLabel.style.opacity = '0';
      setTimeout(() => { langLabel.style.opacity = '1'; }, 150);
    });
  }


  /* =========================================================
     7. HERO IMAGE SLIDER
  ========================================================= */
  const slides      = $$('.hero-slide');
  const dotsWrap    = $('#sliderDots');
  const prevBtn     = $('#sliderPrev');
  const nextBtn     = $('#sliderNext');
  const heroSection = $('.hero');

  let currentSlide = 0;
  let sliderTimer  = null;
  let isPaused     = false;

  const SLIDE_DELAY = 5000;
  const SLIDE_COUNT = slides.length;

  if (SLIDE_COUNT > 0) {

    /* ---- Build Dots ---- */
    const dots = [];

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${SLIDE_COUNT}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

        dot.addEventListener('click', () => {
          goToSlide(i);
          resetTimer();
        });

        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    /* ---- Go to Slide ---- */
    function goToSlide(index) {
      const previous = currentSlide;
      currentSlide = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

      if (previous === currentSlide) return;

      slides[previous].classList.remove('active');
      slides[currentSlide].classList.add('active');

      if (dots[previous]) {
        dots[previous].classList.remove('active');
        dots[previous].setAttribute('aria-selected', 'false');
      }
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
      }
    }

    /* ---- Timer Management ---- */
    function startTimer() {
      if (isPaused) return;
      clearInterval(sliderTimer);
      sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_DELAY);
    }

    function stopTimer() {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    /* ---- Arrow Controls ---- */
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetTimer();
      });
    }

    /* ---- Pause on Hover ---- */
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => {
        isPaused = true;
        stopTimer();
      });

      heroSection.addEventListener('mouseleave', () => {
        isPaused = false;
        startTimer();
      });

      /* ---- Touch Swipe Support ---- */
      let touchStartX = 0;
      let touchStartY = 0;

      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        const deltaX = touchStartX - e.changedTouches[0].clientX;
        const deltaY = touchStartY - e.changedTouches[0].clientY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          goToSlide(deltaX > 0 ? currentSlide + 1 : currentSlide - 1);
          resetTimer();
        }
      }, { passive: true });
    }

    /* ---- Keyboard Navigation (only when hero is visible) ---- */
    document.addEventListener('keydown', (e) => {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        resetTimer();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        resetTimer();
      }
    });

    /* ---- Visibility API — pause when tab hidden ---- */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopTimer();
      } else if (!isPaused) {
        startTimer();
      }
    });

    /* ---- Start Slider ---- */
    startTimer();

  } // end if SLIDE_COUNT > 0


  /* =========================================================
     8. SCROLL INDICATOR — Hide after first scroll
  ========================================================= */
  const scrollIndicator = $('.scroll-indicator');

  if (scrollIndicator) {
    const hideScrollIndicator = () => {
      if (window.scrollY > 50) {
        scrollIndicator.style.opacity       = '0';
        scrollIndicator.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideScrollIndicator);
      }
    };
    window.addEventListener('scroll', hideScrollIndicator, { passive: true });
  }


  /* =========================================================
     9. BUTTON RIPPLE EFFECT
  ========================================================= */
  (function injectRippleStyle() {
    if (document.getElementById('ripple-style')) return;
    const style = document.createElement('style');
    style.id    = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { width: 200px; height: 200px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  })();

  $$('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position:       absolute;
        left:           ${x}px;
        top:            ${y}px;
        width:          0;
        height:         0;
        border-radius:  50%;
        background:     rgba(255,255,255,0.35);
        transform:      translate(-50%, -50%);
        animation:      rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* =========================================================
     10. INTERSECTION OBSERVER — Animate hero stats on entry
  ========================================================= */
  const statNums = $$('.stat-num');

  if ('IntersectionObserver' in window && statNums.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNums.forEach(el => statObserver.observe(el));
  }

  function animateCountUp(el) {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw.replace(/[^\d.]/g, ''));
    if (isNaN(target)) return;

    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.floor(eased * target);

      el.textContent = value + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };

    requestAnimationFrame(step);
  }


  /* =========================================================
     11. LEADERSHIP CARDS — Staggered scroll-in animation
  ========================================================= */
  const leaderCards = $$('.leader-card');

  if ('IntersectionObserver' in window && leaderCards.length > 0) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const card  = entry.target;
        const delay = parseInt(card.dataset.delay || '0', 10);

        setTimeout(() => {
          card.classList.add('visible');
        }, delay);

        cardObserver.unobserve(card);
      });
    }, { threshold: 0.15 });

    leaderCards.forEach(card => cardObserver.observe(card));

  } else {
    leaderCards.forEach(card => card.classList.add('visible'));
  }


  /* =========================================================
     12. UPDATES SECTION — NEWS TICKER (Seamless loop)
  ========================================================= */
  const tickerContent = $('#tickerContent');

  if (tickerContent) {
    // Clone content for seamless infinite scroll
    const clone = tickerContent.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    tickerContent.parentElement.appendChild(clone);

    // Scale duration to text length for consistent reading speed
    const textLength = tickerContent.scrollWidth;
    const duration   = Math.max(20, textLength / 60);

    [tickerContent, clone].forEach(el => {
      el.style.animationDuration = `${duration}s`;
    });

    // Ensure all ticker links open safely
    $$('.ticker-link').forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }


  /* =========================================================
     13. UPDATES SECTION — INFO CARDS Staggered entrance
  ========================================================= */
  const infoCards = $$('.info-card');

  if (infoCards.length > 0) {
    if ('IntersectionObserver' in window) {
      const infoCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = Array.from(infoCards).indexOf(entry.target) * 120;
            setTimeout(() => {
              entry.target.classList.remove('card-hidden');
              entry.target.classList.add('card-visible');
            }, delay);
            infoCardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      infoCards.forEach(card => {
        card.classList.add('card-hidden');
        infoCardObserver.observe(card);
      });

    } else {
      infoCards.forEach(card => card.classList.add('card-visible'));
    }
  }


  /* =========================================================
     14. KEYBOARD ACCESSIBLE FOCUS STYLING for card links
  ========================================================= */
  $$('.card-link').forEach(link => {
    link.addEventListener('focus', () => {
      link.style.outline       = '2px solid currentColor';
      link.style.outlineOffset = '2px';
    });
    link.addEventListener('blur', () => {
      link.style.outline       = '';
      link.style.outlineOffset = '';
    });
  });

}); // end DOMContentLoaded
