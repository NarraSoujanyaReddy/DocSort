import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo.png';  // Import logo image
import backgroundImage from '../assets/Digital.jpeg'; // Import background image

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="DocSort Logo" className="logo" />
          <h1 className="title">DocSort</h1>
        </div>
        <ul>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
          <li><Link to="/user-profile">User Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Main Content Section with Background Image */}
      <div className="content" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="welcome-section">
          <h2>Welcome to DocSort</h2>
          <p>Your automatic document classification system</p>
        </div>

        <div className="upload-section">
          <h3>Upload your documents</h3>
          <p>Click on the Upload link in the navbar to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
