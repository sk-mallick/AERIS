/* ============================================
   AERIS – Enhanced JavaScript v2.0
   Mobile drawer, micro-interactions, smooth UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // MOBILE NAV — Slide-in drawer with backdrop
  // =============================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  // Create backdrop overlay
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop && navToggle) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    navBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(navBackdrop);
  }

  function openNav() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    document.body.classList.add('nav-open');
    if (navBackdrop) {
      navBackdrop.style.display = 'block';
      // Force reflow for transition
      navBackdrop.offsetHeight;
      navBackdrop.classList.add('visible');
    }
  }

  function closeNav() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (navBackdrop) {
      navBackdrop.classList.remove('visible');
      setTimeout(() => { navBackdrop.style.display = 'none'; }, 350);
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  // Close on backdrop click
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
  }

  // Close on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeNav();
    }
  });

  // =============================================
  // NAVBAR SCROLL — Smooth shrink with elevation
  // =============================================
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 50);
      lastScroll = scrollY;
    }, { passive: true });
  }

  // =============================================
  // SCROLL REVEAL — IntersectionObserver
  // =============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -32px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // =============================================
  // ANIMATED COUNTERS — Smooth easing
  // =============================================
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2200;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(easedProgress * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // =============================================
  // TABS — Slide animation
  // =============================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.style.animation = 'none';
      });

      btn.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) {
        target.classList.add('active');
        // Re-trigger animation
        target.offsetHeight;
        target.style.animation = '';
      }
    });
  });

  // =============================================
  // ACTIVE NAV LINK — Auto-detect current page
  // =============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('#')[0];
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // =============================================
  // PARTICLES GENERATOR
  // =============================================
  const particleContainers = document.querySelectorAll('.particles');
  particleContainers.forEach(container => {
    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 14 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 8) + 's';
      const size = (Math.random() * 4 + 2) + 'px';
      particle.style.width = size;
      particle.style.height = size;
      if (Math.random() > 0.5) particle.style.background = '#7c5cfc';
      container.appendChild(particle);
    }
  });

  // =============================================
  // HEATMAP — Random cell animation
  // =============================================
  const heatmapCells = document.querySelectorAll('.heatmap-cell');
  if (heatmapCells.length > 0) {
    setInterval(() => {
      const randomCell = heatmapCells[Math.floor(Math.random() * heatmapCells.length)];
      const heatLevels = ['heat-1', 'heat-2', 'heat-3', 'heat-4', 'heat-5', 'heat-6', 'heat-7'];
      const newLevel = heatLevels[Math.floor(Math.random() * heatLevels.length)];
      heatLevels.forEach(h => randomCell.classList.remove(h));
      randomCell.classList.add(newLevel);
    }, 900);
  }

  // =============================================
  // RISK GAUGE — Animated needle
  // =============================================
  const gaugeNeedle = document.querySelector('.risk-gauge-needle');
  if (gaugeNeedle) {
    setTimeout(() => {
      gaugeNeedle.style.transform = 'translateX(-50%) rotate(25deg)';
    }, 600);
  }

  // =============================================
  // FAQ ACCORDION
  // =============================================
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // =============================================
  // CARD TILT — Subtle depth effect on hover
  // =============================================
  const tiltCards = document.querySelectorAll('.card, .card-glass');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 3;
      const tiltY = (x - 0.5) * -3;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
