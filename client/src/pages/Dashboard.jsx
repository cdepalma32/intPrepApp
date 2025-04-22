// main hub for logged-in users -- jumping point to practice, progress, settings

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {user?.username || 'User'}!</h1>


      <div className="progress-box">
        <h3>Your Progress</h3>
        <p>Anagrams Completed: <strong>0</strong></p>
        <p>Interview Questions Answered: <strong>0</strong></p>
        </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/practice/anagram')}>🧩 Practice Anagrams</button>
        <button onClick={() => navigate('/practice/interview')}>💬 Practice Interview Qs</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
