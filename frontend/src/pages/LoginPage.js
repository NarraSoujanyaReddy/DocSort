import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  sendSignInLinkToEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Fade,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  width: '100%',
  margin: '0 auto',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(240, 245, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(240, 245, 255, 1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(240, 245, 255, 1)',
    }
  },
  '& .MuiInputLabel-root': {
    color: '#666',
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
  color: '#666',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  border: '1px solid #dadce0',
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '8px',
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const actionCodeSettings = {
        url: window.location.origin + "/finishSignUp",
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email for later use
      window.localStorage.setItem("emailForSignIn", email);
      
      setSuccess(
        "Check your email for the sign-in link! " +
        "The link will expire after 24 hours. " +
        "Please use the same device to open the link for a seamless experience."
      );
      setEmail(''); // Clear the form
    } catch (err) {
      console.error("Error sending sign-in link:", err);
      setError(
        err.message || 
        "Failed to send sign-in link. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login with account selection
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem('username', user.email);

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/upload'), 1000);
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={3}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: '#333',
                textAlign: 'center',
                fontSize: '2rem',
              }}
            >
              Welcome Back
            </Typography>
          </motion.div>

          <Fade in={!!error}>
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          </Fade>

          <Fade in={!!success}>
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          </Fade>

          <StyledForm onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Sign-in Link'}
            </Button>

            <GoogleButton
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={loading}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </GoogleButton>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    textDecoration: 'none',
                    color: '#2196F3',
                    fontWeight: 500,
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </motion.div>
    </Box>
  );
};

export default LoginPage;