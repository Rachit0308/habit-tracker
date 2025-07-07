import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MoodIcon from '@mui/icons-material/Mood';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CircularProgress from '@mui/material/CircularProgress';
import { getDailySummary } from '../api/summary';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function DailySummary({ userId, date, onBack }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(date));

  useEffect(() => {
    if (!userId || !selectedDate) return;
    setLoading(true);
    setError(null);
    const formatted = selectedDate.toISOString().slice(0, 10);
    getDailySummary(userId, formatted)
      .then(data => setSummary(data))
      .catch(() => setError('Failed to load summary'))
      .finally(() => setLoading(false));
  }, [userId, selectedDate]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!summary) return null;

  // Mood of the day: first mood log (when the day began)
  const moodOfDay = summary.moodLogs.length > 0 ? summary.moodLogs[0] : null;
  // Build a timeline of the day: mood, activities in chronological order
  const events = [
    ...(summary.moodLogs || []).map(m => ({ type: 'mood', ...m })),
    ...(summary.activityLogs || []).map(a => ({ type: 'activity', ...a })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Container style={{ maxWidth: 480, padding: 0, minHeight: '100vh', background: '#f8f9fa' }} className="py-4">
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }} variant="text">
        Back
      </Button>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select date"
          value={selectedDate}
          onChange={date => {
            if (date && date <= new Date()) setSelectedDate(date);
          }}
          maxDate={new Date()}
          disableFuture
          slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
        />
      </LocalizationProvider>
      <Typography variant="h5" className="mb-3" style={{ fontWeight: 700, textAlign: 'center' }}>
        Today's Story
      </Typography>
      <Card variant="outlined" sx={{ mb: 3, background: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
            {summary.user.name ? `${summary.user.name}'s day began...` : "Your day began..."}
          </Typography>
          {moodOfDay ? (
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Typography variant="body1" sx={{ fontSize: 22, mb: 1 }}>
                <span style={{ fontSize: 32 }}>{moodOfDay.emoji}</span> {moodOfDay.mood}
              </Typography>
              {moodOfDay.note && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                  " {moodOfDay.note} "
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {`You started your day at ${formatTime(moodOfDay.timestamp)} feeling this way.`}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>No mood logged today.</Typography>
          )}
        </CardContent>
      </Card>
      <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 3 }}>
        {events.length === 0 && (
          <ListItem>
            <ListItemIcon>
              <EventNoteIcon color="disabled" />
            </ListItemIcon>
            <ListItemText primary="No events logged today." />
          </ListItem>
        )}
        {events.map((event, i) => (
          <React.Fragment key={i}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                {event.type === 'mood' ? <MoodIcon color="primary" /> : <EventNoteIcon color="secondary" />}
              </ListItemIcon>
              <ListItemText
                primary={event.type === 'mood'
                  ? (<span>{summary.user.name ? `${summary.user.name} felt ` : 'You felt '}<span style={{ fontSize: 20 }}>{event.emoji}</span> <b>{event.mood}</b></span>)
                  : (<span>{summary.user.name ? `${summary.user.name} spent` : 'You spent'} <b>{event.timeSpent} min</b> on <b>{event.activity === 'custom' ? event.customActivity : event.activity}</b></span>)}
                secondary={event.type === 'mood' && event.note ? `"${event.note}"` : null}
              />
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60, textAlign: 'right' }}>
                {formatTime(event.timestamp)}
              </Typography>
            </ListItem>
            {i < events.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
      <Card variant="outlined" sx={{ background: '#fffbe6', mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>A day to remember!</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {events.length > 0
              ? "Every log, every mood, every activity is a part of your story. Keep tracking to see your journey unfold!"
              : "Start logging your moods and activities to build your story."}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default DailySummary; 