import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Products';
import Navbar from './pages/Navbar';
import './App.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';  
import Register from './pages/Register'; 
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Products" element={<Menu />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
