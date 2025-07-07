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
import { createOrUpdateUser } from '../api/users';

const countryCodes = [
  { code: '+1', label: 'US/Canada' },
  { code: '+91', label: 'India' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'Australia' },
  { code: '+92', label: 'Pakistan' },
];

function WelcomeStep({ onNext }) {
  return (
    <Container className="Onboarding-step text-center p-4" style={{ maxWidth: 400 }}>
      <h1 className="mb-3">Welcome to Habit Tracker!</h1>
      <p className="mb-4">Track your habits, moods, and build a better you.</p>
      <Button variant="contained" size="large" onClick={onNext} fullWidth>Get Started</Button>
    </Container>
  );
}

function NameStep({ name, setName, countryCode, setCountryCode, mobile, setMobile, onNext }) {
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
            onClick={onNext}
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

function OTPStep({ otp, setOtp, otpError, setOtpError, loading, onVerify }) {
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
            onClick={onVerify}
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

  // Add more steps as needed

  if (step === 0) {
    return <WelcomeStep onNext={() => setStep(1)} />;
  }
  if (step === 1) {
    return <NameStep name={name} setName={setName} countryCode={countryCode} setCountryCode={setCountryCode} mobile={mobile} setMobile={setMobile} onNext={() => setStep(2)} />;
  }
  if (step === 2) {
    return <OTPStep otp={otp} setOtp={setOtp} otpError={otpError} setOtpError={setOtpError} loading={loading} onVerify={async () => {
      if (otp === '0308') {
        setLoading(true);
        try {
          const { user, token } = await createOrUpdateUser({ name, mobile: countryCode + mobile });
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
    }} />;
  }
  if (step === 3) {
    return <SuccessStep onFinish={onFinish} />;
  }
  return null;
}

export default Onboarding; 