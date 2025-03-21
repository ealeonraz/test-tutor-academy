import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboardHome from './pages/studentDashboard';
import "./App.css";
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/studentDashboard" element={<StudentDashboardHome />} />
      </Routes>
    </Router>
  ); 
}

export default App;
