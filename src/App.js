import React, { useState, useMemo } from 'react';
import './App.css';
import Onboarding from './Onboarding';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const colorThemes = [
  { name: 'Light', value: 'light', primary: '#1976d2', secondary: '#9c27b0' },
  { name: 'Dark', value: 'dark', primary: '#212121', secondary: '#ff4081' },
  { name: 'Green', value: 'green', primary: '#388e3c', secondary: '#cddc39' },
  { name: 'Orange', value: 'orange', primary: '#ff9800', secondary: '#ff5722' },
];

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [themeName, setThemeName] = useState('light');

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
        ) : (
          <div>
            <h2>Dashboard (Coming Soon)</h2>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
