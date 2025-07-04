import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { createOrUpdateUser } from './api';

const steps = [
  'Welcome',
  'Name',
  'Goal',
  'TrackingStyle',
  'PresetActivities',
  'Notifications',
  'Success',
];

const colorThemes = [
  { name: 'Light', value: 'light', primary: '#1976d2', secondary: '#9c27b0' },
  { name: 'Dark', value: 'dark', primary: '#212121', secondary: '#ff4081' },
  { name: 'Green', value: 'green', primary: '#388e3c', secondary: '#cddc39' },
  { name: 'Orange', value: 'orange', primary: '#ff9800', secondary: '#ff5722' },
];

const countryCodes = [
  { code: '+1', label: 'US/Canada' },
  { code: '+91', label: 'India' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'Australia' },
  { code: '+92', label: 'Pakistan' },
  // Add more as needed
];

function ThemeSelector({ theme, setTheme }) {
  return (
    <Row className="mb-3 justify-content-center">
      <Col xs="auto">
        <span style={{ fontWeight: 500, marginRight: 8 }}>Theme:</span>
        <ToggleButtonGroup
          value={theme}
          exclusive
          onChange={(_, val) => val && setTheme(val)}
          size="small"
        >
          {colorThemes.map((t) => (
            <ToggleButton key={t.value} value={t.value} style={{ color: t.primary, borderColor: t.primary }}>
              {t.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Col>
    </Row>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <Container className="Onboarding-step text-center p-4" style={{ maxWidth: 400 }}>
      <h1 className="mb-3">Welcome to Habit Tracker!</h1>
      <p className="mb-4">Track your habits, moods, and build a better you.</p>
      <Button variant="contained" size="large" onClick={() => onNext()} fullWidth>Get Started</Button>
    </Container>
  );
}

function NameStep({ data, onNext, onBack }) {
  const [name, setName] = useState(data.name || '');
  const [email, setEmail] = useState(data.email || '');
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">Let's get to know you</h2>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        className="mb-3"
      />
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        className="mb-3"
        type="email"
      />
      <Row className="mt-3">
        <Col><Button variant="outlined" onClick={onBack} fullWidth>Back</Button></Col>
        <Col><Button variant="contained" onClick={() => onNext({ name, email })} fullWidth disabled={!name || !email}>Next</Button></Col>
      </Row>
    </Container>
  );
}

function GoalStep({ data, onNext, onBack }) {
  const [goal, setGoal] = useState(data.goal || '');
  const goals = [
    'Improve Mood',
    'Build New Habits',
    'Track Productivity',
    'Something Else',
  ];
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">What's your main goal?</h2>
      <ToggleButtonGroup
        value={goal}
        exclusive
        onChange={(_, val) => val && setGoal(val)}
        fullWidth
        className="mb-3"
        orientation="vertical"
      >
        {goals.map((g) => (
          <ToggleButton key={g} value={g} style={{ marginBottom: 8 }}>
            {g}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Row className="mt-3">
        <Col><Button variant="outlined" onClick={onBack} fullWidth>Back</Button></Col>
        <Col><Button variant="contained" onClick={() => onNext({ goal })} fullWidth disabled={!goal}>Next</Button></Col>
      </Row>
    </Container>
  );
}

function TrackingStyleStep({ data, onNext, onBack }) {
  const [style, setStyle] = useState(data.trackingStyle || 'quick');
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">How do you want to track your day?</h2>
      <ToggleButtonGroup
        value={style}
        exclusive
        onChange={(_, val) => val && setStyle(val)}
        fullWidth
        className="mb-3"
      >
        <ToggleButton value="quick">Quick & Simple</ToggleButton>
        <ToggleButton value="detailed">Detailed</ToggleButton>
      </ToggleButtonGroup>
      <Row className="mt-3">
        <Col><Button variant="outlined" onClick={onBack} fullWidth>Back</Button></Col>
        <Col><Button variant="contained" onClick={() => onNext({ trackingStyle: style })} fullWidth>Next</Button></Col>
      </Row>
    </Container>
  );
}

function PresetActivitiesStep({ data, onNext, onBack }) {
  const activities = ['Sleep', 'Work', 'Exercise', 'Meals', 'Reading', 'Relaxation'];
  const [selected, setSelected] = useState(data.activities || []);
  const toggle = (activity) => {
    setSelected((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">Pick a few activities you want to track</h2>
      <Row className="mb-3">
        {activities.map((activity) => (
          <Col xs={6} className="mb-2" key={activity}>
            <Button
              variant={selected.includes(activity) ? 'contained' : 'outlined'}
              color={selected.includes(activity) ? 'primary' : 'inherit'}
              onClick={() => toggle(activity)}
              fullWidth
            >
              {activity}
            </Button>
          </Col>
        ))}
      </Row>
      <Row className="mt-3">
        <Col><Button variant="outlined" onClick={onBack} fullWidth>Back</Button></Col>
        <Col><Button variant="contained" onClick={() => onNext({ activities: selected })} fullWidth>Next</Button></Col>
      </Row>
    </Container>
  );
}

function NotificationsStep({ data, onNext, onBack }) {
  const [enabled, setEnabled] = useState(data.notificationsEnabled || false);
  const [frequency, setFrequency] = useState(data.notificationsFrequency || '5x/day');
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">Would you like reminders?</h2>
      <FormControlLabel
        control={<Checkbox checked={enabled} onChange={e => setEnabled(e.target.checked)} />}
        label="Enable reminders to log mood/activities"
      />
      {enabled && (
        <Select
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          fullWidth
          className="mb-3"
        >
          <MenuItem value="3x/day">3x/day</MenuItem>
          <MenuItem value="5x/day">5x/day</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      )}
      <Row className="mt-3">
        <Col><Button variant="outlined" onClick={onBack} fullWidth>Back</Button></Col>
        <Col><Button variant="contained" onClick={() => onNext({ notificationsEnabled: enabled, notificationsFrequency: frequency })} fullWidth>Next</Button></Col>
      </Row>
    </Container>
  );
}

function SuccessStep({ onFinish }) {
  return (
    <Container className="Onboarding-step text-center p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">You're all set!</h2>
      <p className="mb-4">You can start logging activities and moods right away.</p>
      <Button variant="contained" size="large" onClick={onFinish} fullWidth>Go to Dashboard</Button>
    </Container>
  );
}

function Onboarding({ data, onFinish }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(data.name || '');
  const [countryCode, setCountryCode] = useState('+1');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  if (step === 0) {
    return (
      <Container className="Onboarding-step text-center p-4" style={{ maxWidth: 400 }}>
        <h1 className="mb-3">Welcome to Habit Tracker!</h1>
        <p className="mb-4">Track your habits, moods, and build a better you.</p>
        <Button variant="contained" size="large" onClick={() => setStep(1)} fullWidth>Get Started</Button>
      </Container>
    );
  }

  if (step === 1) {
    return (
      <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
        <h2 className="mb-3">Let's get to know you</h2>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          className="mb-3"
        />
        <Row className="mb-3">
          <Col xs={5}>
            <TextField
              select
              label="Code"
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              fullWidth
            >
              {countryCodes.map((c) => (
                <MenuItem key={c.code} value={c.code}>{c.code} ({c.label})</MenuItem>
              ))}
            </TextField>
          </Col>
          <Col xs={7}>
            <TextField
              label="Mobile Number"
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
              fullWidth
              inputProps={{ maxLength: 15 }}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button
              variant="contained"
              onClick={() => setStep(2)}
              fullWidth
              disabled={!name || !mobile}
            >
              Continue
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Step 2: OTP
  return (
    <Container className="Onboarding-step p-4" style={{ maxWidth: 400 }}>
      <h2 className="mb-3">Enter OTP</h2>
      <p className="mb-3">Enter the 4-digit code sent to your mobile</p>
      <TextField
        label="OTP"
        value={otp}
        onChange={e => {
          setOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
          setOtpError('');
        }}
        fullWidth
        inputProps={{ maxLength: 4 }}
        error={!!otpError}
        helperText={otpError}
      />
      <Row className="mt-3">
        <Col>
          <Button
            variant="contained"
            onClick={async () => {
              if (otp === '0308') {
                setLoading(true);
                try {
                  const { user, token } = await createOrUpdateUser({ name, mobile: countryCode + mobile });
                  // Save token to localStorage with expiry
                  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
                  localStorage.setItem('jwt_token', token);
                  localStorage.setItem('jwt_token_expires', expiresAt);
                  onFinish(user);
                } catch (e) {
                  setOtpError('Failed to save user.');
                }
                setLoading(false);
              } else {
                setOtpError('Invalid OTP. Try 0308.');
              }
            }}
            fullWidth
            disabled={otp.length !== 4 || loading}
          >
            {loading ? 'Saving...' : 'Verify & Continue'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Onboarding; 