import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import './Login.css';

function Login() {
  const [ModalStudOpen, setModalStudOpen] = useState(true);
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
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

      const response = await axios.post('http://192.168.10.24:3004/api/login', { loginID, password });
      const { token, userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);

      // Redirection based on userRole
      if (userRole === 'admin') {
        navigate('/AdminDashboard');
      } else if (userRole === 'user') {
        navigate('/Products');
      
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
            <h1>Login</h1>
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
                type="password"
                required
                error={!!passwordError}
                helperText={passwordError ? passwordError : ''}
              />

              <Button variant="contained" onClick={handleSubmit}>
                Login
              </Button>
              <Button variant="contained" onClick={handleCloseStudModal}>
                Cancel
              </Button>

              {/* Button to navigate to Register page */}
              <Button variant="contained" onClick={handleRegisterClick}>
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
