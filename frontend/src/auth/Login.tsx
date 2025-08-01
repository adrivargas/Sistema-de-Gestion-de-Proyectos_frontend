import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { User } from '../context/AuthContext';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // limpia error anterior

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom align="center">
          Inicia sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            label="Correo Electronico"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Iniciar sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
