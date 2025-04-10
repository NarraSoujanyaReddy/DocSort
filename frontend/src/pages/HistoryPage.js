import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Paper,
  Divider,
  List,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./HistoryPage.css";

// Reusable component for displaying document details
const DocumentCard = ({ document }) => {
  return (
    <Paper elevation={3} style={{ marginBottom: "10px", padding: "10px" }}>
      <Typography variant="h6" style={{ color: "#4a4a4a" }}>
        Filename: {document?.filename || "N/A"}
      </Typography>
      <Typography variant="subtitle1" style={{ color: "#757575" }}>
        Category: {document?.category || "Unknown"}
      </Typography>
      <Divider style={{ margin: "10px 0" }} />
      <Typography variant="body1" style={{ color: "#333" }}>
        Average Sentence Length: {document?.analysis?.average_sentence_length?.toFixed(2) || "N/A"}
      </Typography>
      <Typography variant="body1" style={{ color: "#333" }}>
        Character Count: {document?.analysis?.char_count || 0}
      </Typography>
      <Typography variant="body1" style={{ color: "#333" }}>
        Language: {document?.analysis?.language || "Unknown"}
      </Typography>
      <Typography variant="body1" style={{ color: "#333" }}>
        Sentence Count: {document?.analysis?.sentence_count || 0}
      </Typography>
      <Typography variant="body1" style={{ color: "#333" }}>
        Readability Score: {document?.analysis?.readability_score?.toFixed(2) || "N/A"}
      </Typography>
      <Typography variant="body2" style={{ marginTop: "10px", color: "#555" }}>
        Sentiment - Polarity:{" "}
        {document?.analysis?.sentiment?.polarity?.toFixed(2) || "N/A"}, Subjectivity:{" "}
        {document?.analysis?.sentiment?.subjectivity?.toFixed(2) || "N/A"}
      </Typography>
      <Divider style={{ margin: "10px 0" }} />
      <Typography variant="subtitle1" style={{ color: "#4a4a4a", marginTop: "10px" }}>
        Top Keywords:
      </Typography>
      {document?.analysis?.top_keywords && Array.isArray(document.analysis.top_keywords) && document.analysis.top_keywords.length > 0 ? (
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {document.analysis.top_keywords.map(([word, count], index) => (
            <Box
              key={index}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                padding: "8px 12px",
                fontSize: "14px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {word}: {count}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" style={{ color: "#888", fontStyle: "italic" }}>
          No keywords available.
        </Typography>
      )}
    </Paper>
  );
};

const HistoryPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/view-history/${auth.currentUser?.email}`);
      if (response.data.status === "success") {
        setDocuments(response.data.history);
      } else {
        alert("Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("An error occurred while fetching documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const groupDocumentsByDate = () => {
    return documents.reduce((acc, document) => {
      const date = document.Date.split("T")[0]; // Assuming date is in 'YYYY-MM-DD' format
      if (!acc[date]) acc[date] = [];
      acc[date].push(document);
      return acc;
    }, {});
  };

  const groupedDocuments = groupDocumentsByDate();

  return (
    <div className="history-page">
      <header className="header">
        <Typography variant="h4" align="center" style={{ marginBottom: "20px" }}>
          Document History
        </Typography>
      </header>

      <div className="documents-container">
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Loading documents...
            </Typography>
          </div>
        ) : (
          <div className="documents-list">
            {Object.keys(groupedDocuments).map((date) => (
              <div key={date} className="date-group">
                <Typography variant="h6" style={{ marginTop: "20px", color: "#8a5e3b" }}>
                  {date}
                </Typography>
                <List>
                  {groupedDocuments[date].map((doc, index) => (
                    <div key={index}>
                      {doc.Documents.map((item, itemIndex) => (
                        <DocumentCard key={itemIndex} document={item} />
                      ))}
                    </div>
                  ))}
                </List>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;


