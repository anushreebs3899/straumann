import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import PatientHistory from './PatientHistory';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' ,second:'2-digit'}));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="App">
      <Header username="Straumann User" currentTime={currentTime} />
      <div className="main-content">
        <PatientHistory />
      </div>
    </div>
  );
};

export default App;