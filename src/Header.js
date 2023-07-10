
import React from 'react';
import './Header.js';

const Header = ({ username, currentTime }) => {
  return (
    <div className="header">
      <h1 className="app-title">Patient History</h1>
      <div className="user-info">
        <span className="username">Welcome, {username}</span>
        <span className="current-time">Current Time: {currentTime}</span>
      </div>
    </div>
  );
};

export default Header;
