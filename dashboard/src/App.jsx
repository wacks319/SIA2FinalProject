import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Products';
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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  // Get userRole from localStorage
  const userRole = localStorage.getItem('userRole');
  const user = {
    name: 'John Doe',
    role: userRole || 'buyer',
  };

  return (
    <BrowserRouter>
      {/* <MainNavbar /> */}
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/Products" element={<Menu />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ManageProduct" element={
          <ProtectedRoute allowedRoles={['admin', 'seller']}>
            <ManageProduct />
          </ProtectedRoute>
        } />
        <Route path="/ManageAccount" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageAccount />
          </ProtectedRoute>
        } />
        <Route path="/InventoryDashboard" element={<Inventory />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/SaleList" element={<SaleList />} />
        <Route path="/InventoryReport" element={<InventoryReport />} />
        <Route path="/ShoppingList" element={<ShoppingList />} />
        <Route path="/BackupAndRestore" element={<BackupAndRestore />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
