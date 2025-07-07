import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { createMood } from '../api/moods';
import { API_BASE } from '../api/base';

function getAuthHeaders() {
  const token = localStorage.getItem('jwt_token');
  const expires = localStorage.getItem('jwt_token_expires');
  if (!token || !expires || Date.now() > Number(expires)) return {};
  return { Authorization: `Bearer ${token}` };
}

function MoodModal({ open, onClose, userId, onMoodLogged }) {
  const [moods, setMoods] = useState([
    { label: 'Great', emoji: '\ud83d\ude03' },
    { label: 'Good', emoji: '\ud83d\ude42' },
    { label: 'Okay', emoji: '\ud83d\ude10' },
    { label: 'Bad', emoji: '\ud83d\ude41' },
    { label: 'Awful', emoji: '\ud83d\ude22' },
  ]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodsLoading, setMoodsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMoodsLoading(true);
    fetch(`${API_BASE}/moods/master`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(list => {
        if (Array.isArray(list) && list.length && list[0].mood && list[0].emoji) {
          // Sort moods in fixed order
          const order = ['Great', 'Good', 'Okay', 'Bad', 'Awful'];
          const sorted = list
            .map(m => ({ label: m.mood, emoji: m.emoji }))
            .sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
          setMoods(sorted);
        }
        setMoodsLoading(false);
      })
      .catch(() => setMoodsLoading(false));
  }, [open]);

  const handleSave = async () => {
    if (!selectedMood) return;
    setLoading(true);
    const moodObj = moods.find(m => m.label === selectedMood);
    const data = {
      userId,
      mood: selectedMood,
      emoji: moodObj.emoji,
      note,
    };
    const saved = await createMood(data);
    setLoading(false);
    if (onMoodLogged) onMoodLogged(saved);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>How are you feeling?</DialogTitle>
      <DialogContent>
        {moodsLoading ? (
          <Box display="flex" justifyContent="center" my={3}>Loading moods...</Box>
        ) : (
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            {moods.map((mood) => (
              <Box
                key={mood.label}
                sx={{
                  fontSize: 32,
                  cursor: 'pointer',
                  border: selectedMood === mood.label ? '2px solid #1976d2' : '2px solid transparent',
                  borderRadius: '50%',
                  p: 0.5,
                  transition: 'border 0.2s',
                }}
                onClick={() => setSelectedMood(mood.label)}
                aria-label={mood.label}
              >
                <span role="img" aria-label={mood.label}>{mood.emoji}</span>
              </Box>
            ))}
          </Box>
        )}
        <TextField
          label="Add a note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="text">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={!selectedMood || loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MoodModal; 