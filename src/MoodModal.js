import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const moods = [
  { label: 'Great', emoji: '😃' },
  { label: 'Good', emoji: '🙂' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Bad', emoji: '🙁' },
  { label: 'Awful', emoji: '😢' },
];

function MoodModal({ open, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    // Save mood and note (to be implemented)
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>How are you feeling?</DialogTitle>
      <DialogContent>
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
        <Button onClick={handleSave} color="primary" variant="contained" disabled={!selectedMood}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MoodModal; 