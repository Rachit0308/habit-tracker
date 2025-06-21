import React, { useState, useMemo } from 'react';
import './App.css';
import Onboarding from './Onboarding';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './Dashboard';
import DailySummary from './DailySummary';

const colorThemes = [
  { name: 'Light', value: 'light', primary: '#1976d2', secondary: '#9c27b0' },
  { name: 'Dark', value: 'dark', primary: '#212121', secondary: '#ff4081' },
  { name: 'Green', value: 'green', primary: '#388e3c', secondary: '#cddc39' },
  { name: 'Orange', value: 'orange', primary: '#ff9800', secondary: '#ff5722' },
];

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({ name: 'Rachit' });
  const [themeName, setThemeName] = useState('light');
  const [showSummary, setShowSummary] = useState(false);

  // Sample data for logs and suggestions
  const [moodLogs, setMoodLogs] = useState([
    { mood: 'Good', emoji: '🙂', note: 'Feeling productive this morning!', timestamp: new Date().setHours(9, 30) },
    { mood: 'Okay', emoji: '😐', note: 'A bit tired after lunch.', timestamp: new Date().setHours(13, 15) },
  ]);
  const [activityLogs, setActivityLogs] = useState([
    { activity: 'Work', timeSpent: 180, timestamp: new Date().setHours(9, 0) },
    { activity: 'Reading', timeSpent: 30, timestamp: new Date().setHours(12, 30) },
    { activity: 'Exercise', timeSpent: 60, timestamp: new Date().setHours(17, 0) },
  ]);
  const [suggestionHistory, setSuggestionHistory] = useState([
    { tip: "Take a 5-minute walk to refresh your mind.", timestamp: new Date().setHours(11, 0) }
  ]);

  const theme = useMemo(() => {
    const selected = colorThemes.find(t => t.value === themeName) || colorThemes[0];
    return createTheme({
      palette: {
        mode: selected.value === 'dark' ? 'dark' : 'light',
        primary: { main: selected.primary },
        secondary: { main: selected.secondary },
      },
    });
  }, [themeName]);

  const handleNext = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setOnboardingStep((step) => step + 1);
  };

  const handleBack = () => {
    setOnboardingStep((step) => Math.max(0, step - 1));
  };

  const handleFinish = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setOnboarded(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {!onboarded ? (
          <Onboarding
            step={onboardingStep}
            data={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            themeName={themeName}
            setThemeName={setThemeName}
          />
        ) : showSummary ? (
          <DailySummary
            user={onboardingData}
            moodLogs={moodLogs}
            activityLogs={activityLogs}
            suggestionHistory={suggestionHistory}
            onBack={() => setShowSummary(false)}
          />
        ) : (
          <Dashboard
            user={onboardingData}
            themeName={themeName}
            setThemeName={setThemeName}
            onShowSummary={() => setShowSummary(true)}
            setMoodLogs={setMoodLogs}
            setActivityLogs={setActivityLogs}
            setSuggestionHistory={setSuggestionHistory}
            moodLogs={moodLogs}
            activityLogs={activityLogs}
            suggestionHistory={suggestionHistory}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
