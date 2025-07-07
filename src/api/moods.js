// Mood-related API calls
import { API_BASE } from './base';

export async function getMoods() {
  const res = await fetch(`${API_BASE}/moods`);
  return res.json();
}

export async function createMood(data) {
  const token = localStorage.getItem('jwt_token');
  const expires = localStorage.getItem('jwt_token_expires');
  const headers = { 'Content-Type': 'application/json' };
  if (token && expires && Date.now() < Number(expires)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/moods`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create mood');
  return res.json();
} 