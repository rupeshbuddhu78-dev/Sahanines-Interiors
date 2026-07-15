/* Sahanines Interiors - main site interactions */
(function () {
  'use strict';

  // ---------- Header scroll state ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const setState = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', setState, { passive: true });
    setState();
  }

  // ---------- Mobile menu and accordion ----------
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.nav-overlay');
  const megaWrap = document.querySelector('.nav-mega-wrap');

  const closeMenu = () => {
    if (hamburger && menu) {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  };

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking any link except the parent dropdown "Services" link on mobile
    menu.querySelectorAll('.nav-link:not(.nav-mega-wrap > .nav-link), .mega-menu a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // Toggle sub-menu (Services) accordion on mobile
    if (megaWrap) {
      const megaLink = megaWrap.querySelector('.nav-link');
      megaLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 1180) {
          e.preventDefault(); // Prevent navigating to /services.html directly on first tap
          megaWrap.classList.toggle('active');
        }
      });
    }
  }

  // Close menu when clicking the overlay background
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // ---------- Active nav link ----------
  const normalizePath = (value) => {
    let out = value.replace(/\/$/, '') || '/';
    out = out.replace(/\.html$/, '');
    if (out === '/index') out = '/';
    return out;
  };
  const path = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = normalizePath(a.getAttribute('href').split('#')[0].split('?')[0]);
    if (href === path) a.classList.add('active');
  });

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Counters ----------
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
          } else {
            el.textContent = current.toLocaleString() + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => countObserver.observe(c));

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // ---------- Toast ----------
  window.toast = function (message, type = 'info') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    stack.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.3s, transform 0.3s';
      t.style.opacity = 0;
      t.style.transform = 'translateX(120%)';
      setTimeout(() => t.remove(), 300);
    }, 4200);
  };

  // ---------- Populate settings-driven placeholders ----------
  async function loadSettings() {
    try {
      const { settings } = await API.get('/settings/public');
      if (!settings) return;
      // Update text placeholders
      document.querySelectorAll('[data-setting]').forEach((el) => {
        const key = el.dataset.setting;
        const val = key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), settings);
        if (val !== undefined && val !== null && val !== '') {
          if (el.tagName === 'A' && key.startsWith('social.')) el.href = val;
          else if (el.tagName === 'A' && key === 'contact.email') el.href = `mailto:${val}`;
          else if (el.tagName === 'A' && (key === 'contact.phone' || key === 'contact.whatsapp'))
            el.href = key === 'contact.whatsapp' ? `https://wa.me/${String(val).replace(/\D/g, '')}` : `tel:${val}`;
          else if (el.tagName === 'IMG') el.src = val.url || val;
          else el.textContent = val;
        }
      });
      // Update copyright placeholder
      const cp = document.querySelector('[data-copyright]');
      if (cp && settings.footer?.copyright) {
        cp.textContent = settings.footer.copyright.replace('{year}', new Date().getFullYear());
      }
      if (settings.seo?.title) document.title = settings.seo.title;
      const setMeta = (selector, value, attr = 'content') => {
        if (!value) return;
        const el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
      };
      setMeta('meta[name="description"]', settings.seo?.description);
      setMeta('meta[property="og:title"]', settings.seo?.title);
      setMeta('meta[property="og:description"]', settings.seo?.description);
      setMeta('meta[property="og:image"]', settings.seo?.ogImage?.url);
      setMeta('meta[name="twitter:image"]', settings.seo?.ogImage?.url);
      if (settings.logo?.url) {
        document.querySelectorAll('.brand-mark').forEach((el) => {
          el.innerHTML = `<img src="${settings.logo.url}" alt="${settings.websiteName || 'Sahanines Interiors'}" loading="lazy">`;
          el.classList.add('brand-mark-img');
        });
      }
      if (settings.hero?.background?.url) {
        document.querySelectorAll('.hero-bg').forEach((el) => {
          el.style.backgroundImage = `linear-gradient(90deg, rgba(13,15,16,.78), rgba(13,15,16,.24)), url("${settings.hero.background.url}")`;
        });
      }
      window.__siteSettings = settings;
    } catch (err) {
      console.warn('Settings load failed:', err.message);
    }
  }
  loadSettings();

  // ---------- Generic form handler ----------
  window.handleForm = async function (form, endpoint, options = {}) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Sending…';
    }
    try {
      const formData = new FormData(form);
      const useFormData = options.multipart || form.querySelector('input[type="file"]');
      const body = useFormData
        ? formData
        : Object.fromEntries(formData.entries());
      const res = await API.post(endpoint, body);
      window.toast(res.message || 'Submitted successfully.', 'success');
      form.reset();
      if (options.onSuccess) options.onSuccess(res);
    } catch (err) {
      window.toast(err.message || 'Something went wrong.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  };

  // ---------- Hero parallax (subtle) ----------
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }
})();
