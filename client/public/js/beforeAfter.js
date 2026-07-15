/* Before/After — comparison slider and cards */
(function () {
  // Initialize a single before/after slider
  window.initBaSlider = function (slider) {
    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    const setPos = (percent) => {
      percent = Math.max(0, Math.min(100, percent));
      after.style.clipPath = `inset(0 0 0 ${percent}%)`;
      handle.style.left = `${percent}%`;
    };

    const onMove = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPos(percent);
    };

    slider.addEventListener('mousedown', (e) => {
      dragging = true;
      onMove(e.clientX);
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => dragging && onMove(e.clientX));
    document.addEventListener('mouseup', () => (dragging = false));
    slider.addEventListener('touchstart', (e) => {
      dragging = true;
      onMove(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
      if (dragging) onMove(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener('touchend', () => (dragging = false));

    setPos(50);
  };

  // Auto-init all sliders on page
  document.querySelectorAll('.ba-slider').forEach((s) => window.initBaSlider(s));

  // Load public before-after projects into a grid
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const state = { type: 'all', search: '', page: 1, pages: 1, loading: false };
  const chips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('projectSearch');

  chips.forEach((c) =>
    c.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      state.type = c.dataset.type;
      state.page = 1;
      grid.innerHTML = '';
      load();
    })
  );
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.search = e.target.value.trim();
        state.page = 1;
        grid.innerHTML = '';
        load();
      }, 350);
    });
  }

  async function load() {
    if (state.loading || state.page > state.pages) return;
    state.loading = true;
    try {
      const params = new URLSearchParams({
        page: state.page,
        limit: 9,
        ...(state.type !== 'all' && { projectType: state.type }),
        ...(state.search && { search: state.search }),
      });
      const res = await API.get(`/before-after?${params.toString()}`);
      state.pages = res.pages || 1;
      res.items.forEach((item) => grid.appendChild(createCard(item)));
      grid.querySelectorAll('.ba-slider').forEach((s) => {
        if (!s.dataset.init) {
          window.initBaSlider(s);
          s.dataset.init = '1';
        }
      });
      state.page++;
      if (!res.items.length && state.page === 2) {
        grid.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--clr-muted);grid-column:1/-1;">No projects yet. Check back soon.</p>';
      }
    } catch (err) {
      console.error(err);
    } finally {
      state.loading = false;
    }
  }

  function createCard(item) {
    const div = document.createElement('article');
    div.className = 'ba-card reveal';
    const date = item.completionDate ? new Date(item.completionDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '';
    div.innerHTML = `
      <div class="ba-slider">
        <img class="ba-before" src="${item.beforeImage.url}" alt="Before" loading="lazy">
        <img class="ba-after" src="${item.afterImage.url}" alt="After" loading="lazy">
        <div class="ba-handle"></div>
        <span class="ba-label before">Before</span>
        <span class="ba-label after">After</span>
      </div>
      <div class="ba-body">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="ba-meta">
          <span>👤 ${escapeHtml(item.customerName || '')}</span>
          ${item.location ? `<span>📍 ${escapeHtml(item.location)}</span>` : ''}
          ${date ? `<span>🗓 ${date}</span>` : ''}
        </div>
        <p>${escapeHtml(item.description || '')}</p>
        <button class="btn btn-outline btn-sm" type="button" data-fullscreen>Fullscreen Preview</button>
      </div>
    `;
    div.querySelector('[data-fullscreen]').addEventListener('click', () => openFullscreen(item));
    setTimeout(() => div.classList.add('in'), 50);
    return div;
  }

  let fullModal;
  function openFullscreen(item) {
    if (!fullModal) {
      fullModal = document.createElement('div');
      fullModal.className = 'lightbox ba-fullscreen';
      fullModal.innerHTML = `
        <button class="lightbox-close" aria-label="Close">✕</button>
        <div class="ba-full-card"></div>
      `;
      document.body.appendChild(fullModal);
      fullModal.querySelector('.lightbox-close').addEventListener('click', closeFullscreen);
      fullModal.addEventListener('click', (e) => { if (e.target === fullModal) closeFullscreen(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFullscreen(); });
    }
    fullModal.querySelector('.ba-full-card').innerHTML = `
      <div class="ba-slider" style="width:min(1100px,92vw);height:min(70vh,720px);">
        <img class="ba-before" src="${item.beforeImage.url}" alt="Before ${escapeHtml(item.title)}">
        <img class="ba-after" src="${item.afterImage.url}" alt="After ${escapeHtml(item.title)}">
        <div class="ba-handle"></div>
        <span class="ba-label before">Before</span>
        <span class="ba-label after">After</span>
      </div>
      <h3 style="color:var(--clr-cream);margin-top:1rem;">${escapeHtml(item.title)}</h3>
    `;
    window.initBaSlider(fullModal.querySelector('.ba-slider'));
    fullModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeFullscreen() {
    if (fullModal) fullModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  load();
})();
