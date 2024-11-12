import React, { useState, useEffect } from 'react';
import './Home.css'; // Linking your CSS
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, differenceInDays } from 'date-fns'; // For formatting the date and calculating the difference in days
import { FaComments } from 'react-icons/fa'; // Importing chat icon
import { gapi } from 'gapi-script'; // Import Google API client

const CLIENT_ID = '735228709539-1q4cqdt56ji75e4mg2lihaqh0s07lq3k.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC3f_Mz4zUMAseqIqfErkTY9vqFeKnxHac';
const SCOPES = 'openid email profile https://www.googleapis.com/auth/calendar';

const Home = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const [nextServiceDate, setNextServiceDate] = useState(new Date('2024-10-15')); // Initial date for "Next service"
  const [lastServiceDate, setLastServiceDate] = useState(new Date('2023-10-15')); // Initial date for "Last service"
  const [showModal, setShowModal] = useState(false); // To toggle the modal
  const [errorCode, setErrorCode] = useState(''); // State for the error code input
  const [errorCodeDisplay, setErrorCodeDisplay] = useState(''); // State for the displayed error code
  const [errorDescription, setErrorDescription] = useState(''); // State for the error code description
  const [reminder, setReminder] = useState(''); // State for the reminder message

  useEffect(() => {
    const storedNextServiceDate = localStorage.getItem('nextServiceDate');
    if (storedNextServiceDate) {
      const date = new Date(storedNextServiceDate);
      setNextServiceDate(date);

      const daysUntilService = differenceInDays(date, new Date());
      if (daysUntilService <= 7) {
        setReminder(`Reminder: Your next service is scheduled for ${format(date, 'dd MMM yyyy')}`);
      }
    }

    // Load Google API client
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.init({
          client_id: CLIENT_ID,
        });
      }).catch((error) => {
        console.error('Error initializing Google API client:', error);
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  // Function to handle date selection
  const handleDateChange = (date) => {
    const userConfirmed = window.confirm(`Would you like to add the selected date (${format(date, 'dd MMM yyyy')}) to your calendar?`);
    if (userConfirmed) {
      setLastServiceDate(nextServiceDate); // Update the "Last service" date to the current "Next service" date
      setNextServiceDate(date); // Update the "Next service" date
      setShowModal(false); // Close the modal after selection
      localStorage.setItem('nextServiceDate', date.toISOString()); // Store the date in local storage
      addEventToGoogleCalendar(date); // Add event to Google Calendar
    }
  };

  // Function to add event to Google Calendar
  const addEventToGoogleCalendar = (date) => {
    const event = {
      summary: 'Scheduled Maintenance',
      description: 'Scheduled maintenance for the device.',
      start: {
        dateTime: date.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: 'America/Los_Angeles',
      },
    };

    console.log('Event to be added:', event); // Log the event details

    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signIn().then(() => {
        gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        }).then((response) => {
          console.log('Event created: ', response);
        }).catch((error) => {
          console.error('Error creating event:', error);
        });
      }).catch((error) => {
        console.error('Error signing in:', error);
      });
    } else {
      console.error('Auth instance not available');
    }
  };

  // Function to handle error code search
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/lookup-code?code=${errorCode}`);
      const data = await response.json();
      console.log(data);

      setErrorCodeDisplay(errorCode); // Update the displayed error code
      setErrorDescription(data['Description']); // Update the error code description
    } catch (error) {
      console.error('Error fetching error code description:', error);
    }
  };

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

          {/* Reminder Section */}
          {reminder && (
            <div className="reminder">
              <p>{reminder}</p>
            </div>
          )}

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
                <div className="overlap-2">                   
                  {/* Display the selected "Next service" date */}
                  <p className="p">Next service: {format(nextServiceDate, 'dd MMM yyyy')}</p>
                  <p className="p">Last serviced: {format(lastServiceDate, 'dd MMM yyyy')}</p>
                </div>

                {/* Button to open the modal */}
                <button className="schedule-button" onClick={() => setShowModal(true)}>
                  <div className="div-wrapper">
                    <div className="text-wrapper-2">Schedule Maintenance</div>
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