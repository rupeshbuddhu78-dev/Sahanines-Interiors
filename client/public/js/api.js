/* Sahanines Interiors - Lightweight API client */
(function (global) {
  const API_BASE = '/api';

  const getToken = () => localStorage.getItem('sahanines_admin_token') || '';

  async function request(method, path, body, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (opts.auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

    let fetchBody;
    if (body instanceof FormData) {
      fetchBody = body;
    } else if (body) {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: fetchBody,
      credentials: 'include',
    });

    let data = null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) data = await res.json();
    else if (ct.includes('text/csv')) return res.blob();
    else data = { success: res.ok, text: await res.text() };

    if (!res.ok) {
      const err = new Error(data?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const api = {
    get: (p, opts) => request('GET', p, null, opts),
    post: (p, body, opts) => request('POST', p, body, opts),
    patch: (p, body, opts) => request('PATCH', p, body, opts),
    put: (p, body, opts) => request('PUT', p, body, opts),
    delete: (p, opts) => request('DELETE', p, null, opts),

    setToken: (t) => localStorage.setItem('sahanines_admin_token', t),
    clearToken: () => localStorage.removeItem('sahanines_admin_token'),
    getToken,
  };

  global.API = api;
})(window);
