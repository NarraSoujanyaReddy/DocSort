import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token or user data)
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <div className="header">
      {/* Logo and DocSort Name */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="DocSort Logo" className="logo-img" />
          <span className="docsort-name">DocSort</span>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="user-profile">
        <IconButton onClick={handleMenuOpen}>
          <AccountCircleIcon />
        </IconButton>
        <span className="username">Username</span>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { navigate('/user-profile'); handleMenuClose(); }}>Profile</MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
