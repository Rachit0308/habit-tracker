// Daily summary API call
import { API_BASE } from './base';

export async function getDailySummary(userId, date) {
  const token = localStorage.getItem('jwt_token');
  const expires = localStorage.getItem('jwt_token_expires');
  const headers = {};
  if (token && expires && Date.now() < Number(expires)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/users/${userId}/summary?date=${date}`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
} 