import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const user: User = await login(email, password);
      if (user.role === 'admin') {
        navigate('/tipos-proyecto');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: '100%',
          maxWidth: 450,
          borderRadius: 4,
          backgroundColor: '#f8fafc',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ color: '#1e293b', fontWeight: 'bold' }}
        >
          Inicia sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="login-email"
            label="Correo electrónico"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            id="login-password"
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#1e40af' }}
          >
            Iniciar sesión
          </Button>
        </Box>


        {/* Link a Registro */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: '#334155' }}
        >
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            style={{
              color: '#1e40af',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Regístrate 
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
