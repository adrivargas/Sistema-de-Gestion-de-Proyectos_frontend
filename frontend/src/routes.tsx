import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./Dashboard/Dashboard";
import CrearProyecto from "./pages/CrearProyecto";
import DetalleProyecto from "./Dashboard/DetalleProyecto";
import EditarProyecto from "./Dashboard/EditarProyecto";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/crear" element={
        <ProtectedRoute><CrearProyecto /></ProtectedRoute>
      } />

      {/* RUTA PARA VER DETALLE DEL PROYECTO */}
      <Route path="/proyecto/:id" element={
        <ProtectedRoute><DetalleProyecto /></ProtectedRoute>
      } />

      {/* RUTA PARA EDITAR PROYECTO */}
      <Route path="/proyecto/:id/editar" element={
        <ProtectedRoute><EditarProyecto /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
