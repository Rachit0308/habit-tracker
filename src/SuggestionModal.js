import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Box from '@mui/material/Box';

const suggestions = [
  "Try a 5-minute walk to refresh your mind.",
  "Write down one thing you're grateful for today.",
  "Take a deep breath and stretch for a moment.",
  "Read a page from a book you enjoy.",
  "Drink a glass of water and hydrate yourself.",
  "Step outside and notice something new in your surroundings.",
];

function getRandomSuggestion(current) {
  let filtered = suggestions.filter(s => s !== current);
  return filtered[Math.floor(Math.random() * filtered.length)] || suggestions[0];
}

function SuggestionModal({ open, onClose }) {
  const [tip, setTip] = useState(suggestions[0]);

  const handleReroll = () => {
    setTip(getRandomSuggestion(tip));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>Today's Insight</DialogTitle>
      <DialogContent>
        <Card variant="outlined" sx={{ background: '#fffbe6', mb: 2 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <LightbulbIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 500, mb: 1 }}>
                {tip}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={handleReroll} color="primary" variant="outlined">Suggest Again</Button>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuggestionModal; 