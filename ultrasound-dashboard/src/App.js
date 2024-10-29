// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ManualsPage from './ManualsPage';
import LogsPage from './LogsPage';
import UploadPage from './UploadPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the paths and corresponding components */}
        <Route path="/" element={<Home />} />
        <Route path="/manuals" element={<ManualsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;
