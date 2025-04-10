import React, { useEffect, useState } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { auth } from "../firebase";

const FinishSignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          // Get the email and username from localStorage
          let email = window.localStorage.getItem("emailForSignIn");
          let username = window.localStorage.getItem("usernameForSignIn");

          // If email is missing, prompt the user
          if (!email) {
            email = window.prompt("Please enter your email to complete sign in:");
            if (!email) {
              throw new Error("Email is required to complete sign in.");
            }
          }

          // If username is missing, prompt the user
          if (!username) {
            username = window.prompt("Please enter your username to complete sign in:");
            if (!username) {
              throw new Error("Username is required to complete sign in.");
            }
          }

          // Complete the sign-in process
          const result = await signInWithEmailLink(auth, email, window.location.href);

          // Update the user's profile with their username
          await updateProfile(result.user, {
            displayName: username
          });

          // Clear the stored email and username
          window.localStorage.removeItem("emailForSignIn");
          window.localStorage.removeItem("usernameForSignIn");

          console.log("✅ User signed in successfully:", result.user);
          
          // Navigate to the upload page
          navigate("/upload");
        } catch (error) {
          console.error("❌ Sign-in error:", error.message);
          setError(error.message);
          setIsProcessing(false);
        }
      } else {
        setError("Invalid sign-in link. Please try signing up again.");
        setIsProcessing(false);
      }
    };

    completeSignIn();
  }, [navigate]);

  if (isProcessing) {
    return (
      <Container maxWidth="xs" sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 3
      }}>
        <CircularProgress />
        <Typography variant="h6" color="textSecondary">
          Completing your sign-in...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, width: '100%' }}>
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Sign-in Status
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FinishSignUp; 