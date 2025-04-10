// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJtKywr5MubheInb1fhVE86-PkgBszMGU",
  authDomain: "student-attendance-track-60ef2.firebaseapp.com",
  projectId: "student-attendance-track-60ef2",
  storageBucket: "student-attendance-track-60ef2.firebasestorage.app",
  messagingSenderId: "941718693774",
  appId: "1:941718693774:web:f853f2030b92d1e40b66df",
  measurementId: "G-TB0GVWB1W3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
