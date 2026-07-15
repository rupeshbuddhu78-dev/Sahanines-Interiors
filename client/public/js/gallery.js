/* Gallery — masonry, filter, infinite scroll, lightbox */
(function () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const state = {
    category: new URLSearchParams(location.search).get('category') || 'all',
    search: '',
    page: 1,
    pages: 1,
    loading: false,
    all: [],
  };

  const chips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('gallerySearch');

  chips.forEach((c) =>
    c.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      state.category = c.dataset.category;
      state.page = 1;
      grid.innerHTML = '';
      state.all = [];
      load();
    })
  );
  chips.forEach((c) => c.classList.toggle('active', c.dataset.category === state.category));

  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        grid.innerHTML = '';
        state.all = [];
        load();
      }, 350);
    });
  }

  async function load() {
    if (state.loading || state.page > state.pages) return;
    state.loading = true;
    const spinner = document.getElementById('gallerySpinner');
    if (spinner) spinner.style.display = 'block';

    try {
      const params = new URLSearchParams({
        page: state.page,
        limit: 15,
        ...(state.category !== 'all' && { category: state.category }),
        ...(state.search && { search: state.search }),
      });
      const res = await API.get(`/gallery?${params.toString()}`);
      state.pages = res.pages || 1;
      res.items.forEach((item) => {
        state.all.push(item);
        grid.appendChild(createItem(item, state.all.length - 1));
      });
      state.page++;
      if (!res.items.length && state.all.length === 0) {
        grid.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--clr-muted);">No images found.</p>';
      }
    } catch (err) {
      console.error(err);
      window.toast('Failed to load gallery', 'error');
    } finally {
      state.loading = false;
      if (spinner) spinner.style.display = 'none';
    }
  }

  function createItem(item, index) {
    const div = document.createElement('div');
    div.className = 'masonry-item';
    div.innerHTML = `
      <img src="${item.image.url}" alt="${escapeHtml(item.title)}" loading="lazy">
      <div class="overlay">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.location || item.projectName || '')}</p>
        </div>
      </div>
    `;
    div.addEventListener('click', () => openLightbox(index));
    return div;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  // ----- Lightbox -----
  let lightbox;
  let currentIndex = 0;

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">✕</button>
      <button class="lightbox-prev" aria-label="Previous">‹</button>
      <img alt="">
      <button class="lightbox-next" aria-label="Next">›</button>
    `;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showLightbox(currentIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showLightbox(currentIndex + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
    });
  }

  function openLightbox(index) {
    ensureLightbox();
    showLightbox(index);
  }
  function showLightbox(index) {
    if (index < 0) index = state.all.length - 1;
    if (index >= state.all.length) index = 0;
    currentIndex = index;
    const item = state.all[index];
    if (!item) return;
    lightbox.querySelector('img').src = item.image.url;
    lightbox.querySelector('img').alt = item.title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ----- Infinite scroll -----
  const sentinel = document.getElementById('gallerySentinel');
  if (sentinel) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) load();
        });
      },
      { rootMargin: '400px' }
    );
    io.observe(sentinel);
  }

  // Initial load
  load();
})();
