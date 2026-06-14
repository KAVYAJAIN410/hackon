/**
 * Centralised API client with JWT auth support.
 * All fetch calls in the app should import `api` from here.
 *
 * Usage:
 *   import api from '../lib/api';
 *   const data = await api.get('/marketplace');
 *   const result = await api.post('/returns', { orderId, reason });
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('reloop_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('reloop_token', token);
  } else {
    localStorage.removeItem('reloop_token');
  }
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const error = new Error(err.error || err.message || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

async function postFormData(path, formData) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData, // browser sets multipart boundary automatically
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const error = new Error(err.error || err.message || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
  postFormData: (path, formData) => postFormData(path, formData),
};

export default api;
