import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './Dashboard/Dashboard';
import CrearProyecto from './pages/CrearProyecto';
import DetalleProyecto from './Dashboard/DetalleProyecto';
import EditarProyecto from './Dashboard/EditarProyecto';
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/crear"
            element={
              <PrivateRoute>
                <CrearProyecto />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/:id"
            element={
              <PrivateRoute>
                <DetalleProyecto />
              </PrivateRoute>
            }
          />
          <Route
            path="/proyecto/:id/editar"
            element={
              <PrivateRoute>
                <EditarProyecto />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
