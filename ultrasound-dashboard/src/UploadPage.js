import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css'; // Import the custom CSS for styling
import { FaFileUpload, FaHome } from 'react-icons/fa'; // Import file upload and home icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // State to store the selected file
  const [uploadStatus, setUploadStatus] = useState(''); // State to store the upload status
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store the list of uploaded files
  const [isDragging, setIsDragging] = useState(false); // State to manage drag-and-drop indication

  // Handle file selection
  const handleFileChange = (event) => {
      setSelectedFiles(event.target.files);
  };

  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

      setSelectedFiles(files);
    setIsDragging(false);
  };

  // Handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Simulate file upload on form submit
  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }

    const formData = new FormData();
    // Append each file in the selectedFiles list to the formData
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("UPLOAD RESPONSE",response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    
    <div className="upload-page">
      <div className="grid-container">
        {/* Left Grid: Upload Section */}
        <div
          className={`left-grid ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          {/* Home Icon */}
          <Link to="/" className="home-icon">
            <FaHome />
            <span className="home-text">Home</span>
          </Link>

          {/* Header and Instruction */}
          <div className="header-section">
            <h2>Upload a Manual</h2>
            <p className="instruction-text">Please upload a PDF version of the manual.</p>
            <p className="drag-drop-text">Drag and drop your manual here, or use the file input below.</p>
          </div>

          {/* Drag-and-Drop Frame */}
          <div className="drag-drop-frame">
            <FaFileUpload className="upload-icon" />
            <p>Drag & Drop your file here</p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleFileUpload} className="upload-form">
            <div className="file-input-wrapper">
              <label htmlFor="manual-upload" className="file-label">
                Choose a manual (PDF):
              </label>
              <input
                type="file"
                id="manual-upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            {/* Display Selected File Name */}
            {selectedFiles && <p className="selected-file">Selected file: {selectedFiles.name}</p>}

            {/* Submit Button */}
            <button type="submit" className="upload-button">
              Upload Manual
            </button>
          </form>

          {/* Upload Status */}
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>

        {/* Right Grid: Uploaded Files Section */}
        <div className="right-grid">
          <h3>Uploaded Files</h3>
          <ul className="uploaded-files-list">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="uploaded-file-item">
                {file}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;