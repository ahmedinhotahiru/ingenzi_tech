import React, { useState, useEffect } from 'react';
import './SelectDevice.css'; // Import the custom CSS for styling

const SelectDevice = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Fetch the list of devices from the backend
    fetch("http://127.0.0.1:5000/api/devices")
      .then(response => response.json())
      .then(data => setDevices(data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  return (
    <div className="select-device-page">
      <h1 className="main-heading">Select Device Type</h1>
      <ul className="device-list">
        {devices.map((device, index) => (
          <li key={index} className="device-item">
            {device.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectDevice;