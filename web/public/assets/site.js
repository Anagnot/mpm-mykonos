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
