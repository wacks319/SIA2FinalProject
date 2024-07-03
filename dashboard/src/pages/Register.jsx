import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.10.24:3004/api/users', formData);
      setMessage(response.data.message);
      setFormData({ username: '', email: '', password: ''});
      setErrors({});
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.error || {});
      } else {
        setErrors({ general: 'Error creating user' });
      }
    }
  };

  return (
    <Box className="container">
      <Box className="form-container">
        <Typography variant="h4" gutterBottom textAlign="center" color="#0c1c8d">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box className="form-group">
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
              required
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Box>
          <Box className="button-container">
            <Button type="submit" variant="contained" color="primary" size="large">
              Register
            </Button>
          </Box>
        </form>
        {message && <Box className="message-container">{message}</Box>}
      </Box>
    </Box>
  );
};

export default Register;
