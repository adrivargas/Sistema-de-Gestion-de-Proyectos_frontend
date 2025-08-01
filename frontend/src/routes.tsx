import React, { JSX } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './Dashboard/Dashboard';
import CrearProyecto from './pages/CrearProyecto';
import DetalleProyecto from './Dashboard/DetalleProyecto';
import EditarProyecto from './Dashboard/EditarProyecto';
import TiposProyecto from './pages/TiposProyectos';
import { useAuth } from './context/AuthContext';
import Register from './auth/Register';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAuth();
  return token && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  const { token, user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />
      {/* Register */}
      <Route path="/register" element={<Register />} />
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      {/* Crear Proyecto */}
      <Route path="/crear" element={
        <PrivateRoute>
          <CrearProyecto />
        </PrivateRoute>
      } />

      {/* Detalle del Proyecto */}
      <Route path="/proyecto/:id" element={
        <PrivateRoute>
          <DetalleProyecto />
        </PrivateRoute>
      } />

      {/* Editar Proyecto */}
      <Route
            path="/proyecto/:id/editar"
            element={
              <PrivateRoute>
                <EditarProyecto />
              </PrivateRoute>
            }
          />

      {/* Tipos de Proyecto (solo para admins) */}
      <Route path="/tipos-proyecto" element={
        <ProtectedRoute>
          <TiposProyecto />
        </ProtectedRoute>
      } />

      {/* Redirección por defecto: si tiene token, ir a dashboard; si no, login */}
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
