import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { auth } from '../firebase';

// Styled Components with Aurora Night theme
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  fontFamily: "'Inter', sans-serif",
  '& *': {
    fontFamily: 'inherit',
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#EEEEEE',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #FF6FD8 0%, #3813C2 100%)',
  boxShadow: '0 8px 32px rgba(255, 111, 216, 0.3)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(255, 111, 216, 0.4)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  background: 'linear-gradient(135deg, #FF6FD8 0%, #3813C2 100%)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(255, 111, 216, 0.3)',
  transition: 'all 0.3s ease',
  border: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 111, 216, 0.4)',
    background: 'linear-gradient(135deg, #FF6FD8 20%, #3813C2 100%)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputBase-root': {
    color: '#EEEEEE',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF6FD8',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF6FD8',
  },
}));

const StyledDivider = styled(Divider)({
  background: 'rgba(255, 255, 255, 0.2)',
  margin: '24px 0',
});

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    displayName: auth.currentUser?.displayName || 'User',
    email: auth.currentUser?.email || '',
    phoneNumber: auth.currentUser?.phoneNumber || '',
    bio: '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await auth.currentUser?.updateProfile({
        displayName: userData.displayName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <StyledContainer maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box sx={{ mb: 4 }}>
          <StyledButton
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateX(-4px)',
              },
            }}
          >
            Back
          </StyledButton>
        </Box>

        <ProfileCard>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LargeAvatar>
                {userData.displayName.charAt(0).toUpperCase()}
              </LargeAvatar>
            </motion.div>
            
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6FD8 0%, #3813C2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 3,
              }}
            >
              Profile
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <StyledTextField
              fullWidth
              label="Display Name"
              name="displayName"
              value={userData.displayName}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email}
              disabled
            />

            <StyledTextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <StyledTextField
              fullWidth
              label="Bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              rows={4}
            />
          </Box>

          <StyledDivider />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isEditing ? (
                <StyledButton
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save Changes
                </StyledButton>
              ) : (
                <StyledButton
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </StyledButton>
              )}
            </motion.div>
          </Box>
        </ProfileCard>
      </motion.div>
    </StyledContainer>
  );
};

export default UserProfilePage;
