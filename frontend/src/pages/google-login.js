// src/components/google-login.js
import React from 'react';
import { auth } from '../firebase';  // Import auth from your updated firebase.js
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';  // Import necessary functions

const googleProvider = new GoogleAuthProvider();  // Using the provider

const handleGoogleLogin = async () => {
  try {
    // Initiating Google login through popup
    const result = await signInWithPopup(auth, googleProvider);
    
    // Accessing user info from the result
    const user = result.user;
    console.log('Google login successful', user);
    
    // Now you can use `user` info to update UI or make API calls
  } catch (error) {
    console.error('Google login failed', error.message);
    
    // Optional: Show error message to the user
    alert('Login failed: ' + error.message);
  }
};

const GoogleLoginButton = () => {
  return (
    <button onClick={handleGoogleLogin}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
