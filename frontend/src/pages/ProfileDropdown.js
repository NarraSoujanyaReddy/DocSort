// ProfileDropdown.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="profile-section">
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        <img src="/profile-icon.png" alt="Profile" />
        <span>{user?.displayName || 'User'}</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div onClick={() => navigate('/profile')} className="dropdown-item">
            <i className="icon">👤</i> Profile
          </div>
          <div onClick={() => navigate('/settings')} className="dropdown-item">
            <i className="icon">⚙️</i> Settings
          </div>
          <div onClick={handleLogout} className="dropdown-item logout">
            <i className="icon">🚪</i> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
