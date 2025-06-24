import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Modal, Box, Typography } from '@mui/material';
import { Person, ShoppingCart } from '@mui/icons-material';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
    window.location.reload();
  };

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-img">
        <img src="logo.jpg" alt="logo" />
      </div>

      {/* Links */}
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/Products" className="navbar-link">Books</Link>

        {isLoggedIn && (userRole === 'admin' || userRole === 'seller') && (
          <Link to="/ManageProduct" className="navbar-link">Manage Product</Link>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <Link to="/ManageAccount" className="navbar-link">Manage Account</Link>
        )}

        {isLoggedIn ? (
          <>
            {/* Shopping cart button (only if logged in) */}
            <IconButton color="inherit" onClick={handleCartOpen}>
              <ShoppingCart />
            </IconButton>

            {/* Logout button */}
            <IconButton color="inherit" onClick={handleLogout}>
              <Person />
            </IconButton>
          </>
        ) : (
          <IconButton color="inherit" component={Link} to="/login">
            <Person />
          </IconButton>
        )}
      </div>

      {/* Cart Modal */}
      <Modal
        open={cartOpen}
        onClose={handleCartClose}
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="cart-modal-title" variant="h6">
            Cart Items
          </Typography>
          <Typography id="cart-modal-description" sx={{ mt: 2 }}>
            Your cart is currently empty.
          </Typography>
        </Box>
      </Modal>
    </nav>
  );
}

export default Navbar;
