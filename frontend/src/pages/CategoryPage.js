import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Container,
  Paper,
  IconButton,
  Collapse,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Description as FileIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

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

const FileCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#EEEEEE',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
}));

const FileHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const AnalysisContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.05)',
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  height: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
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

const FileLink = styled('a')({
  color: '#EEEEEE',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    color: '#FF6FD8',
  },
});

const ExpandButton = styled(IconButton)(({ theme, isexpanded }) => ({
  color: '#EEEEEE',
  transform: isexpanded === 'true' ? 'rotate(180deg)' : 'rotate(0)',
  transition: 'transform 0.3s ease',
}));

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { files } = location.state || { files: [] };
  const [expandedFileIndex, setExpandedFileIndex] = useState(null);
  const categoryName = decodeURIComponent(location.pathname.split("/").pop());
  const backendUploadsFolder = "http://localhost:5000/uploads";

  const toggleAnalysis = (index) => {
    setExpandedFileIndex(expandedFileIndex === index ? null : index);
  };

  const formatMetricValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
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
          {categoryName} Files
        </Typography>

        {files.length > 0 ? (
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FileCard>
                  <FileHeader>
                    <FileLink
                      href={`${backendUploadsFolder}/${file.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileIcon />
                      <Typography variant="h6">
                        {file.filename}
                      </Typography>
                    </FileLink>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <StyledButton
                        startIcon={<AnalyticsIcon />}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleAnalysis(index);
                        }}
                        size="small"
                      >
                        Analysis
                      </StyledButton>
                      <ExpandButton
                        onClick={(e) => {
                          e.preventDefault();
                          toggleAnalysis(index);
                        }}
                        isexpanded={String(expandedFileIndex === index)}
                      >
                        <ExpandMoreIcon />
                      </ExpandButton>
                    </Box>
                  </FileHeader>

                  <Collapse in={expandedFileIndex === index}>
                    <AnalysisContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#FF6FD8' }}>
                            Basic Analysis
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Word Count:</strong><br />
                                  {file.analysis.word_count}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Character Count:</strong><br />
                                  {file.analysis.char_count}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Sentence Count:</strong><br />
                                  {file.analysis.sentence_count}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Language:</strong><br />
                                  {file.analysis.language}
                                </Typography>
                              </MetricCard>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#FF6FD8' }}>
                            Advanced Metrics
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Readability Score:</strong><br />
                                  {formatMetricValue(file.analysis.readability_score)}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Avg Sentence Length:</strong><br />
                                  {formatMetricValue(file.analysis.avg_sentence_length)}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Sentiment Polarity:</strong><br />
                                  {formatMetricValue(file.analysis.sentiment.polarity)}
                                </Typography>
                              </MetricCard>
                            </Grid>
                            <Grid item xs={6}>
                              <MetricCard>
                                <Typography variant="body2">
                                  <strong>Sentiment Subjectivity:</strong><br />
                                  {formatMetricValue(file.analysis.sentiment.subjectivity)}
                                </Typography>
                              </MetricCard>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#FF6FD8' }}>
                            Top Keywords
                          </Typography>
                          <Grid container spacing={1}>
                            {file.analysis.top_keywords.map(([word, count], idx) => (
                              <Grid item xs={6} sm={4} md={3} key={idx}>
                                <MetricCard>
                                  <Typography variant="body2">
                                    {word}: {count}
                                  </Typography>
                                </MetricCard>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </AnalysisContent>
                  </Collapse>
                </FileCard>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
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
              No files found in this category.
            </Typography>
          </Box>
        )}
      </motion.div>
    </StyledContainer>
  );
};

export default CategoryPage;