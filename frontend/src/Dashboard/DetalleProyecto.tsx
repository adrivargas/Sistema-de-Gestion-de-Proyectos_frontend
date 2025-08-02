import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Chip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios.get(`/projects/${id}`)
      .then(res => setProyecto(res.data))
      .catch(() => setError("No se pudo cargar el proyecto"));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/projects/${id}`);
      setSuccess("Proyecto eliminado correctamente");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setError("No se pudo eliminar el proyecto");
    }
  };

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (!proyecto) return null;

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {proyecto.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {proyecto.description}
        </Typography>
        <Chip label={`Tipo: ${proyecto.project_type.name}`} sx={{ mb: 2 }} />
        <Typography>Estado: {proyecto.status}</Typography>
        <Typography>Inicio: {proyecto.start_date}</Typography>
        <Typography>Fin: {proyecto.end_date}</Typography>
        <Typography>Presupuesto: ${proyecto.budget}</Typography>
        <Typography>Propietario ID: {proyecto.owner_id}</Typography>

        {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}

        <Box mt={4} display="flex" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/dashboard")}>
            Volver
          </Button>
          <Button onClick={() => navigate(`/proyecto/${proyecto.id}/editar`)}>
            Editar
          </Button>
          <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
            Eliminar
          </Button>
        </Box>
      </Paper>

      {/* Diálogo de Confirmación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¿Eliminar proyecto?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar este proyecto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DetalleProyecto;
