import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Import your CSS file for styling
import logo from '../assets/logonew4.jpg'; // Update path to your assets folder

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <div className="logo-container">
          <img src={logo} alt="DocSort Logo" className="logo" />
          <h1 className="docsort-title">DocSort</h1>
        </div>
      </header>

      <div className="welcome-content">
        <p className="welcome-quote">
          <span className="quote-highlight">Welcome to DocSort – Upload and relax, DocSort does the rest!</span>  
          Tired of dealing with scattered and unorganized files? DocSort makes it simple to sort, classify, and analyze your documents effortlessly. Whether you’re working with single files, batches, or entire folders, DocSort streamlines the process so you can focus on what matters most.
        </p>
        <p className="welcome-subtext">
          Get started today – Your Hassle-Free Document Sorting Solution!
        </p>
        <div className="welcome-buttons">
          <button onClick={() => navigate('/login')} className="btn btn-login">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="btn btn-signup">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;