import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getSuggestions } from './api';

function SuggestionModal({ open, onClose, userId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuggestions(userId);
      setSuggestions(data);
    } catch (e) {
      setError('Failed to load suggestions');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchSuggestions();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>Suggestions</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {suggestions.length === 0 ? (
              <Typography>No suggestions for now.</Typography>
            ) : (
              suggestions.map((s, i) => (
                <Typography key={i} sx={{ mb: 2 }}>{s.text || s}</Typography>
              ))
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={fetchSuggestions} color="primary" variant="outlined" disabled={loading}>Reroll</Button>
        <Button onClick={onClose} color="secondary" variant="text">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuggestionModal; 