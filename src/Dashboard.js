import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoodIcon from '@mui/icons-material/Mood';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MoodModal from './MoodModal';
import ActivityModal from './ActivityModal';
import SuggestionModal from './SuggestionModal';
import { getSuggestions } from './api';

function Dashboard({ user, themeName, setThemeName, onShowSummary }) {
  const name = user.name || 'there';
  const userId = user.id;
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [latestSuggestion, setLatestSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [suggestionHistory, setSuggestionHistory] = useState([]);

  // Fetch latest suggestion on mount
  useEffect(() => {
    if (!userId) return;
    setSuggestionLoading(true);
    getSuggestions(userId)
      .then(suggestions => {
        setLatestSuggestion(suggestions[0]?.text || 'No suggestions yet.');
        setSuggestionHistory(suggestions);
      })
      .catch(() => setLatestSuggestion('No suggestions yet.'))
      .finally(() => setSuggestionLoading(false));
  }, [userId]);

  // Callbacks for modals
  const handleActivityLogged = (activity) => {
    setActivityLogs(logs => [...logs, activity]);
  };
  const handleMoodLogged = (mood) => {
    setMoodLogs(logs => [...logs, mood]);
  };
  const handleSuggestionLogged = (suggestions) => {
    setSuggestionHistory(suggestions);
    setLatestSuggestion(suggestions[0]?.text || 'No suggestions yet.');
  };

  return (
    <Container style={{ maxWidth: 480, padding: 0, minHeight: '100vh', background: '#f8f9fa' }} className="py-4">
      <Typography variant="h5" className="mb-3" style={{ fontWeight: 600, textAlign: 'center' }}>
        Hi {name} <span role="img" aria-label="wave">👋</span>
      </Typography>
      <Row className="mb-3">
        <Col xs={12}>
          <Card variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setShowMoodModal(true)}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <MoodIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 500 }}>Mood</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>Tap to log your mood</Typography>
              </Box>
            </CardContent>
          </Card>
        </Col>
        <Col xs={12}>
          <Card variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setShowActivityModal(true)}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <EventNoteIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 500 }}>Activity</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>Tap to log an activity</Typography>
              </Box>
            </CardContent>
          </Card>
        </Col>
      </Row>
      <Card variant="outlined" sx={{ mb: 3, background: '#fffbe6', cursor: 'pointer' }} onClick={() => setShowSuggestionModal(true)}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <LightbulbIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 500 }}>Today's Suggestion</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>{suggestionLoading ? 'Loading...' : latestSuggestion}</Typography>
          </Box>
        </CardContent>
      </Card>
      <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 600 }} onClick={onShowSummary}>
        View Summary
      </Button>
      <MoodModal open={showMoodModal} onClose={() => setShowMoodModal(false)} userId={userId} onMoodLogged={handleMoodLogged} />
      <ActivityModal open={showActivityModal} onClose={() => setShowActivityModal(false)} userId={userId} onActivityLogged={handleActivityLogged} />
      <SuggestionModal open={showSuggestionModal} onClose={() => setShowSuggestionModal(false)} userId={userId} onSuggestionLogged={handleSuggestionLogged} />
    </Container>
  );
}

export default Dashboard; 