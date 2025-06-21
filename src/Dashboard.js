import React, { useState } from 'react';
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

function Dashboard({ user, themeName, setThemeName, onShowSummary }) {
  const name = user.name || 'there';
  // Placeholder for LLM-generated tip
  const suggestion = "Take a 5-minute walk to refresh your mind!";
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

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
            <Typography variant="body2" sx={{ textAlign: 'center' }}>{suggestion}</Typography>
          </Box>
        </CardContent>
      </Card>
      <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 600 }} onClick={onShowSummary}>
        View Summary
      </Button>
      <MoodModal open={showMoodModal} onClose={() => setShowMoodModal(false)} />
      <ActivityModal open={showActivityModal} onClose={() => setShowActivityModal(false)} />
      <SuggestionModal open={showSuggestionModal} onClose={() => setShowSuggestionModal(false)} />
    </Container>
  );
}

export default Dashboard; 