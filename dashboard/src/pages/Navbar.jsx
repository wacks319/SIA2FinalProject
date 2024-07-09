import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IconButton, Modal, Box, Typography } from '@mui/material';
import { Person, ExitToApp, ShoppingCart } from '@mui/icons-material';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // State to handle modal open/close
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  return (
    <nav className="navbar">
      <div className='search-bar'>
        <div className='logo-img'>
          <img src="logo.jpg" alt="logo" />
        </div>
        <input type="text" placeholder="Search..." className="search-input" />
        <button type="button" className="search-button">Search</button>
      </div>
      <div className='navbar-links'>
        {/* <Link to="/" className='navbar-link'>Home</Link> */}
        {/* <IconButton color="inherit" onClick={handleCartOpen}>
          <ShoppingCart />
        </IconButton> */}
        {isLoggedIn ? (
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        ) : (
          <IconButton color="inherit" component={Link} to="/login">
            <Person />
          </IconButton>
        )}
      </div>

      {/* Modal for cart */}
      <Modal
        open={cartOpen}
        onClose={handleCartClose}
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="cart-modal-title" variant="h6" component="h2">
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
