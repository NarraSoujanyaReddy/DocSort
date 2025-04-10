import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import UnclassifiedPage from './pages/UnclassifiedPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import CategoryPage from './pages/CategoryPage';
import ContactUsPage from './pages/ContactUsPage';
import SettingsPage from './pages/SettingsPage';
import AboutUsPage from './pages/AboutUsPage';
import FeedbackPage from './pages/FeedbackPage';
import Footer from './pages/Footer';
import EditProfile from './pages/EditProfile';
import GoogleLoginButton from './pages/google-login';
import HistoryPage from './pages/HistoryPage';
import FinishSignUp from './pages/FinishSignUp';

const AppContent = () => {
  const location = useLocation();
  
  // Determine if the footer should be displayed based on the current route
  const showFooter = location.pathname === '/' || location.pathname === '/upload';

  return (
    <div>
      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/unclassified" element={<UnclassifiedPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/google-login" element={<GoogleLoginButton />} />
        <Route path="/history"element={<HistoryPage/>}/>
        <Route path="/finishSignUp" element={<FinishSignUp />} />
      </Routes>

      {/* Conditionally render the footer based on the path */}
      {showFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
