// Suggestion-related API calls
import { API_BASE } from './base';

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