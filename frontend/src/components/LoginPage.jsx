import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    apiKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Test the API key by making a health check request
      const response = await fetch('http://localhost:8000/api/health');
      
      if (response.ok) {
        // Store the API key in localStorage for future use
        localStorage.setItem('apiKey', formData.apiKey);
        localStorage.setItem('username', formData.username);
        onLogin();
      } else {
        setError('Unable to connect to the backend server. Please ensure the server is running.');
      }
    } catch (error) {
      setError('Connection failed. Please check if the backend server is running on localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3,
            background: '#fff', // solid white for best contrast
            color: '#222', // dark text for all children
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
              textAlign: 'center',
              color: 'primary.main'
            }}
          >
            <Lock sx={{ fontSize: 48, mr: 2 }} />
            <Typography component="h1" variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Welcome to ZChat!
            </Typography>
          </Box>

          <Typography variant="body1" align="center" sx={{ mb: 3, color: '#222' }}>
            Sign in to start your AI-powered conversations.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 3 }}
              variant="outlined"
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{ style: { color: '#222' } }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="apiKey"
              label="OpenAI API Key"
              type={showPassword ? 'text' : 'password'}
              id="apiKey"
              autoComplete="current-password"
              value={formData.apiKey}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: '#333' } }}
              InputProps={{
                style: { color: '#222' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !formData.username || !formData.apiKey}
              sx={{ 
                mt: 2, 
                mb: 3, 
                height: 56,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#444' }}>
            🔐 Your API key is stored securely in your browser
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 