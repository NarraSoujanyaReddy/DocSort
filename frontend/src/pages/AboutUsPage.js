import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Lightbulb,
  Security,
  Speed,
  Group,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'visible',
  position: 'relative',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(2),
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const AboutUsPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { name: 'John Doe', role: 'Project Lead', avatar: '/path/to/john.jpg' },
    { name: 'Jane Smith', role: 'Developer', avatar: '/path/to/jane.jpg' },
    { name: 'Alice Brown', role: 'Data Scientist', avatar: '/path/to/alice.jpg' },
    { name: 'Bob Johnson', role: 'UI/UX Designer', avatar: '/path/to/bob.jpg' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/home')}
            sx={{
              mb: 4,
              color: '#666',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Back to Home
          </Button>

          <StyledCard elevation={0}>
            <CardContent sx={{ p: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    mb: 4,
                    fontWeight: 700,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  About Us
                </Typography>

                <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: '#666' }}>
                  Welcome to <strong>AutoSort</strong>, an automatic document classification and filing system designed to streamline your document management process.
                </Typography>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <FeatureIcon>
                          <Speed sx={{ fontSize: 30 }} />
                        </FeatureIcon>
                        <Typography variant="h6" sx={{ mb: 1 }}>Efficiency</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Real-time document processing with high accuracy
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <FeatureIcon>
                          <Security sx={{ fontSize: 30 }} />
                        </FeatureIcon>
                        <Typography variant="h6" sx={{ mb: 1 }}>Security</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Advanced security measures to protect your documents
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <FeatureIcon>
                          <Lightbulb sx={{ fontSize: 30 }} />
                        </FeatureIcon>
                        <Typography variant="h6" sx={{ mb: 1 }}>Innovation</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Smart AI-powered classification system
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                <Typography
                  variant="h3"
                  sx={{
                    mb: 4,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1a237e',
                  }}
                >
                  Our Team
                </Typography>

                <Grid container spacing={3}>
                  {teamMembers.map((member, index) => (
                    <Grid item xs={12} sm={6} md={3} key={member.name}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <TeamMemberCard elevation={0}>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              margin: '0 auto 16px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                          >
                            <Person />
                          </Avatar>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.role}
                          </Typography>
                        </TeamMemberCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </CardContent>
          </StyledCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutUsPage;
