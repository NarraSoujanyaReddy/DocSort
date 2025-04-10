import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  FolderOpen as FolderIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';

// Styled Components
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

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#EEEEEE',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
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
}));

const StatusMessage = styled(Typography)(({ success }) => ({
  color: success ? '#4CAF50' : '#f44336',
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '8px 16px',
  borderRadius: '8px',
  marginTop: '16px',
  textAlign: 'center',
  backdropFilter: 'blur(5px)',
}));

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classificationData = location.state?.classificationData || [];
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Science & Technology",
    "Business & Marketing",
    "Sports",
    "Legal",
    "Finance"
  ];

  const categoryMapping = {
    "Science/Technology": "Science & Technology",
    "Business/Marketing": "Business & Marketing",
    "Sports": "Sports",
    "Legal": "Legal",
    "Finance": "Finance",
  };

  const groupedFiles = categories.reduce((acc, category) => {
    acc[category] = classificationData.filter((file) => {
      const normalizedCategory = categoryMapping[file.category] || null;
      return normalizedCategory === category;
    });
    return acc;
  }, {});

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`, {
      state: { files: groupedFiles[category] || [] },
    });
  };

  const handleSaveReport = async () => {
    const username = localStorage.getItem("username");
    
    if (!username) {
      setSaveStatus({ message: "Error: No username found.", success: false });
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post("http://localhost:5000/save_report", {
        username: username,
        results: classificationData,
      });

      if (response.status === 200) {
        setSaveStatus({ message: "Report saved successfully!", success: true });
      } else {
        setSaveStatus({ message: "Error saving the report.", success: false });
      }
    } catch (error) {
      setSaveStatus({ message: "Error saving the report.", success: false });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box sx={{ mb: 4 }}>
          <StyledButton
            startIcon={<ArrowBackIcon />}
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

        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            mb: 4,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Classification Results
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => {
            const filesInCategory = groupedFiles[category] || [];
            return (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CategoryCard onClick={() => handleCategoryClick(category)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">
                        {category}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      {filesInCategory.length} {filesInCategory.length === 1 ? 'file' : 'files'}
                    </Typography>
                  </CategoryCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {classificationData.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              mt: 4,
              p: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" color="white">
              No files were classified. Please try uploading files again.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <StyledButton
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSaveReport}
              disabled={isSaving || classificationData.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save Report'}
            </StyledButton>
          </motion.div>
        </Box>

        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatusMessage success={saveStatus.success}>
              {saveStatus.message}
            </StatusMessage>
          </motion.div>
        )}
      </motion.div>
    </StyledContainer>
  );
};

export default ResultsPage;
