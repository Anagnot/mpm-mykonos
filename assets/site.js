// MPM — site-wide nav + dropdown + scroll header behavior
(function () {
  // Sticky header solid-on-scroll
  const header = document.querySelector('.site-header');
  if (header && !header.classList.contains('always-solid')) {
    const update = () => {
      if (window.scrollY > 80) header.classList.add('solid');
      else header.classList.remove('solid');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // Dropdowns
  const items = document.querySelectorAll('.nav-item.has-dropdown');
  const scrim = document.querySelector('.nav-scrim');
  let openItem = null;

  const close = () => {
    if (openItem) {
      openItem.classList.remove('open');
      const dd = document.getElementById(openItem.dataset.dropdown);
      if (dd) dd.classList.remove('open');
      openItem = null;
    }
    scrim && scrim.classList.remove('open');
  };

  const open = (item) => {
    if (openItem && openItem !== item) close();
    item.classList.add('open');
    const dd = document.getElementById(item.dataset.dropdown);
    if (dd) dd.classList.add('open');
    scrim && scrim.classList.add('open');
    openItem = item;
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (openItem === item) close();
      else open(item);
    });
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) open(item);
    });
  });

  // hovering off the dropdown closes it (with a small grace period)
  let leaveTimer = null;
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach((dd) => {
    dd.addEventListener('mouseenter', () => { if (leaveTimer) clearTimeout(leaveTimer); });
    dd.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        leaveTimer = setTimeout(close, 150);
      }
    });
  });
  items.forEach((item) => {
    item.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        leaveTimer = setTimeout(close, 150);
      }
    });
  });

  // Scrim or outside click closes
  scrim && scrim.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const mnav = document.querySelector('.mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', () => {
      mnav.classList.toggle('open');
      header.classList.toggle('solid');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('open');
    }));
  }
})();

/* ============================================================
   Cookie consent · Back-to-top · Quotation popup
   Injected on every page that loads site.js.
   ============================================================ */
(function () {
  const COOKIE_KEY = 'mpm:cookie-consent';
  const QUOTE_KEY  = 'mpm:quote-popup-shown';

  /* ---------- Cookie consent banner ---------- */
  function initCookies() {
    if (localStorage.getItem(COOKIE_KEY)) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-copy">
          <span class="eyebrow">Cookies</span>
          <p>We use a few essential cookies to keep this site running and, with your consent, a small set to understand how it's used. Your preference is remembered on this device.</p>
        </div>
        <div class="cookie-actions">
          <button type="button" class="btn btn-secondary cookie-decline">Decline</button>
          <button type="button" class="btn btn-primary cookie-accept">Accept all</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('show'));

    const dismiss = (value) => {
      try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ value, ts: Date.now() })); } catch (_) {}
      banner.classList.remove('show');
      banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    };
    banner.querySelector('.cookie-accept').addEventListener('click', () => dismiss('accepted'));
    banner.querySelector('.cookie-decline').addEventListener('click', () => dismiss('declined'));
  }

  /* ---------- Back-to-top button ---------- */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg class="btt-progress" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="btt-track" cx="24" cy="24" r="22"/>
        <circle class="btt-fill"  cx="24" cy="24" r="22"/>
      </svg>
      <svg class="btt-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 19V5"/>
        <path d="m6 11 6-6 6 6"/>
      </svg>
    `;
    document.body.appendChild(btn);

    const fill = btn.querySelector('.btt-fill');
    const circumference = 2 * Math.PI * 22;
    if (fill) {
      fill.style.strokeDasharray = circumference.toFixed(2);
      fill.style.strokeDashoffset = circumference.toFixed(2);
    }

    let ticking = false;
    const update = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const y = window.scrollY;
      const ratio = Math.min(1, Math.max(0, y / max));
      if (y > 480) btn.classList.add('show');
      else btn.classList.remove('show');
      if (fill) fill.style.strokeDashoffset = (circumference * (1 - ratio)).toFixed(2);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    btn.addEventListener('click', () => {
      btn.classList.add('pulse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => btn.classList.remove('pulse'), 600);
    });
  }

  /* ---------- Quotation popup (fires past 70% scroll) ---------- */
  function initQuotePopup() {
    // Don't show on pages that already host the booking form.
    const path = (location.pathname.split('/').pop() || '').toLowerCase();
    if (path === 'book.html' || path === 'contact.html') return;
    if (sessionStorage.getItem(QUOTE_KEY)) return;

    const overlay = document.createElement('div');
    overlay.className = 'quote-popup';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'quote-popup-title');
    overlay.innerHTML = `
      <div class="quote-backdrop"></div>
      <div class="quote-card" role="document">
        <button type="button" class="quote-close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <span class="eyebrow">Complimentary</span>
        <span class="rule-gold"></span>
        <h3 id="quote-popup-title">Request a <em>free quotation</em>.</h3>
        <p>Tell us your dates, route and party size — a concierge will reply within the hour with a tailored, fixed-price proposal. No commitment.</p>
        <div class="quote-actions">
          <a class="btn btn-primary quote-cta" href="book.html">Get my free quote</a>
          <button type="button" class="btn btn-secondary quote-dismiss">Maybe later</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const card = overlay.querySelector('.quote-card');
    const close = () => {
      overlay.classList.remove('show');
      document.body.classList.remove('quote-open');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      try { sessionStorage.setItem(QUOTE_KEY, '1'); } catch (_) {}
    };
    overlay.querySelector('.quote-close').addEventListener('click', close);
    overlay.querySelector('.quote-dismiss').addEventListener('click', close);
    overlay.querySelector('.quote-backdrop').addEventListener('click', close);
    overlay.querySelector('.quote-cta').addEventListener('click', () => {
      try { sessionStorage.setItem(QUOTE_KEY, '1'); } catch (_) {}
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });

    let shown = false;
    const check = () => {
      if (shown) return;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const progress = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      // 70% of the page has been seen
      if (progress >= 0.7 || (window.scrollY / max) >= 0.7) {
        shown = true;
        window.removeEventListener('scroll', onScroll);
        document.body.classList.add('quote-open');
        requestAnimationFrame(() => overlay.classList.add('show'));
        if (card) setTimeout(() => card.focus && card.focus(), 50);
      }
    };
    let scheduled = false;
    const onScroll = () => {
      if (!scheduled) { requestAnimationFrame(() => { scheduled = false; check(); }); scheduled = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Also check on load — short pages may already be past 70%.
    setTimeout(check, 300);
  }

  const boot = () => { initCookies(); initBackToTop(); initQuotePopup(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
