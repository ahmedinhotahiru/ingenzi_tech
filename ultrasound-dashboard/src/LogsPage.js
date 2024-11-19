import React, { useState, useRef, useEffect } from 'react';
import {startCase } from "lodash";
import './LogsPage.css'; // Linking your CSS
import { FaDownload, FaSyncAlt } from 'react-icons/fa'; // Importing icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Bar } from 'react-chartjs-2'; // Importing chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const initSelfTestReport = {
  "calibration_status": {
      "display": "FAIL",
      "probe": "PASS"
  },
  "components_tested": {
      "imaging_modes": {
          "2D": "FAIL",
          "Doppler": "PASS",
          "M-Mode": "PASS"
      },
      "network_connectivity": {
          "network_status": "Connected",
          "signal_strength": "-53 dBm"
      },
      "power_supply": {
          "battery_level": "52%",
          "current": "1.8A",
          "voltage": "23.3V"
      },
      "probe_check": {
          "connection_status": "Connected",
          "frequency_response": "3.5 MHz",
          "probe_id": "C78901",
          "type": "Linear"
      },
      "temperature_check": "40°C"
  },
  "error_logs": [
      {
          "description": "Probe disconnected unexpectedly",
          "error_code": "E-404"
      }
  ],
  "firmware_version": "5.3.2",
  "recommendations": "Recalibrate probe",
  "system_status": "PASS",
  "test_duration": "1 minutes",
  "test_id": "ST-73302",
  "timestamp": "2024-11-18T16:31:59.829315Z"
};

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [machineInfo, setMachineInfo] = useState({
    'System Startup': {
      description: 'Indicates any errors or warnings detected in the system.',
      value: 'System'
    },
    'Firmware Status': {
      description: 'Confirmation that the operating software and firmware are up to date.',
      value: 'Up To Date'
    },
    'Time Stamp': {
      description: 'Results from tests that check the functionality of specific components.',
      value: new Date("2024-11-18T16:02:31Z").toDateString()
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isChartReady, setIsChartReady] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ['Calibration Results', 'Image Quality', 'Battery Status'],
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
  const [showSelfTestCard, setShowSelfTestCard] = useState(false);
  const [showSelfTestResults, setShowSelfTestResults] = useState(false);
  const [selfTestReport, setSelfTestReport] = useState(initSelfTestReport);
  const chartRef = useRef(null);

  const runSelfTest = async () =>{
    const resp = await fetch("http://127.0.0.1:5000/api/self-test-report");
    const data = await resp.json();

    setSelfTestReport(data);
  }

  const retrieveSingleLogFile = async (fileName) => {
    const resp = await fetch(`http://127.0.0.1:5000/api/retrieve-logs/${fileName}`);
    const data = await resp.json();

    setMachineInfo({
      'System Startup': {
        description: 'Indicates any errors or warnings detected in the system.',
        value: startCase(data[0].details["startup_status"])
      },
      'Firmware Status': {
        description: 'Confirmation that the operating software and firmware are up to date.',
        value: startCase(data[0].details["firmware_status"])
      },
      'Time Stamp': {
        description: 'Results from tests that check the functionality of specific components.',
        value: new Date(data[0]["timestamp"]).toDateString()
      },
    });

    setChartData(prevState => ({
      ...prevState,
      datasets: [
        {
          label: 'Machine Information',
          data: [
            data[2].details["callibration_value"], 
            data[1].details["image_quality"], 
            data[1].details["battery_health"]], 
          backgroundColor: 'rgba(2, 157, 204, 0.6)',
          borderColor: 'rgba(2, 157, 204, 1)',
          borderWidth: 1,
        },
      ],
    }));
  }

  const fetchLogs = async () => {
    const response = await fetch(`http://127.0.0.1:5000/api/get_files?type=logs`);
    const data = await response.json();

    setLogs(data);

   retrieveSingleLogFile(data[0].file);
  };

  const retrieveNewLogs = async () => {
    const resp = await fetch("http://127.0.0.1:5000/api/retrieve-logs");
    const data = await resp.json();
    fetchLogs();

    setMachineInfo({
      'System Startup': {
        description: 'Indicates any errors or warnings detected in the system.',
        value: startCase(data.data[0].details["startup_status"])
      },
      'Firmware Status': {
        description: 'Confirmation that the operating software and firmware are up to date.',
        value: startCase(data.data[0].details["firmware_status"])
      },
      'Time Stamp': {
        description: 'Results from tests that check the functionality of specific components.',
        value: new Date(data.data[0]["timestamp"]).toDateString()
      },
    });

    setChartData(prevState => ({
      ...prevState,
      datasets: [
        {
          label: 'Machine Information',
          data: [
            data.data[2].details["callibration_value"], 
            data.data[1].details["image_quality"], 
            data.data[1].details["battery_health"]], 
          backgroundColor: 'rgba(2, 157, 204, 0.6)',
          borderColor: 'rgba(2, 157, 204, 1)',
          borderWidth: 1,
        },
      ],
    }))
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelfTestClick = () => {
    setShowSelfTestCard(true);
  };

  const handleSelfTestSubmit = () => {
    alert('All conditions satisfied. Initiating self-test...');
    
    runSelfTest();

    setShowSelfTestCard(false);
    setShowSelfTestResults(true);

   
  };

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
          <button className="self-test-button" onClick={handleSelfTestClick}>Initiate Device Self-Test</button>

          {showSelfTestCard && (
            <div className="self-test-card">
              <h2>Only click submit when the below has been checked</h2>
              <ul>
                <li>Disconnect all transducers and probes</li>
                <li>Ensure the device is properly powered</li>
                <li>Place the device in a ventilated area</li>
              </ul>
              <button className="submit-button" onClick={handleSelfTestSubmit}>Submit</button>
            </div>
          )}

          {showSelfTestResults && (
            <div className="self-test-results-grid">
              <div className="self-test-results-card">
                <h3>Probe Check</h3>
                <div className="result-item">
                  <ul>
                    <li>Connection Status: {selfTestReport.components_tested.probe_check.connection_status}</li>
                    <li>Frequency Response: {selfTestReport.components_tested.probe_check.frequency_response}</li>
                    <li>Probe ID: {selfTestReport.components_tested.probe_check.probe_id}</li>
                    <li>Type: {selfTestReport.components_tested.probe_check.type}</li>
                  </ul>
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Imaging Modes</h3>
                <div className="result-item">
                  <ul>
                    <li>2D: {selfTestReport.components_tested.imaging_modes['2D']}</li>
                    <li>Doppler: {selfTestReport.components_tested.imaging_modes.Doppler}</li>
                    <li>M-Mode: {selfTestReport.components_tested.imaging_modes['M-Mode']}</li>
                  </ul>
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Network Connectivity</h3>
                <div className="result-item">
                  <ul>
                    <li>Network Status: {selfTestReport.components_tested.network_connectivity.network_status}</li>
                    <li>Signal Strength: {selfTestReport.components_tested.network_connectivity.signal_strength}</li>
                  </ul>
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Power Supply</h3>
                <div className="result-item">
                  <ul>
                    <li>Battery Level: {selfTestReport.components_tested.power_supply.battery_level}</li>
                    <li>Current: {selfTestReport.components_tested.power_supply.current}</li>
                    <li>Voltage: {selfTestReport.components_tested.power_supply.voltage}</li>
                  </ul>
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Calibration Status</h3>
                <div className="result-item">
                  <strong>Status:</strong> {selfTestReport.calibration_status.probe}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Temperature Check</h3>
                <div className="result-item">
                  Temperature: {selfTestReport.components_tested.temperature_check}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Error Logs</h3>
                <div className="result-item">
                  <ul>
                    {selfTestReport.error_logs.map((error, index) => (
                      <li key={index}>{error.description} (Error Code: {error.error_code})</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Firmware Version</h3>
                <div className="result-item">
                  Version: {selfTestReport.firmware_version}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Recommendations</h3>
                <div className="result-item">
                  Recommendations: {selfTestReport.recommendations}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>System Status</h3>
                <div className="result-item">
                  Status: {selfTestReport.system_status}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Test Duration</h3>
                <div className="result-item">
                  Duration: {selfTestReport.test_duration}
                </div>
              </div>
              <div className="self-test-results-card">
                <h3>Test ID</h3>
                <div className="result-item">
                  <strong>ID:</strong> {selfTestReport.test_id}
                </div>
              </div>
              {/* <div className="self-test-results-card">
                <h3>Timestamp</h3>
                <div className="result-item">
                  <strong>Timestamp:</strong> {staticSelfTestResults.timestamp}
                </div>
              </div> */}
            </div>
          )}

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