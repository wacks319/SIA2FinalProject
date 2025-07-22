import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Modal,
  InputAdornment,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import axios from 'axios';
import './Login.css';

// Use the uploaded logo
const loginImage = '/Red_Booklyp.png'; // Or adjust path based on your public folder

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
      navigate('/ManageProduct');
      return;
    }

    // Buyer login via backend
    try {
      const response = await axios.post('http://localhost:3004/api/login', {
        loginID,
        password
      });
      const { token, userRole, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('username', username);

      if (userRole === 'buyer' || userRole === 'user') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
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
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#7b1e3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="login-form"
          style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 4px 32px rgba(128,0,32,0.10)',
            padding: 36,
            minWidth: 350,
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <img
            src={loginImage}
            alt="Login"
            style={{
              width: 80,
              height: 80,
              objectFit: 'contain',
              marginBottom: 10,
              borderRadius: 16,
              border: '2px solid #7b1e3d',
              boxShadow: '0 2px 8px #7b1e3d22',
            }}
          />
          <h1
            style={{
              color: '#7b1e3d',
              fontWeight: 700,
              fontFamily: 'serif',
              fontSize: 30,
              marginBottom: 0,
              letterSpacing: 1,
            }}
          >
            Welcome to BookMart
          </h1>
          <p style={{ color: '#7b1e3d99', fontWeight: 500, marginTop: -4, marginBottom: 0, fontSize: 15 }}>
            Sign in to your account
          </p>
          <TextField
            value={loginID}
            onChange={(e) => {
              setLoginID(e.target.value);
              setLoginIDError('');
            }}
            label="Email or Username"
            variant="outlined"
            required
            error={!!loginIDErr}
            helperText={loginIDErr}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: '#7b1e3d' }} />
                </InputAdornment>
              ),
              style: { background: '#F9E6ED', borderRadius: 8 },
            }}
            InputLabelProps={{ style: { color: '#7b1e3d' } }}
          />
          <TextField
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            label="Password"
            variant="outlined"
            type="password"
            required
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#7b1e3d' }} />
                </InputAdornment>
              ),
              style: { background: '#F9E6ED', borderRadius: 8 },
            }}
            InputLabelProps={{ style: { color: '#7b1e3d' } }}
          />
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: '#7b1e3d',
              color: 'white',
              fontWeight: 600,
              borderRadius: 8,
              fontSize: 18,
              marginTop: 8,
              width: '100%',
              boxShadow: '0 2px 8px #7b1e3d11',
            }}
          >
            Login
          </Button>
          <Button
            onClick={handleCloseStudModal}
            variant="contained"
            style={{
              backgroundColor: '#b93a5d',
              color: 'white',
              fontWeight: 600,
              borderRadius: 8,
              fontSize: 18,
              width: '100%',
              boxShadow: '0 2px 8px #b93a5d11',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleRegisterClick}
            style={{
              borderColor: '#7b1e3d',
              color: '#7b1e3d',
              fontWeight: 600,
              borderRadius: 8,
              fontSize: 18,
              width: '100%',
              height: '48px',
            }}
          >
            Register
          </Button>
          <div style={{ marginTop: 10 }}>
            <span style={{ color: '#888', fontSize: 15 }}>
              Don't have an account?{' '}
              <span
                style={{ color: '#7b1e3d', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={handleRegisterClick}
              >
                Register here
              </span>
            </span>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Login;
