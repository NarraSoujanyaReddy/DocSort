import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UnclassifiedPage.css';

const UnclassifiedPage = () => {
  const navigate = useNavigate();

  // Sample unclassified files (this data would be dynamically generated based on your system's error handling)
  const unclassifiedFiles = [
    'unknown_file_1.pdf',
    'unsorted_document.txt',
    'image_1.jpg',
  ];

  // Retry uploading files
  const handleRetry = () => {
    navigate('/upload'); // Redirect to the Upload page to retry
  };

  return (
    <div className="unclassified-container">
      <h2>Unclassified Files</h2>
      <div className="unclassified-list">
        {unclassifiedFiles.length ? (
          <ul>
            {unclassifiedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ) : (
          <p>No unclassified files found</p>
        )}
      </div>
      <button className="retry-btn" onClick={handleRetry}>
        Retry Upload
      </button>
    </div>
  );
};

export default UnclassifiedPage;
