import React, { useState, useEffect } from 'react';
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
import { createActivity, API_BASE } from './api';
import dayjs from 'dayjs';

function getAuthHeaders() {
  const token = localStorage.getItem('jwt_token');
  const expires = localStorage.getItem('jwt_token_expires');
  if (!token || !expires || Date.now() > Number(expires)) return {};
  return { Authorization: `Bearer ${token}` };
}

const fallbackActivities = [
  'Reading',
  'Cooking',
  'Scrolling',
  'Exercise',
  'Work',
  'Relaxation',
];

function ActivityModal({ open, onClose, userId, onActivityLogged }) {
  const [activities, setActivities] = useState(fallbackActivities);
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [timeSpent, setTimeSpent] = useState(30);
  const [loading, setLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityTime, setActivityTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0,5); // 'HH:MM'
  });

  useEffect(() => {
    if (!open) return;
    setActivitiesLoading(true);
    fetch(`${API_BASE}/activities/master`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(list => {
        if (Array.isArray(list) && list.length) {
          setActivities(list);
        }
        setActivitiesLoading(false);
      })
      .catch(() => setActivitiesLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) {
      const now = new Date();
      setActivityTime(now.toTimeString().slice(0,5));
    }
  }, [open]);

  const handleSave = async () => {
    if (!activity || (activity === 'custom' && !customActivity)) return;
    setLoading(true);
    const today = dayjs().format('YYYY-MM-DD');
    const timestamp = dayjs(`${today}T${activityTime}`).toDate().getTime();
    const data = {
      userId,
      activity,
      customActivity: activity === 'custom' ? customActivity : '',
      timeSpent,
      timestamp,
    };
    const saved = await createActivity(data);
    setLoading(false);
    if (onActivityLogged) onActivityLogged(saved);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>Log Activity</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="activity-label">Activity</InputLabel>
            {activitiesLoading ? (
              <Box my={2} textAlign="center">Loading activities...</Box>
            ) : (
              <Select
                labelId="activity-label"
                value={activity}
                label="Activity"
                onChange={e => setActivity(e.target.value)}
              >
                {activities.map((act) => (
                  <MenuItem key={act} value={act}>{act}</MenuItem>
                ))}
                <MenuItem value="custom">Custom...</MenuItem>
              </Select>
            )}
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
        <Box mb={2}>
          <TextField
            label="Time of Activity"
            type="time"
            value={activityTime}
            onChange={e => setActivityTime(e.target.value)}
            fullWidth
            inputProps={{ step: 60 }} // 1 min steps
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="text">Cancel</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!(activity && (activity !== 'custom' || customActivity)) || loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActivityModal; 