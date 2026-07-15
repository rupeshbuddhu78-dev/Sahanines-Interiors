/* ============================================================
   Sahanines Admin — Dashboard SPA controller
   ============================================================ */
(function () {
  'use strict';

  // ---------- Auth Guard ----------
  if (!API.getToken()) {
    window.location.href = '/admin/login';
    return;
  }

  const state = {
    admin: null,
    charts: {},
  };

  // ---------- Toast (reused across admin) ----------
  window.toast = function (msg, type = 'info') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      Object.assign(stack.style, {
        position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '.5rem',
      });
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    Object.assign(t.style, {
      padding: '.85rem 1.1rem',
      borderRadius: '10px',
      background: type === 'error' ? '#f87171' : type === 'success' ? '#4ade80' : '#22283a',
      color: type === 'error' || type === 'success' ? '#0a0c10' : '#e6e9f2',
      fontSize: '.88rem',
      fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,.4)',
    });
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => { t.style.opacity = 0; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3800);
  };

  // ---------- Navigation ----------
  const navItems = document.querySelectorAll('.side-nav-item[data-nav]');
  const views = document.querySelectorAll('[data-view]');
  const pageTitle = document.getElementById('pageTitle');
  
  // YAHAN NAYA LOGIC ADD KIYA HAI MOBILE MENU KE LIYE
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  const viewLabels = {
    dashboard: 'Dashboard',
    gallery: 'Gallery',
    projects: 'Before & After Projects',
    services: 'Services',
    testimonials: 'Testimonials',
    faqs: 'FAQ',
    bookings: 'Bookings',
    messages: 'Messages',
    settings: 'Website Settings',
    users: 'Users',
    profile: 'Profile',
    notifications: 'Notifications',
  };

  function showView(name) {
    navItems.forEach((i) => i.classList.toggle('active', i.dataset.nav === name));
    views.forEach((v) => v.classList.toggle('active', v.dataset.view === name));
    pageTitle.textContent = viewLabels[name] || 'Dashboard';
    location.hash = name;
    
    // YAHAN BHI ADD KIYA HAI TAAKI MOBILE PE CLICK KARNE KE BAAD MENU BAND HO JAYE
    if (sidebar) {
      sidebar.classList.remove('open');
    }

    if (loaders[name]) loaders[name]();
  }
  
  navItems.forEach((i) =>
    i.addEventListener('click', () => i.dataset.nav && showView(i.dataset.nav))
  );

  // ---------- Modal ----------
  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  window.openModal = function (title, bodyHtml, footerHtml = '') {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = footerHtml;
    modal.classList.add('active');
  };
  window.closeModal = function () { modal.classList.remove('active'); };
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ---------- Confirm helper ----------
  window.confirmAction = (message, onConfirm) => {
    openModal(
      'Confirm',
      `<p style="font-size:.95rem;">${message}</p>`,
      `<button class="a-btn ghost" onclick="closeModal()">Cancel</button>
       <button class="a-btn danger" id="confirmYes">Confirm</button>`
    );
    document.getElementById('confirmYes').onclick = async () => {
      closeModal();
      await onConfirm();
    };
  };

  const escapeHtml = (s) =>
    String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Auth / me ----------
  async function loadAdmin() {
    try {
      const { admin } = await API.get('/auth/me', { auth: true });
      state.admin = admin;
      document.getElementById('avatarLetter').textContent = admin.name?.[0]?.toUpperCase() || 'A';
    } catch (err) {
      API.clearToken();
      window.location.href = '/admin/login';
    }
  }

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    try { await API.post('/auth/logout'); } catch (e) {}
    API.clearToken();
    window.location.href = '/admin/login';
  });

  // ---------- Dashboard Overview ----------
  async function loadDashboard() {
    try {
      const { stats } = await API.get('/dashboard/overview', { auth: true });
      const items = [
        { label: 'Total Images', value: stats.totalImages, color: '#c9a26a', icon: '🖼' },
        { label: 'Total Projects', value: stats.totalProjects, color: '#60a5fa', icon: '◐' },
        { label: 'Total Bookings', value: stats.totalBookings, color: '#4ade80', icon: '📅' },
        { label: 'Pending Bookings', value: stats.pendingBookings, color: '#fbbf24', icon: '⏳' },
        { label: 'Messages', value: stats.totalContacts, color: '#a78bfa', icon: '✉' },
        { label: 'Unread', value: stats.unreadMessages, color: '#f87171', icon: '●' },
        { label: 'Visitors', value: stats.totalVisitors, color: '#3b82f6', icon: '👁' },
      ];
      document.getElementById('statCards').innerHTML = items.map(i => `
        <div class="stat-card" style="--card-color:${i.color};">
          <div class="icon-badge" style="background:${i.color}">${i.icon}</div>
          <div class="label">${i.label}</div>
          <div class="value">${i.value.toLocaleString()}</div>
        </div>
      `).join('');

      // Sidebar badges
      const setBadge = (id, count) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (count > 0) { el.textContent = count; el.style.display = 'inline-block'; }
        else el.style.display = 'none';
      };
      setBadge('navUnreadMsgs', stats.unreadMessages);
      setBadge('navPendingBookings', stats.pendingBookings);

      // Charts
      const { labels, bookings, visitors, contacts, bookingByStatus } = await API.get(
        '/dashboard/charts', { auth: true }
      );

      const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
      state.charts.monthly?.destroy();
      state.charts.monthly = new Chart(monthlyCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Bookings', data: bookings, borderColor: '#c9a26a', backgroundColor: 'rgba(201,162,106,.15)', tension: .35, fill: true },
            { label: 'Visitors', data: visitors, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,.12)', tension: .35, fill: true },
            { label: 'Messages', data: contacts, borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,.12)', tension: .35, fill: true },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#e6e9f2' } } },
          scales: {
            x: { ticks: { color: '#8891a8' }, grid: { color: 'rgba(255,255,255,.05)' } },
            y: { ticks: { color: '#8891a8' }, grid: { color: 'rgba(255,255,255,.05)' } },
          },
        },
      });

      const statusCtx = document.getElementById('statusChart').getContext('2d');
      state.charts.status?.destroy();
      const statusLabels = bookingByStatus.map(s => s._id);
      const statusData = bookingByStatus.map(s => s.count);
      state.charts.status = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: statusLabels.length ? statusLabels : ['No data'],
          datasets: [{
            data: statusData.length ? statusData : [1],
            backgroundColor: ['#c9a26a', '#4ade80', '#f87171', '#60a5fa', '#a78bfa', '#fbbf24'],
            borderColor: 'transparent',
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: { legend: { labels: { color: '#e6e9f2' } } },
        },
      });

      // Activity
      const { items: activity } = await API.get('/dashboard/activity', { auth: true });
      document.getElementById('activityList').innerHTML = activity.length
        ? activity.slice(0, 8).map(a => `
          <div style="padding:.6rem 0;border-bottom:1px solid var(--a-border);display:flex;justify-content:space-between;gap:1rem;font-size:.85rem;">
            <span>${escapeHtml(a.adminName || 'Admin')} · <strong style="color:var(--a-accent);">${escapeHtml(a.action)}</strong> ${a.entity ? '· ' + escapeHtml(a.entity) : ''}</span>
            <span class="text-muted text-xs">${new Date(a.createdAt).toLocaleString()}</span>
          </div>
        `).join('')
        : '<div style="color:var(--a-muted);">No activity yet.</div>';
    } catch (err) {
      console.error(err);
    }
  }

  // ---------- Gallery ----------
  const galleryState = { page: 1, pages: 1, search: '' };
  async function loadGallery(reset = true) {
    if (reset) { galleryState.page = 1; document.getElementById('galleryAdminGrid').innerHTML = ''; }
    try {
      const params = new URLSearchParams({ page: galleryState.page, limit: 24, ...(galleryState.search && { search: galleryState.search }) });
      const { items, pages } = await API.get(`/gallery/admin/all?${params}`, { auth: true });
      galleryState.pages = pages;
      const grid = document.getElementById('galleryAdminGrid');
      if (!items.length && galleryState.page === 1) {
        grid.innerHTML = '<p class="text-muted">No images yet. Upload some!</p>';
        return;
      }
      items.forEach(item => grid.appendChild(galleryCard(item)));
    } catch (err) { toast(err.message, 'error'); }
  }
  function galleryCard(item) {
    const div = document.createElement('div');
    div.className = 'thumb-card';
    div.innerHTML = `
      <img src="${item.image.url}" alt="${escapeHtml(item.title)}">
      <div class="thumb-actions">
        <button title="Edit" data-act="edit">✎</button>
        <button class="${item.isFeatured ? 'featured' : ''}" title="Featured" data-act="feature">★</button>
        <button title="Hidden" data-act="hide">${item.isHidden ? '🙈' : '👁'}</button>
        <button title="Delete" data-act="del">✕</button>
      </div>
      <div class="thumb-body">
        <div class="thumb-title">${escapeHtml(item.title)}</div>
        <div class="thumb-meta">${escapeHtml(item.category)} · ${escapeHtml(item.location || '—')}</div>
      </div>
    `;
    div.querySelector('[data-act="edit"]').onclick = () => openGalleryEditForm(item);
    div.querySelector('[data-act="feature"]').onclick = async () => {
      await API.patch(`/gallery/admin/${item._id}/toggle-featured`, {}, { auth: true });
      loadGallery();
    };
    div.querySelector('[data-act="hide"]').onclick = async () => {
      await API.patch(`/gallery/admin/${item._id}/toggle-hidden`, {}, { auth: true });
      loadGallery();
    };
    div.querySelector('[data-act="del"]').onclick = () => {
      confirmAction(`Delete "${item.title}"?`, async () => {
        await API.delete(`/gallery/admin/${item._id}`, { auth: true });
        toast('Deleted', 'success');
        loadGallery();
      });
    };
    return div;
  }

  function openGalleryEditForm(item) {
    openModal('Edit Gallery Image', `
      <form id="galleryEditForm">
        <div class="a-form-group"><label class="a-label">Title</label><input class="a-input" name="title" value="${escapeHtml(item.title || '')}" required></div>
        <div class="a-form-group"><label class="a-label">Description</label><textarea class="a-textarea" name="description">${escapeHtml(item.description || '')}</textarea></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Category</label>
            <select class="a-select" name="category">
              ${['living-room','bedroom','kitchen','office','commercial','pvc','pop','gypsum','wood','custom'].map(c => `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">Project Name</label><input class="a-input" name="projectName" value="${escapeHtml(item.projectName || '')}"></div>
          <div class="a-form-group"><label class="a-label">Location</label><input class="a-input" name="location" value="${escapeHtml(item.location || '')}"></div>
          <div class="a-form-group"><label class="a-label">Completion Date</label><input class="a-input" type="date" name="completionDate" value="${item.completionDate ? item.completionDate.slice(0,10) : ''}"></div>
          <div class="a-form-group"><label class="a-label">Order</label><input class="a-input" type="number" name="order" value="${item.order || 0}"></div>
        </div>
        <div class="a-form-group"><label class="a-label">Tags (comma-separated)</label><input class="a-input" name="tags" value="${escapeHtml((item.tags || []).join(', '))}"></div>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isFeatured" ${item.isFeatured ? 'checked' : ''}> Featured</label>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isHidden" ${item.isHidden ? 'checked' : ''}> Hidden</label>
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitGalleryEdit">Save</button>
    `);
    document.getElementById('submitGalleryEdit').onclick = async () => {
      const form = document.getElementById('galleryEditForm');
      const data = Object.fromEntries(new FormData(form).entries());
      data.isFeatured = form.isFeatured.checked;
      data.isHidden = form.isHidden.checked;
      data.order = Number(data.order || 0);
      try {
        await API.patch(`/gallery/admin/${item._id}`, data, { auth: true });
        toast('Image updated', 'success');
        closeModal();
        loadGallery();
      } catch (err) { toast(err.message, 'error'); }
    };
  }

  document.getElementById('gallerySearchAdmin').addEventListener('input', (e) => {
    clearTimeout(galleryState.timer);
    galleryState.timer = setTimeout(() => { galleryState.search = e.target.value; loadGallery(); }, 300);
  });
  document.getElementById('loadMoreGallery').addEventListener('click', () => {
    if (galleryState.page < galleryState.pages) { galleryState.page++; loadGallery(false); }
  });

  document.getElementById('openUploadModal').addEventListener('click', () => {
    openModal(
      'Upload Gallery Images',
      `<form id="uploadForm" enctype="multipart/form-data">
        <div class="a-form-group"><label class="a-label">Title (base)</label><input class="a-input" name="title" placeholder="Optional — uses filename otherwise"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Category</label>
            <select class="a-select" name="category" required>
              <option value="living-room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="office">Office</option>
              <option value="commercial">Commercial</option>
              <option value="pvc">PVC</option>
              <option value="pop">POP</option>
              <option value="gypsum">Gypsum</option>
              <option value="wood">Wood</option>
              <option value="custom" selected>Custom</option>
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">Project Name</label><input class="a-input" name="projectName"></div>
          <div class="a-form-group"><label class="a-label">Location</label><input class="a-input" name="location"></div>
          <div class="a-form-group"><label class="a-label">Completion Date</label><input class="a-input" type="date" name="completionDate"></div>
        </div>
        <div class="a-form-group"><label class="a-label">Description</label><textarea class="a-textarea" name="description"></textarea></div>
        <div class="a-form-group"><label class="a-label">Tags (comma-separated)</label><input class="a-input" name="tags"></div>
        <label class="upload-zone" id="uploadZone">
          <input type="file" name="images" multiple accept="image/*" required>
          <div style="font-size:1rem;margin-bottom:.35rem;">📎 Drop images here or click to select</div>
          <div class="text-muted text-xs">JPG, PNG, WEBP · Multi-upload supported</div>
          <div id="uploadFileList" class="text-xs" style="color:var(--a-accent);margin-top:.5rem;"></div>
        </label>
      </form>`,
      `<button class="a-btn ghost" onclick="closeModal()">Cancel</button>
       <button class="a-btn" id="submitUpload">Upload</button>`
    );

    const zone = document.getElementById('uploadZone');
    const input = zone.querySelector('input[type=file]');
    input.addEventListener('change', () => {
      const files = Array.from(input.files);
      document.getElementById('uploadFileList').textContent = files.map(f => f.name).join(', ') || '';
    });
    ['dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => zone.addEventListener(ev, () => zone.classList.remove('drag')));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    });

    document.getElementById('submitUpload').onclick = async () => {
      const form = document.getElementById('uploadForm');
      const fd = new FormData(form);
      try {
        await API.post('/gallery/admin/upload', fd, { auth: true });
        toast('Uploaded successfully', 'success');
        closeModal();
        loadGallery();
      } catch (err) { toast(err.message, 'error'); }
    };
  });

  // ---------- Before/After Projects ----------
  async function loadProjects() {
    try {
      const { items } = await API.get('/before-after/admin/all', { auth: true });
      const grid = document.getElementById('baAdminGrid');
      if (!items.length) { grid.innerHTML = '<p class="text-muted">No projects yet.</p>'; return; }
      grid.innerHTML = '';
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'thumb-card';
        div.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">
            <img src="${item.beforeImage.url}" style="height:120px;">
            <img src="${item.afterImage.url}" style="height:120px;">
          </div>
          <div class="thumb-actions">
            <button title="Edit" data-act="edit">✎</button>
            <button title="Delete" data-act="del">✕</button>
          </div>
          <div class="thumb-body">
            <div class="thumb-title">${escapeHtml(item.title)}</div>
            <div class="thumb-meta">${escapeHtml(item.customerName || '—')} · ${escapeHtml(item.projectType)}</div>
          </div>
        `;
        div.querySelector('[data-act="edit"]').onclick = () => openProjectEditForm(item);
        div.querySelector('[data-act="del"]').onclick = () => {
          confirmAction(`Delete "${item.title}"?`, async () => {
            await API.delete(`/before-after/admin/${item._id}`, { auth: true });
            toast('Deleted', 'success');
            loadProjects();
          });
        };
        grid.appendChild(div);
      });
    } catch (err) { toast(err.message, 'error'); }
  }

  function openProjectEditForm(item) {
    openModal('Edit Before / After Project', `
      <form id="projectEditForm">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Title *</label><input class="a-input" name="title" value="${escapeHtml(item.title || '')}" required></div>
          <div class="a-form-group"><label class="a-label">Customer Name *</label><input class="a-input" name="customerName" value="${escapeHtml(item.customerName || '')}" required></div>
          <div class="a-form-group"><label class="a-label">Location</label><input class="a-input" name="location" value="${escapeHtml(item.location || '')}"></div>
          <div class="a-form-group"><label class="a-label">Project Type</label>
            <select class="a-select" name="projectType">
              ${['false-ceiling','pvc-ceiling','gypsum-ceiling','pop-ceiling','wood-ceiling','led-ceiling','office-interior','commercial-interior','residential-interior','other'].map(t => `<option value="${t}" ${item.projectType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">Completion Date</label><input class="a-input" type="date" name="completionDate" value="${item.completionDate ? item.completionDate.slice(0,10) : ''}"></div>
          <div class="a-form-group"><label class="a-label">Order</label><input class="a-input" type="number" name="order" value="${item.order || 0}"></div>
        </div>
        <div class="a-form-group"><label class="a-label">Description</label><textarea class="a-textarea" name="description">${escapeHtml(item.description || '')}</textarea></div>
        <div class="a-form-group"><label class="a-label">Tags (comma-separated)</label><input class="a-input" name="tags" value="${escapeHtml((item.tags || []).join(', '))}"></div>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isFeatured" ${item.isFeatured ? 'checked' : ''}> Featured</label>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isHidden" ${item.isHidden ? 'checked' : ''}> Hidden</label>
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitProjectEdit">Save</button>
    `);
    document.getElementById('submitProjectEdit').onclick = async () => {
      const form = document.getElementById('projectEditForm');
      const data = Object.fromEntries(new FormData(form).entries());
      data.isFeatured = form.isFeatured.checked;
      data.isHidden = form.isHidden.checked;
      data.order = Number(data.order || 0);
      try {
        await API.patch(`/before-after/admin/${item._id}`, data, { auth: true });
        toast('Project updated', 'success');
        closeModal();
        loadProjects();
      } catch (err) { toast(err.message, 'error'); }
    };
  }

  document.getElementById('openBaModal').addEventListener('click', () => {
    openModal('New Before / After Project', `
      <form id="baForm" enctype="multipart/form-data">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Title *</label><input class="a-input" name="title" required></div>
          <div class="a-form-group"><label class="a-label">Customer Name *</label><input class="a-input" name="customerName" required></div>
          <div class="a-form-group"><label class="a-label">Location</label><input class="a-input" name="location"></div>
          <div class="a-form-group"><label class="a-label">Project Type *</label>
            <select class="a-select" name="projectType" required>
              <option value="false-ceiling">False Ceiling</option>
              <option value="pvc-ceiling">PVC Ceiling</option>
              <option value="gypsum-ceiling">Gypsum Ceiling</option>
              <option value="pop-ceiling">POP Ceiling</option>
              <option value="wood-ceiling">Wood Ceiling</option>
              <option value="led-ceiling">LED Ceiling</option>
              <option value="office-interior">Office Interior</option>
              <option value="commercial-interior">Commercial Interior</option>
              <option value="residential-interior">Residential Interior</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">Completion Date</label><input class="a-input" type="date" name="completionDate"></div>
        </div>
        <div class="a-form-group"><label class="a-label">Description</label><textarea class="a-textarea" name="description"></textarea></div>
        <div class="a-form-group"><label class="a-label">Before Image *</label><input class="a-input" type="file" name="beforeImage" accept="image/*" required></div>
        <div class="a-form-group"><label class="a-label">After Image *</label><input class="a-input" type="file" name="afterImage" accept="image/*" required></div>
        <div class="a-form-group"><label class="a-label">Additional Images (optional)</label><input class="a-input" type="file" name="additionalImages" accept="image/*" multiple></div>
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitBa">Create</button>
    `);
    document.getElementById('submitBa').onclick = async () => {
      const fd = new FormData(document.getElementById('baForm'));
      try {
        await API.post('/before-after/admin/create', fd, { auth: true });
        toast('Project created', 'success');
        closeModal();
        loadProjects();
      } catch (err) { toast(err.message, 'error'); }
    };
  });

  // ---------- Services ----------
  async function loadServices() {
    try {
      const { items } = await API.get('/services/admin/all', { auth: true });
      const table = document.getElementById('servicesTable');
      table.innerHTML = `
        <thead><tr><th>Title</th><th>Slug</th><th>Order</th><th>Active</th><th></th></tr></thead>
        <tbody>${items.map(s => `
          <tr>
            <td>${escapeHtml(s.title)}</td>
            <td class="text-muted">${escapeHtml(s.slug)}</td>
            <td>${s.order}</td>
            <td><span class="status-pill ${s.isActive ? 'status-accepted' : 'status-archived'}">${s.isActive ? 'Active' : 'Inactive'}</span></td>
            <td style="text-align:right;">
              <button class="a-btn sm ghost" data-edit="${s._id}">Edit</button>
              <button class="a-btn sm danger" data-del="${s._id}" data-name="${escapeHtml(s.title)}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-del]').forEach(b => {
        b.onclick = () => confirmAction(`Delete "${b.dataset.name}"?`, async () => {
          await API.delete(`/services/admin/${b.dataset.del}`, { auth: true });
          toast('Deleted', 'success');
          loadServices();
        });
      });
      table.querySelectorAll('[data-edit]').forEach(b => {
        b.onclick = () => openServiceForm(items.find(s => s._id === b.dataset.edit));
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openServiceForm(existing = null) {
    const s = existing || {};
    openModal(existing ? 'Edit Service' : 'New Service', `
      <form id="serviceForm">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Title *</label><input class="a-input" name="title" required value="${escapeHtml(s.title || '')}"></div>
          <div class="a-form-group"><label class="a-label">Slug</label><input class="a-input" name="slug" value="${escapeHtml(s.slug || '')}" placeholder="auto"></div>
          <div class="a-form-group"><label class="a-label">Icon</label><input class="a-input" name="icon" value="${escapeHtml(s.icon || '')}"></div>
          <div class="a-form-group"><label class="a-label">Order</label><input class="a-input" type="number" name="order" value="${s.order ?? 0}"></div>
          <div class="a-form-group"><label class="a-label">Starting Price</label><input class="a-input" name="startingPrice" value="${escapeHtml(s.startingPrice || '')}"></div>
          <div class="a-form-group"><label class="a-label">Active</label>
            <select class="a-select" name="isActive"><option value="true" ${s.isActive !== false ? 'selected' : ''}>Yes</option><option value="false">No</option></select>
          </div>
        </div>
        <div class="a-form-group"><label class="a-label">Short Description *</label><textarea class="a-textarea" name="shortDescription" required maxlength="300">${escapeHtml(s.shortDescription || '')}</textarea></div>
        <div class="a-form-group"><label class="a-label">Description *</label><textarea class="a-textarea" name="description" required style="min-height:120px;">${escapeHtml(s.description || '')}</textarea></div>
        <div class="a-form-group"><label class="a-label">Benefits (one per line)</label><textarea class="a-textarea" name="benefits">${(s.benefits || []).join('\n')}</textarea></div>
        <div class="a-form-group"><label class="a-label">Service FAQs (Question | Answer — one per line)</label><textarea class="a-textarea" name="faqs">${(s.faqs || []).map(f => `${f.question || ''} | ${f.answer || ''}`).join('\n')}</textarea></div>
        ${existing ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
            <div class="a-form-group"><label class="a-label">Upload Banner</label><input class="a-input" type="file" id="serviceBannerFile" accept="image/*"></div>
            <div class="a-form-group"><label class="a-label">Upload Gallery Images</label><input class="a-input" type="file" id="serviceGalleryFiles" accept="image/*" multiple></div>
          </div>
        ` : '<p class="text-xs text-muted">Create the service first, then edit it to upload Cloudinary banner/gallery images.</p>'}
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitService">${existing ? 'Save' : 'Create'}</button>
    `);
    document.getElementById('submitService').onclick = async () => {
      const form = document.getElementById('serviceForm');
      const fd = Object.fromEntries(new FormData(form).entries());
      fd.isActive = fd.isActive === 'true';
      if (typeof fd.benefits === 'string') fd.benefits = fd.benefits.split('\n').map(l => l.trim()).filter(Boolean);
      if (typeof fd.faqs === 'string') {
        fd.faqs = fd.faqs.split('\n').map(line => {
          const [question, ...rest] = line.split('|');
          return { question: (question || '').trim(), answer: rest.join('|').trim() };
        }).filter(f => f.question && f.answer);
      }
      try {
        if (existing) await API.patch(`/services/admin/${existing._id}`, fd, { auth: true });
        else await API.post('/services/admin', fd, { auth: true });
        if (existing) {
          const bannerFile = document.getElementById('serviceBannerFile')?.files?.[0];
          if (bannerFile) {
            const fdBanner = new FormData();
            fdBanner.append('banner', bannerFile);
            await API.post(`/services/admin/${existing._id}/banner`, fdBanner, { auth: true });
          }
          const galleryFiles = Array.from(document.getElementById('serviceGalleryFiles')?.files || []);
          if (galleryFiles.length) {
            const fdGallery = new FormData();
            galleryFiles.forEach(f => fdGallery.append('images', f));
            await API.post(`/services/admin/${existing._id}/gallery`, fdGallery, { auth: true });
          }
        }
        toast('Saved', 'success');
        closeModal();
        loadServices();
      } catch (err) { toast(err.message, 'error'); }
    };
  }
  document.getElementById('openServiceModal').addEventListener('click', () => openServiceForm());

  // ---------- Testimonials ----------
  async function loadTestimonials() {
    try {
      const { items } = await API.get('/testimonials/admin/all', { auth: true });
      const table = document.getElementById('testimonialsTable');
      table.innerHTML = `
        <thead><tr><th>Customer</th><th>Rating</th><th>Review</th><th>Approved</th><th></th></tr></thead>
        <tbody>${items.map(t => `
          <tr>
            <td><strong>${escapeHtml(t.customerName)}</strong><br><span class="text-xs text-muted">${escapeHtml(t.location || '')}</span></td>
            <td style="color:var(--a-accent);">${'★'.repeat(t.rating || 5)}</td>
            <td style="max-width:400px;">${escapeHtml((t.review || '').slice(0, 120))}${t.review?.length > 120 ? '…' : ''}</td>
            <td><span class="status-pill ${t.isApproved ? 'status-accepted' : 'status-archived'}">${t.isApproved ? 'Yes' : 'Pending'}</span></td>
            <td style="text-align:right;">
              <button class="a-btn sm ghost" data-edit="${t._id}">Edit</button>
              <button class="a-btn sm danger" data-del="${t._id}" data-name="${escapeHtml(t.customerName)}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-edit]').forEach(b => {
        b.onclick = () => openTestimonialForm(items.find(t => t._id === b.dataset.edit));
      });
      table.querySelectorAll('[data-del]').forEach(b => {
        b.onclick = () => confirmAction(`Delete testimonial from ${b.dataset.name}?`, async () => {
          await API.delete(`/testimonials/admin/${b.dataset.del}`, { auth: true });
          toast('Deleted', 'success'); loadTestimonials();
        });
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openTestimonialForm(existing = null) {
    const t = existing || {};
    openModal(existing ? 'Edit Testimonial' : 'New Testimonial', `
      <form id="testimonialForm" enctype="multipart/form-data">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Customer Name *</label><input class="a-input" name="customerName" required value="${escapeHtml(t.customerName || '')}"></div>
          <div class="a-form-group"><label class="a-label">Location</label><input class="a-input" name="location" value="${escapeHtml(t.location || '')}"></div>
          <div class="a-form-group"><label class="a-label">Role</label><input class="a-input" name="role" placeholder="e.g. Homeowner" value="${escapeHtml(t.role || '')}"></div>
          <div class="a-form-group"><label class="a-label">Rating (1-5)</label><input class="a-input" type="number" name="rating" min="1" max="5" value="${t.rating || 5}"></div>
          <div class="a-form-group"><label class="a-label">Order</label><input class="a-input" type="number" name="order" value="${t.order || 0}"></div>
        </div>
        <div class="a-form-group"><label class="a-label">Review *</label><textarea class="a-textarea" name="review" required>${escapeHtml(t.review || '')}</textarea></div>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isFeatured" ${t.isFeatured ? 'checked' : ''}> Featured</label>
        <label style="display:flex;gap:.75rem;align-items:center;margin:.75rem 0;"><input type="checkbox" name="isApproved" ${t.isApproved !== false ? 'checked' : ''}> Approved</label>
        ${existing ? '' : '<div class="a-form-group"><label class="a-label">Customer Image (optional)</label><input class="a-input" type="file" name="customerImage" accept="image/*"></div>'}
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitTestimonial">${existing ? 'Save' : 'Create'}</button>
    `);
    document.getElementById('submitTestimonial').onclick = async () => {
      const form = document.getElementById('testimonialForm');
      try {
        if (existing) {
          const data = Object.fromEntries(new FormData(form).entries());
          data.rating = Number(data.rating || 5);
          data.order = Number(data.order || 0);
          data.isFeatured = form.isFeatured.checked;
          data.isApproved = form.isApproved.checked;
          await API.patch(`/testimonials/admin/${existing._id}`, data, { auth: true });
        } else {
          const fd = new FormData(form);
          fd.set('isFeatured', form.isFeatured.checked);
          fd.set('isApproved', form.isApproved.checked);
          await API.post('/testimonials/admin', fd, { auth: true });
        }
        toast('Saved', 'success'); closeModal(); loadTestimonials();
      } catch (err) { toast(err.message, 'error'); }
    };
  }
  document.getElementById('openTestimonialModal').addEventListener('click', () => openTestimonialForm());

  // ---------- FAQ ----------
  async function loadFaqs() {
    try {
      const { items } = await API.get('/faqs/admin/all', { auth: true });
      const table = document.getElementById('faqTable');
      table.innerHTML = `
        <thead><tr><th>Question</th><th>Category</th><th>Order</th><th>Active</th><th></th></tr></thead>
        <tbody>${items.map(f => `
          <tr>
            <td>${escapeHtml(f.question)}</td>
            <td class="text-muted">${escapeHtml(f.category || '')}</td>
            <td>${f.order}</td>
            <td><span class="status-pill ${f.isActive ? 'status-accepted' : 'status-archived'}">${f.isActive ? 'Yes' : 'No'}</span></td>
            <td style="text-align:right;">
              <button class="a-btn sm ghost" data-edit="${f._id}">Edit</button>
              <button class="a-btn sm danger" data-del="${f._id}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-del]').forEach(b => {
        b.onclick = () => confirmAction('Delete FAQ?', async () => {
          await API.delete(`/faqs/admin/${b.dataset.del}`, { auth: true });
          toast('Deleted', 'success'); loadFaqs();
        });
      });
      table.querySelectorAll('[data-edit]').forEach(b => {
        b.onclick = () => openFaqForm(items.find(f => f._id === b.dataset.edit));
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openFaqForm(existing = null) {
    const f = existing || {};
    openModal(existing ? 'Edit FAQ' : 'New FAQ', `
      <form id="faqForm">
        <div class="a-form-group"><label class="a-label">Question *</label><input class="a-input" name="question" required value="${escapeHtml(f.question || '')}"></div>
        <div class="a-form-group"><label class="a-label">Answer *</label><textarea class="a-textarea" name="answer" required style="min-height:120px;">${escapeHtml(f.answer || '')}</textarea></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Category</label>
            <select class="a-select" name="category">
              <option ${f.category === 'general' ? 'selected' : ''}>general</option>
              <option ${f.category === 'services' ? 'selected' : ''}>services</option>
              <option ${f.category === 'pricing' ? 'selected' : ''}>pricing</option>
              <option ${f.category === 'process' ? 'selected' : ''}>process</option>
              <option ${f.category === 'warranty' ? 'selected' : ''}>warranty</option>
              <option ${f.category === 'other' ? 'selected' : ''}>other</option>
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">Order</label><input class="a-input" type="number" name="order" value="${f.order ?? 0}"></div>
          <div class="a-form-group"><label class="a-label">Active</label>
            <select class="a-select" name="isActive"><option value="true" ${f.isActive !== false ? 'selected' : ''}>Yes</option><option value="false">No</option></select>
          </div>
        </div>
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitFaq">${existing ? 'Save' : 'Create'}</button>
    `);
    document.getElementById('submitFaq').onclick = async () => {
      const fd = Object.fromEntries(new FormData(document.getElementById('faqForm')).entries());
      fd.isActive = fd.isActive === 'true';
      try {
        if (existing) await API.patch(`/faqs/admin/${existing._id}`, fd, { auth: true });
        else await API.post('/faqs/admin', fd, { auth: true });
        toast('Saved', 'success'); closeModal(); loadFaqs();
      } catch (err) { toast(err.message, 'error'); }
    };
  }
  document.getElementById('openFaqModal').addEventListener('click', () => openFaqForm());

  // ---------- Bookings ----------
  const bkState = { status: '', search: '' };
  async function loadBookings() {
    try {
      const params = new URLSearchParams({ limit: 50, ...(bkState.status && { status: bkState.status }), ...(bkState.search && { search: bkState.search }) });
      const { items } = await API.get(`/bookings?${params}`, { auth: true });
      const table = document.getElementById('bookingsTable');
      table.innerHTML = `
        <thead><tr><th>Customer</th><th>Contact</th><th>Service</th><th>Date</th><th>Status</th><th></th></tr></thead>
        <tbody>${items.map(b => `
          <tr>
            <td><strong>${escapeHtml(b.name)}</strong><br><span class="text-xs text-muted">${escapeHtml(b.propertyType || '')}</span></td>
            <td class="text-xs">${escapeHtml(b.phone)}<br>${escapeHtml(b.email)}</td>
            <td>${escapeHtml(b.service)}<br><span class="text-xs text-muted">${escapeHtml(b.budget || '')}</span></td>
            <td class="text-xs">${new Date(b.createdAt).toLocaleDateString()}</td>
            <td><span class="status-pill status-${b.status}">${b.status}</span></td>
            <td style="text-align:right;white-space:nowrap;">
              <button class="a-btn sm ghost" data-view="${b._id}">View</button>
            </td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-view]').forEach(btn => {
        btn.onclick = () => openBookingDetail(items.find(x => x._id === btn.dataset.view));
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openBookingDetail(b) {
    const refs = (b.referenceImages || []).map(i => `<a href="${i.url}" target="_blank"><img src="${i.url}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;margin:.25rem;"></a>`).join('');
    openModal(`Booking · ${b.name}`, `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:.9rem;">
        <div><strong>Phone:</strong> ${escapeHtml(b.phone)}</div>
        <div><strong>Email:</strong> ${escapeHtml(b.email)}</div>
        <div><strong>Service:</strong> ${escapeHtml(b.service)}</div>
        <div><strong>Budget:</strong> ${escapeHtml(b.budget || '—')}</div>
        <div><strong>Property Type:</strong> ${escapeHtml(b.propertyType || '—')}</div>
        <div><strong>Preferred Date:</strong> ${b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : '—'}</div>
      </div>
      <div class="mt-4"><strong>Address:</strong> ${escapeHtml(b.address || '—')}</div>
      <div class="mt-4"><strong>Message:</strong><p style="margin-top:.5rem;">${escapeHtml(b.message || '—')}</p></div>
      ${refs ? `<div class="mt-4"><strong>Reference Images:</strong><div style="display:flex;flex-wrap:wrap;">${refs}</div></div>` : ''}
      <div class="mt-4">
        <label class="a-label">Update Status</label>
        <select class="a-select" id="bkStatus">
          ${['pending','accepted','rejected','completed','cancelled'].map(s => `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="a-form-group mt-2">
        <label class="a-label">Admin Notes</label>
        <textarea class="a-textarea" id="bkNotes">${escapeHtml(b.adminNotes || '')}</textarea>
      </div>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Close</button>
      <button class="a-btn danger" id="bkDelete">Delete</button>
      <button class="a-btn" id="bkSave">Save</button>
    `);
    document.getElementById('bkSave').onclick = async () => {
      await API.patch(`/bookings/${b._id}/status`, {
        status: document.getElementById('bkStatus').value,
        adminNotes: document.getElementById('bkNotes').value,
      }, { auth: true });
      toast('Updated', 'success'); closeModal(); loadBookings();
    };
    document.getElementById('bkDelete').onclick = () => {
      confirmAction(`Delete booking from ${b.name}?`, async () => {
        await API.delete(`/bookings/${b._id}`, { auth: true });
        toast('Deleted', 'success'); loadBookings();
      });
    };
  }
  document.getElementById('bookingStatusFilter').addEventListener('change', (e) => { bkState.status = e.target.value; loadBookings(); });
  document.getElementById('bookingSearch').addEventListener('input', (e) => {
    clearTimeout(bkState.timer);
    bkState.timer = setTimeout(() => { bkState.search = e.target.value; loadBookings(); }, 300);
  });

  // ---------- Messages ----------
  const msgState = { status: '', search: '' };
  async function loadMessages() {
    try {
      const params = new URLSearchParams({ limit: 50, ...(msgState.status && { status: msgState.status }), ...(msgState.search && { search: msgState.search }) });
      const { items } = await API.get(`/contact?${params}`, { auth: true });
      const table = document.getElementById('messagesTable');
      table.innerHTML = `
        <thead><tr><th></th><th>From</th><th>Message</th><th>Received</th><th>Status</th><th></th></tr></thead>
        <tbody>${items.map(m => `
          <tr style="${m.status === 'unread' ? 'font-weight:600;' : ''}">
            <td><button class="icon-btn" style="width:28px;height:28px;font-size:.85rem;background:transparent;border:0;" data-star="${m._id}">${m.isStarred ? '★' : '☆'}</button></td>
            <td><strong>${escapeHtml(m.name)}</strong><br><span class="text-xs text-muted">${escapeHtml(m.email)}</span></td>
            <td style="max-width:340px;">${escapeHtml((m.message || '').slice(0, 100))}${m.message?.length > 100 ? '…' : ''}</td>
            <td class="text-xs">${new Date(m.createdAt).toLocaleDateString()}</td>
            <td><span class="status-pill status-${m.status}">${m.status}</span></td>
            <td><button class="a-btn sm ghost" data-view="${m._id}">Open</button></td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-star]').forEach(btn => {
        btn.onclick = async () => {
          const item = items.find(x => x._id === btn.dataset.star);
          await API.patch(`/contact/${btn.dataset.star}/status`, { isStarred: !item.isStarred }, { auth: true });
          loadMessages();
        };
      });
      table.querySelectorAll('[data-view]').forEach(btn => {
        btn.onclick = async () => {
          const { item } = await API.get(`/contact/${btn.dataset.view}`, { auth: true });
          openMessageDetail(item);
        };
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openMessageDetail(m) {
    openModal(`Message · ${m.name}`, `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:.9rem;">
        <div><strong>Phone:</strong> ${escapeHtml(m.phone)}</div>
        <div><strong>Email:</strong> ${escapeHtml(m.email)}</div>
        <div><strong>City:</strong> ${escapeHtml(m.city || '—')}</div>
        <div><strong>Service:</strong> ${escapeHtml(m.service || '—')}</div>
      </div>
      <div class="mt-4"><strong>Message:</strong><p style="margin-top:.5rem;">${escapeHtml(m.message)}</p></div>
      ${m.referenceImage?.url ? `<div class="mt-4"><a href="${m.referenceImage.url}" target="_blank"><img src="${m.referenceImage.url}" style="max-width:200px;border-radius:6px;"></a></div>` : ''}
      <div class="a-form-group mt-4">
        <label class="a-label">Change Status</label>
        <select class="a-select" id="msgStatus">
          ${['unread','read','replied','archived','deleted'].map(s => `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="a-form-group mt-2">
        <label class="a-label">Reply / Internal Response Note</label>
        <textarea class="a-textarea" id="msgReply" placeholder="Write reply note and mark as replied…"></textarea>
      </div>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Close</button>
      <button class="a-btn danger" id="msgDel">Delete</button>
      <button class="a-btn ghost" id="msgReplyBtn">Save Reply</button>
      <button class="a-btn" id="msgSave">Save</button>
    `);
    document.getElementById('msgSave').onclick = async () => {
      await API.patch(`/contact/${m._id}/status`, { status: document.getElementById('msgStatus').value }, { auth: true });
      toast('Updated', 'success'); closeModal(); loadMessages();
    };
    document.getElementById('msgReplyBtn').onclick = async () => {
      const message = document.getElementById('msgReply').value.trim();
      if (!message) return toast('Reply note is required', 'error');
      await API.post(`/contact/${m._id}/reply`, { message }, { auth: true });
      toast('Reply saved', 'success'); closeModal(); loadMessages();
    };
    document.getElementById('msgDel').onclick = () => {
      confirmAction(`Delete message?`, async () => {
        await API.delete(`/contact/${m._id}`, { auth: true });
        toast('Deleted', 'success'); loadMessages();
      });
    };
  }
  document.getElementById('msgStatusFilter').addEventListener('change', (e) => { msgState.status = e.target.value; loadMessages(); });
  document.getElementById('msgSearch').addEventListener('input', (e) => {
    clearTimeout(msgState.timer);
    msgState.timer = setTimeout(() => { msgState.search = e.target.value; loadMessages(); }, 300);
  });
  document.getElementById('exportMessagesCsv').addEventListener('click', async () => {
    try {
      const blob = await API.get('/contact/export.csv', { auth: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sahanines-messages-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) { toast(err.message, 'error'); }
  });

  // ---------- Settings ----------
  async function loadSettings() {
    try {
      const { settings } = await API.get('/settings', { auth: true });
      const form = document.getElementById('settingsForm');
      form.querySelectorAll('[name]').forEach((input) => {
        const path = input.name.split('.');
        let val = settings;
        for (const p of path) { val = val?.[p]; }
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) input.value = val.join(', ');
          else input.value = val;
        }
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    form.querySelectorAll('[name]').forEach((input) => {
      const path = input.name.split('.');
      let v = input.value;
      if (input.name === 'seo.keywords') v = v.split(',').map(s => s.trim()).filter(Boolean);
      if (input.type === 'number') v = Number(v) || 0;
      let cursor = data;
      for (let i = 0; i < path.length - 1; i++) {
        cursor[path[i]] = cursor[path[i]] || {};
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = v;
    });
    try {
      await API.patch('/settings', data, { auth: true });
      toast('Settings saved', 'success');
    } catch (err) { toast(err.message, 'error'); }
  });
  document.querySelectorAll('.branding-upload').forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      try {
        await API.post(`/settings/branding/${input.dataset.field}`, fd, { auth: true });
        toast(`${input.dataset.field} uploaded`, 'success');
        input.value = '';
        loadSettings();
      } catch (err) { toast(err.message, 'error'); }
    });
  });

  // ---------- Users / Admins ----------
  const userState = { search: '' };
  async function loadUsers() {
    try {
      const params = new URLSearchParams({ ...(userState.search && { search: userState.search }) });
      const { items } = await API.get(`/admins?${params}`, { auth: true });
      const table = document.getElementById('usersTable');
      table.innerHTML = `
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th></th></tr></thead>
        <tbody>${items.map(u => `
          <tr>
            <td><strong>${escapeHtml(u.name)}</strong><br><span class="text-xs text-muted">${escapeHtml(u.phone || '')}</span></td>
            <td>${escapeHtml(u.email)}</td>
            <td>${escapeHtml(u.role)}</td>
            <td><span class="status-pill ${u.isActive ? 'status-accepted' : 'status-archived'}">${u.isActive ? 'Active' : 'Disabled'}</span></td>
            <td class="text-xs">${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
            <td style="text-align:right;">
              <button class="a-btn sm ghost" data-edit="${u._id}">Edit</button>
              <button class="a-btn sm danger" data-del="${u._id}" data-name="${escapeHtml(u.name)}">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      `;
      table.querySelectorAll('[data-edit]').forEach(btn => {
        btn.onclick = () => openUserForm(items.find(u => u._id === btn.dataset.edit));
      });
      table.querySelectorAll('[data-del]').forEach(btn => {
        btn.onclick = () => confirmAction(`Delete admin "${btn.dataset.name}"?`, async () => {
          await API.delete(`/admins/${btn.dataset.del}`, { auth: true });
          toast('Admin deleted', 'success');
          loadUsers();
        });
      });
    } catch (err) { toast(err.message, 'error'); }
  }
  function openUserForm(existing = null) {
    const u = existing || {};
    openModal(existing ? 'Edit Admin User' : 'New Admin User', `
      <form id="userForm">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          <div class="a-form-group"><label class="a-label">Name *</label><input class="a-input" name="name" value="${escapeHtml(u.name || '')}" required></div>
          <div class="a-form-group"><label class="a-label">Email ${existing ? '(locked)' : '*'}</label><input class="a-input" name="email" type="email" value="${escapeHtml(u.email || '')}" ${existing ? 'disabled' : 'required'}></div>
          <div class="a-form-group"><label class="a-label">Phone</label><input class="a-input" name="phone" value="${escapeHtml(u.phone || '')}"></div>
          <div class="a-form-group"><label class="a-label">Role</label>
            <select class="a-select" name="role">
              <option value="admin" ${u.role !== 'superadmin' ? 'selected' : ''}>admin</option>
              <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>superadmin</option>
            </select>
          </div>
          <div class="a-form-group"><label class="a-label">${existing ? 'New Password (optional)' : 'Password *'}</label><input class="a-input" name="password" type="password" ${existing ? '' : 'required'} minlength="8"></div>
          <div class="a-form-group"><label class="a-label">Active</label>
            <select class="a-select" name="isActive">
              <option value="true" ${u.isActive !== false ? 'selected' : ''}>Yes</option>
              <option value="false" ${u.isActive === false ? 'selected' : ''}>No</option>
            </select>
          </div>
        </div>
      </form>
    `, `
      <button class="a-btn ghost" onclick="closeModal()">Cancel</button>
      <button class="a-btn" id="submitUser">${existing ? 'Save' : 'Create'}</button>
    `);
    document.getElementById('submitUser').onclick = async () => {
      const form = document.getElementById('userForm');
      const data = Object.fromEntries(new FormData(form).entries());
      data.isActive = data.isActive === 'true';
      if (existing && !data.password) delete data.password;
      if (existing) delete data.email;
      try {
        if (existing) await API.patch(`/admins/${existing._id}`, data, { auth: true });
        else await API.post('/admins', data, { auth: true });
        toast('Admin saved', 'success');
        closeModal();
        loadUsers();
      } catch (err) { toast(err.message, 'error'); }
    };
  }
  document.getElementById('openUserModal').addEventListener('click', () => openUserForm());
  document.getElementById('userSearch').addEventListener('input', (e) => {
    clearTimeout(userState.timer);
    userState.timer = setTimeout(() => { userState.search = e.target.value; loadUsers(); }, 300);
  });

  // ---------- Profile ----------
  async function loadProfile() {
    document.getElementById('profileName').value = state.admin?.name || '';
    document.getElementById('profilePhone').value = state.admin?.phone || '';
    document.getElementById('profileEmail').value = state.admin?.email || '';
  }
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await API.patch('/auth/profile', {
        name: e.target.name.value, phone: e.target.phone.value,
      }, { auth: true });
      state.admin = res.admin;
      toast('Profile updated', 'success');
    } catch (err) { toast(err.message, 'error'); }
  });
  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await API.patch('/auth/change-password', {
        currentPassword: e.target.currentPassword.value,
        newPassword: e.target.newPassword.value,
      }, { auth: true });
      toast('Password changed', 'success');
      e.target.reset();
    } catch (err) { toast(err.message, 'error'); }
  });

  // ---------- Notifications ----------
  const notifBtn = document.getElementById('notifBtn');
  const notifPopover = document.getElementById('notifPopover');
  notifBtn.addEventListener('click', () => {
    notifPopover.classList.toggle('active');
    if (notifPopover.classList.contains('active')) loadNotifications();
  });
  document.addEventListener('click', (e) => {
    if (!notifPopover.contains(e.target) && !notifBtn.contains(e.target)) notifPopover.classList.remove('active');
  });

  async function loadNotifications() {
    try {
      const { items, unread } = await API.get('/dashboard/notifications', { auth: true });
      document.getElementById('notifDot').style.display = unread > 0 ? 'block' : 'none';
      const setBadge = (id, count) => {
        const el = document.getElementById(id); if (!el) return;
        if (count > 0) { el.textContent = count; el.style.display = 'inline-block'; }
        else el.style.display = 'none';
      };
      setBadge('navUnread', unread);
      const html = items.length
        ? items.slice(0, 20).map(n => `
          <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n._id}" ${n.link ? `data-link="${n.link}"` : ''}>
            <div class="notif-title">${escapeHtml(n.title)}</div>
            <div class="notif-meta">${escapeHtml(n.message)} · ${new Date(n.createdAt).toLocaleString()}</div>
          </div>
        `).join('')
        : '<div style="padding:2rem;text-align:center;color:var(--a-muted);">No new notifications</div>';
      document.getElementById('notifList').innerHTML = html;
      await API.post('/dashboard/notifications/read-all', {}, { auth: true });
    } catch (err) { console.error(err); }
  }

  // ---------- Init ----------
  const loaders = {
    dashboard: loadDashboard, gallery: loadGallery, projects: loadProjects, services: loadServices,
    testimonials: loadTestimonials, faqs: loadFaqs, bookings: loadBookings, messages: loadMessages,
    settings: loadSettings, users: loadUsers, profile: loadProfile,
  };
  async function init() {
    await loadAdmin();
    const hash = location.hash.replace('#', '') || 'dashboard';
    showView(hash);
  }
  init();
})();
