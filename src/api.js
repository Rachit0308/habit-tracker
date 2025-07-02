export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

// USERS
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}
export async function createUser(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// MOODS
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

// ACTIVITIES
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

// SUGGESTIONS
export async function getSuggestions(userId) {
  const res = await fetch(`${API_BASE}/suggestions?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json();
}
export async function createSuggestion(data) {
  const res = await fetch(`${API_BASE}/suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

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

export async function createOrUpdateUser({ name, mobile }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile }),
  });
  if (!res.ok) throw new Error('Failed to create or update user');
  return res.json();
} 