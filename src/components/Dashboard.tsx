import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div>
      <header>
        <h1>🧰 Freelancer Toolkit</h1>
        <p>Manage your freelance work all in one place.</p>
      </header>

      <main className="dashboard">
        <Link to="/tools/invoice" className="card">
          <h2>🧾 Invoice Generator</h2>
          <p>Create and export invoices for your clients.</p>
        </Link>

        <Link to="/tools/calendar" className="card">
          <h2>📅 Project Calendar</h2>
          <p>Track deadlines and project timelines.</p>
        </Link>

        <Link to="/tools/notes" className="card">
          <h2>🗒️ Quick Notes</h2>
          <p>Jot down client details and project ideas.</p>
        </Link>
      </main>

      <footer>
        <p>Built by Isiyaku Bala • <a href="https://github.com/YOUR_GITHUB_USERNAME" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
};

export default Dashboard; 