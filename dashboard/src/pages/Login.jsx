import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Modal,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import axios from 'axios';
import './Login.css';
import loginImage from '../../public/logo.jpg'; // Adjust path as necessary

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

    // Hardcoded admin and seller logins
    const adminEmail = 'admin@system.com';
    const adminPassword = 'admin123';
    const sellerEmail = 'seller@system.com';
    const sellerPassword = 'seller123';

    if (loginID === adminEmail && password === adminPassword) {
      localStorage.setItem('token', 'dummy_admin_token');
      localStorage.setItem('userRole', 'admin');
      navigate('/ManageProduct');
      return;
    }

    if (loginID === sellerEmail && password === sellerPassword) {
      localStorage.setItem('token', 'dummy_seller_token');
      localStorage.setItem('userRole', 'seller');
      navigate('/dashboard');
      return;
    }

    // Buyer login via backend
    try {
      const response = await axios.post('http://localhost:3004/api/login', {
        loginID,
        password
      });
      const { token, userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);

      if (userRole === 'buyer' || userRole === 'user') {
        navigate('/Products');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 400) {
        setLoginIDError('Invalid login ID or password');
        setPasswordError('Invalid login ID or password');
      } else {
        setLoginIDError('An error occurred');
        setPasswordError('An error occurred');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Modal open={ModalStudOpen} onClose={handleCloseStudModal}>
      <div className="login-modal">
        <div className="main-login-form">
          <div className="login-form">
            <img src={loginImage} alt="Login" className="login-image" />
            <h1>Login</h1>
            <div className="login-forms">
              <TextField
                value={loginID}
                onChange={(e) => {
                  setLoginID(e.target.value);
                  setLoginIDError('');
                }}
                id="outlined-login-id"
                label="Email or Username"
                variant="outlined"
                required
                error={!!loginIDErr}
                helperText={loginIDErr}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                id="outlined-password"
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                required
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
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

              {/* Register button only shown for non-admin/non-seller */}
              {loginID !== 'admin@system.com' && loginID !== 'seller@system.com' && (
                <Button
                  variant="outlined"
                  onClick={handleRegisterClick}
                  className="login-button register"
                  style={{ borderColor: 'black', color: 'black', height: '56px' }}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Login;
