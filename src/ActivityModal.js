import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';

const defaultActivities = [
  'Reading',
  'Cooking',
  'Scrolling',
  'Exercise',
  'Work',
  'Relaxation',
];

function ActivityModal({ open, onClose }) {
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [timeSpent, setTimeSpent] = useState(30);

  const handleSave = () => {
    // Save activity, customActivity, and timeSpent (to be implemented)
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>Log Activity</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="activity-label">Activity</InputLabel>
            <Select
              labelId="activity-label"
              value={activity}
              label="Activity"
              onChange={e => setActivity(e.target.value)}
            >
              {defaultActivities.map((act) => (
                <MenuItem key={act} value={act}>{act}</MenuItem>
              ))}
              <MenuItem value="custom">Custom...</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {activity === 'custom' && (
          <TextField
            label="Custom Activity"
            value={customActivity}
            onChange={e => setCustomActivity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <Box mb={2}>
          <Typography gutterBottom>Time Spent (minutes)</Typography>
          <Slider
            value={timeSpent}
            onChange={(_, val) => setTimeSpent(val)}
            min={5}
            max={180}
            step={5}
            valueLabelDisplay="auto"
            marks={[{ value: 5, label: '5' }, { value: 60, label: '60' }, { value: 120, label: '120' }, { value: 180, label: '180' }]}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="text">Cancel</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!(activity && (activity !== 'custom' || customActivity))}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActivityModal; 