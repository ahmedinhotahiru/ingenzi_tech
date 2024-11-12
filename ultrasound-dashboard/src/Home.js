import React, { useState, useEffect, useRef } from 'react';
import './Home.css'; // Linking your CSS
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // For formatting the date
import { FaComments } from 'react-icons/fa'; // Importing chat icon
import { FaTools, FaBell } from 'react-icons/fa'; // Import maintenance icon


const errorCodeDescriptions = {
  '0001': 'A software failure (new assertion) has occurred. There is no known hardware fault that could cause this.',
  '0002': 'FEC alert message - The front end has stopped scanning because of some power monitor problem. This could be a hardware problem with the scanhead, the channel boards, the AIM, or the power supplies, but this also could be a system software problem. In reviewing the previous error messages, from the FEC, the board errorID should indicate if there is a specific problem with hardware.',
  '0003': 'Hardware configuration was incorrect for the board specified in the error message. Most likely this is a board configuration problem - either the hard coded bits or the Eeprom is bad. This could also be a communications or software problem.'
  // Add more error codes and descriptions as needed
};

const Home = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const [nextServiceDate, setNextServiceDate] = useState(new Date('2025-10-15')); // Initial date for "Next service"
  const [lastServiceDate, setLastServiceDate] = useState(new Date('2024-10-15')); // Initial date for "Last service"
  const [showModal, setShowModal] = useState(false); // To toggle the modal
  const [errorCode, setErrorCode] = useState(''); // State for the error code input
  const [errorCodeDisplay, setErrorCodeDisplay] = useState(''); // State for the displayed error code
  const [errorDescription, setErrorDescription] = useState(''); // State for the error code description
  const modalRef = useRef(null); // Reference for the modal

  // Function to handle date selection
  const handleDateChange = (date) => {
    setLastServiceDate(nextServiceDate); // Update the "Last service" date to the current "Next service" date
    setNextServiceDate(date); // Update the "Next service" date
    setShowModal(false); // Close the modal after selection
  };

  // Function to handle error code search
  const handleSearch = async () => {

    const response = await fetch(`http://127.0.0.1:5000/api/lookup-code?code=${errorCode}`);
    const data = await response.json();
    console.log(data);

    setErrorCodeDisplay(errorCode); // Update the displayed error code
    setErrorDescription(data['Description']); // Update the error code description
  };

  // Effect to handle clicks outside the modal and Escape key press
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  return (
    <div className="home-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          
          {/* Navigation / Header */}
          <div className="overlap-group">
            <img className="image" src="/assets/logo_trasparent.png" alt="No Image" />
            <div className="tabs">
              <button className="tab" onClick={() => navigate('/manuals')}>Access Manuals</button>
              <button className="tab" onClick={() => navigate('/logs')}>Retrieve Device Logs</button>
              <button className="tab" onClick={() => navigate('/upload')}>Upload Manuals</button>
            </div>
          </div>

          {/* Main Section: LLM Device Troubleshooting Tool */}
          <div className="main-section">
            <h1 className="main-heading">LLM Ultrasound Troubleshooting Tool</h1>
            <p className="p">Fix Faster, Diagnose Smarter!</p>
          </div>

          {/* Error Code Search, Recent Logs, and AI Assistant Sections */}
          <div className="grid-container">
            <div className="left-grid">
              <div className="overlap-5">
                <div className="text-wrapper-7">Error Code Search</div>
                <div className="search-container">
                  <input 
                    type="text" 
                    placeholder="Enter error code... e.g 0001" 
                    className="search-input"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(); // Trigger the handleSearch function on Enter key press
                      }
                    }}
                  />
                  <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
                <div className="log-frame">
                  <div className="log-title">Error Code</div>
                  <div className="log-content">
                    <img className="log-icon" src="https://cdn-icons-png.freepik.com/512/9496/9496657.png" alt="Log Icon" />
                    <span className="log-text">
                      {errorCodeDisplay ? errorCodeDisplay : 'No error code selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="error-code-right-grid">
                <div className="error-code-frame">
                  <div className="error-code-title">Error Code Description</div>
                  <div className="error-code-content">
                    <p>{errorDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Maintenance Section */}
            <div className="right-grid">
              <div className="div">
                <div className="text-wrapper-3">Upcoming Maintenance</div>
                <div className="maintenance-card">
                  {/* Large maintenance icon */}
                  <div className='next-maintenance'>
                    <FaTools className="card-icon-large" /> 
                    <div>
                      <span className='next-date'> {format(nextServiceDate, 'dd MMM yyyy')}</span><br/>

                      <span className="p last-serviced">Last serviced: {format(lastServiceDate, 'dd MMM yyyy')}</span>
                    </div>
                        
                    
                  </div>               
                  {/* Display the selected "Next service" date */}
                  
                  {/* <p className="p last-serviced">Last serviced: {format(lastServiceDate, 'dd MMM yyyy')}</p>
                  <p className="p">Next service: {format(nextServiceDate, 'dd MMM yyyy')}</p> */}
                </div>

                {/* Button to open the modal */}
                <button className="schedule-button" onClick={() => setShowModal(true)}>
                  <div className="div-wrapper">
                    <div className="text-wrapper-2">
                      <FaBell/> Schedule Maintenance</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Modal for Date Picker */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
                <h3>Select a Maintenance Date</h3>
                <DatePicker
                  selected={nextServiceDate}
                  onChange={handleDateChange}
                  minDate={new Date()} // Prevent selecting past dates
                  inline
                />
              </div>
            </div>
          )}

          {/* Floating Chat Icon */}
          {/* <div className="chat-icon">
            <FaComments size={40} />
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default Home;