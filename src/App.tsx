import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import InvoiceGenerator from './components/InvoiceGenerator';
import ProjectCalendar from './components/ProjectCalendar';
import Notes from './components/Notes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools/invoice" element={<InvoiceGenerator />} />
          <Route path="/tools/calendar" element={<ProjectCalendar />} />
          <Route path="/tools/notes" element={<Notes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
