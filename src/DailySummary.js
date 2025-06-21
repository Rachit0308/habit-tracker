import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import MoodIcon from '@mui/icons-material/Mood';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function DailySummary({ user, moodLogs, activityLogs, suggestionHistory, onBack }) {
  // Mood of the day: last mood log
  const moodOfDay = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null;
  // Build a timeline of the day: mood, activities, suggestions in chronological order
  const events = [
    ...moodLogs.map(m => ({ type: 'mood', ...m })),
    ...activityLogs.map(a => ({ type: 'activity', ...a })),
    ...suggestionHistory.map(s => ({ type: 'suggestion', ...s })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Container style={{ maxWidth: 480, padding: 0, minHeight: '100vh', background: '#f8f9fa' }} className="py-4">
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }} variant="text">
        Back
      </Button>
      <Typography variant="h5" className="mb-3" style={{ fontWeight: 700, textAlign: 'center' }}>
        Today's Story
      </Typography>
      <Card variant="outlined" sx={{ mb: 3, background: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
            {user.name ? `${user.name}'s day began...` : "Your day began..."}
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
      <Timeline position="right" sx={{ mb: 3 }}>
        {events.length === 0 && (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="grey" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" color="text.secondary">No events logged today.</Typography>
            </TimelineContent>
          </TimelineItem>
        )}
        {events.map((event, i) => (
          <TimelineItem key={i}>
            <TimelineSeparator>
              <TimelineDot color={event.type === 'mood' ? 'primary' : event.type === 'activity' ? 'secondary' : 'warning'}>
                {event.type === 'mood' ? <MoodIcon /> : event.type === 'activity' ? <EventNoteIcon /> : <LightbulbIcon />}
              </TimelineDot>
              {i < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              {event.type === 'mood' && (
                <Box mb={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.name ? `${user.name} felt ` : 'You felt '}<span style={{ fontSize: 20 }}>{event.emoji}</span> <b>{event.mood}</b>
                  </Typography>
                  {event.note && <Typography variant="body2" color="text.secondary"> "{event.note}"</Typography>}
                  <Typography variant="caption" color="text.secondary">{formatTime(event.timestamp)}</Typography>
                </Box>
              )}
              {event.type === 'activity' && (
                <Box mb={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.name ? `${user.name} spent` : 'You spent'} <b>{event.timeSpent} min</b> on <b>{event.activity === 'custom' ? event.customActivity : event.activity}</b>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{formatTime(event.timestamp)}</Typography>
                </Box>
              )}
              {event.type === 'suggestion' && (
                <Box mb={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Insight: <span style={{ color: '#fbc02d' }}>{event.tip}</span>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{formatTime(event.timestamp)}</Typography>
                </Box>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
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