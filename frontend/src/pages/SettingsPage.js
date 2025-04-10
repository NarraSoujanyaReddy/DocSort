import React, { useState } from "react";
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock'; // Lock Icon for password
import Visibility from '@mui/icons-material/Visibility'; // Eye icon for visibility toggle
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Eye off icon
import './SettingsPage.css'; // Import the CSS file

const Settings = () => {
  const [displayName, setDisplayName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State to toggle current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility

  // Function to handle saving settings
  const handleSaveSettings = () => {
    alert("Settings updated successfully!");
  };

  // Function to handle password change submission
  const handlePasswordChange = () => {
    alert("Password changed successfully!");
    setOpenPasswordDialog(false); // Close password change dialog
  };

  return (
    <div className="settings-container">
      <Typography variant="h5" className="settings-heading">Settings</Typography>

      <div className="form-container">
        <TextField
          className="form-field"
          label="Display Name"
          variant="outlined"
          fullWidth
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          className="form-field"
          label="Email Address"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Button
          className="form-button"
          variant="contained"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>

        <Button
          className="change-password-button"
          variant="text"
          onClick={() => setOpenPasswordDialog(true)}
        >
          Change Password
        </Button>
      </div>

      {/* Password Change Dialog */}
      <Dialog 
        open={openPasswordDialog} 
        onClose={() => setOpenPasswordDialog(false)} 
        maxWidth="xs" // Reduce the dialog size
        fullWidth 
        PaperProps={{
          style: {
            padding: '20px', // Adjust dialog padding
          },
        }}
      >
        <DialogTitle style={{ textAlign: 'center', marginBottom: '10px' }}>Change Password</DialogTitle> {/* Centered title */}
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            label="Current Password"
            placeholder="Enter your current password"
            type={showCurrentPassword ? "text" : "password"}
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            style={{
              width: '80%', // Reduce width of the TextField
              marginBottom: '1rem', // Adjust spacing
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                color: "#8a5e3b", // Custom color for the label
                fontWeight: "bold",
              },
            }}
            inputProps={{
              style: {
                fontSize: '14px', // Adjust the font size of the input text
              }
            }}
            placeholder="Current Password" // This will act as placeholder text inside the field
          />
          <TextField
            label="New Password"
            placeholder="Enter your new password"
            type={showNewPassword ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            style={{
              width: '80%', // Reduce width of the TextField
              marginBottom: '1rem', // Adjust spacing
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                color: "#8a5e3b", // Custom color for the label
                fontWeight: "bold",
              },
            }}
            inputProps={{
              style: {
                fontSize: '14px', // Adjust the font size of the input text
              }
            }}
            placeholder="New Password" // This will act as placeholder text inside the field
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenPasswordDialog(false)}
            style={{ backgroundColor: "#8a5e3b", color: "white", borderRadius: "4px", padding: '8px 16px' }} // Remove rounded corners and adjust padding
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            style={{ backgroundColor: "#8a5e3b", color: "white", borderRadius: "4px", padding: '8px 16px' }} // Remove rounded corners and adjust padding
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;