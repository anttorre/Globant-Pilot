import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TripRecommendator from './components/TripRecommendator';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<TripRecommendator />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
