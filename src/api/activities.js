// Activity-related API calls
import { API_BASE } from './base';

export async function getActivities() {
  const res = await fetch(`${API_BASE}/activities`);
  return res.json();
}

export async function createActivity(data) {
  const token = localStorage.getItem('jwt_token');
  const expires = localStorage.getItem('jwt_token_expires');
  const headers = { 'Content-Type': 'application/json' };
  if (token && expires && Date.now() < Number(expires)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create activity');
  return res.json();
} 