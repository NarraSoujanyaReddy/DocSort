// src/components/SignUpPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { 
  getAuth, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  updateProfile 
} from "firebase/auth";
import { auth } from "../firebase";

// Configure the action code settings for email link
const getActionCodeSettings = () => {
  // For local development with ngrok
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const ngrokUrl = process.env.REACT_APP_NGROK_URL;
  const redirectPath = process.env.REACT_APP_AUTH_REDIRECT_URL || '/finishSignUp';
  
  let baseUrl;
  if (isLocalhost && ngrokUrl) {
    // Use ngrok URL for local development
    baseUrl = ngrokUrl;
  } else if (process.env.REACT_APP_ENV === 'production') {
    // Use production URL
    baseUrl = process.env.REACT_APP_PRODUCTION_URL;
  } else {
    // Fallback to current origin
    baseUrl = window.location.origin;
  }

  // Ensure the URL is properly formatted
  const url = `${baseUrl}${redirectPath}`;
  console.log('Sign-in link will redirect to:', url);

  return {
    url,
    handleCodeInApp: true,
    // Add any additional settings if needed
    dynamicLinkDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
  };
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a sign-in link
    const verifyEmailLink = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get the email from localStorage
          let email = window.localStorage.getItem('emailForSignIn');
          let username = window.localStorage.getItem('usernameForSignIn');

          // If email is missing, prompt the user
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
            if (!email) {
              throw new Error('Email is required to complete sign-in');
            }
          }

          // If username is missing, prompt the user
          if (!username) {
            username = window.prompt('Please provide your username for confirmation');
            if (!username) {
              throw new Error('Username is required to complete sign-in');
            }
          }

          setIsLoading(true);
          
          // Complete the sign-in process
          const result = await signInWithEmailLink(auth, email, window.location.href);
          
          // Update user profile
          await updateProfile(result.user, {
            displayName: username
          });

          // Clear stored data
          window.localStorage.removeItem('emailForSignIn');
          window.localStorage.removeItem('usernameForSignIn');
          
          // Navigate to upload page
          navigate('/upload');
        }
      } catch (error) {
        console.error("Error completing sign-in:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
        setIsVerifying(false);
      }
    };

    verifyEmailLink();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear any previous messages
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const { username, email } = formData;

    if (!username || !email) {
      setError('Please fill all the fields');
      setIsLoading(false);
      return;
    }

    try {
      // Get action code settings
      const actionCodeSettings = getActionCodeSettings();

      // Send the sign-in link
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email and username locally
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('usernameForSignIn', username);
      
      setSuccess(
        'Check your email for the sign-in link! ' +
        'The link will expire after 24 hours. ' +
        'Please use the same device to open the link for a seamless experience.'
      );
      
      // Clear form
      setFormData({ username: '', email: '' });
    } catch (err) {
      console.error("Error sending sign-in link:", err);
      setError(
        err.message || 
        'Failed to send sign-in link. Please check your email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while verifying email link
  if (isVerifying) {
    return (
      <Container maxWidth="xs" sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  // Show loading spinner while processing
  if (isLoading) {
    return (
      <Container maxWidth="xs" sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1" color="textSecondary">
          {success ? 'Sending sign-in link...' : 'Processing...'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={4}>
          Welcome
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <Box mb={2}>
            <OutlinedInput
              fullWidth
              placeholder="Full Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              }
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Box>

          {/* Email */}
          <Box mb={3}>
            <OutlinedInput
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              }
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Box>

          {/* Sign Up Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(to right, #2196f3, #21cbf3)',
              color: '#fff',
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            }}
          >
            {isLoading ? 'Sending Link...' : 'Get Sign-in Link'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
              Already have an account?
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;