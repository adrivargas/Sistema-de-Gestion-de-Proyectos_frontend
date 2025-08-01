import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register({ username, email, password });
    } catch (err) {
      setError('No se pudo registrar el usuario.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          marginTop: 8,
          borderRadius: 3,
          backgroundColor: '#f8fafc',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: '#1e293b' }}
        >
          Crear una cuenta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
                id="register-username"
                label="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                id="register-email"
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                id="register-password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, backgroundColor: '#0f172a' }}
            >
                Registrarse
            </Button>
            </Box>


        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: '#334155' }}
        >
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            style={{
              color: '#1e40af',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
