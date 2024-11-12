import React, { useState, useRef, useEffect } from 'react';
import './LogsPage.css'; // Linking your CSS
import { FaHome, FaDownload, FaSyncAlt } from 'react-icons/fa'; // Importing icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Bar } from 'react-chartjs-2'; // Importing chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const initialLogs = [
  { id: 1, name: 'Log029.txt', date: '23-Sept-2024' },
  { id: 2, name: 'Log026.txt', date: '30-Nov-2024' },
  // Add more logs as needed
];

const initialMachineInfo = {
  'System Errors or Warnings': {
    description: 'Indicates any errors or warnings detected in the system.',
    value: '2 warnings'
  },
  'Functional Tests': {
    description: 'Results from tests that check the functionality of specific components.',
    value: 'All Set'
  },
  'Software and Firmware Status': {
    description: 'Confirmation that the operating software and firmware are up to date.',
    value: 'Up to date'
  },
};

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [machineInfo, setMachineInfo] = useState(initialMachineInfo);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChartReady, setIsChartReady] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ['Calibration Results', 'Image Quality Metrics', 'Battery Status'],
    datasets: [
      {
        label: 'Machine Information',
        data: [85, 90, 60], // Example data
        backgroundColor: 'rgba(2, 157, 204, 0.6)',
        borderColor: 'rgba(2, 157, 204, 1)',
        borderWidth: 1,
      },
    ],
  });
  // const [isFunctionalTestAllSet, setIsFunctionalTestAllSet] = useState(true);
  const chartRef = useRef(null);

  const fetchLogs = async () => {
    const response = await fetch(`http://127.0.0.1:5000/api/get_files?type=logs`);
    const data = await response.json();
    setLogs(data);
  };

  const retrieveNewLogs = async () => {
    fetch("http://127.0.0.1:5000/api/retrieve-logs").then(_=>{
      fetchLogs();
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const handleRetrieveLogs = () => {
  //   // Simulate fetching new log files
  //   const newLogs = [
  //     { id: logs.length + 1, name: `Log0${logs.length + 30}.txt`, date: new Date().toLocaleDateString() },
  //     // Add more new logs as needed
  //   ];
  //   setLogs([...logs, ...newLogs]);

  //   // Generate new random data for the chart
  //   const newChartData = {
  //     labels: ['Calibration Results', 'Image Quality Metrics', 'Battery Status'],
  //     datasets: [
  //       {
  //         label: 'Machine Information',
  //         data: [
  //           Math.floor(Math.random() * 100), // Random value for Calibration Results
  //           Math.floor(Math.random() * 100), // Random value for Image Quality Metrics
  //           Math.floor(Math.random() * 100), // Random value for Battery Status
  //         ],
  //         backgroundColor: 'rgba(2, 157, 204, 0.6)',
  //         borderColor: 'rgba(2, 157, 204, 1)',
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  //   setChartData(newChartData);

  //   // Alternate between "All Set" and "Error Detected" for Functional Tests
  //   const newFunctionalTestValue = isFunctionalTestAllSet ? 'Error Detected' : 'All Set';
  //   setIsFunctionalTestAllSet(!isFunctionalTestAllSet);

  //   // Update machine info with new information
  //   const newMachineInfo = {
  //     'System Errors or Warnings': {
  //       description: 'Indicates any errors or warnings detected in the system.',
  //       value: `${Math.floor(Math.random() * 5)} warnings`
  //     },
  //     'Functional Tests': {
  //       description: 'Results from tests that check the functionality of specific components.',
  //       value: newFunctionalTestValue
  //     },
  //     'Software and Firmware Status': {
  //       description: 'Confirmation that the operating software and firmware are up to date.',
  //       value: 'Up to date'
  //     },
  //   };
  //   setMachineInfo(newMachineInfo);
  // };

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log["file"].toLowerCase().includes(searchLower) ||
      log["date"].toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    setIsChartReady(true);
    return () => {
      // Cleanup chart instance when the component unmounts
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    fetchLogs();
  },[]);

  console.log("logs: ",logs);

  return (
    <div className="logs-page">
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

          <h1 className="main-heading">Retrieve Device Logs</h1>

          {/* Main Section: Search and Logs List */}
          <div className="grid-container">
            <div className="left-grid">
              <div className="main-section">
                <h1 className="new-logs">Log Files</h1>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search logs by name or date..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
                <button className="retrieve-button" onClick={retrieveNewLogs}>
                  <FaSyncAlt/> Retrieve New Logs
                </button>
                <div className="logs-list">


                  {filteredLogs.map((log, index) => (
                    <div key={index} className="log-item">
                      <span className="log-name">{log.file}</span>
                      <span className="log-date">{log.date}</span>

                      <a href={`http://127.0.0.1:5000/api/files/download/${log.file}?type=${log.type}`} download={log.file} className="download-button">
                        <FaDownload className="download-icon" /> Download
                      </a>
                    </div>
                  ))}



                </div>
              </div>
            </div>

            <div className="right-grid">
              <div className="catalog-section">
                <h2 className="device-heading">Device Information</h2>
                <ul className="catalog-list">
                  {Object.entries(machineInfo).map(([key, info]) => (
                    <li key={key} className="catalog-item">
                      <div className="catalog-key">{key}:</div>
                      <div className="catalog-value">{info.value}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="chart-section">
                {isChartReady && <Bar data={chartData} ref={chartRef} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LogsPage;