import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  Box,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Card,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  CloudUpload,
  Person,
  Settings,
  Logout,
  History,
  FolderOpen,
  InsertDriveFile,
  Close,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logonew4.jpg";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 4),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const UploadCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.5)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.8)",
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const FilePreviewCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.8)",
  borderRadius: theme.spacing(2),
  maxHeight: "300px",
  overflow: "auto",
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
  },
}));

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const currentUser = auth.currentUser;
  const displayName = currentUser?.displayName || "User";
  const email = currentUser?.email || "user@example.com";
  const allowedFileTypes = [".pdf", ".docx", ".txt", ".xlsx", ".jpg", ".jpeg", ".png"];

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const fileType = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return allowedFileTypes.includes(fileType);
    });

    if (validFiles.length === 0) {
      alert("No valid files found. Please upload supported file formats.");
      return;
    }

    setSelectedFiles((prevFiles) => {
      const existingFiles = new Set(prevFiles.map((file) => file.webkitRelativePath || file.name));
      const uniqueFiles = validFiles.filter(
        (file) => !existingFiles.has(file.webkitRelativePath || file.name)
      );
      return [...prevFiles, ...uniqueFiles];
    });
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const handleClassify = async () => {
    if (selectedFiles.length === 0) {
      alert("No files or folders uploaded for classification.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      simulateUpload();

      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        navigate("/results", { state: { classificationData: response.data.results } });
      } else {
        alert("An error occurred during classification. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while uploading or classifying the files.");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <StyledContainer maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Box display="flex" alignItems="center" gap={2}>
            <motion.img
              src={Logo}
              alt="DOCSORT Logo"
              style={{ height: 50 }}
              whileHover={{ scale: 1.05 }}
            />
            <Typography variant="h4" fontWeight="bold" color="primary">
              DOCSORT
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={(e) => setProfileMenuAnchor(e.currentTarget)}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={() => setProfileMenuAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ p: 2, minWidth: 250 }}>
                <Typography variant="h6" gutterBottom>
                  {displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate("/settings")}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => navigate("/history")}>
                <ListItemIcon>
                  <History fontSize="small" />
                </ListItemIcon>
                View History
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                auth.signOut();
                navigate("/login");
              }}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Header>

        <UploadCard>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
            Upload Files
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Select files or folders to begin classification
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileSelection}
              style={{ display: "none" }}
            />
            <input
              type="file"
              id="folder-upload"
              webkitdirectory="true"
              multiple
              onChange={handleFileSelection}
              style={{ display: "none" }}
            />
            
            <label htmlFor="file-upload">
              <StyledButton
                variant="contained"
                component="span"
                startIcon={<InsertDriveFile />}
              >
                Choose Files
              </StyledButton>
            </label>
            
            <label htmlFor="folder-upload">
              <StyledButton
                variant="contained"
                component="span"
                startIcon={<FolderOpen />}
              >
                Choose Folder
              </StyledButton>
            </label>
          </Box>

          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FilePreviewCard>
                  <List>
                    {selectedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end" onClick={() => removeFile(index)}>
                              <Close />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            {file.webkitRelativePath ? <FolderOpen /> : <InsertDriveFile />}
                          </ListItemIcon>
                          <ListItemText
                            primary={file.webkitRelativePath || file.name}
                            secondary={`${(file.size / 1024).toFixed(2)} KB`}
                          />
                        </ListItem>
                        {index < selectedFiles.length - 1 && <Divider />}
                      </motion.div>
                    ))}
                  </List>
                </FilePreviewCard>

                {uploadProgress > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <ProgressBar variant="determinate" value={uploadProgress} />
                    <Typography align="center" variant="body2" color="text.secondary">
                      {uploadProgress}% Complete
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                  <StyledButton
                    variant="contained"
                    onClick={handleClassify}
                    startIcon={<CloudUpload />}
                    size="large"
                  >
                    Classify Files
                  </StyledButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedFiles.length && (
            <DropZone>
              <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop Files Here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or use the buttons above to select files
              </Typography>
            </DropZone>
          )}
        </UploadCard>
      </motion.div>
    </StyledContainer>
  );
};

export default UploadPage;
