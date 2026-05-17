/* =============================================
   KNOCKOUT FITNESS — MAIN JAVASCRIPT
   Premium Animations & Interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── ACTIVE NAV LINK ─────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    if (link.getAttribute('href') === currentPage ||
        (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── NAV SCROLL STYLE ─────────────────────── */
  const nav     = document.querySelector('.nav');
  const backTop = document.querySelector('.back-top');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 60);
    backTop?.classList.toggle('visible', y > 300);
    if (y > 120) {
      nav?.classList.toggle('nav-hidden', y > lastY + 6);
    } else {
      nav?.classList.remove('nav-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── BACK TO TOP ─────────────────────────── */
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── HAMBURGER ────────────────────────────── */
  const burger    = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.nav-mobile');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─── SMOOTH ANCHOR LINKS ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
      ) || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ─── SCROLL REVEAL ────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── COUNTER ANIMATION ─────────────────────*/
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const animateCounter = el => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const fps      = 60;
    const steps    = duration / (1000 / fps);
    let current    = 0;
    const easeOut  = t => 1 - Math.pow(1 - t, 3);
    const timer = setInterval(() => {
      current++;
      const progress = easeOut(Math.min(current / steps, 1));
      const val = target * progress;
      el.textContent = (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1)) + suffix;
      if (current >= steps) { el.textContent = target + suffix; clearInterval(timer); }
    }, 1000 / fps);
  };
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ─── HERO PARALLAX (index only) ──────────── */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBgImg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.25}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── PAGE HERO PARALLAX (inner pages) ────── */
  const pageHeroBg = document.querySelector('.page-hero-bg img');
  if (pageHeroBg) {
    let ticking2 = false;
    window.addEventListener('scroll', () => {
      if (!ticking2) {
        requestAnimationFrame(() => {
          pageHeroBg.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.1)`;
          ticking2 = false;
        });
        ticking2 = true;
      }
    }, { passive: true });
  }

  /* ─── 3D CARD TILT ON MOUSE HOVER ─────────── */
  const tiltCards = document.querySelectorAll(
    '.feature-card, .review-card, .service-card, .pricing-card'
  );
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform  = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) scale(1.02)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
    });
  });

  /* ─── GALLERY IMAGE — MOUSE TRACK ZOOM ORIGIN */
  document.querySelectorAll('.gallery-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    });
    item.addEventListener('mouseleave', () => {
      img.style.transformOrigin = 'center center';
    });
  });

  /* ─── BUTTON CLICK RIPPLE ─────────────────── */
  const injectRippleStyle = () => {
    if (document.getElementById('rippleStyle')) return;
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
    document.head.appendChild(s);
  };
  injectRippleStyle();

  document.querySelectorAll('.btn, .cta-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position: 'absolute',
        width: size + 'px', height: size + 'px',
        left: (e.clientX - rect.left - size / 2) + 'px',
        top:  (e.clientY - rect.top  - size / 2) + 'px',
        background: 'rgba(255,255,255,0.22)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'rippleAnim 0.65s ease-out forwards',
        pointerEvents: 'none',
        zIndex: '10'
      });
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 750);
    });
  });

  /* ─── MAGNETIC BUTTONS ────────────────────── */
  document.querySelectorAll('.btn-primary, .cta-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ─── RATING BARS ─────────────────────────── */
  const bars = document.querySelectorAll('.bar-fill');
  if (bars.length && 'IntersectionObserver' in window) {
    const bObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transition = 'width 1.3s cubic-bezier(0.23,1,0.32,1)';
          el.style.width = el.dataset.width;
          bObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => { b.style.width = '0'; bObs.observe(b); });
  }

  /* ─── REVIEW FILTER TABS ─────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.review-card[data-rating]').forEach(card => {
        const show = f === 'all' || card.dataset.rating === f;
        card.style.display   = show ? '' : 'none';
        card.style.animation = show ? 'fadeIn 0.4s ease both' : '';
      });
    });
  });

  /* ─── TODAY HIGHLIGHT ─────────────────────── */
  const days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours-row .day').forEach(cell => {
    if (cell.textContent.trim() === today) cell.closest('.hours-row')?.classList.add('today');
  });

  /* ─── PRICING TOGGLE ─────────────────────── */
  const pToggle = document.getElementById('pricingToggle');
  if (pToggle) {
    const prices = {
      monthly: { basic: '999', standard: '1499', premium: '1999' },
      yearly:  { basic: '799', standard: '1199', premium: '1599' }
    };
    pToggle.addEventListener('change', () => {
      const mode  = pToggle.checked ? 'yearly' : 'monthly';
      const label = document.getElementById('toggleLabel');
      const knob  = document.getElementById('toggleKnob');
      if (label) label.textContent = mode === 'yearly' ? 'Yearly (Save 20%)' : 'Monthly';
      if (knob) {
        knob.style.transform = pToggle.checked ? 'translateX(24px)' : 'translateX(0)';
        const track = knob.parentElement.querySelector('span');
        if (track) track.style.background = pToggle.checked ? 'var(--yellow-dim)' : 'var(--border)';
      }
      document.querySelectorAll('.pricing-price').forEach(el => {
        const plan = el.dataset.plan;
        if (plan && prices[mode][plan]) el.innerHTML = `<sup>₹</sup>${prices[mode][plan]}`;
      });
    });
  }

  /* ─── AUTO STAGGER GRID CHILDREN ─────────── */
  document.querySelectorAll('.features-grid, .reviews-grid, .services-grid, .pricing-grid').forEach(grid => {
    [...grid.children].forEach((el, i) => {
      const cls = el.classList;
      if (!cls.contains('reveal-delay-1') && !cls.contains('reveal-delay-2') &&
          !cls.contains('reveal-delay-3') && !cls.contains('reveal-delay-4')) {
        el.classList.add(`reveal-delay-${(i % 3) + 1}`);
      }
    });
  });

  /* ─── NAV HIDE-ON-SCROLL CSS ─────────────── */
  if (!document.getElementById('navHideStyle')) {
    const s = document.createElement('style');
    s.id = 'navHideStyle';
    s.textContent = `
      .nav { transition: background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s, transform 0.35s cubic-bezier(0.23,1,0.32,1); }
      .nav-hidden { transform: translateY(-100%) !important; }
    `;
    document.head.appendChild(s);
  }

  /* ─── ABOUT IMAGE MOUSE TILT ─────────────── */
  const aboutMedia = document.querySelector('.about-media');
  const aboutImg   = aboutMedia?.querySelector('.about-media-img');
  if (aboutMedia && aboutImg) {
    aboutMedia.addEventListener('mousemove', e => {
      const rect = aboutMedia.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      aboutImg.style.transform  = `scale(1.04) rotate(${dx * 1.2}deg) translateY(${dy * -6}px)`;
      aboutImg.style.transition = 'transform 0.1s ease';
    });
    aboutMedia.addEventListener('mouseleave', () => {
      aboutImg.style.transform  = '';
      aboutImg.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });
  }

});
