import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css'; // Import the custom CSS for styling
import { FaFileUpload } from 'react-icons/fa'; // Import file upload and home icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Backend URL for the API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // State to store the selected file
  const [uploadStatus, setUploadStatus] = useState(''); // State to store the upload status
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store the list of uploaded files
  const [isDragging, setIsDragging] = useState(false); // State to manage drag-and-drop indication
  const [documentType, setDocumentType] = useState(''); // State to store the selected document type
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indication

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

  // Handle document type change
  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Simulate file upload on form submit
  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }
    if (!documentType) {
      console.error('No document type selected.');
      setUploadStatus('Please select a document type.');
      return;
    }

    const formData = new FormData();
    // Append each file in the selectedFiles list to the formData
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files', file);
    });
    formData.append('documentType', documentType); // Append the document type to the formData

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("UPLOAD RESPONSE", response.data);
      setUploadStatus('Files uploaded successfully.');
      setUploadedFiles(prevFiles => [...prevFiles, ...Array.from(selectedFiles).map(file => file.name)]);
      setSelectedFiles([]);
      setDocumentType(''); // Reset document type
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Error uploading files.');
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="upload-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          
          {/* Navigation / Header */}
          <div className="overlap-group">
            <Link to="/">
              <img className="image" src="/assets/logo_trasparent.png" alt="No Image" />
            </Link>
            <div className="tabs">
              <Link to="/manuals" className="tab">Access Manuals</Link>
              <Link to="/logs" className="tab">Retrieve Device Logs</Link>
              <Link to="/upload" className="tab">Upload Manuals</Link>
            </div>
          </div>

          <h1 className="main-heading">Upload Documents </h1>

          <div className="grid-container">
            {/* Left Grid: Upload Section */}
            <div className="left-grid">
              {/* Header and Instruction */}
              <div className="header-section">
                <p>Upload PDF Files Only.</p>
              </div>

              {/* Document Type Selection */}
              <div className="document-type-section">
                <select
                  id="document-type"
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                  className="document-type-select"
                >
                  <option value="">--Select Document Type--</option>
                  <option value="user-manual">User Manuals</option>
                  <option value="service-manual">Service Manuals</option>
                  <option value="regulatory-document">Regulatory Documents</option>
                  <option value="general-purpose-document">General Purpose Documents</option>
                </select>
              </div>

              {/* Drag-and-Drop Frame */}
              <div
                className={`drag-drop-frame ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('manual-upload').click()}
              >
                <FaFileUpload className="upload-icon" />
                <p className='drag-drop-text'>Drag & Drop your file here or click to select files</p>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                id="manual-upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
                style={{ display: 'none' }}
              />

              {/* Display Selected File Name */}
              {selectedFiles.length > 0 && (
                <p className="selected-file">Selected file: {Array.from(selectedFiles).map(file => file.name).join(', ')}</p>
              )}

              {/* Upload Form */}
              <form onSubmit={handleFileUpload} className="upload-form">
                {/* Submit Button */}
                <button type="submit" className="upload-button">
                  Upload..
                </button>
              </form>
                
              {/* Upload Status */}
              {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

              {/* Loading Bar */}
              {isLoading && <div className="loading-bar">Uploading...</div>}
            </div>

            {/* Right Grid: Uploaded Files Section */}
            <div className="right-grid">
              <h4>Uploaded Files</h4>
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
      </div>
    </div>
  );
};

export default UploadPage;
