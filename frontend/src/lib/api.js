/**
 * Centralised API client.
 * All fetch calls in the app should import `api` from here
 * so that the base URL is always sourced from VITE_API_URL.
 *
 * Usage:
 *   import api from '../lib/api';
 *   const data = await api.get('/marketplace?user_id=user-001');
 *   const result = await api.post('/returns', { orderId, userId, reason });
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
};

export default api;
