/* ===================================================================
   Sahanines Interiors - Main Site Interactions
   ================================================================= */
(function () {
  'use strict';

  // ---------- Header scroll state ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const setState = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', setState, { passive: true });
    setState();
  }

  // ---------- Mobile menu ----------
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  // ---------- Active nav link ----------
  const normalizePath = (value) => {
    if (!value) return '';
    let out = value.trim().split('#')[0].split('?')[0];
    out = out.replace(/\/$/, '') || '/';
    out = out.replace(/\.html$/, '');
    if (out === '/index') out = '/';
    return out;
  };

  const path = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-link').forEach((a) => {
    const rawHref = a.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
    const href = normalizePath(rawHref);
    if (href === path) a.classList.add('active');
  });

  // ---------- Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
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
  }

  // ---------- Counters ----------
  if ('IntersectionObserver' in window) {
    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.count, 10) || 0;
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
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (item) {
        // Auto-close other open accordions
        const openSibling = item.parentNode.querySelector('.faq-item.open');
        if (openSibling && openSibling !== item) {
          openSibling.classList.remove('open');
        }
        item.classList.toggle('open');
      }
    });
  });

  // ---------- Toast Notifications ----------
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
    if (typeof API === 'undefined') {
      console.warn('API utility is not defined. Skipping dynamic settings.');
      return;
    }
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
    if (typeof API === 'undefined') {
      window.toast('System API unavailable. Form submission halted.', 'error');
      return;
    }
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

  // ---------- Before/After Slider logic ----------
  const initBeforeAfterSliders = () => {
    document.querySelectorAll('.ba-slider').forEach((slider) => {
      const afterImg = slider.querySelector('.ba-after');
      const handle = slider.querySelector('.ba-handle');
      if (!afterImg || !handle) return;

      const updateSlider = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const percentage = (x / rect.width) * 100;

        handle.style.left = `${percentage}%`;
        afterImg.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      };

      const onMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        updateSlider(clientX);
      };

      let isDragging = false;
      const startDragging = () => { isDragging = true; };
      const stopDragging = () => { isDragging = false; };

      slider.addEventListener('mousedown', startDragging);
      slider.addEventListener('touchstart', startDragging, { passive: true });
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);

      const handleMove = (e) => {
        if (!isDragging && e.type !== 'touchmove') return;
        onMove(e);
      };

      slider.addEventListener('mousemove', handleMove);
      slider.addEventListener('touchmove', handleMove, { passive: true });
    });
  };
  initBeforeAfterSliders();

  // ---------- Gallery Lightbox logic ----------
  const initLightbox = () => {
    const items = document.querySelectorAll('.masonry-item');
    if (items.length === 0) return;

    let currentIndex = 0;
    const images = Array.from(items).map(item => ({
      src: item.querySelector('img')?.src || '',
      alt: item.querySelector('img')?.alt || 'Interior project'
    }));

    let lb = document.querySelector('.lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
        <img src="" alt="" class="lightbox-img">
        <button class="lightbox-next" aria-label="Next">&#10095;</button>
      `;
      document.body.appendChild(lb);
    }

    const lbImg = lb.querySelector('.lightbox-img');
    const closeBtn = lb.querySelector('.lightbox-close');
    const prevBtn = lb.querySelector('.lightbox-prev');
    const nextBtn = lb.querySelector('.lightbox-next');

    const showImage = (index) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
    };

    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  };
  initLightbox();

})();
