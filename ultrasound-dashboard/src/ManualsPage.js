import React, { useEffect, useState } from 'react';
import './ManualsPage.css'; // Linking your CSS
import { FaDownload } from 'react-icons/fa'; // Importing icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Backend URL for the API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ManualsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchManuals = async () => {
    setLoading(true);
    const file_types = ["user", "service", "regulatory"];
    const manualList = [];

    for (const file_type of file_types) {
      const response = await fetch(`${BACKEND_URL}/api/get_files?type=${file_type}`);
      const data = await response.json();
      manualList.push(...data);
    }

    setManuals(manualList);
    setLoading(false);
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const filteredManuals = manuals.filter(manual => {
    return (
      (selectedType === 'All' || selectedType.toLowerCase().includes(manual.type)) &&
      manual["file"].toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log("Filtered Manuals: ", filteredManuals);

  return (
    <div className="manuals-page">
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

          {/* Main Section: Search and Manuals List */}
          <div className="main-section">
            <h1 className="main-heading">Retrieve Device Manuals</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search manuals..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <select value={selectedType} onChange={handleTypeChange} className="type-select">
                <option value="All">All</option>
                <option value="User Manual">User Manuals</option>
                <option value="Service Manual">Service Manuals</option>
                <option value="Regulatory Document">Regulatory Documents</option>
              </select>
            </div>
            <div className="manuals-list">
              {filteredManuals.map((manual, index) => (
                <div key={index} className="manual-item">
                  <span className="manual-name">{manual.file}</span>
                  <a href={`${BACKEND_URL}/api/files/download/${manual.file}?type=${manual.type}`} download={manual.file} className="download-button">
                    <FaDownload className="download-icon" /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManualsPage;
