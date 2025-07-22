import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Modal,
  InputAdornment,
  MenuItem
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import axios from 'axios';
import './Login.css';

const registerImage = '/164ae3e0-78b1-477b-8902-81eda65d8488.png'; // Your logo

function Register() {
  const [ModalOpen, setModalOpen] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate('/');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.email || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }
    try {
      await axios.post('http://localhost:3004/api/users', {
        username: form.username,
        email: form.email,
        password: form.password,
        userRole: form.role,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Modal open={ModalOpen} onClose={handleCloseModal}>
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
          className="register-form"
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
            src={registerImage}
            alt="Register"
            style={{
              width: 90,
              height: 90,
              objectFit: 'contain',
              marginBottom: 10,
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 4px 16px rgba(123, 30, 61, 0.25), 0 1.5px 4px #fff',
              background: '#fff',
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
            Register Account
          </h1>
          <TextField
            value={form.username}
            onChange={handleChange}
            name="username"
            label="Username"
            variant="outlined"
            required
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
            value={form.email}
            onChange={handleChange}
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            required
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
            value={form.password}
            onChange={handleChange}
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            required
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
          <TextField
            select
            value={form.role}
            onChange={handleChange}
            name="role"
            label="Role"
            variant="outlined"
            required
            fullWidth
            InputLabelProps={{ style: { color: '#7b1e3d' } }}
            style={{ background: '#F9E6ED', borderRadius: 8 }}
          >
            <MenuItem value="buyer">Buyer</MenuItem>
            <MenuItem value="seller">Seller</MenuItem>
          </TextField>
        
          {error && <div style={{ color: 'red', fontSize: 15 }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: 15 }}>{success}</div>}
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
            Register
          </Button>
          <Button
            onClick={handleCloseModal}
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
        </form>
      </div>
    </Modal>
  );
}

export default Register;
