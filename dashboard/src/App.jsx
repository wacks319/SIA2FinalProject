import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Products';
import Navbar from './pages/Navbar';
import './App.css';
import Login from './pages/Login';
import ManageProduct from './pages/ManageProduct';  
import Register from './pages/Register'; 
import ManageAccount from './pages/ManageAccount'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Products" element={<Menu />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ManageProduct" element={<ManageProduct />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ManageAccount" element={<ManageAccount />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
