import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Products';
import Navbar from './pages/Navbar'; // Assuming Navbar is correctly implemented
import './App.css';
import Login from './pages/Login';
import ManageProduct from './pages/ManageProduct';  
import Register from './pages/Register'; 
import ManageAccount from './pages/ManageAccount'; 
import Inventory from './pages/InventoryDashboard'; 
import Report from './pages/Report'; 
import SaleList from './pages/SaleList'; 
import InventoryReport from './pages/InventoryReport'; 
import ShoppingList from './pages/ShoppingList'; 
import BackupAndRestore from './pages/BackupAndRestore'; 

function App() {
  return (
    <BrowserRouter basename="/SIA2FinalProject-2">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Products" element={<Menu />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ManageProduct" element={<ManageProduct />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ManageAccount" element={<ManageAccount />} />
        <Route path="/InventoryDashboard" element={<Inventory />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/SaleList" element={<SaleList />} />
        <Route path="/InventoryReport" element={<InventoryReport />} />
        <Route path="/ShoppingList" element={<ShoppingList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
