import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import './Login.css';

import loginImage from '../../public/logo.jpg'; // Adjust the path as necessary

function Login() {
  const [ModalStudOpen, setModalStudOpen] = useState(true);
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIDErr, setLoginIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleCloseStudModal = () => {
    setModalStudOpen(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending loginID:', loginID);
      console.log('Sending password:', password);

      const response = await axios.post('http://localhost:3004/api/login', { loginID, password });
      const { token, userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);

      // Redirection based on userRole
      if (userRole === 'admin') {
        navigate('/ManageProduct');
      } else if (userRole === 'user') {
        navigate('/Products');
      } else if (userRole === 'inventory') {
        navigate('/InventoryDashboard');
      } else {
        navigate('Unknown user role:', userRole);
      }
    } catch (err) {
      console.error('Error during login:', err);
      if (err.response) {
        console.error(err.response.data);
        if (err.response.status === 400) {
          setLoginIDError('Invalid login ID or password');
          setPasswordError('Invalid login ID or password');
        } else {
          setLoginIDError('An error occurred');
          setPasswordError('An error occurred');
        }
      } else {
        setLoginIDError('An error occurred');
        setPasswordError('An error occurred');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to Register page
  };

  return (
    <Modal open={ModalStudOpen} onClose={handleCloseStudModal}>
      <div className="login-modal">
        <div className="main-login-form">
          <div className="login-form">
            <img src={loginImage} alt="Login Image" className="login-image" /> {/* Use the image here */}
            <h1>Login</h1>
            <div className="example-credentials">
              <p><strong>admin</strong> password: admin</p>
              {/* <p><strong>staff</strong> password: staff</p> */}
              <p><strong>user</strong> password: user</p>
            </div>
            <div className="login-forms">
              <TextField
                value={loginID}
                onChange={(e) => {
                  setLoginID(e.target.value);
                  setLoginIDError('');
                }}
                id="outlined-basic-1"
                label="Email or Username"
                variant="outlined"
                required
                error={!!loginIDErr}
                helperText={loginIDErr ? loginIDErr : ''}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                id="outlined-basic-2"
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                required
                error={!!passwordError}
                helperText={passwordError ? passwordError : ''}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                }
                label="Show Password"
              />

              <Button
                variant="contained"
                onClick={handleSubmit}
                className="login-button sign-in"
                style={{ backgroundColor: 'black', color: 'white' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleCloseStudModal}
                className="login-button cancel"
                style={{ backgroundColor: 'black', color: 'white' }}
              >
                Cancel
              </Button>

              <Button
                variant="outlined"
                onClick={handleRegisterClick}
                className="login-button register"
                style={{ borderColor: 'black', color: 'black', height: '56px' }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Login;
