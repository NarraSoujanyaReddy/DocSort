// src/pages/Footer.js

import React from 'react';
import './Footer.css';  // Import the Footer CSS file

const Footer = () => {
  return (
    <footer className="footer">
      {/* Contact Information Section */}
      <div className="footer-section">
        <h4>Contact Information:</h4>
        <p>Email: support@Docsort.com</p>
      </div>

      {/* Privacy and Terms Links Section */}
      <div className="footer-section">
        <p><a href="#privacy-policy">Privacy Policy</a></p>
        <p><a href="#terms-conditions">Terms & Conditions</a></p>
      </div>

      {/* Copyright Section */}
      <div className="footer-section">
        <p>&copy; {new Date().getFullYear()} DocSort. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;