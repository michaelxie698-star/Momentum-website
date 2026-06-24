// ============================================================
// FITS — app.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initAccordions();
  initFaqSearch();
});

/* ---------------- Navbar scroll state ---------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------- Mobile menu ---------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    overlay && overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay && overlay.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------------- Scroll reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------------- Back to top ---------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------- Accordions ---------------- */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const wasOpen = item.classList.contains('open');

      // close siblings within the same accordion group only
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
      }

      if (wasOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------- FAQ search + filter ---------------- */
function initFaqSearch() {
  const input = document.querySelector('.faq-search input');
  const tabs = document.querySelectorAll('.faq-tab');
  const categories = document.querySelectorAll('.faq-category-block');
  const emptyState = document.querySelector('.faq-empty');
  if (!input && !tabs.length) return;

  let activeCategory = 'all';

  const applyFilter = () => {
    const query = (input ? input.value : '').trim().toLowerCase();
    let anyVisible = false;

    categories.forEach(cat => {
      const catName = cat.dataset.category;
      const items = cat.querySelectorAll('.accordion-item');
      let catHasVisible = false;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matchesQuery = !query || text.includes(query);
        const matchesCategory = activeCategory === 'all' || activeCategory === catName;
        const visible = matchesQuery && matchesCategory;
        item.style.display = visible ? '' : 'none';
        if (visible) catHasVisible = true;
      });

      cat.style.display = catHasVisible ? '' : 'none';
      if (catHasVisible) anyVisible = true;
    });

    emptyState && emptyState.classList.toggle('show', !anyVisible);
  };

  input && input.addEventListener('input', applyFilter);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.filter;
      applyFilter();
    });
  });

  applyFilter();
}
